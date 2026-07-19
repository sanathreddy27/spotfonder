import axios from "axios";

const API = "http://localhost:5000/api";

// Save Favorite
export async function saveFavorite(destination) {
  const response = await axios.post(
    `${API}/favorites`,
    destination
  );

  return response.data;
}

// Get Favorites
export async function getFavorites() {
  const response = await axios.get(
    `${API}/favorites`
  );

  return response.data.favorites;
}

// Delete Favorite
export async function deleteFavorite(id) {
  const response = await axios.delete(
    `${API}/favorites/${id}`
  );

  return response.data;
}

// Check if Favorite Exists
export async function checkFavorite(name) {
  const favorites = await getFavorites();

  return favorites.find(
    (item) => item.name.toLowerCase() === name.toLowerCase()
  );
}