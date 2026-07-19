import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export async function getWeather(city) {
  try {
    console.log("Searching weather for:", city);

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

    return response.data;
  } catch (error) {
    console.error("Weather API Error:", error.response?.data || error);
    return null;
  }
}