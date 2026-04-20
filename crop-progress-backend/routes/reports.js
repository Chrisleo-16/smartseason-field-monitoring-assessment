const express = require('express');
const router = express.Router();
const db = require('../db');

// Generate weekly field report
router.get('/weekly', async (req, res) => {
    try {
        const { week_offset = 0 } = req.query;
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + (parseInt(week_offset) * 7));
        
        // Get week start and end
        const weekStart = new Date(targetDate);
        weekStart.setDate(targetDate.getDate() - targetDate.getDay());
        weekStart.setHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        // Get field data for the week
        const { rows: fields } = await db.query(`
            SELECT * FROM field_management 
            WHERE last_updated_at >= $1 AND last_updated_at <= $2
            ORDER BY field_name
        `, [weekStart, weekEnd]);

        // Get all fields for summary
        const { rows: allFields } = await db.query(`
            SELECT * FROM field_management ORDER BY field_name
        `);

        // Generate report data
        const reportData = {
            report_info: {
                title: `Weekly Field Report - Week of ${weekStart.toLocaleDateString()}`,
                date_range: {
                    start: weekStart.toISOString(),
                    end: weekEnd.toISOString()
                },
                generated_at: new Date().toISOString(),
                week_number: Math.ceil((weekStart.getDate()) / 7)
            },
            summary: {
                total_fields: allFields.length,
                active_fields: allFields.filter(f => f.computed_status === 'Active').length,
                at_risk_fields: allFields.filter(f => f.computed_status === 'At Risk').length,
                completed_fields: allFields.filter(f => f.computed_status === 'Completed').length,
                updated_this_week: fields.length
            },
            field_details: allFields.map(field => ({
                field_name: field.field_name,
                location: field.field_location,
                crop_type: field.crop_type,
                current_stage: field.current_stage,
                status: field.computed_status,
                planting_date: field.planting_date,
                harvesting_date: field.harvesting_date,
                last_updated: field.last_updated_at,
                insights: field.insights,
                weekly_activity: fields.find(f => f.field_id === field.field_id) ? 'Updated' : 'No changes'
            })),
            crop_breakdown: generateCropBreakdown(allFields),
            recommendations: generateWeeklyRecommendations(allFields),
            upcoming_tasks: generateUpcomingTasks(allFields)
        };

        res.json(reportData);
    } catch (error) {
        console.error('Weekly report error:', error);
        res.status(500).json({ error: 'Failed to generate weekly report' });
    }
});

// Generate PDF report (real implementation with html-pdf-node)
router.get('/pdf/:reportType', async (req, res) => {
    try {
        const { reportType } = req.params;
        const html_to_pdf = require('html-pdf-node');
        
        // Generate HTML report content
        const htmlContent = await generateReportHTML(reportType);
        
        // PDF generation options
        const options = { 
            format: 'A4',
            margin: {
                top: "20mm",
                right: "20mm",
                bottom: "20mm",
                left: "20mm"
            },
            printBackground: true
        };
        
        // Generate PDF
        const pdfBuffer = await html_to_pdf.generatePdf({ content: htmlContent }, options);
        
        // Set headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="report_${reportType}_${Date.now()}.pdf"`);
        res.send(pdfBuffer);
        
    } catch (error) {
        console.error('PDF report error:', error);
        res.status(500).json({ error: 'Failed to generate PDF report' });
    }
});

// Alternative: Generate JSON report for easy PDF conversion
router.get('/json/:reportType', async (req, res) => {
    try {
        const { reportType } = req.params;
        
        // Get report data
        let reportData;
        if (reportType === 'weekly') {
            reportData = await getWeeklyReportData();
        } else {
            reportData = await getAnalyticsReportData();
        }
        
        res.json({
            ...reportData,
            generated_at: new Date().toISOString(),
            format: 'JSON (can be converted to PDF)'
        });
        
    } catch (error) {
        console.error('JSON report error:', error);
        res.status(500).json({ error: 'Failed to generate JSON report' });
    }
});

// Helper function to generate HTML for reports
async function generateReportHTML(reportType) {
    try {
        // Get report data based on type
        let reportData;
        if (reportType === 'weekly') {
            reportData = await getWeeklyReportData();
        } else {
            reportData = await getAnalyticsReportData();
        }
        
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>${reportData.title}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
                .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
                .summary-card { background: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; }
                .summary-card h3 { margin: 0 0 10px 0; color: #333; }
                .summary-card .value { font-size: 2em; font-weight: bold; color: #007bff; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .status-active { color: green; font-weight: bold; }
                .status-at-risk { color: orange; font-weight: bold; }
                .status-completed { color: blue; font-weight: bold; }
                .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>${reportData.title}</h1>
                <p>Generated: ${new Date().toLocaleString()}</p>
            </div>
            
            <div class="summary">
                <div class="summary-card">
                    <h3>Total Fields</h3>
                    <div class="value">${reportData.summary.total_fields}</div>
                </div>
                <div class="summary-card">
                    <h3>Active Fields</h3>
                    <div class="value">${reportData.summary.active_fields}</div>
                </div>
                <div class="summary-card">
                    <h3>At Risk Fields</h3>
                    <div class="value">${reportData.summary.at_risk_fields}</div>
                </div>
                <div class="summary-card">
                    <h3>Completed Fields</h3>
                    <div class="value">${reportData.summary.completed_fields}</div>
                </div>
            </div>
            
            <h2>Field Details</h2>
            <table>
                <thead>
                    <tr>
                        <th>Field Name</th>
                        <th>Location</th>
                        <th>Crop Type</th>
                        <th>Current Stage</th>
                        <th>Status</th>
                        <th>Planting Date</th>
                        <th>Harvesting Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${reportData.field_details.map(field => `
                        <tr>
                            <td>${field.field_name}</td>
                            <td>${field.location}</td>
                            <td>${field.crop_type}</td>
                            <td>${field.current_stage}</td>
                            <td><span class="status-${field.status.toLowerCase().replace(' ', '-')}">${field.status}</span></td>
                            <td>${new Date(field.planting_date).toLocaleDateString()}</td>
                            <td>${new Date(field.harvesting_date).toLocaleDateString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <h2>Recommendations</h2>
            <ul>
                ${reportData.recommendations.map(rec => `
                    <li><strong>${rec.priority} Priority:</strong> ${rec.action} (Deadline: ${rec.deadline})</li>
                `).join('')}
            </ul>
            
            <div class="footer">
                <p>SmartSeason Field Monitoring System - Automated Report</p>
                <p>This report was generated automatically on ${new Date().toLocaleString()}</p>
            </div>
        </body>
        </html>
        `;
    } catch (error) {
        console.error('Error generating report HTML:', error);
        return '<html><body><h1>Error generating report</h1></body></html>';
    }
}

// Helper function to get weekly report data
async function getWeeklyReportData() {
    const { rows: fields } = await db.query(`
        SELECT * FROM field_management ORDER BY field_name
    `);
    
    return {
        title: 'Weekly Field Report',
        summary: {
            total_fields: fields.length,
            active_fields: fields.filter(f => f.computed_status === 'Active').length,
            at_risk_fields: fields.filter(f => f.computed_status === 'At Risk').length,
            completed_fields: fields.filter(f => f.computed_status === 'Completed').length
        },
        field_details: fields.map(field => ({
            field_name: field.field_name,
            location: field.field_location,
            crop_type: field.crop_type,
            current_stage: field.current_stage,
            status: field.computed_status,
            planting_date: field.planting_date,
            harvesting_date: field.harvesting_date
        })),
        recommendations: [
            { priority: 'High', action: 'Monitor at-risk fields closely', deadline: 'This week' },
            { priority: 'Medium', action: 'Prepare harvest schedule for ready fields', deadline: 'Next week' },
            { priority: 'Low', action: 'Continue routine maintenance', deadline: 'Ongoing' }
        ]
    };
}

// Helper function to get analytics report data
async function getAnalyticsReportData() {
    const { rows: fields } = await db.query(`
        SELECT * FROM field_management ORDER BY field_name
    `);
    
    return {
        title: 'Analytics Report',
        summary: {
            total_fields: fields.length,
            active_fields: fields.filter(f => f.computed_status === 'Active').length,
            at_risk_fields: fields.filter(f => f.computed_status === 'At Risk').length,
            completed_fields: fields.filter(f => f.computed_status === 'Completed').length
        },
        field_details: fields.map(field => ({
            field_name: field.field_name,
            location: field.field_location,
            crop_type: field.crop_type,
            current_stage: field.current_stage,
            status: field.computed_status,
            planting_date: field.planting_date,
            harvesting_date: field.harvesting_date
        })),
        recommendations: [
            { priority: 'High', action: 'Review analytics trends', deadline: 'This week' },
            { priority: 'Medium', action: 'Optimize field management based on data', deadline: 'Next week' }
        ]
    };
}

// Send email report (mock implementation)
router.post('/email', async (req, res) => {
    try {
        const { recipients, report_type, subject, message } = req.body;
        
        // In a real implementation, this would send emails
        // For demo, we'll simulate the email sending
        const emailResults = recipients.map(email => ({
            email: email,
            status: 'sent',
            sent_at: new Date().toISOString(),
            message_id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }));

        res.json({
            message: 'Email reports sent successfully',
            sent_count: recipients.length,
            results: emailResults,
            report_details: {
                report_type: report_type,
                subject: subject,
                sent_at: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Email report error:', error);
        res.status(500).json({ error: 'Failed to send email reports' });
    }
});

// Get report history
router.get('/history', async (req, res) => {
    try {
        // Mock report history data
        const history = [
            {
                id: 1,
                report_type: 'weekly',
                title: 'Weekly Field Report - Week of Apr 12, 2026',
                generated_at: new Date('2026-04-12T10:00:00Z').toISOString(),
                file_size: '2.1 MB',
                download_url: 'https://example.com/reports/weekly_20260412.pdf'
            },
            {
                id: 2,
                report_type: 'weekly',
                title: 'Weekly Field Report - Week of Apr 5, 2026',
                generated_at: new Date('2026-04-05T10:00:00Z').toISOString(),
                file_size: '2.3 MB',
                download_url: 'https://example.com/reports/weekly_20260405.pdf'
            },
            {
                id: 3,
                report_type: 'monthly',
                title: 'Monthly Analytics Report - March 2026',
                generated_at: new Date('2026-03-31T15:00:00Z').toISOString(),
                file_size: '5.7 MB',
                download_url: 'https://example.com/reports/monthly_202603.pdf'
            }
        ];

        res.json(history);
    } catch (error) {
        console.error('Report history error:', error);
        res.status(500).json({ error: 'Failed to fetch report history' });
    }
});

// Helper functions
function generateCropBreakdown(fields) {
    const cropStats = {};
    
    fields.forEach(field => {
        if (!cropStats[field.crop_type]) {
            cropStats[field.crop_type] = {
                crop_type: field.crop_type,
                total_fields: 0,
                active_fields: 0,
                at_risk_fields: 0,
                completed_fields: 0
            };
        }
        
        cropStats[field.crop_type].total_fields++;
        if (field.computed_status === 'Active') cropStats[field.crop_type].active_fields++;
        if (field.computed_status === 'At Risk') cropStats[field.crop_type].at_risk_fields++;
        if (field.computed_status === 'Completed') cropStats[field.crop_type].completed_fields++;
    });

    return Object.values(cropStats);
}

function generateWeeklyRecommendations(fields) {
    const recommendations = [];
    
    const atRiskCount = fields.filter(f => f.computed_status === 'At Risk').length;
    if (atRiskCount > 0) {
        recommendations.push({
            priority: 'High',
            category: 'Risk Management',
            action: `Review ${atRiskCount} field(s) marked as at risk`,
            deadline: 'Within 3 days'
        });
    }

    const readyFields = fields.filter(f => f.current_stage === 'Ready').length;
    if (readyFields > 0) {
        recommendations.push({
            priority: 'Medium',
            category: 'Harvest Planning',
            action: `Prepare for harvest of ${readyFields} ready field(s)`,
            deadline: 'This week'
        });
    }

    const growingFields = fields.filter(f => f.current_stage === 'Growing').length;
    if (growingFields > 0) {
        recommendations.push({
            priority: 'Low',
            category: 'Routine Maintenance',
            action: `Continue monitoring ${growingFields} growing field(s)`,
            deadline: 'Ongoing'
        });
    }

    return recommendations;
}

function generateUpcomingTasks(fields) {
    const tasks = [];
    const today = new Date();
    
    fields.forEach(field => {
        const harvestDate = new Date(field.harvesting_date);
        const daysToHarvest = Math.ceil((harvestDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysToHarvest <= 7 && daysToHarvest > 0 && field.current_stage !== 'Harvested') {
            tasks.push({
                field_name: field.field_name,
                task: 'Prepare for harvest',
                due_date: harvestDate.toISOString(),
                priority: daysToHarvest <= 3 ? 'High' : 'Medium'
            });
        }

        if (daysToHarvest <= 0 && field.current_stage !== 'Harvested') {
            tasks.push({
                field_name: field.field_name,
                task: 'Harvest overdue',
                due_date: harvestDate.toISOString(),
                priority: 'High'
            });
        }
    });

    return tasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
}

module.exports = router;
