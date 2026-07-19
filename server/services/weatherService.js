import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.OPENWEATHER_API_KEY;

export async function getWeather(city) {
  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: city,
          units: "metric",
          appid: API_KEY,
        },
      }
    );

    return {
      city,
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      weather: response.data.weather[0].main,
      description: response.data.weather[0].description,
      wind: response.data.wind.speed,
    };

  } catch (error) {

    console.log("Weather Error:", city);

    return null;

  }
}