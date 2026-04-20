const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get weather data for a location
router.get('/:location', async (req, res) => {
    const { location } = req.params;
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    
    if (!API_KEY) {
        return res.status(500).json({ error: 'OpenWeatherMap API key not configured' });
    }
    
    try {
        // Real API call
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`
        );
        
        const forecastResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=metric`
        );

        const weather = {
            location: location,
            current: {
                temp: Math.round(response.data.main.temp),
                description: response.data.weather[0].description,
                icon: response.data.weather[0].icon,
                humidity: response.data.main.humidity,
                windSpeed: response.data.wind.speed,
                pressure: response.data.main.pressure
            },
            forecast: forecastResponse.data.list.slice(0, 3).map(item => ({
                day: new Date(item.dt * 1000).toLocaleDateString(),
                temp: Math.round(item.main.temp),
                description: item.weather[0].description,
                icon: item.weather[0].icon
            })),
            alerts: [],
            lastUpdated: new Date().toISOString()
        };

        res.json(weather);
    } catch (error) {
        console.error('Weather API error:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

module.exports = router;
