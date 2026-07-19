import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    state: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    about: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Favorite", favoriteSchema);