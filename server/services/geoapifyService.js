const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;

export async function getCoordinates(place) {
  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
        place
      )}&apiKey=${GEOAPIFY_API_KEY}`
    );

    const data = await response.json();

    if (!data.features.length) return null;

    const location = data.features[0];

    return {
      latitude: location.properties.lat,
      longitude: location.properties.lon,
      formatted: location.properties.formatted,
    };

  } catch (error) {
    console.log(error);

    return null;
  }
}