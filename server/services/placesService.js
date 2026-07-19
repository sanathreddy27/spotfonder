const API_KEY = process.env.GEOAPIFY_API_KEY;

async function getPlaces(category, lat, lon) {
  try {
    const url = `https://api.geoapify.com/v2/places?categories=${category}&filter=circle:${lon},${lat},5000&limit=10&apiKey=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.features) return [];

    return data.features.map((place) => ({
      name: place.properties.name || "Unknown",
      category: place.properties.categories?.[0] || category,
    }));

  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getAttractions(lat, lon) {
  return await getPlaces("tourism.sights", lat, lon);
}

export async function getHotels(lat, lon) {
  return await getPlaces("accommodation.hotel", lat, lon);
}

export async function getRestaurants(lat, lon) {
  return await getPlaces("catering.restaurant", lat, lon);
}