import ollama from "ollama";
import KnowledgeChunk from "../models/KnowledgeChunk.js";

const EMBEDDING_MODEL = "nomic-embed-text";
const VECTOR_INDEX = "knowledge_vector_index";

export async function searchKnowledge(question, limit = 6) {
  try {
    console.log(`🔎 Vector search: ${question}`);

    // 1. Convert the user's question into a 768-dimensional embedding
    const embeddingResponse = await ollama.embed({
      model: EMBEDDING_MODEL,
      input: question,
    });

    const queryVector = embeddingResponse.embeddings[0];

    if (!queryVector || queryVector.length !== 768) {
      throw new Error(
        `Invalid query embedding. Expected 768 dimensions, received ${
          queryVector?.length || 0
        }.`
      );
    }

    // 2. Search MongoDB Atlas Vector Search
    const results = await KnowledgeChunk.aggregate([
      {
        $vectorSearch: {
          index: VECTOR_INDEX,
          path: "embedding",
          queryVector,
          numCandidates: 100,
          limit,
        },
      },
      {
        $project: {
          _id: 1,
          text: 1,
          type: 1,
          name: 1,
          destination: 1,
          source: 1,
          metadata: 1,
          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ]);

    console.log(
      `✅ Vector search returned ${results.length} results`
    );

    results.forEach((result, index) => {
      console.log(
        `${index + 1}. ${result.name} | ${result.metadata?.section || "unknown"} | score: ${result.score}`
      );
    });

    return results;
  } catch (error) {
    console.error("❌ Vector Search Error:", error);

    throw error;
  }
}