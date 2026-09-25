import ollama from "ollama";
import { getAttractionKnowledge } from "./ragService.js";

export async function generateAttractionAI({
  attractionName,
  destinationName,
}) {
  try {
    const knowledge = await getAttractionKnowledge(
      attractionName,
      destinationName
    );

    if (!knowledge) {
      throw new Error(
        `No attraction knowledge found for ${attractionName}`
      );
    }

    const context = `
Attraction:
${knowledge.name}

Destination:
${knowledge.destination}

State:
${knowledge.state || "Not available"}

Category:
${knowledge.category || "Not available"}

Type:
${knowledge.typeName || "Not available"}

Why it is important:
${knowledge.importance || "Not available"}

What it is famous for:
${knowledge.famousFor || "Not available"}

Description:
${knowledge.description || "Not available"}

History and background:
${knowledge.history || "Not available"}

Retrieved knowledge:
${knowledge.knowledgeText || "Not available"}

Travel tips:
${
  knowledge.tips?.length
    ? knowledge.tips.join("\n")
    : "Not available"
}

Coordinates:
Latitude: ${knowledge.latitude ?? "unknown"}
Longitude: ${knowledge.longitude ?? "unknown"}
`;

    const response = await ollama.chat({
      model: "llama3.1:8b",

      options: {
        num_predict: 450,
      },

      messages: [
        {
          role: "system",
          content: `
You are SpotFonder, an AI travel guide.

Use ONLY the supplied attraction context.

The supplied context is the complete source of truth.

Do NOT add facts from your general knowledge.

Do NOT infer facts from the attraction name.

Do NOT make recommendations such as:
- must-visit
- ideal for
- perfect for
- great for
- popular with
- worth visiting

unless the supplied context explicitly supports that statement.

Do NOT invent:
- historical dates
- historical events
- entry fees
- opening hours
- wildlife
- flora or fauna
- distances
- facilities
- tourist activities
- travel experiences
- popularity claims
- importance claims
- famous-for claims

If information is missing from the supplied context, say:
"Information is not available in the supplied knowledge."

Preserve the meaning of the supplied information.

Do not mention Wikipedia, MongoDB, RAG, databases, APIs, or the fact that you were given context.

Return only information supported by the supplied context.
          `.trim(),
        },

        {
          role: "user",
          content: `
Create a concise travel guide for this attraction.

${context}

Use exactly these five sections:

1. ⭐ Why it is important
2. 📜 History
3. ✨ What it is famous for
4. 📝 Description
5. 💡 Travel tips

Use short paragraphs or bullet points.

For the History section, use the supplied "History and background" information.
For the famous-for section, use the supplied information rather than making up attractions or activities.

Keep the answer useful for a traveller.
          `.trim(),
        },
      ],
    });

    return {
      answer: response.message.content.trim(),
    };
  } catch (error) {
    console.error("❌ Attraction RAG AI Error:", error);

    return {
      answer:
        "AI information for this attraction is temporarily unavailable.",
    };
  }
}