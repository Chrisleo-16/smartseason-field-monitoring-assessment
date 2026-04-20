const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db'); // Assuming you have a db.js file for database connection

// Register route
router.post('/register', async (req, res) => {
    const { username, email, password, users_role, phone_number } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Check if the user already exists (PostgreSQL syntax: { rows })
        const { rows: existingUsers } = await db.query(
            `SELECT * FROM users WHERE email = $1 OR username = $2 OR phone_number = $3`,
            [email, username, phone_number]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "User with this email, username, or phone already exists." });
        } 
        
        // Insert user into the database
        await db.query(
            `INSERT INTO users (username, email, password, users_role, phone_number) VALUES ($1, $2, $3, $4, $5)`,
            [username, email, hashedPassword, users_role, phone_number]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        console.log("DB Object Type:", typeof db.query);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Get the rows from the database (PostgreSQL syntax: { rows })
        const { rows } = await db.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );
        
        // 2. Extract the actual user object from the first row
        const user = rows[0]; 

        // console.log("User found in DB:", user ? "Yes" : "No");

        // 3. Check if user exists
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // 4. Compare the password string with the hash from the DB object
        const isMatch = await bcrypt.compare(password.toString(), user.password);
        
        // console.log("Password Match:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ error: 'Password incorrect' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user details by email
router.get('/user/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const { rows } = await db.query(
            `SELECT user_id, username, email, users_role, phone_number FROM users WHERE email = $1`,
            [email]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all users (for admin dropdowns)
router.get('/users', async (req, res) => {
    try {
        const { rows } = await db.query(`
            SELECT user_id, username, email, users_role 
            FROM users 
            ORDER BY username
        `);
        
        res.json(rows);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

module.exports = router;