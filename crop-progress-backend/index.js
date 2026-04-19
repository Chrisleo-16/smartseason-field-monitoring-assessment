const express = require('express');
const app = express();
const cors = require('cors');

const authRoutes = require('./routes/auth.js');
const db = require('./db.js');
const fieldManagementRoutes = require('./routes/field-management.js');


app.use(express.json());
// More flexible CORS configuration for production
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // In production, allow the frontend URL
        if (process.env.NODE_ENV === 'production') {
            const allowedOrigins = [
                'https://smartseason-field-monitoring-assessment.onrender.com',
                // Add your production frontend URL here if different
            ];
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
        } else {
            // In development, allow localhost
            if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
                return callback(null, true);
            }
        }
        
        callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'X-Requested-With', 'Accept', 'Origin', 'Pragma'],
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

// Alternative: More permissive CORS for production (uncomment if above causes issues)
// app.use(cors({
//     origin: true, // Allow all origins
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//     credentials: true,
//     allowHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'X-Requested-With', 'Accept', 'Origin', 'Pragma'],
//     optionsSuccessStatus: 200
// }));
app.use('/api/auth', authRoutes);
app.use('/api/field-management', fieldManagementRoutes);

app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})