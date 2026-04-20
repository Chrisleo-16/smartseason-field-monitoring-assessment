const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get weather data for a location
router.get('/:location', async (req, res) => {
    const { location } = req.params;
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    
    // Fallback weather data when API key is not available
    const getFallbackWeather = (location) => {
        const currentHour = new Date().getHours();
        const isDaytime = currentHour >= 6 && currentHour <= 18;
        
        const locationWeather = {
            'Nairobi North': {
                temp: 28, description: 'Partly cloudy', icon: isDaytime ? '02d' : '02n', 
                humidity: 65, windSpeed: 12, pressure: 1013
            },
            'Greenhouse Complex A': {
                temp: 31, description: 'Sunny', icon: '01d', 
                humidity: 45, windSpeed: 8, pressure: 1015
            },
            'East Farm Section B': {
                temp: 25, description: 'Overcast', icon: '04d', 
                humidity: 72, windSpeed: 15, pressure: 1011
            }
        };

        const defaultWeather = {
            temp: 26, description: 'Partly cloudy', icon: isDaytime ? '02d' : '02n', 
            humidity: 60, windSpeed: 10, pressure: 1013
        };

        const current = locationWeather[location] || defaultWeather;
        
        return {
            location: location,
            current: current,
            forecast: [
                { day: 'Mon', temp: current.temp + 1, description: 'Sunny', icon: '01d' },
                { day: 'Tue', temp: current.temp - 1, description: 'Cloudy', icon: '03d' },
                { day: 'Wed', temp: current.temp - 2, description: 'Partly cloudy', icon: '02d' }
            ],
            alerts: [],
            lastUpdated: new Date().toISOString()
        };
    };
    
    if (!API_KEY) {
        console.log('OpenWeatherMap API key not configured, using fallback data for:', location);
        return res.json(getFallbackWeather(location));
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
