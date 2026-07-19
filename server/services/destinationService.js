import { getCoordinates } from "./geoapifyService.js";
import { getWeather } from "./weatherService.js";
import { getDestinationImage } from "./imageService.js";
import { getPlaceImage } from "./placeImageService.js";

const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;

async function getPlaces(lat, lon, categories, limit = 5) {
  try {
    const response = await fetch(
      `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lon},${lat},10000&limit=${limit}&apiKey=${GEOAPIFY_API_KEY}`
    );

    const data = await response.json();

    if (!data.features) {
      return [];
    }

    const places = await Promise.all(
      data.features.map(async (place) => ({
        id: place.properties.place_id || "",
        name: place.properties.name || "Unknown",
        address: place.properties.formatted || "",
        latitude: place.properties.lat,
        longitude: place.properties.lon,
        image: await getPlaceImage(place.properties.name || "Hotel"),
      }))
    );

    return places;

  } catch (error) {
    console.error("Geoapify Places Error:", error);
    return [];
  }
}

export async function buildDestination(name) {
  try {
    const coordinates = await getCoordinates(name);

    if (!coordinates) {
      return null;
    }

    const weather = await getWeather(name);

    const image = await getDestinationImage(name);

    const hotels = await getPlaces(
      coordinates.latitude,
      coordinates.longitude,
      "accommodation.hotel"
    );

    const restaurants = await getPlaces(
      coordinates.latitude,
      coordinates.longitude,
      "catering.restaurant"
    );

    const attractions = await getPlaces(
      coordinates.latitude,
      coordinates.longitude,
      "tourism.attraction"
    );

    return {
      name,

      state:
        coordinates.formatted.split(",").length > 1
          ? coordinates.formatted.split(",")[1].trim()
          : "",

      image,

      about: `${name} is one of India's most popular tourist destinations known for its scenic beauty, culture, food, history and unforgettable travel experiences.`,

      weather,

      hotels,

      restaurants,

      attractions,
    };

  } catch (error) {
    console.error("Destination Service Error:", error);
    return null;
  }
}