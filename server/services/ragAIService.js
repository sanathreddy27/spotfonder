import ollama from "ollama";

import {
  getDestinationKnowledge,
  getAttractionKnowledge,
} from "./ragService.js";

// --------------------------------------------
// GENERATE DESTINATION AI
// --------------------------------------------

export async function generateDestinationAI({
  destinationName,
  weather,
}) {
  try {
    const knowledge =
      await getDestinationKnowledge(destinationName);

    if (!knowledge) {
      throw new Error(
        `No knowledge found for ${destinationName}`
      );
    }

    const context = `
Destination: ${knowledge.name}
State: ${knowledge.state}
Category: ${knowledge.category}

Importance:
${knowledge.importance}

Famous for:
${knowledge.famousFor}

Description:
${knowledge.description}

History:
${knowledge.history}

Best time:
${knowledge.bestTime}

Knowledge:
${knowledge.knowledgeText}

Current weather:
${weather?.temperature ?? "unknown"}°C,
${weather?.weather ?? "unknown"}
`;

    console.log(
      "🧠 RAG context prepared for:",
      destinationName
    );

    console.log("🤖 Sending RAG context to Ollama...");

    const response = await ollama.chat({
      model: "llama3.1:8b",

      options: {
        num_predict: 250,
      },

      messages: [
        {
          role: "system",
          content:
            "You are a travel assistant. Answer using the supplied context.",
        },

        {
          role: "user",
          content: `
Using this travel context, explain the destination to a traveller.

${context}

Give your answer in four sections:

1. Why it is important
2. What it is famous for
3. Description
4. Best time to visit

Keep the answer concise and useful.
`,
        },
      ],
    });

    console.log("✅ Ollama response received");

    return {
      answer: response.message.content.trim(),
    };
  } catch (error) {
    console.error(
      "❌ RAG AI Error:",
      error
    );

    return {
      answer:
        "AI information is temporarily unavailable.",
    };
  }
}

// --------------------------------------------
// GENERATE ATTRACTION AI
// --------------------------------------------

export async function generateAttractionAI({
  attractionName,
  destinationName,
}) {
  try {
    const knowledge =
      await getAttractionKnowledge(
        attractionName,
        destinationName
      );

    if (!knowledge) {
      throw new Error(
        `No knowledge found for ${attractionName}`
      );
    }

    const context = `
Attraction: ${knowledge.name}
Destination: ${knowledge.destination}
State: ${knowledge.state}
Category: ${knowledge.category}

Importance:
${knowledge.importance}

Famous for:
${knowledge.famousFor}

Description:
${knowledge.description}

Tips:
${knowledge.tips?.join("\n")}

Knowledge:
${knowledge.knowledgeText}
`;

    console.log(
      "🧠 RAG attraction context prepared:",
      attractionName
    );

    console.log("🤖 Sending attraction context to Ollama...");

    const response = await ollama.chat({
      model: "llama3.1:8b",

      options: {
        num_predict: 250,
      },

      messages: [
        {
          role: "system",
          content:
            "You are a travel assistant. Answer using the supplied attraction context.",
        },

        {
          role: "user",
          content: `
Explain this attraction to a traveller using the supplied context.

${context}

Give your answer in four sections:

1. Why it is important
2. Description
3. What it is famous for
4. Travel tips

Keep the answer concise and useful.
`,
        },
      ],
    });

    console.log("✅ Attraction Ollama response received");

    return {
      answer: response.message.content.trim(),
    };
  } catch (error) {
    console.error(
      "❌ Attraction RAG AI Error:",
      error
    );

    return {
      answer:
        "AI information is temporarily unavailable.",
    };
  }
}