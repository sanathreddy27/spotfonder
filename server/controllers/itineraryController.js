import { generateItinerary } from "../services/itineraryService.js";

export const getItinerary = async (req, res) => {
  try {
    const tripData = req.body;

    const aiResponse = await generateItinerary(tripData);

    const cleanedResponse = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let itinerary;

    try {
      itinerary = JSON.parse(cleanedResponse);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Gemini returned invalid JSON.",
        rawResponse: aiResponse,
      });
    }

    res.json({
      success: true,
      itinerary,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};