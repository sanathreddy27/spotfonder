import indiaDestinations from "../data/indiaDestinations.js";
import { getWeather } from "./weatherService.js";
import { getCoordinates } from "./geoapifyService.js";
import {
  getAttractions,
  getHotels,
  getRestaurants,
} from "./placesService.js";
import { getDestinationImage } from "./imageService.js";

export async function buildTravelContext() {
  const context = await Promise.all(
    indiaDestinations.map(async (place) => {
      try {
        // Fetch weather and coordinates together
        const [weather, coordinates] = await Promise.all([
          getWeather(place.name),
          getCoordinates(place.name),
        ]);

        let attractions = [];
        let hotels = [];
        let restaurants = [];
        let image = null;

        if (coordinates) {
          const lat = coordinates.latitude;
          const lon = coordinates.longitude;

          // Fetch everything together for better performance
          [attractions, hotels, restaurants, image] = await Promise.all([
            getAttractions(lat, lon),
            getHotels(lat, lon),
            getRestaurants(lat, lon),
            getDestinationImage(place.name),
          ]);
        }

        return {
          ...place,
          weather,
          coordinates,
          attractions,
          hotels,
          restaurants,
          image,
        };
      } catch (error) {
        console.log(`Error loading ${place.name}:`, error.message);

        return {
          ...place,
          weather: null,
          coordinates: null,
          attractions: [],
          hotels: [],
          restaurants: [],
          image: null,
        };
      }
    })
  );

  return context;
}