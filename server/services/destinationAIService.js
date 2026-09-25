import ollama from "ollama";

export async function generateDestinationOverview({
  destination,
  weather,
}) {
  try {
    const prompt = `
You are SpotFonder AI, an expert travel guide.

Create a travel overview for this destination.

Destination: ${destination}

Current weather:
Temperature: ${weather?.temperature ?? "unknown"}°C
Weather: ${weather?.weather ?? "unknown"}
Description: ${weather?.description ?? "unknown"}

Return ONLY valid JSON.
Do not use markdown.
Do not use code fences.

Return exactly this structure:

{
  "importance": "A paragraph explaining why this destination is important.",
  "famousFor": "A paragraph explaining what this destination is famous for.",
  "description": "A useful travel description for someone visiting this destination.",
  "bestTime": "A short answer about the best time to visit."
}

Make the content specific to the destination.
Do not invent specific historical facts if you are uncertain.
`;

    console.log("🤖 Generating AI overview for:", destination);

    const response = await ollama.chat({
      model: "qwen3:8b",
      messages: [
        {
          role: "system",
          content:
            "You are SpotFonder AI. Return ONLY valid JSON. No markdown. No explanations outside JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    let content = response.message.content.trim();

    // Remove accidental markdown fences if Ollama adds them
    content = content
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const result = JSON.parse(content);

    return result;
  } catch (error) {
    console.error("❌ Destination AI Error:", error);

    return {
      importance:
        "This destination is a popular place to explore and offers a distinctive travel experience.",
      famousFor:
        "It is known for its scenic surroundings, local culture and attractions.",
      description:
        "Explore the destination, discover nearby attractions and experience the local atmosphere.",
      bestTime: "Check the current weather before planning your visit.",
    };
  }
}