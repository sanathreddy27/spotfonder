import mongoose from "mongoose";
import dotenv from "dotenv";

import { generateDestinationAI } from "./services/ragAIService.js";

dotenv.config();

const destinations = [
  "Leh",
  "Goa",
  "Jaipur",
  "Hampi",
  "Munnar",
];

try {
  await mongoose.connect(process.env.MONGO_URI);

  console.log("=================================");
  console.log("🧠 MULTI-DESTINATION RAG TEST");
  console.log("=================================");

  for (const destination of destinations) {
    console.log("\n---------------------------------");
    console.log(`🌴 Testing: ${destination}`);
    console.log("---------------------------------");

    const result = await generateDestinationAI({
      destinationName: destination,

      weather: {
        temperature: 25,
        weather: "Clouds",
      },
    });

    console.log("\n🤖 AI RESULT:");

    console.log(
      result.answer.substring(0, 500)
    );
  }

  console.log("\n=================================");
  console.log("✅ MULTI-DESTINATION TEST COMPLETE");
  console.log("=================================");
} catch (error) {
  console.error("❌ Test Error:", error);
} finally {
  await mongoose.disconnect();

  console.log("🔌 MongoDB disconnected");
}