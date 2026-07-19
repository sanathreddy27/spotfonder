const API_KEY = process.env.PEXELS_API_KEY;

export async function getDestinationImage(destination) {
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        destination + " India landscape"
      )}&per_page=1`,
      {
        headers: {
          Authorization: API_KEY,
        },
      }
    );

    const data = await response.json();

    if (!data.photos || data.photos.length === 0) {
      return null;
    }

    return data.photos[0].src.large;
  } catch (error) {
    console.error("Pexels Error:", error);
    return null;
  }
}