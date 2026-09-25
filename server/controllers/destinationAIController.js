import { generateDestinationAI } from "../services/ragAIService.js";
import { getWeather } from "../services/weatherService.js";

export const getDestinationAI = async (req, res) => {
  try {
    const destination = decodeURIComponent(req.params.name);

    console.log("=================================");
    console.log("🧠 RAG AI Destination:", destination);
    console.log("=================================");

    // Get current weather
    console.log("🌤 Getting live weather...");

    const weather = await getWeather(destination);

    console.log("🌤 Weather:", weather);

    // Generate AI using MongoDB RAG + live weather
    const aiOverview = await generateDestinationAI({
      destinationName: destination,
      weather,
    });

    res.json({
      success: true,

      destination,

      weather,

      aiOverview,
    });
  } catch (error) {
    console.error(
      "❌ Destination RAG AI Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to generate destination AI information",
    });
  }
};