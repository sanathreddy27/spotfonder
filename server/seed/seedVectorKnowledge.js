import "dotenv/config";
import mongoose from "mongoose";
import ollama from "ollama";

import Destination from "../models/Destination.js";
import KnowledgeChunk from "../models/KnowledgeChunk.js";

const EMBEDDING_MODEL = "nomic-embed-text";

async function createEmbedding(text) {
  const response = await ollama.embed({
    model: EMBEDDING_MODEL,
    input: text,
  });

  return response.embeddings[0];
}

function createDestinationChunks(destination) {
  const chunks = [];

  if (destination.description) {
    chunks.push({
      section: "description",
      text: `
Destination: ${destination.name}

Description:
${destination.description}
      `.trim(),
    });
  }

  if (destination.importance) {
    chunks.push({
      section: "importance",
      text: `
Destination: ${destination.name}

Why it is important:
${destination.importance}
      `.trim(),
    });
  }

  if (destination.famousFor) {
    chunks.push({
      section: "famousFor",
      text: `
Destination: ${destination.name}

Famous for:
${destination.famousFor}
      `.trim(),
    });
  }

  if (destination.history) {
    chunks.push({
      section: "history",
      text: `
Destination: ${destination.name}

History:
${destination.history}
      `.trim(),
    });
  }

  if (destination.bestTime) {
    chunks.push({
      section: "bestTime",
      text: `
Destination: ${destination.name}

Best time to visit:
${destination.bestTime}
      `.trim(),
    });
  }

  if (destination.knowledgeText) {
    chunks.push({
      section: "knowledge",
      text: `
Destination: ${destination.name}

SpotFonder knowledge:
${destination.knowledgeText}
      `.trim(),
    });
  }

  if (destination.tags?.length) {
    chunks.push({
      section: "tags",
      text: `
Destination: ${destination.name}

Tags:
${destination.tags.join(", ")}
      `.trim(),
    });
  }

  return chunks;
}

async function seedVectorKnowledge() {
  try {
    console.log("🔌 Connecting to MongoDB Atlas...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    console.log("🗑️ Removing old vector knowledge...");

    await KnowledgeChunk.deleteMany({});

    const destinations = await Destination.find({}).lean();

    console.log(
      `📚 Found ${destinations.length} destinations`
    );

    let insertedCount = 0;

    for (const destination of destinations) {
      const chunks = createDestinationChunks(destination);

      console.log(
        `\n🌴 ${destination.name}: ${chunks.length} chunks`
      );

      for (const chunk of chunks) {
        console.log(
          `   🧠 Embedding ${chunk.section}...`
        );

        const embedding = await createEmbedding(chunk.text);

        if (!embedding || embedding.length !== 768) {
          throw new Error(
            `Invalid embedding dimensions for ${destination.name}/${chunk.section}`
          );
        }

        await KnowledgeChunk.create({
          text: chunk.text,
          type: "destination",
          name: destination.name,
          destination: destination.name,
          source: "spotfonder-destination",
          metadata: {
            section: chunk.section,
            state: destination.state || "",
            category: destination.category || "",
          },
          embedding,
        });

        insertedCount++;

        console.log("   ✅ Stored");
      }
    }

    console.log("\n🎉 Vector knowledge seeding complete!");
    console.log(
      `📦 ${insertedCount} knowledge chunks inserted`
    );

    await mongoose.disconnect();

    console.log("🔌 MongoDB disconnected");
  } catch (error) {
    console.error(
      "❌ Vector knowledge seed failed:",
      error
    );

    try {
      await mongoose.disconnect();
    } catch {}

    process.exit(1);
  }
}

seedVectorKnowledge();