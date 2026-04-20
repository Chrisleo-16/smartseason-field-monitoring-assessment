const express = require('express');
const app = express();
const cors = require('cors');

// Import all routes
const authRoutes = require('./routes/auth.js');
const fieldManagementRoutes = require('./routes/field-management.js');
const weatherRoutes = require('./routes/weather.js');
const photosRoutes = require('./routes/photos.js');
const analyticsRoutes = require('./routes/analytics.js');
const reportsRoutes = require('./routes/reports.js');

// Middleware
app.use(express.json());
app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'X-Requested-With', 'Accept', 'Origin', 'Pragma']
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        features: ['auth', 'field-management', 'weather', 'photos', 'analytics', 'reports']
    });
});

// Route registrations
app.use('/api/auth', authRoutes);
app.use('/api/field-management', fieldManagementRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/photos', photosRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reports', reportsRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`SmartSeason Field Monitoring API Server running on port ${PORT}`);
    console.log('Available endpoints:');
    console.log('- GET /health - Health check');
    console.log('- POST /api/auth/login - User authentication');
    console.log('- POST /api/auth/register - User registration');
    console.log('- GET /api/field-management/fields - Get all fields');
    console.log('- GET /api/weather/:location - Get weather data');
    console.log('- POST /api/photos/fields/:fieldId/photos - Upload field photo');
    console.log('- GET /api/analytics/predictions - Get predictive analytics');
    console.log('- GET /api/reports/weekly - Generate weekly report');
});