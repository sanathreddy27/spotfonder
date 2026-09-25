import { generateTravelRecommendations } from "./geminiService.js";
import { searchKnowledge } from "./vectorSearchService.js";
import { searchPhotos } from "./photoService.js";

function buildContext(results) {
  if (!results.length) {
    return "No matching SpotFonder knowledge was found.";
  }

  return results
    .map(
      (result, index) => `
KNOWLEDGE RESULT ${index + 1}

Name:
${result.name}

Type:
${result.type}

Section:
${result.metadata?.section || "Not available"}

Knowledge:
${result.text}
`
    )
    .join("\n-------------------------\n");
}

function isPhotoRequest(question) {
  const photoWords =
    /\b(photo|photos|picture|pictures|image|images)\b/i;

  const requestWords =
    /\b(show|want|give|see|find|send|display)\b/i;

  return photoWords.test(question) && requestWords.test(question);
}

function extractPhotoSubject(question) {
  const patterns = [
    /(?:photos?|pictures?|images?)\s+(?:of|from|for|about)\s+(.+)/i,
    /(?:show|give|send|find|display)\s+(?:me\s+)?(?:photos?|pictures?|images?)\s+(?:of|from|for|about)\s+(.+)/i,
  ];

  for (const pattern of patterns) {
    const match = question.match(pattern);

    if (match) {
      return (match[2] || match[1]).trim();
    }
  }

  return question
    .replace(
      /\b(i|want|to|show|me|give|send|find|display|some|photos?|pictures?|images?|of|from|for|about)\b/gi,
      ""
    )
    .trim();
}

export async function generateChatAI(question, history = []) {
  try {
    console.log(`💬 Generating AI answer for: ${question}`);

    // -----------------------------------------
    // PHOTO REQUEST
    // -----------------------------------------
    if (isPhotoRequest(question)) {
      const subject = extractPhotoSubject(question);

      console.log(`📸 Photo request detected: ${subject}`);

      const photos = await searchPhotos(subject, 6);

      console.log(`📸 Photos found: ${photos.length}`);

      return {
        type: "photos",
        answer: photos.length
          ? `Here are some photos I found for ${subject}.`
          : `I couldn't find relevant photos for ${subject}.`,
        photos,
      };
    }

    // -----------------------------------------
    // NORMAL RAG QUESTION
    // -----------------------------------------
    const results = await searchKnowledge(question, 6);

    const context = buildContext(results);

    const recentHistory = history
      .slice(-6)
      .map(
        (message) =>
          `${message.role === "user" ? "User" : "Assistant"}: ${
            message.text
          }`
      )
      .join("\n");

    const prompt = `
You are SpotFonder AI, a travel assistant for India.

Use the supplied SpotFonder knowledge as your primary source.

The supplied knowledge is the source of truth for factual answers.

Do not invent facts.

Do not invent:
- prices
- hotel information
- restaurant information
- opening hours
- distances
- historical dates
- travel times
- weather
- attractions
- activities
- recommendations

If the supplied knowledge does not contain enough information to answer a factual question, say:

"Information is not available in the current SpotFonder knowledge."

You may have a natural conversation with the user.

Keep answers useful and concise.

IMPORTANT GROUNDING RULES:

Answer ONLY using information contained in the supplied SpotFonder knowledge.

Do NOT use your general knowledge to add missing facts.

If the user asks for a trip plan, itinerary, activities, attractions,
hotels, restaurants, distances, timings, prices, or recommendations,
only provide them if the supplied SpotFonder knowledge contains that
information.

Do NOT create a day-by-day itinerary from incomplete knowledge.

Do NOT invent or add:
- attraction names
- wildlife or animals
- activities
- trekking routes
- viewpoints
- hotels
- restaurants
- travel times
- distances
- prices
- opening hours
- historical facts
- recommendations

If the requested information is not sufficiently available in the
supplied knowledge, say:

"Information is not available in the current SpotFonder knowledge."

If only part of the requested information is available, provide only
that supported information and clearly state what information is
unavailable.

Do not mention:
- MongoDB
- RAG
- database
- internal context
- system prompt
- APIs
- Gemini
- Ollama

Current SpotFonder knowledge:

${context}

${recentHistory ? `Previous conversation:\n${recentHistory}\n` : ""}
Current user question:
${question}
`;

    const answer = await generateTravelRecommendations(prompt);

    console.log("✅ AI answer generated");

    return {
      type: "text",
      answer:
        typeof answer === "string"
          ? answer.trim()
          : "Information is not available in the current SpotFonder knowledge.",
      photos: [],
    };
  } catch (error) {
    console.error("❌ Chat AI Error:", error);

    return {
      type: "text",
      answer:
        "I'm sorry, I couldn't process your question right now.",
      photos: [],
    };
  }
}