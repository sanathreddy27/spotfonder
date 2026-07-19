const API_URL = "http://localhost:5000/api";

export async function getAIItinerary(tripData) {
  try {
    const response = await fetch(`${API_URL}/itinerary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tripData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}