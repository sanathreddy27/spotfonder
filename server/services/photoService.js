function normalizeText(text = "") {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getSearchTokens(query) {
  return normalizeText(query)
    .split(" ")
    .filter((word) => word.length >= 3);
}

function isRelevantPhoto(title, query) {
  const normalizedTitle = normalizeText(title);
  const tokens = getSearchTokens(query);

  if (!normalizedTitle || !tokens.length) {
    return false;
  }

  // At least one important search word must appear
  // in the Wikimedia file title.
  const matchingTokens = tokens.filter((token) =>
    normalizedTitle.includes(token)
  );

  return matchingTokens.length > 0;
}

export async function searchPhotos(query, limit = 6) {
  try {
    const cleanQuery = query.trim();

    if (!cleanQuery) {
      return [];
    }

    console.log(`📸 Searching Wikimedia for: ${cleanQuery}`);

    const searchUrl =
      "https://commons.wikimedia.org/w/api.php?" +
      new URLSearchParams({
        action: "query",
        generator: "search",

        // Search the actual destination/attraction.
        gsrsearch: cleanQuery,

        // File namespace only.
        gsrnamespace: "6",

        // Get a few extra results because we filter
        // unrelated results afterwards.
        gsrlimit: String(Math.max(limit * 3, 15)),

        prop: "imageinfo",

        iiprop: "url|extmetadata",

        iiurlwidth: "600",

        format: "json",

        origin: "*",
      }).toString();

    const response = await fetch(searchUrl);

    if (!response.ok) {
      throw new Error(
        `Wikimedia request failed: ${response.status}`
      );
    }

    const data = await response.json();

    const pages = Object.values(
      data.query?.pages || {}
    );

    const photos = pages
      .map((page) => {
        const imageInfo = page.imageinfo?.[0];

        if (!imageInfo?.thumburl) {
          return null;
        }

        const title = page.title
          .replace(/^File:/, "")
          .replace(/\.[^.]+$/, "");

        // IMPORTANT:
        // Reject images whose Wikimedia title does not
        // contain the requested destination/attraction.
        if (!isRelevantPhoto(title, cleanQuery)) {
          return null;
        }

        const metadata = imageInfo.extmetadata || {};

        return {
          title,
          image: imageInfo.thumburl,
          originalImage: imageInfo.url,
          source: "Wikimedia Commons",
          sourceUrl:
            `https://commons.wikimedia.org/wiki/${encodeURIComponent(
              page.title.replace(/ /g, "_")
            )}`,
          artist:
            metadata.Artist?.value || "",
          license:
            metadata.LicenseShortName?.value || "",
        };
      })
      .filter(Boolean)
      .slice(0, limit);

    console.log(
      `📸 Relevant Wikimedia photos found: ${photos.length}`
    );

    photos.forEach((photo, index) => {
      console.log(
        `${index + 1}. ${photo.title}`
      );
    });

    return photos;
  } catch (error) {
    console.error(
      "❌ Photo Search Error:",
      error
    );

    return [];
  }
}