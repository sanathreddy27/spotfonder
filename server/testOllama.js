import { generateTravelRecommendations } from "./services/ollamaService.js";

const prompt = "Recommend the top 5 tourist destinations in India for July.";

const result = await generateTravelRecommendations(prompt);

console.log(result);