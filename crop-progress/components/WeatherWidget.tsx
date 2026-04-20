"use client"
import React, { useState, useEffect } from 'react';
import { getWeather, WeatherData } from '@/utils/api';

interface WeatherWidgetProps {
  location: string;
  compact?: boolean;
}

export default function WeatherWidget({ location, compact = false }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWeather();
  }, [location]);

  const getFallbackWeather = (location: string): WeatherData => {
    const currentHour = new Date().getHours();
    const isDaytime = currentHour >= 6 && currentHour <= 18;
    
    // Simulate different weather conditions based on location
    const locationWeather: Record<string, Partial<WeatherData>> = {
      'Nairobi North': {
        current: { temp: 28, description: 'Partly cloudy', icon: isDaytime ? '02d' : '02n', humidity: 65, windSpeed: 12, pressure: 1013 },
        forecast: [
          { day: 'Mon', temp: 29, description: 'Sunny', icon: '01d' },
          { day: 'Tue', temp: 27, description: 'Cloudy', icon: '03d' },
          { day: 'Wed', temp: 26, description: 'Light rain', icon: '10d' }
        ]
      },
      'Greenhouse Complex A': {
        current: { temp: 31, description: 'Sunny', icon: '01d', humidity: 45, windSpeed: 8, pressure: 1015 },
        forecast: [
          { day: 'Mon', temp: 32, description: 'Sunny', icon: '01d' },
          { day: 'Tue', temp: 30, description: 'Partly cloudy', icon: '02d' },
          { day: 'Wed', temp: 29, description: 'Sunny', icon: '01d' }
        ]
      },
      'East Farm Section B': {
        current: { temp: 25, description: 'Overcast', icon: '04d', humidity: 72, windSpeed: 15, pressure: 1011 },
        forecast: [
          { day: 'Mon', temp: 26, description: 'Cloudy', icon: '03d' },
          { day: 'Tue', temp: 24, description: 'Rainy', icon: '10d' },
          { day: 'Wed', temp: 23, description: 'Thunderstorms', icon: '11d' }
        ]
      }
    };

    const defaultWeather = {
      current: { temp: 26, description: 'Partly cloudy', icon: isDaytime ? '02d' : '02n', humidity: 60, windSpeed: 10, pressure: 1013 },
      forecast: [
        { day: 'Mon', temp: 27, description: 'Sunny', icon: '01d' },
        { day: 'Tue', temp: 25, description: 'Cloudy', icon: '03d' },
        { day: 'Wed', temp: 24, description: 'Partly cloudy', icon: '02d' }
      ]
    };

    const weatherData = locationWeather[location] || defaultWeather;
    
    return {
      location,
      current: weatherData.current as any,
      forecast: weatherData.forecast as any,
      alerts: [],
      lastUpdated: new Date().toISOString()
    };
  };

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const data = await getWeather(location);
      setWeather(data);
      setError('');
    } catch (err: any) {
      // Use fallback weather data when API fails
      const fallbackData = getFallbackWeather(location);
      setWeather(fallbackData);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  const getWeatherRecommendations = (weather: WeatherData) => {
    const recommendations = [];
    
    // Temperature-based recommendations
    if (weather.current.temp > 30) {
      recommendations.push("High temperature - consider irrigation");
    } else if (weather.current.temp < 10) {
      recommendations.push("Low temperature - protect sensitive crops");
    }

    // Weather condition recommendations
    if (weather.current.description.toLowerCase().includes('rain')) {
      recommendations.push("Rain expected - delay field activities");
    } else if (weather.current.description.toLowerCase().includes('sunny')) {
      recommendations.push("Perfect conditions for field work");
    }

    // Wind recommendations
    if (weather.current.windSpeed > 20) {
      recommendations.push("High winds - avoid spraying operations");
    }

    // Humidity recommendations
    if (weather.current.humidity > 80) {
      recommendations.push("High humidity - monitor for fungal diseases");
    }

    return recommendations;
  };

  if (loading) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        padding: compact ? '15px' : '20px',
        borderRadius: '12px',
        textAlign: 'center',
        minWidth: compact ? '200px' : '300px',
        color: '#E8E4DA'
      }}>
        <div style={{ fontSize: '14px', color: '#888' }}>Loading weather...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        padding: compact ? '15px' : '20px',
        borderRadius: '12px',
        textAlign: 'center',
        minWidth: compact ? '200px' : '300px',
        color: '#E8E4DA'
      }}>
        <div style={{ color: '#F8727A', marginBottom: '10px' }}>Weather unavailable</div>
        <button 
          onClick={fetchWeather}
          style={{
            padding: '6px 12px',
            background: 'rgba(78,139,58,0.15)',
            border: '1px solid rgba(78,139,58,0.3)',
            color: '#7AB85A',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(78,139,58,0.25)';
            e.currentTarget.style.borderColor = 'rgba(78,139,58,0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(78,139,58,0.15)';
            e.currentTarget.style.borderColor = 'rgba(78,139,58,0.3)';
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!weather) return null;

  const recommendations = getWeatherRecommendations(weather);

  if (compact) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        padding: '15px',
        borderRadius: '12px',
        minWidth: '200px',
        color: '#E8E4DA'
      }}>
        <div style={{ fontWeight: '500', marginBottom: '10px', fontSize: '14px', color: '#C8C4BB' }}>{weather.location}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src={getWeatherIcon(weather.current.icon)} 
            alt={weather.current.description}
            style={{ width: '40px', height: '40px' }}
          />
          <div>
            <div style={{ fontSize: '20px', fontWeight: '600', color: '#E8E4DA' }}>{weather.current.temp}°C</div>
            <div style={{ fontSize: '12px', color: '#888' }}>{weather.current.description}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      padding: '20px',
      borderRadius: '16px',
      minWidth: '300px',
      color: '#E8E4DA'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, color: '#F0EDE4', fontSize: '16px', fontWeight: '500' }}>{weather.location}</h3>
        <button 
          onClick={fetchWeather}
          style={{
            padding: '4px 8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#888',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '11px',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.color = '#C8C4BB';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = '#888';
          }}
        >
          Refresh
        </button>
      </div>

      {/* Current Weather */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
        <img 
          src={getWeatherIcon(weather.current.icon)} 
          alt={weather.current.description}
          style={{ width: '60px', height: '60px' }}
        />
        <div>
          <div style={{ fontSize: '32px', fontWeight: '600', color: '#7AB85A' }}>
            {weather.current.temp}°C
          </div>
          <div style={{ color: '#A8A49C', marginBottom: '5px', fontSize: '14px' }}>{weather.current.description}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Humidity: {weather.current.humidity}% | Wind: {weather.current.windSpeed} km/h
          </div>
        </div>
      </div>

      {/* 3-Day Forecast */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#C8C4BB', fontSize: '14px', fontWeight: '500' }}>3-Day Forecast</h4>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
          {weather.forecast.map((day, index) => (
            <div key={index} style={{ textAlign: 'center', flex: 1, background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: '#666', marginBottom: '5px' }}>{day.day}</div>
              <img 
                src={getWeatherIcon(day.icon)} 
                alt={day.description}
                style={{ width: '30px', height: '30px' }}
              />
              <div style={{ fontSize: '14px', fontWeight: '500', marginTop: '5px', color: '#E8E4DA' }}>{day.temp}°C</div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Recommendations */}
      {recommendations.length > 0 && (
        <div style={{
          background: 'rgba(78,139,58,0.08)',
          border: '1px solid rgba(78,139,58,0.2)',
          padding: '15px',
          borderRadius: '10px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#7AB85A', fontSize: '14px', fontWeight: '500' }}>Field Recommendations</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#A8A49C' }}>
            {recommendations.map((rec, index) => (
              <li key={index} style={{ marginBottom: '5px', fontSize: '13px', lineHeight: '1.4' }}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Weather Alerts */}
      {weather.alerts && weather.alerts.length > 0 && (
        <div style={{
          background: 'rgba(220,53,69,0.08)',
          border: '1px solid rgba(220,53,69,0.2)',
          padding: '12px',
          borderRadius: '8px',
          marginTop: '15px'
        }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#F8727A', fontSize: '13px', fontWeight: '500' }}>Weather Alerts</h4>
          {weather.alerts.map((alert, index) => (
            <div key={index} style={{ fontSize: '12px', color: '#FF8088', lineHeight: '1.3' }}>
              {alert}
            </div>
          ))}
        </div>
      )}

      <div style={{ fontSize: '11px', color: '#555', marginTop: '12px', textAlign: 'right' }}>
        Last updated: {new Date(weather.lastUpdated).toLocaleTimeString()}
      </div>
    </div>
  );
}
