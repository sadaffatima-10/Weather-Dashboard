import { useState } from "react";
import WeatherCard from "./components/WeatherCard";
import WeatherChart from './components/WeatherChart';

import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchWeather = async () => {
  if (!city) return;

  try {
    // Current weather API call
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    // 5-day forecast API call
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!weatherRes.ok || !forecastRes.ok) {
      throw new Error("City not found");
    }

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    setWeather(weatherData);
    setForecast(processForecastData(forecastData)); // Call the new helper function
    setError("");

  } catch (err) {
    setWeather(null);
    setForecast(null); // Reset forecast on error
    setError(err.message);
  }
};

const processForecastData = (data) => {
  const dailyData = {};
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
    const temp = item.main.temp;
    const wind = item.wind.speed;

    if (!dailyData[date]) {
      dailyData[date] = { temp: [], wind: [] };
    }
    dailyData[date].temp.push(temp);
    dailyData[date].wind.push(wind);
  });

  const chartData = Object.keys(dailyData).map(date => ({
    date: date,
    temp: dailyData[date].temp.reduce((sum, t) => sum + t, 0) / dailyData[date].temp.length,
    wind: dailyData[date].wind.reduce((sum, w) => sum + w, 0) / dailyData[date].wind.length,
  }));
  
  return chartData;
};

  return (
    <div className="app">
      <h1 className="title">🌤 Weather Dashboard</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchWeather}>Search</button>
      </div>

      {error && <p className="error">{error}</p>}

      {weather && <WeatherCard weather={weather} />}

      {forecast && <WeatherChart historicalData={forecast} />}

    </div>
  );
}

export default App;
