import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },

    cuisine: [String],

    rating: Number,

    address: String,

    image: String,

    speciality: [String],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Restaurant", restaurantSchema);