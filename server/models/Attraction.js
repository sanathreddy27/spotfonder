import mongoose from "mongoose";

const attractionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },

    type: String,

    description: String,

    entryFee: Number,

    timings: String,

    image: String,

    rating: Number,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Attraction", attractionSchema);