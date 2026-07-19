import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },

    state: String,

    address: String,

    pricePerNight: Number,

    rating: Number,

    amenities: [String],

    image: String,

    location: {
      latitude: Number,
      longitude: Number,
    },

    bookingLink: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Hotel", hotelSchema);