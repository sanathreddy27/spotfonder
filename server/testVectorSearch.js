import "dotenv/config";
import mongoose from "mongoose";

import { searchKnowledge } from "./services/vectorSearchService.js";

async function testVectorSearch() {
  try {
    console.log("🔌 Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");

    const question = "Why is Munnar famous?";

    console.log(`\n❓ Question: ${question}\n`);

    const results = await searchKnowledge(question, 6);

    console.log("\n📚 Retrieved knowledge:\n");

    results.forEach((result, index) => {
      console.log(`\n--- RESULT ${index + 1} ---`);
      console.log("Name:", result.name);
      console.log("Type:", result.type);
      console.log("Section:", result.metadata?.section);
      console.log("Score:", result.score);
      console.log("Text:", result.text);
    });

    await mongoose.disconnect();

    console.log("\n🔌 MongoDB disconnected");
    console.log("🎉 Vector search test complete!");
  } catch (error) {
    console.error("\n❌ Test failed:");
    console.error(error);

    try {
      await mongoose.disconnect();
    } catch {}

    process.exit(1);
  }
}

testVectorSearch();