import "./WeatherCard.css";

function WeatherCard({ weather }) {
  return (
    <div className="weather-card">
      <h2>{weather.name}, {weather.sys.country}</h2>
      <p className="temp">{Math.round(weather.main.temp)}°C</p>
      <p>{weather.weather[0].description}</p>
      <div className="details">
        <p>💧 Humidity: {weather.main.humidity}%</p>
        <p>🌬 Wind: {weather.wind.speed} m/s</p>
      </div>
    </div>
  );
}

export default WeatherCard;
