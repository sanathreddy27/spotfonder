import mongoose from "mongoose";

// --------------------------------------------------
// PLACE SCHEMA
// Hotels, Restaurants, Attractions
// --------------------------------------------------

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

// --------------------------------------------------
// ITINERARY DAY SCHEMA
// --------------------------------------------------

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

// --------------------------------------------------
// DESTINATION SCHEMA
// --------------------------------------------------

const destinationSchema = new mongoose.Schema(
  {
    // Basic destination information
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    state: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "Destination",
    },

    // ------------------------------------------------
    // RAG KNOWLEDGE
    // ------------------------------------------------

    importance: {
      type: String,
      default: "",
    },

    famousFor: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    history: {
      type: String,
      default: "",
    },

    bestTime: {
      type: String,
      default: "",
    },

    tags: {
      type: [String],
      default: [],
    },

    knowledgeText: {
      type: String,
      default: "",
    },

    // ------------------------------------------------
    // IMAGE
    // ------------------------------------------------

    image: String,

    images: {
      type: [String],
      default: [],
    },

    // ------------------------------------------------
    // LIVE WEATHER
    // ------------------------------------------------

    weather: {
      temperature: Number,
      weather: String,
    },

    // ------------------------------------------------
    // LIVE PLACES
    // ------------------------------------------------

    attractions: [placeSchema],

    hotels: [placeSchema],

    restaurants: [placeSchema],

    // ------------------------------------------------
    // ITINERARY
    // ------------------------------------------------

    itinerary: {
      threeDays: [itineraryDaySchema],
      fiveDays: [itineraryDaySchema],
    },

    // ------------------------------------------------
    // CACHE INFORMATION
    // ------------------------------------------------

    cachedAt: {
      type: Date,
      default: Date.now,
    },
  },

  {
    timestamps: true,
  }
);

const Destination = mongoose.model(
  "Destination",
  destinationSchema
);

export default Destination;