import mongoose from "mongoose";

// Sub-schema for places (Hotels, Restaurants, Attractions)
const placeSchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    latitude: Number,
    longitude: Number,
    rating: Number,
    image: String,
  },
  { _id: false }
);

// Updated Itinerary Day Schema with budget sub-document
const itineraryDaySchema = new mongoose.Schema(
  {
    day: Number,

    theme: String,

    hotel: placeSchema,

    breakfast: placeSchema,

    morning: [placeSchema],

    lunch: placeSchema,

    afternoon: [placeSchema],

    evening: [placeSchema],

    dinner: placeSchema,

    stay: placeSchema,

    weatherAdvice: String,

    schedule: [
      {
        time: String,
        label: String,
      },
    ],

    budget: {
      hotel: Number,
      breakfast: Number,
      lunch: Number,
      dinner: Number,
      transport: Number,
      attractions: Number,
      total: Number,
    },
  },
  { _id: false }
);

// Main Destination Schema linking threeDays and fiveDays structures
const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: String,
    image: String,
    weather: {
      temperature: Number,
      weather: String,
    },
    attractions: [placeSchema],
    hotels: [placeSchema],
    restaurants: [placeSchema],
    itinerary: {
      threeDays: [itineraryDaySchema],
      fiveDays: [itineraryDaySchema],
    },
    cachedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Destination = mongoose.model("Destination", destinationSchema);

export default Destination;