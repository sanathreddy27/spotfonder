import Hotel from "../models/Hotel.js";
import Restaurant from "../models/Restaurant.js";
import Attraction from "../models/Attraction.js";
import Festival from "../models/Festival.js";

export const buildTravelContext = async (destinations) => {
  const travelContext = [];

  for (const destination of destinations) {
    const hotels = await Hotel.find({
      destination: destination.name,
    });

    const restaurants = await Restaurant.find({
      destination: destination.name,
    });

    const attractions = await Attraction.find({
      destination: destination.name,
    });

    const festivals = await Festival.find({
      destination: destination.name,
    });

    travelContext.push({
      destination,
      hotels,
      restaurants,
      attractions,
      festivals,
    });
  }

  return travelContext;
};