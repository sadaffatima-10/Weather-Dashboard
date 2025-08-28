import { useState, useEffect } from "react";
import WeatherCard from "./components/WeatherCard";
import WeatherChart from './components/WeatherChart';


import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // To show a loading message
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    // Check if the browser supports the Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // Success callback
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLocation({ lat, lon });
          fetchWeatherByCoords(lat, lon); // Call the new function to fetch weather
        },
        // Error callback
        (error) => {
          console.error("Error fetching location:", error);
          setError("Unable to retrieve your location.");
          setIsLoading(false); // Stop loading even if there's an error
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setIsLoading(false);
    }
  }, []);
  // Empty dependency array '[]' ensures this runs only on mount.

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

const fetchWeatherByCoords = async (lat, lon) => {
  setIsLoading(true);
  setError("");
  
  try {
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!weatherRes.ok || !forecastRes.ok) {
      throw new Error("Weather data not found for your location.");
    }

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    setCity(weatherData.name); // Automatically set the city name from the API response
    setWeather(weatherData);
    setForecast(processForecastData(forecastData));
    
  } catch (err) {
    setWeather(null);
    setForecast(null);
    setError(err.message);
  } finally {
    setIsLoading(false); // Hide the loading state
  }
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

    {isLoading && <p className="loading">Detecting your location...</p>}
    {error && <p className="error">{error}</p>}
    
    {!isLoading && !error && weather && <WeatherCard weather={weather} />}
    {!isLoading && !error && forecast && <WeatherChart historicalData={forecast} />}
  </div>
);
}

export default App;
