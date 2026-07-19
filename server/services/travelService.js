import { getCoordinates, getNearbyHotels } from "./geoapifyService.js";
import { getWeather } from "./weatherService.js";

export const buildTravelData = async (destination) => {
  try {
    const coordinates = await getCoordinates(destination.name);

    if (!coordinates) {
      return {
        ...destination,
        weather: null,
        hotels: [],
        restaurants: [],
        attractions: [],
      };
    }

    const weather = await getWeather(destination.name);

    const hotels = await getNearbyHotels(
      coordinates.latitude,
      coordinates.longitude
    );

    return {
      ...destination,
      coordinates,
      weather,
      hotels,
      restaurants: [],
      attractions: [],
    };
  } catch (error) {
    console.error(error);

    return {
      ...destination,
      weather: null,
      hotels: [],
      restaurants: [],
      attractions: [],
    };
  }
};