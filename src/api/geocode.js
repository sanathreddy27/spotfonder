import axios from "axios";

const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

export async function getCoordinates(place) {
  try {
    const response = await axios.get(
      "https://api.geoapify.com/v1/geocode/search",
      {
        params: {
          text: place,
          apiKey: API_KEY,
        },
      }
    );

    if (response.data.features.length === 0) {
      return null;
    }

    return response.data.features[0].properties;
  } catch (error) {
    console.error(error);
    return null;
  }
}