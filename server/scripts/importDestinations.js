import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import Destination from "../models/Destination.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const importData = async () => {
  try {
    // Connect MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    // Read JSON file
    const filePath = path.join(__dirname, "../data/destinations.json");

    const jsonData = fs.readFileSync(filePath, "utf-8");

    const destinations = JSON.parse(jsonData);

    // Remove old data
    await Destination.deleteMany();

    // Insert new data
    await Destination.insertMany(destinations);

    console.log(
      `🎉 Successfully Imported ${destinations.length} Destinations`
    );

    process.exit();

  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

importData();