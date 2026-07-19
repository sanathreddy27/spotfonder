import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

export const generateItinerary = async (tripData) => {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
You are SpotFonder AI.

Generate a personalized travel itinerary.

Trip Details:

${JSON.stringify(tripData, null, 2)}

Return ONLY valid JSON.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error(error);
    throw error;
  }
};