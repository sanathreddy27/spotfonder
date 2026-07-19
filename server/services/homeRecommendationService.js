import { GoogleGenAI } from "@google/genai";

export const getHomeRecommendations = async () => {
  // Check which API key is being used
  console.log(
    "Using Gemini Key:",
    process.env.GEMINI_API_KEY
      ? process.env.GEMINI_API_KEY.substring(0, 10) + "..."
      : "NOT FOUND"
  );

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const currentMonth = new Date().toLocaleString("en-US", {
    month: "long",
  });

  const prompt = `
You are SpotFonder AI.

Today's month is ${currentMonth}.

Recommend the BEST 10 tourist destinations in India for RIGHT NOW.

Consider:
- Current season
- Weather
- Scenic beauty
- Budget friendliness
- Family trips
- Couples
- Solo travellers
- Adventure
- Hidden gems
- Popularity

Return ONLY valid JSON.

Example:

[
  {
    "name": "Goa",
    "state": "Goa",
    "reason": "Sunny weather and beautiful beaches.",
    "budget": "₹15,000",
    "bestFor": "Beach, Couples",
    "days": "3-5",
    "aiScore": 98
  }
]

Do NOT return markdown.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};