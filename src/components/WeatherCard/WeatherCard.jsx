import { useEffect, useState } from "react";
import { getWeather } from "../../api/weather";

function WeatherCard({ destination }) {
  console.log("WeatherCard Loaded");
  console.log("Destination:", destination);

  const [weather, setWeather] = useState(null);

  useEffect(() => {
    async function loadWeather() {
      if (!destination) {
        console.log("No destination received.");
        return;
      }

      console.log("Fetching weather for:", destination);

      const data = await getWeather(destination);

      console.log("Weather API Response:", data);

      if (data) {
        setWeather(data);
      }
    }

    loadWeather();
  }, [destination]);

  return (
    <div className="bg-slate-800 rounded-2xl p-6 mt-8 text-white shadow-lg">
      <h2 className="text-3xl font-bold mb-6">
        🌤 Weather
      </h2>

      <div className="bg-slate-700 rounded-xl p-6">

        <p className="text-xl mb-3">
          🌡 Temperature : {weather ? `${weather.main.temp} °C` : "--"}
        </p>

        <p className="text-xl mb-3">
          ☁ Condition : {weather ? weather.weather[0].main : "--"}
        </p>

        <p className="text-xl mb-3">
          💧 Humidity : {weather ? `${weather.main.humidity}%` : "--"}
        </p>

        <p className="text-xl">
          🌬 Wind Speed : {weather ? `${weather.wind.speed} m/s` : "--"}
        </p>

      </div>
    </div>
  );
}

export default WeatherCard;