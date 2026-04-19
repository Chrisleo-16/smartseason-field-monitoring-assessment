const express = require('express');
const router = express.Router();
const db = require('../db'); 

// BUSINESS LOGIC: Calculate Computed Status
const calculateComputedStatus = (stage, harvestingDateStr) => {
    // If it's already harvested, the lifecycle is complete
    if (stage === 'Harvested') return 'Completed';

    // If today is past the harvesting date and it's NOT harvested, it's At Risk
    if (harvestingDateStr) {
        const harvestDate = new Date(harvestingDateStr);
        const today = new Date();
        if (today > harvestDate) return 'At Risk';
    }

    // Otherwise, everything is on track
    return 'Active';
};

// ROUTES

// 1. Create a new field (Admin)
router.post('/fields', async (req, res) => {
    const { field_name, field_location, crop_type, planting_date, harvesting_date, user_id, insights, status_description } = req.body;
    
    // Default stage for a new field is 'Planted'
    const current_stage = req.body.current_stage || 'Planted';
    
    // Automatically compute the status based on our business logic
    const computed_status = calculateComputedStatus(current_stage, harvesting_date);

    try {
        // Changed ? to $1, $2... for PostgreSQL
        await db.query(
            `INSERT INTO field_management 
            (field_name, field_location, crop_type, planting_date, harvesting_date, user_id, insights, status_description, current_stage, computed_status) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [field_name, field_location, crop_type, planting_date, harvesting_date, user_id, insights, status_description, current_stage, computed_status]
        );
        res.status(201).json({ message: 'Field created successfully', computed_status });
    } catch (error) {
        console.error('Error creating field:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 2. Get all fields (Admin Dashboard)
router.get('/fields', async (req, res) => {
    try {
        // Changed [fields] to { rows: fields }
        const { rows: fields } = await db.query(`SELECT * FROM field_management`);   
        res.json(fields);
    } catch (error) {
        console.error('Error fetching fields:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 3. Get a specific field by ID
router.get('/fields/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Changed ? to $1 and [field] to { rows: field }
        const { rows: field } = await db.query(`SELECT * FROM field_management WHERE field_id = $1`, [id]);
        if (field.length === 0) {
            return res.status(404).json({ error: 'Field not found' });
        }
        res.json(field[0]);
    } catch (error) {
        console.error('Error fetching field:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 4. Update an entire field (Admin)
router.put('/fields/:id', async (req, res) => {
    const { id } = req.params;
    const { field_name, field_location, crop_type, planting_date, harvesting_date, user_id, insights, status_description, current_stage } = req.body;
    
    // Re-calculate status in case dates or stages changed
    const computed_status = calculateComputedStatus(current_stage, harvesting_date);

    try {
        // Changed ? to $1, $2... and [result] to result
        const result = await db.query(
            `UPDATE field_management 
             SET field_name = $1, field_location = $2, crop_type = $3, planting_date = $4, harvesting_date = $5, user_id = $6, insights = $7, status_description = $8, current_stage = $9, computed_status = $10 
             WHERE field_id = $11`,
            [field_name, field_location, crop_type, planting_date, harvesting_date, user_id, insights, status_description, current_stage, computed_status, id]
        );
        
        // Changed affectedRows to rowCount
        if (result.rowCount === 0) return res.status(404).json({ error: 'Field not found' });
        res.json({ message: 'Field updated successfully', new_status: computed_status });
    } catch (error) {
        console.error('Error updating field:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 5. Field Agent specific update (Stage & Observations ONLY)
router.patch('/fields/:id/agent-update', async (req, res) => {
    const { id } = req.params;
    const { current_stage, insights } = req.body;

    try {
        // First, fetch the existing field to get the harvesting_date for our status calculation
        const { rows: existingField } = await db.query(`SELECT harvesting_date FROM field_management WHERE field_id = $1`, [id]);
        if (existingField.length === 0) return res.status(404).json({ error: 'Field not found' });

        const computed_status = calculateComputedStatus(current_stage, existingField[0].harvesting_date);

        // Update only the fields the agent is allowed to touch
        await db.query(
            `UPDATE field_management SET current_stage = $1, insights = $2, computed_status = $3 WHERE field_id = $4`,
            [current_stage, insights, computed_status, id]
        );

        res.json({ message: 'Field observation updated successfully', new_status: computed_status });
    } catch (error) {
        console.error('Error in agent update:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 6. Delete a field (Admin)
router.delete('/fields/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(`DELETE FROM field_management WHERE field_id = $1`, [id]);
        // Changed affectedRows to rowCount
        if (result.rowCount === 0) return res.status(404).json({ error: 'Field not found' });
        res.json({ message: 'Field deleted successfully' });
    } catch (error) {
        console.error('Error deleting field:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 7. Get fields for a specific Field Agent
router.get('/fields/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const { rows: fields } = await db.query(`SELECT * FROM field_management WHERE user_id = $1`, [userId]);
        res.json(fields);
    } catch (error) {
        console.error('Error fetching fields for user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;