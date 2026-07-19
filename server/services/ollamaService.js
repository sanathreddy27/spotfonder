export async function generateTravelRecommendations(prompt) {
  try {
    console.log("🚀 Calling Ollama HTTP API...");

    const response = await fetch("http://127.0.0.1:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.1:8b",
        stream: false,
        messages: [
          {
            role: "system",
            content:
              "You are SpotFonder AI. Return ONLY valid JSON. Do not return markdown.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    console.log("✅ Ollama Response:");
    console.log(data);

    return data.message.content;
  } catch (error) {
    console.error("❌ Ollama HTTP Error:", error);
    throw error;
  }
}