import axios from "axios";

const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

export async function getRoute(from, to) {
  try {
    const response = await axios.get(
      "https://api.geoapify.com/v1/routing",
      {
        params: {
          waypoints: `${from.lat},${from.lon}|${to.lat},${to.lon}`,
          mode: "drive",
          details: "route_details",
          apiKey: API_KEY,
        },
      }
    );

    return response.data.features[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}