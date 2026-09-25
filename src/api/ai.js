import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api";

export async function getAIRecommendations() {
  try {
    console.log(
      "Calling:",
      `${API_URL}/recommendations`
    );

    const response = await axios.get(
      `${API_URL}/recommendations`
    );

    console.log(
      "Backend response:",
      response.data
    );

    return response.data.recommendations || [];

  } catch (error) {
    console.error(
      "AI Recommendation Error:",
      error
    );

    throw error;
  }
}