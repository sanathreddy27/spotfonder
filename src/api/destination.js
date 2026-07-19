import axios from "axios";

const API_URL = "http://localhost:5000/api";

export async function getDestination(name) {
  const response = await axios.get(
    `${API_URL}/destination/${encodeURIComponent(name)}`
  );

  return response.data.destination;
}