import Destination from "../models/Destination.js";

export const retrieveDestinations = async (filters) => {
  try {
    const query = {};

    // Filter by current month
    if (filters.month) {
      query.bestMonths = filters.month;
    }

    // Filter by trip type (optional)
    if (filters.tripType) {
      query.tripTypes = filters.tripType;
    }

    // Get destinations from MongoDB
    const destinations = await Destination.find(query);

    return destinations;
  } catch (error) {
    console.error("Retrieval Error:", error.message);
    return [];
  }
};