import mongoose from "mongoose";

const festivalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    state: String,

    destination: String,

    month: String,

    description: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Festival", festivalSchema);