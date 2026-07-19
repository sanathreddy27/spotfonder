import { buildTravelContext } from "./travelContextService.js";
import { generateTravelRecommendations } from "./ollamaService.js";

export async function getAIRecommendations() {
  const travelContext = await buildTravelContext();

  // Keep only destinations with weather
  const filtered = travelContext
    .filter(place => place.weather && place.coordinates)
    .slice(0, 5);   // <-- Only 5 destinations for now

  const simplified = filtered.map(place => ({
    name: place.name,
    state: place.state,
    category: place.category,
    temperature: place.weather.temperature,
    weather: place.weather.weather,
  }));

  console.log("Sending to Ollama:");
  console.log(simplified);

  const prompt = `
You are SpotFonder AI.

Today's live travel data:

${JSON.stringify(simplified)}

Choose the BEST destinations.

Return ONLY valid JSON.

Example:

[
  {
    "name":"Leh",
    "state":"Ladakh",
    "reason":"Pleasant weather today.",
    "aiScore":98
  }
]
`;

  return await generateTravelRecommendations(prompt);
}