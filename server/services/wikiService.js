const WIKIPEDIA_API = "https://en.wikipedia.org/w/api.php";

// ----------------------------------------------------
// Find the most relevant Wikipedia page
// ----------------------------------------------------

async function findWikipediaPage(
  attractionName,
  destinationName
) {
  try {
    const queries = [
      `"${attractionName}" "${destinationName}"`,
      `"${attractionName}"`,
      `${attractionName} ${destinationName}`,
    ];

    const candidates = [];

    for (const query of queries) {
      const params = new URLSearchParams({
        action: "query",
        list: "search",
        srsearch: query,
        srlimit: "10",
        format: "json",
        origin: "*",
      });

      const response = await fetch(
        `${WIKIPEDIA_API}?${params.toString()}`
      );

      const data = await response.json();

      const results =
        data?.query?.search || [];

      candidates.push(...results);
    }

    if (!candidates.length) {
      return null;
    }

    // ------------------------------------------------
    // Remove duplicate search results
    // ------------------------------------------------

    const uniqueCandidates = [
      ...new Map(
        candidates.map((item) => [
          item.pageid,
          item,
        ])
      ).values(),
    ];

    const attractionWords =
      attractionName
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(
          (word) =>
            word.length > 2 &&
            ![
              "road",
              "roadway",
              "view",
              "point",
              "park",
              "national",
            ].includes(word)
        );

    const destination =
      destinationName.toLowerCase();

    // ------------------------------------------------
    // Score each Wikipedia result
    // ------------------------------------------------

    const scored =
      uniqueCandidates.map((candidate) => {
        const title =
          (candidate.title || "").toLowerCase();

        const snippet =
          (candidate.snippet || "").toLowerCase();

        let score = 0;

        // Exact title match
        if (
          title ===
          attractionName.toLowerCase()
        ) {
          score += 100;
        }

        // Attraction name appears in title
        if (
          title.includes(
            attractionName.toLowerCase()
          )
        ) {
          score += 70;
        }

        // Individual attraction words
        for (const word of attractionWords) {
          if (title.includes(word)) {
            score += 15;
          }
        }

        // Destination appears in title
        if (title.includes(destination)) {
          score += 20;
        }

        // Destination appears in search snippet
        if (snippet.includes(destination)) {
          score += 10;
        }

        return {
          candidate,
          score,
        };
      });

    scored.sort(
      (a, b) => b.score - a.score
    );

    const best = scored[0];

    // ------------------------------------------------
    // Reject weak/unrelated matches
    // ------------------------------------------------

    if (!best || best.score < 50) {
      console.log(
        `⚠️ No reliable Wikipedia page found for ${attractionName}`
      );

      return null;
    }

    console.log(
      `📚 Wikipedia match: ${best.candidate.title} (score ${best.score})`
    );

    return best.candidate.title;
  } catch (error) {
    console.error(
      "❌ Wikipedia Search Error:",
      error
    );

    return null;
  }
}

// ----------------------------------------------------
// Get Wikipedia page
// ----------------------------------------------------

async function getWikipediaPage(title) {
  try {
    const params = new URLSearchParams({
      action: "query",
      prop: "extracts|pageimages|info",
      titles: title,
      explaintext: "1",
      exintro: "1",
      exchars: "3000",
      piprop: "original",
      inprop: "url",
      redirects: "1",
      format: "json",
      origin: "*",
    });

    const response = await fetch(
      `${WIKIPEDIA_API}?${params.toString()}`
    );

    const data = await response.json();

    const pages =
      data?.query?.pages || {};

    const page =
      Object.values(pages)[0];

    if (
      !page ||
      page.missing !== undefined
    ) {
      return null;
    }

    return page;
  } catch (error) {
    console.error(
      "❌ Wikipedia Page Error:",
      error
    );

    return null;
  }
}

// ----------------------------------------------------
// Get Wikipedia sections
// ----------------------------------------------------

async function getWikipediaSections(title) {
  try {
    const params = new URLSearchParams({
      action: "parse",
      page: title,
      prop: "sections",
      redirects: "1",
      format: "json",
      origin: "*",
    });

    const response = await fetch(
      `${WIKIPEDIA_API}?${params.toString()}`
    );

    const data = await response.json();

    return (
      data?.parse?.sections || []
    );
  } catch (error) {
    console.error(
      "❌ Wikipedia Sections Error:",
      error
    );

    return [];
  }
}

// ----------------------------------------------------
// Get section text
// ----------------------------------------------------

async function getWikipediaSectionText(
  title,
  sectionIndex
) {
  try {
    const params = new URLSearchParams({
      action: "parse",
      page: title,
      section: String(sectionIndex),
      prop: "wikitext",
      redirects: "1",
      format: "json",
      origin: "*",
    });

    const response = await fetch(
      `${WIKIPEDIA_API}?${params.toString()}`
    );

    const data = await response.json();

    return (
      data?.parse?.wikitext?.["*"] ||
      ""
    );
  } catch (error) {
    console.error(
      "❌ Wikipedia Section Error:",
      error
    );

    return "";
  }
}

// ----------------------------------------------------
// Clean Wikipedia text
// ----------------------------------------------------

function cleanWikiText(text) {
  if (!text) {
    return "";
  }

  return text
    // References
    .replace(
      /<ref[^>]*>.*?<\/ref>/gis,
      ""
    )
    .replace(
      /<ref[^>]*\/>/gis,
      ""
    )

    // Templates
    .replace(
      /\{\{[^{}]*\}\}/g,
      ""
    )

    // Wiki links with display text
    .replace(
      /\[\[([^|\]]+)\|([^\]]+)\]\]/g,
      "$2"
    )

    // Normal wiki links
    .replace(
      /\[\[([^\]]+)\]\]/g,
      "$1"
    )

    // Bold / italic
    .replace(/'''/g, "")
    .replace(/''/g, "")

    // Remove heading markers
    .replace(
      /^={2,6}\s*(.*?)\s*={2,6}$/gm,
      "$1"
    )

    // Remove HTML
    .replace(
      /<[^>]+>/g,
      ""
    )

    // Remove carriage returns
    .replace(/\r/g, "")

    // Clean excessive blank lines
    .replace(
      /\n{3,}/g,
      "\n\n"
    )

    // Remove leading/trailing whitespace
    .trim();
}

// ----------------------------------------------------
// Find a section by keywords
// ----------------------------------------------------

function findSection(
  sections,
  keywords
) {
  return sections.find((section) => {
    const title =
      (section.line || "")
        .toLowerCase();

    return keywords.some(
      (keyword) =>
        title.includes(keyword)
    );
  });
}

// ----------------------------------------------------
// Get structured knowledge
// ----------------------------------------------------

async function getStructuredKnowledge(
  title,
  fallbackExtract
) {
  const sections =
    await getWikipediaSections(title);

  let history = "";
  let description = "";
  let famousFor = "";

  // ------------------------------------------------
  // History
  // ------------------------------------------------

  const historySection =
    findSection(
      sections,
      [
        "history",
        "establishment",
        "background",
      ]
    );

  // ------------------------------------------------
  // Tourism / attractions
  // ------------------------------------------------

  const tourismSection =
    findSection(
      sections,
      [
        "tourism",
        "visiting",
        "attractions",
      ]
    );

  // ------------------------------------------------
  // Features / geography
  // ------------------------------------------------

  const featuresSection =
    findSection(
      sections,
      [
        "features",
        "wildlife",
        "flora",
        "fauna",
        "geography",
      ]
    );

  // ------------------------------------------------
  // Retrieve history
  // ------------------------------------------------

  if (historySection) {
    history =
      cleanWikiText(
        await getWikipediaSectionText(
          title,
          historySection.index
        )
      );
  }

  // ------------------------------------------------
  // Retrieve tourism
  // ------------------------------------------------

  if (tourismSection) {
    famousFor =
      cleanWikiText(
        await getWikipediaSectionText(
          title,
          tourismSection.index
        )
      );
  }

  // ------------------------------------------------
  // Retrieve features
  // ------------------------------------------------

  if (featuresSection) {
    description =
      cleanWikiText(
        await getWikipediaSectionText(
          title,
          featuresSection.index
        )
      );
  }

  // ------------------------------------------------
  // Use introduction as fallback description
  // ------------------------------------------------

  if (!description) {
    description =
      cleanWikiText(
        fallbackExtract || ""
      );
  }

  // ------------------------------------------------
  // Build RAG knowledge text
  // ------------------------------------------------

  const knowledgeText = [
    `Wikipedia page: ${title}`,
    "",
    "Introduction:",
    cleanWikiText(
      fallbackExtract ||
        "Not available"
    ),
    "",
    "History:",
    history ||
      "Not available",
    "",
    "Tourism / Famous for:",
    famousFor ||
      "Not available",
    "",
    "Features / Geography / Wildlife:",
    description ||
      "Not available",
  ].join("\n");

  return {
    history,
    famousFor,
    description,
    knowledgeText,
  };
}

// ----------------------------------------------------
// Get images from Wikipedia
// ----------------------------------------------------

async function getWikipediaImages(
  title
) {
  try {
    const imageParams =
      new URLSearchParams({
        action: "query",
        prop: "images",
        titles: title,
        imlimit: "30",
        redirects: "1",
        format: "json",
        origin: "*",
      });

    const imageResponse =
      await fetch(
        `${WIKIPEDIA_API}?${imageParams.toString()}`
      );

    const imageData =
      await imageResponse.json();

    const pages =
      imageData?.query?.pages || {};

    const page =
      Object.values(pages)[0];

    const files =
      page?.images || [];

    // ------------------------------------------------
    // Remove obviously irrelevant files
    // ------------------------------------------------

    const usableFiles =
      files.filter((file) => {
        const fileTitle =
          (file.title || "")
            .toLowerCase();

        return (
          /\.(jpg|jpeg|png|webp)$/i.test(
            fileTitle
          ) &&
          !fileTitle.includes("logo") &&
          !fileTitle.includes("icon") &&
          !fileTitle.includes("map") &&
          !fileTitle.includes("flag") &&
          !fileTitle.includes("symbol") &&
          !fileTitle.includes("locator")
        );
      });

    if (!usableFiles.length) {
      return [];
    }

    // ------------------------------------------------
    // Get image information
    // ------------------------------------------------

    const titles =
      usableFiles
        .slice(0, 15)
        .map(
          (file) =>
            file.title
        )
        .join("|");

    const infoParams =
      new URLSearchParams({
        action: "query",
        prop: "imageinfo",
        titles,
        iiprop:
          "url|mime|extmetadata",
        iiurlwidth: "1200",
        format: "json",
        origin: "*",
      });

    const infoResponse =
      await fetch(
        `${WIKIPEDIA_API}?${infoParams.toString()}`
      );

    const infoData =
      await infoResponse.json();

    const infoPages =
      infoData?.query?.pages || {};

    return Object.values(
      infoPages
    )
      .flatMap(
        (page) =>
          page.imageinfo || []
      )
      .filter((info) =>
        (
          info.mime || ""
        ).startsWith("image/")
      )
      .map((info) => ({
        url:
          info.thumburl ||
          info.url ||
          null,

        originalUrl:
          info.url ||
          null,

        descriptionUrl:
          info.descriptionurl ||
          null,

        artist:
          info.extmetadata
            ?.Artist?.value ||
          null,

        license:
          info.extmetadata
            ?.LicenseShortName
            ?.value ||
          null,
      }))
      .filter(
        (image) =>
          image.url
      );
  } catch (error) {
    console.error(
      "❌ Wikipedia Images Error:",
      error
    );

    return [];
  }
}

// ----------------------------------------------------
// Main exported function
// ----------------------------------------------------

export async function getWikipediaKnowledge(
  attractionName,
  destinationName
) {
  try {
    // ------------------------------------------------
    // Find relevant Wikipedia page
    // ------------------------------------------------

    const title =
      await findWikipediaPage(
        attractionName,
        destinationName
      );

    if (!title) {
      console.log(
        `⚠️ No reliable Wikipedia page for ${attractionName}`
      );

      return null;
    }

    // ------------------------------------------------
    // Get page
    // ------------------------------------------------

    const page =
      await getWikipediaPage(
        title
      );

    if (!page) {
      return null;
    }

    const extract =
      page.extract || "";

    // ------------------------------------------------
    // Structured knowledge
    // ------------------------------------------------

    const structured =
      await getStructuredKnowledge(
        title,
        extract
      );

    // ------------------------------------------------
    // Lead image
    // ------------------------------------------------

    const leadImage =
      page.original?.source ||
      page.thumbnail?.source ||
      null;

    // ------------------------------------------------
    // Wikipedia URL
    // ------------------------------------------------

    const wikipediaUrl =
      page.fullurl ||
      `https://en.wikipedia.org/wiki/${encodeURIComponent(
        title.replace(
          / /g,
          "_"
        )
      )}`;

    // ------------------------------------------------
    // Page images
    // ------------------------------------------------

    const pageImages =
      await getWikipediaImages(
        title
      );

    const images = [];

    // Add lead image first
    if (leadImage) {
      images.push({
        url: leadImage,

        originalUrl:
          leadImage,

        descriptionUrl:
          wikipediaUrl,

        artist: null,

        license: null,
      });
    }

    // Add other page images
    for (const image of pageImages) {
      if (
        image.url &&
        !images.some(
          (existing) =>
            existing.url ===
            image.url
        )
      ) {
        images.push(image);
      }
    }

    // ------------------------------------------------
    // Return everything
    // ------------------------------------------------

    return {
      title,

      extract,

      history:
        structured.history,

      famousFor:
        structured.famousFor,

      description:
        structured.description,

      knowledgeText:
        structured.knowledgeText,

      image:
        images[0]?.url ||
        null,

      images:
        images.slice(0, 6),

      wikipediaUrl,
    };
  } catch (error) {
    console.error(
      "❌ Wikipedia Knowledge Error:",
      error
    );

    return null;
  }
}