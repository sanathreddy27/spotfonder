import { getWeather } from "../services/weatherService.js";
import {
  getCoordinates,
  getNearbyPlaces,
} from "../services/geoapifyService.js";

export const getDestinationDetails = async (req, res) => {
  try {
    const destination = decodeURIComponent(req.params.name);

    console.log("=================================");
    console.log("📍 Destination:", destination);
    console.log("=================================");

    // ------------------------------------
    // GET COORDINATES
    // ------------------------------------

    const coordinates = await getCoordinates(destination);

    if (!coordinates) {
      return res.status(404).json({
        success: false,
        message: "Destination coordinates not found",
      });
    }

    console.log("📍 Coordinates:", coordinates);

    // ------------------------------------
    // GET WEATHER
    // ------------------------------------

    const weather = await getWeather(destination);

    // ------------------------------------
    // GET ATTRACTIONS
    // ------------------------------------

    console.log("🏞️ Finding attractions...");

    const attractions = await getNearbyPlaces(
      coordinates.latitude,
      coordinates.longitude,
      "tourism",
      20000,
      20
    );

    // ------------------------------------
    // GET HOTELS
    // ------------------------------------

    console.log("🏨 Finding hotels...");

    const hotels = await getNearbyPlaces(
      coordinates.latitude,
      coordinates.longitude,
      "accommodation.hotel",
      10000,
      20
    );

    // ------------------------------------
    // GET RESTAURANTS
    // ------------------------------------

    console.log("🍽️ Finding restaurants...");

    const restaurants = await getNearbyPlaces(
      coordinates.latitude,
      coordinates.longitude,
      "catering.restaurant",
      10000,
      20
    );

    console.log("=================================");
    console.log("✅ Destination data loaded");
    console.log("Attractions:", attractions.length);
    console.log("Hotels:", hotels.length);
    console.log("Restaurants:", restaurants.length);
    console.log("=================================");

    // ------------------------------------
    // SEND RESPONSE
    // ------------------------------------

    res.json({
      success: true,

      destination: {
        name: destination,

        coordinates,

        weather,
      },

      attractions,

      hotels,

      restaurants,
    });
  } catch (error) {
    console.error("❌ Destination Details Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};