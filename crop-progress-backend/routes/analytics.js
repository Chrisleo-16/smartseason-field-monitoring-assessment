const express = require('express');
const router = express.Router();
const db = require('../db');

// Get predictive analytics for all fields
router.get('/predictions', async (req, res) => {
    try {
        // Get historical field data
        const { rows: fields } = await db.query(`
            SELECT * FROM field_management 
            WHERE planting_date IS NOT NULL 
            ORDER BY planting_date DESC
        `);

        // Calculate predictions based on historical data
        const predictions = fields.map(field => {
            const plantingDate = new Date(field.planting_date);
            const harvestingDate = new Date(field.harvesting_date);
            const today = new Date();
            
            // Growth progress calculation
            const totalDays = Math.ceil((harvestingDate - plantingDate) / (1000 * 60 * 60 * 24));
            const daysPassed = Math.ceil((today - plantingDate) / (1000 * 60 * 60 * 24));
            const growthProgress = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));

            // Yield prediction (mock algorithm based on stage and conditions)
            const yieldPrediction = calculateYieldPrediction(field, growthProgress);
            
            // Risk assessment
            const riskFactors = assessRisk(field, today);
            
            return {
                field_id: field.field_id,
                field_name: field.field_name,
                crop_type: field.crop_type,
                growth_progress: Math.round(growthProgress),
                yield_prediction: yieldPrediction,
                risk_assessment: riskFactors,
                predicted_harvest_date: calculatePredictedHarvest(field, growthProgress),
                recommendations: generateFieldRecommendations(field, growthProgress, riskFactors)
            };
        });

        // Overall analytics
        const overallAnalytics = {
            total_fields: fields.length,
            average_growth_progress: Math.round(predictions.reduce((sum, p) => sum + p.growth_progress, 0) / predictions.length),
            high_risk_fields: predictions.filter(p => p.risk_assessment.overall_risk === 'High').length,
            predicted_yield_total: predictions.reduce((sum, p) => sum + p.yield_prediction.estimated_yield, 0),
            crop_performance: analyzeCropPerformance(fields)
        };

        res.json({
            predictions,
            overall_analytics,
            generated_at: new Date().toISOString()
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Failed to generate analytics' });
    }
});

// Get yield forecasting charts data
router.get('/yield-charts', async (req, res) => {
    try {
        const { rows: fields } = await db.query(`
            SELECT crop_type, current_stage, planting_date, harvesting_date 
            FROM field_management 
            WHERE planting_date IS NOT NULL
        `);

        // Prepare chart data
        const cropYieldData = {};
        fields.forEach(field => {
            if (!cropYieldData[field.crop_type]) {
                cropYieldData[field.crop_type] = {
                    crop_type: field.crop_type,
                    fields: [],
                    average_yield: 0,
                    yield_trend: []
                };
            }
            
            const yieldPerAcre = calculateMockYield(field.crop_type, field.current_stage);
            cropYieldData[field.crop_type].fields.push({
                field_name: field.field_name,
                estimated_yield: yieldPerAcre,
                stage: field.current_stage
            });
        });

        // Calculate averages and trends
        Object.keys(cropYieldData).forEach(crop => {
            const cropData = cropYieldData[crop];
            cropData.average_yield = Math.round(
                cropData.fields.reduce((sum, f) => sum + f.estimated_yield, 0) / cropData.fields.length
            );
            
            // Mock trend data
            cropData.yield_trend = [
                { month: 'Jan', yield: cropData.average_yield * 0.8 },
                { month: 'Feb', yield: cropData.average_yield * 0.85 },
                { month: 'Mar', yield: cropData.average_yield * 0.9 },
                { month: 'Apr', yield: cropData.average_yield * 0.95 },
                { month: 'May', yield: cropData.average_yield },
                { month: 'Jun', yield: cropData.average_yield * 1.05 }
            ];
        });

        res.json({
            crop_yield_data: Object.values(cropYieldData),
            overall_yield_trend: [
                { month: 'Jan', total_yield: 150 },
                { month: 'Feb', total_yield: 180 },
                { month: 'Mar', total_yield: 220 },
                { month: 'Apr', total_yield: 280 },
                { month: 'May', total_yield: 320 },
                { month: 'Jun', total_yield: 350 }
            ]
        });
    } catch (error) {
        console.error('Yield charts error:', error);
        res.status(500).json({ error: 'Failed to generate yield charts' });
    }
});

// Helper functions
function calculateYieldPrediction(field, growthProgress) {
    const baseYield = getBaseYieldForCrop(field.crop_type);
    const stageMultiplier = getStageMultiplier(field.current_stage);
    const estimatedYield = Math.round(baseYield * stageMultiplier * (growthProgress / 100));
    
    return {
        estimated_yield: estimatedYield,
        unit: 'tons/hectare',
        confidence: Math.round(70 + (growthProgress * 0.3)), // Increases as crop matures
        factors: {
            weather_impact: 'Normal',
            soil_health: 'Good',
            pest_pressure: 'Low'
        }
    };
}

function assessRisk(field, today) {
    const risks = [];
    let overallRisk = 'Low';

    // Check if past harvesting date
    if (today > new Date(field.harvesting_date) && field.current_stage !== 'Harvested') {
        risks.push('Overdue for harvest');
        overallRisk = 'High';
    }

    // Check if at risk status
    if (field.computed_status === 'At Risk') {
        risks.push('Field marked as at risk');
        if (overallRisk === 'Low') overallRisk = 'Medium';
    }

    // Mock pest/disease risk
    if (Math.random() > 0.7) {
        risks.push('Potential pest pressure');
        if (overallRisk !== 'High') overallRisk = 'Medium';
    }

    return {
        overall_risk: overallRisk,
        risk_factors: risks,
        risk_score: overallRisk === 'High' ? 8 : overallRisk === 'Medium' ? 5 : 2
    };
}

function calculatePredictedHarvest(field, growthProgress) {
    const originalHarvestDate = new Date(field.harvesting_date);
    const today = new Date();
    
    if (growthProgress > 90) {
        // Likely to harvest early
        const daysEarly = Math.floor(Math.random() * 7) + 1;
        return new Date(originalHarvestDate.getTime() - (daysEarly * 24 * 60 * 60 * 1000));
    } else if (growthProgress < 70) {
        // Likely to harvest late
        const daysLate = Math.floor(Math.random() * 10) + 1;
        return new Date(originalHarvestDate.getTime() + (daysLate * 24 * 60 * 60 * 1000));
    }
    
    return originalHarvestDate;
}

function generateFieldRecommendations(field, growthProgress, riskAssessment) {
    const recommendations = [];

    if (growthProgress < 50) {
        recommendations.push('Focus on early growth nutrients');
    } else if (growthProgress > 80) {
        recommendations.push('Prepare for harvest');
    }

    if (riskAssessment.overall_risk === 'High') {
        recommendations.push('Immediate attention required');
        recommendations.push('Consider protective measures');
    }

    if (field.current_stage === 'Growing') {
        recommendations.push('Monitor for pest activity');
        recommendations.push('Maintain irrigation schedule');
    }

    return recommendations;
}

function analyzeCropPerformance(fields) {
    const cropStats = {};
    
    fields.forEach(field => {
        if (!cropStats[field.crop_type]) {
            cropStats[field.crop_type] = {
                count: 0,
                avg_growth: 0,
                risk_count: 0
            };
        }
        
        cropStats[field.crop_type].count++;
        if (field.computed_status === 'At Risk') {
            cropStats[field.crop_type].risk_count++;
        }
    });

    return Object.keys(cropStats).map(crop => ({
        crop_type: crop,
        field_count: cropStats[crop].count,
        risk_percentage: Math.round((cropStats[crop].risk_count / cropStats[crop].count) * 100),
        performance_rating: cropStats[crop].risk_count === 0 ? 'Excellent' : 
                           cropStats[crop].risk_count === 1 ? 'Good' : 'Needs Attention'
    }));
}

function getBaseYieldForCrop(cropType) {
    const yields = {
        'Corn': 10,
        'Wheat': 7,
        'Tomato': 15,
        'Soybean': 5,
        'Rice': 8
    };
    return yields[cropType] || 6;
}

function getStageMultiplier(stage) {
    const multipliers = {
        'Planted': 0.1,
        'Growing': 0.6,
        'Ready': 0.9,
        'Harvested': 1.0
    };
    return multipliers[stage] || 0.5;
}

function calculateMockYield(cropType, stage) {
    const baseYield = getBaseYieldForCrop(cropType);
    const multiplier = getStageMultiplier(stage);
    return Math.round(baseYield * multiplier);
}

module.exports = router;
