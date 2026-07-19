import Destination from "../models/Destination.js";
import { buildDestination } from "../services/destinationService.js";
import { generateItinerary } from "../services/aiItineraryService.js";

export const getDestinationDetails = async (req, res) => {
  try {
    const { name } = req.params;

    // 1. Check MongoDB first
    const existingDestination = await Destination.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });

    // DEVELOPMENT MODE
    // Always regenerate destination data.
    // We will enable caching again before deployment.
    console.log("🔄 Development Mode - Skipping MongoDB Cache");

    console.log("🌍 Fetching destination from APIs...");

    // 2. Fetch from APIs
    const destination = await buildDestination(name);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    // 3. Generate AI itinerary
    const itinerary = await generateItinerary(destination);

    console.log(
      JSON.stringify(itinerary.threeDays[0], null, 2)
    );

    // 4. Save/Update into MongoDB
    let savedDestination;

    if (existingDestination) {
      existingDestination.set({
        ...destination,
        itinerary,
        cachedAt: new Date(),
      });

      savedDestination = await existingDestination.save();
      console.log("🔄 Existing document updated in MongoDB");
    } else {
      savedDestination = await Destination.create({
        ...destination,
        itinerary,
        cachedAt: new Date(),
      });
      console.log("💾 New document saved into MongoDB");
    }

    // 5. Return response
    res.json({
      success: true,
      destination: savedDestination,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};