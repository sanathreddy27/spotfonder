import "dotenv/config";
import mongoose from "mongoose";

import Destination from "../models/Destination.js";

const munnarThreeDays = [
  {
    day: 1,
    theme: "Munnar introduction",
    morning: [],
    afternoon: [],
    evening: [],
    weatherAdvice:
      "Carry light layers because mountain weather can change.",
    schedule: [],
    budget: {
      hotel: 0,
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      transport: 0,
      attractions: 0,
      total: 0,
    },
  },
  {
    day: 2,
    theme: "Nature and tea landscapes",
    morning: [],
    afternoon: [],
    evening: [],
    weatherAdvice:
      "Carry comfortable clothing suitable for outdoor sightseeing.",
    schedule: [],
    budget: {
      hotel: 0,
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      transport: 0,
      attractions: 0,
      total: 0,
    },
  },
  {
    day: 3,
    theme: "Munnar exploration",
    morning: [],
    afternoon: [],
    evening: [],
    weatherAdvice:
      "Check local weather conditions before outdoor activities.",
    schedule: [],
    budget: {
      hotel: 0,
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      transport: 0,
      attractions: 0,
      total: 0,
    },
  },
];

const munnarFiveDays = [
  ...munnarThreeDays,
  {
    day: 4,
    theme: "Extended exploration",
    morning: [],
    afternoon: [],
    evening: [],
    weatherAdvice:
      "Check local weather conditions before outdoor activities.",
    schedule: [],
    budget: {
      hotel: 0,
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      transport: 0,
      attractions: 0,
      total: 0,
    },
  },
  {
    day: 5,
    theme: "Departure",
    morning: [],
    afternoon: [],
    evening: [],
    weatherAdvice:
      "Check local weather and travel conditions before departure.",
    schedule: [],
    budget: {
      hotel: 0,
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      transport: 0,
      attractions: 0,
      total: 0,
    },
  },
];

async function seedItineraries() {
  try {
    console.log("🔌 Connecting to MongoDB Atlas...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");

    const result = await Destination.updateOne(
      { name: "Munnar" },
      {
        $set: {
          "itinerary.threeDays": munnarThreeDays,
          "itinerary.fiveDays": munnarFiveDays,
        },
      }
    );

    console.log("✅ Munnar itinerary updated");
    console.log("Matched:", result.matchedCount);
    console.log("Modified:", result.modifiedCount);

    await mongoose.disconnect();

    console.log("🔌 MongoDB disconnected");
  } catch (error) {
    console.error("❌ Itinerary seed failed:", error);

    try {
      await mongoose.disconnect();
    } catch {}

    process.exit(1);
  }
}

seedItineraries();  