import mongoose from "mongoose";

const attractionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    destination: {
      type: String,
      required: true,
      index: true,
    },

    type: {
      type: String,
      default: "Tourist Attraction",
    },

    description: {
      type: String,
      default: "",
    },

    history: {
      type: String,
      default: "",
    },

    entryFee: {
      type: Number,
      default: null,
    },

    timings: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: null,
    },

    rating: {
      type: Number,
      default: null,
    },

    state: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "Attraction",
    },

    importance: {
      type: String,
      default: "",
    },

    famousFor: {
      type: String,
      default: "",
    },

    tips: {
      type: [String],
      default: [],
    },

    tags: {
      type: [String],
      default: [],
    },

    knowledgeText: {
      type: String,
      default: "",
    },

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },

    images: {
      type: [String],
      default: [],
    },

    cachedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Attraction = mongoose.model(
  "Attraction",
  attractionSchema
);

export default Attraction;