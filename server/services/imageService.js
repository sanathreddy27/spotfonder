const API_KEY = process.env.PEXELS_API_KEY;


// =====================================================
// DESTINATION IMAGE
// =====================================================

export async function getDestinationImage(
  destination
) {
  try {

    const query =
      `${destination} India landscape`;

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query
      )}&per_page=1`,
      {
        headers: {
          Authorization: API_KEY,
        },
      }
    );


    const data =
      await response.json();


    if (
      !data.photos ||
      data.photos.length === 0
    ) {
      return null;
    }


    return data.photos[0].src.large;

  } catch (error) {

    console.error(
      "❌ Pexels Destination Error:",
      error
    );

    return null;
  }
}


// =====================================================
// ATTRACTION IMAGES
// =====================================================

export async function getAttractionImages(
  attraction,
  destination
) {
  try {

    console.log(
      `📸 Searching photos for: ${attraction}, ${destination}`
    );


    const queries = [
      `${attraction} ${destination} India`,
      `${attraction} Munnar`,
      `${attraction} India`,
    ];


    const allPhotos = [];


    for (const query of queries) {

      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(
          query
        )}&per_page=5`,
        {
          headers: {
            Authorization: API_KEY,
          },
        }
      );


      const data =
        await response.json();


      if (
        data.photos &&
        data.photos.length > 0
      ) {

        for (const photo of data.photos) {

          if (photo.src?.large) {

            allPhotos.push(
              photo.src.large
            );
          }
        }
      }


      // Stop once we have enough
      if (allPhotos.length >= 5) {
        break;
      }
    }


    // Remove duplicate URLs
    const uniquePhotos =
      [...new Set(allPhotos)];


    console.log(
      `📸 Photos found: ${uniquePhotos.length}`
    );


    return uniquePhotos.slice(0, 5);


  } catch (error) {

    console.error(
      "❌ Pexels Attraction Error:",
      error
    );

    return [];
  }
}