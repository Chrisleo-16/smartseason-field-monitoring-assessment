const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../db');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Upload photo for a field
router.post('/fields/:fieldId/photos', upload.single('photo'), async (req, res) => {
    const { fieldId } = req.params;
    const { photo_type = 'general', notes = '' } = req.body;

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No photo uploaded' });
        }

        // Convert image to base64 for storage
        const imageBase64 = req.file.buffer.toString('base64');
        const mimeType = req.file.mimetype;

        // Insert photo into database
        const { rows } = await db.query(
            `INSERT INTO field_photos (field_id, photo_data, mime_type, photo_type, notes, upload_date) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [fieldId, imageBase64, mimeType, photo_type, notes, new Date()]
        );

        // Basic "AI" analysis (mock for demo)
        const analysis = analyzePhoto(imageBase64, mimeType);

        res.json({
            message: 'Photo uploaded successfully',
            photo: rows[0],
            analysis: analysis
        });
    } catch (error) {
        console.error('Photo upload error:', error);
        res.status(500).json({ error: 'Failed to upload photo' });
    }
});

// Get all photos for a field
router.get('/fields/:fieldId/photos', async (req, res) => {
    const { fieldId } = req.params;

    try {
        const { rows } = await db.query(
            `SELECT * FROM field_photos WHERE field_id = $1 ORDER BY upload_date DESC`,
            [fieldId]
        );

        res.json(rows);
    } catch (error) {
        console.error('Get photos error:', error);
        res.status(500).json({ error: 'Failed to fetch photos' });
    }
});

// Delete a photo
router.delete('/photos/:photoId', async (req, res) => {
    const { photoId } = req.params;

    try {
        const { rows } = await db.query(
            `DELETE FROM field_photos WHERE photo_id = $1 RETURNING *`,
            [photoId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Photo not found' });
        }

        res.json({ message: 'Photo deleted successfully' });
    } catch (error) {
        console.error('Delete photo error:', error);
        res.status(500).json({ error: 'Failed to delete photo' });
    }
});

// Mock AI photo analysis
function analyzePhoto(imageBase64, mimeType) {
    // In a real implementation, this would call an AI service
    // For demo, we'll return mock analysis
    const healthIndicators = ['Healthy', 'Needs Water', 'Pest Risk', 'Nutrient Deficient'];
    const randomHealth = healthIndicators[Math.floor(Math.random() * healthIndicators.length)];
    
    return {
        health_status: randomHealth,
        confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
        recommendations: getRecommendations(randomHealth),
        analysis_date: new Date().toISOString()
    };
}

function getRecommendations(healthStatus) {
    const recommendations = {
        'Healthy': ['Continue current care routine', 'Monitor for changes'],
        'Needs Water': ['Increase irrigation schedule', 'Check soil moisture levels'],
        'Pest Risk': ['Inspect for pests', 'Consider organic pesticide', 'Monitor daily'],
        'Nutrient Deficient': ['Test soil nutrients', 'Apply appropriate fertilizer', 'Consult agronomist']
    };
    
    return recommendations[healthStatus] || ['Monitor field conditions'];
}

module.exports = router;
