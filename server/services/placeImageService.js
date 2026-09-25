const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

export async function getPlaceImages(
  placeName,
  destinationName,
  type,
  page = 1
) {
  try {
    const placeType =
      type === "restaurant"
        ? "restaurant"
        : "hotel";

    const query =
      `${placeType} ${destinationName} India`;

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query
      )}&per_page=15&page=${page}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    const data = await response.json();

    if (!data.photos || data.photos.length === 0) {
      return [];
    }

    return data.photos
      .map((photo) => ({
        url:
          photo.src.large2x ||
          photo.src.large ||
          photo.src.original,
        photographer:
          photo.photographer || null,
      }))
      .filter((photo) => photo.url);
  } catch (error) {
    console.error(
      `❌ ${type} Images Error:`,
      error
    );

    return [];
  }
}