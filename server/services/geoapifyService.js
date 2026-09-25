const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;

function calculateDistanceKm(
  lat1,
  lon1,
  lat2,
  lon2
) {
  const R = 6371;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLon =
    ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
}

function normalizeText(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsAny(text, words) {
  return words.some((word) =>
    text.includes(word)
  );
}

function isValidHotel(place) {
  const name = normalizeText(place.name);
  const address = normalizeText(place.address);

  const categories = (
    place.category || []
  )
    .join(" ")
    .toLowerCase();

  if (
    !categories.includes(
      "accommodation.hotel"
    )
  ) {
    return false;
  }

  const invalidNameWords = [
    "restaurant",
    "canteen",
    "college",
    "university",
    "school",
    "hospital",
    "clinic",
    "building",
    "road",
    "highway",
    "junction",
    "marg",
    "path",
    "station",
    "office",
    "residential",
    "house",
    "home",
    "apartment",
    "flat",
    "villa",
    "hostel",
  ];

  if (
    containsAny(
      name,
      invalidNameWords
    )
  ) {
    return false;
  }

  if (
    categories.includes(
      "building.residential"
    )
  ) {
    return false;
  }

  return true;
}

function isValidRestaurant(place) {
  const name = normalizeText(place.name);
  const address = normalizeText(place.address);

  const categories = (
    place.category || []
  )
    .join(" ")
    .toLowerCase();

  if (
    !categories.includes(
      "catering.restaurant"
    )
  ) {
    return false;
  }

  const invalidNameWords = [
    "road",
    "highway",
    "marg",
    "junction",
    "circle",
    "building",
    "residential",
    "house",
    "apartment",
    "college",
    "university",
    "school",
    "hospital",
    "clinic",
    "office",
    "parking",
    "station",
  ];

  if (
    containsAny(
      name,
      invalidNameWords
    )
  ) {
    return false;
  }

  if (
    categories.includes(
      "building.residential"
    )
  ) {
    return false;
  }

  return true;
}

function isValidAttraction(place) {
  const name = normalizeText(place.name);

  const categories = (
    place.category || []
  )
    .join(" ")
    .toLowerCase();

  const hasTourismAttraction =
    categories.includes(
      "tourism.attraction"
    );

  const hasTourismSights =
    categories.includes(
      "tourism.sights"
    );

  const hasHistoricBuilding =
    categories.includes(
      "building.historic"
    );

  if (
    !hasTourismAttraction &&
    !hasTourismSights &&
    !hasHistoricBuilding
  ) {
    return false;
  }

  /*
   * For the itinerary we do not use generic
   * artwork/statue/sculpture records.
   */
  if (
    categories.includes(
      "tourism.attraction.artwork"
    )
  ) {
    return false;
  }

  const invalidNameWords = [
    "road",
    "highway",
    "junction",
    "bridge",
    "bus stop",
    "railway",
    "railway station",
    "parking",

    "house",
    "home",
    "residence",
    "residential",
    "apartment",
    "flat",
    "villa",
    "bungalow",
    "mansion",
    "private",

    "office",
    "company",
    "corporate",
    "school",
    "college",
    "university",
    "hospital",
    "clinic",
    "canteen",
    "restaurant",
    "hotel",

    "building",
    "complex",
    "chambers",
    "chembers",
    "garden area",

    "cannon",
    "amphitheatre",
    "amphitheater",
    "sculpture",
    "statue",
    "artwork",

    "turf",
    "sports complex",
    "sports ground",
    "playground",
  ];

  if (
    containsAny(
      name,
      invalidNameWords
    )
  ) {
    return false;
  }

  return true;
}

export async function getCoordinates(
  place
) {
  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
        place
      )}&apiKey=${GEOAPIFY_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(
        `Geoapify geocoding failed: ${response.status}`
      );
    }

    const data =
      await response.json();

    if (
      !data.features ||
      !data.features.length
    ) {
      return null;
    }

    const location =
      data.features[0];

    return {
      latitude:
        location.properties.lat,
      longitude:
        location.properties.lon,
      formatted:
        location.properties.formatted,
    };
  } catch (error) {
    console.log(
      "❌ Geoapify Coordinates Error:",
      error
    );

    return null;
  }
}

export async function getNearbyPlaces(
  latitude,
  longitude,
  category,
  radius = 10000,
  limit = 20
) {
  try {
    const url =
      `https://api.geoapify.com/v2/places` +
      `?categories=${encodeURIComponent(
        category
      )}` +
      `&filter=circle:${longitude},${latitude},${radius}` +
      `&limit=${Math.max(
        limit * 5,
        50
      )}` +
      `&apiKey=${GEOAPIFY_API_KEY}`;

    const response =
      await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Geoapify places failed: ${response.status}`
      );
    }

    const data =
      await response.json();

    if (!data.features) {
      return [];
    }

    let type = null;

    if (
      category.includes("hotel")
    ) {
      type = "hotel";
    } else if (
      category.includes(
        "restaurant"
      )
    ) {
      type = "restaurant";
    } else if (
      category.includes("tourism")
    ) {
      type = "attraction";
    }

    const places =
      data.features
        .map((place) => {
          const properties =
            place.properties;

          const placeLatitude =
            properties.lat;

          const placeLongitude =
            properties.lon;

          if (
            typeof placeLatitude !==
              "number" ||
            typeof placeLongitude !==
              "number"
          ) {
            return null;
          }

          const name =
            properties.name ||
            properties.address_line1 ||
            "";

          if (!name.trim()) {
            return null;
          }

          const distanceKm =
            calculateDistanceKm(
              latitude,
              longitude,
              placeLatitude,
              placeLongitude
            );

          return {
            id:
              properties.place_id ||
              null,

            name: name.trim(),

            address:
              properties.formatted ||
              "Address not available",

            latitude:
              placeLatitude,

            longitude:
              placeLongitude,

            category:
              properties.categories ||
              [],

            distance:
              Math.round(
                distanceKm * 1000
              ),

            website:
              properties.website ||
              null,

            phone:
              properties.contact
                ?.phone || null,

            distanceKm,
          };
        })
        .filter(Boolean)
        .filter((place) => {
          if (type === "hotel") {
            return isValidHotel(place);
          }

          if (type === "restaurant") {
            return isValidRestaurant(place);
          }

          if (type === "attraction") {
            return isValidAttraction(place);
          }

          return true;
        })
        .sort(
          (a, b) =>
            a.distanceKm -
            b.distanceKm
        );

    const uniquePlaces = [];
    const seenNames = new Set();

    for (const place of places) {
      const normalizedName =
        normalizeText(
          place.name
        );

      if (
        seenNames.has(
          normalizedName
        )
      ) {
        continue;
      }

      seenNames.add(
        normalizedName
      );

      uniquePlaces.push(
        place
      );

      if (
        uniquePlaces.length >=
        limit
      ) {
        break;
      }
    }

    console.log(
      `🔎 ${category}: ${data.features.length} raw → ${uniquePlaces.length} valid`
    );

    return uniquePlaces.map(
      (place) => {
        const {
          distanceKm,
          ...cleanPlace
        } = place;

        return cleanPlace;
      }
    );
  } catch (error) {
    console.log(
      `❌ Nearby Places Error (${category}):`,
      error
    );

    return [];
  }
}