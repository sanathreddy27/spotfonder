import {
  getDestinationKnowledge,
  getAttractionKnowledge,
} from "./services/ragService.js";

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

try {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URI);

  console.log("=================================");
  console.log("🧠 RAG TEST");
  console.log("=================================");

  // --------------------------------------------
  // TEST DESTINATION
  // --------------------------------------------

  const destination = await getDestinationKnowledge(
    "Munnar"
  );

  console.log("\n🌴 DESTINATION RESULT:");
  console.log(destination);

  // --------------------------------------------
  // TEST ATTRACTION
  // --------------------------------------------

  const attraction = await getAttractionKnowledge(
    "Blackberry Hills",
    "Munnar"
  );

  console.log("\n📍 ATTRACTION RESULT:");
  console.log(attraction);

  console.log("\n=================================");
  console.log("✅ RAG RETRIEVAL TEST COMPLETE");
  console.log("=================================");
} catch (error) {
  console.error("❌ RAG Test Error:", error);
} finally {
  await mongoose.disconnect();

  console.log("🔌 MongoDB disconnected");
}