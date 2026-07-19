import axios from "axios";

const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

export async function searchCities(text) {
  if (!text) return [];

  try {
    const response = await axios.get(
      "https://api.geoapify.com/v1/geocode/autocomplete",
      {
        params: {
          text,
          filter: "countrycode:in",
          limit: 5,
          apiKey: API_KEY,
        },
      }
    );

    return response.data.features;
  } catch (error) {
    console.error("Geoapify Error:", error);
    return [];
  }
}