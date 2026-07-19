const API_KEY = process.env.PEXELS_API_KEY;

export async function getPlaceImage(placeName) {
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        placeName
      )}&per_page=1`,
      {
        headers: {
          Authorization: API_KEY,
        },
      }
    );

    const data = await response.json();

    if (
      !data.photos ||
      data.photos.length === 0
    ) {
      return null;
    }

    return data.photos[0].src.large;

  } catch (error) {
    console.error(error);
    return null;
  }
}