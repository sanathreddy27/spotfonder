const API_KEY = process.env.GEOAPIFY_API_KEY;

export async function getRoute(
  startLat,
  startLon,
  endLat,
  endLon
) {
  try {
    const url =
      `https://api.geoapify.com/v1/routing?` +
      `waypoints=${startLat},${startLon}|${endLat},${endLon}` +
      `&mode=drive` +
      `&details=instruction_details` +
      `&apiKey=${API_KEY}`;

    const response = await fetch(url);

    const data = await response.json();

    if (
      !data.features ||
      data.features.length === 0
    ) {
      return null;
    }

    const feature = data.features[0];

    return {
      distance: feature.properties.distance, // meters
      time: feature.properties.time, // seconds
      geometry: feature.geometry, // polyline
    };

  } catch (error) {
    console.error("Routing Error:", error);
    return null;
  }
}