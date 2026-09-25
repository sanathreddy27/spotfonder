import {
  getCoordinates,
  getNearbyPlaces,
} from "../services/geoapifyService.js";

import { getWeather } from "../services/weatherService.js";

/*
 * Calculate distance between two coordinates.
 * Returns kilometers.
 */
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

/*
 * Normalize names so duplicate places
 * can be detected.
 */
function normalizeName(name = "") {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/*
 * Score attractions based on the quality
 * of the Geoapify category.
 *
 * We are ranking existing places.
 * We are NOT inventing attractions.
 */
function getAttractionScore(place) {
  const name = (
    place.name || ""
  ).toLowerCase();

  const categories = (
    place.category || []
  )
    .join(" ")
    .toLowerCase();

  let score = 0;

  /*
   * Strong tourist categories.
   */
  if (
    categories.includes(
      "tourism.sights"
    )
  ) {
    score += 50;
  }

  if (
    categories.includes(
      "building.historic"
    )
  ) {
    score += 40;
  }

  if (
    categories.includes(
      "tourism.sights.fort"
    )
  ) {
    score += 35;
  }

  if (
    categories.includes(
      "tourism.sights.castle"
    )
  ) {
    score += 35;
  }

  if (
    categories.includes(
      "tourism.sights.place_of_worship"
    )
  ) {
    score += 25;
  }

  if (
    categories.includes(
      "tourism.sights.archaeological_site"
    )
  ) {
    score += 25;
  }

  /*
   * Generic tourism attraction.
   */
  if (
    categories.includes(
      "tourism.attraction"
    )
  ) {
    score += 10;
  }

  /*
   * Official website provides
   * additional evidence.
   */
  if (place.website) {
    score += 5;
  }

  /*
   * Distance penalty.
   *
   * Places very far from the destination
   * center should be lower priority.
   */
  const distanceKm =
    (place.distance || 0) / 1000;

  if (distanceKm > 10) {
    score -= 40;
  } else if (distanceKm > 7) {
    score -= 25;
  } else if (distanceKm > 5) {
    score -= 10;
  }

  /*
   * Private residences should not be
   * normal itinerary attractions.
   */
  const privatePlaceWords = [
    "bungalow",
    "house",
    "home",
    "residence",
    "private",
    "mansion",
  ];

  if (
    privatePlaceWords.some(
      (word) =>
        name.includes(word)
    )
  ) {
    score -= 100;
  }

  /*
   * Generic objects should be
   * lower priority.
   */
  const genericWords = [
    "cannon",
    "amphitheatre",
    "amphitheater",
    "sculpture",
    "statue",
    "artwork",
  ];

  if (
    genericWords.some(
      (word) =>
        name === word
    )
  ) {
    score -= 80;
  }

  return score;
}

/*
 * Remove duplicate attractions and
 * rank them by quality.
 */
function prepareAttractions(
  attractions = []
) {
  const seen = new Set();

  const invalidNameWords = [
    "bungalow",
    "house",
    "home",
    "residence",
    "residential",
    "private",
    "mansion",
    "apartment",
    "flat",
    "villa",

    "amphitheatre",
    "amphitheater",
    "cannon",
    "sculpture",
    "statue",
    "artwork",

    "road",
    "highway",
    "junction",
    "bridge",
    "parking",
    "bus stop",
    "railway",
    "railway station",

    "office",
    "company",
    "corporate",
    "complex",
    "chambers",
    "garden area",
  ];

  return attractions
    .filter(Boolean)
    .filter((place) => {
      const normalized =
        normalizeName(
          place.name
        );

      if (!normalized) {
        return false;
      }

      if (
        seen.has(normalized)
      ) {
        return false;
      }

      seen.add(normalized);

      return true;
    })
    .filter((place) => {
      const name =
        normalizeName(
          place.name
        );

      const categories = (
        place.category || []
      )
        .join(" ")
        .toLowerCase();

      /*
       * Remove private properties and
       * generic/non-tourist structures.
       */
      if (
        invalidNameWords.some(
          (word) =>
            name.includes(word)
        )
      ) {
        console.log(
          `🚫 Excluded attraction: ${place.name}`
        );

        return false;
      }

      /*
       * Exclude artwork records even when
       * Geoapify classifies them as attractions.
       */
      if (
        categories.includes(
          "tourism.attraction.artwork"
        )
      ) {
        console.log(
          `🚫 Excluded artwork: ${place.name}`
        );

        return false;
      }

      /*
       * Exclude residential buildings.
       */
      if (
        categories.includes(
          "building.residential"
        )
      ) {
        console.log(
          `🚫 Excluded residential place: ${place.name}`
        );

        return false;
      }

      return true;
    })
    .sort(
      (a, b) =>
        getAttractionScore(b) -
        getAttractionScore(a)
    );
}

/*
 * Remove duplicate restaurants.
 */
function prepareRestaurants(
  restaurants = []
) {
  const seen = new Set();

  return restaurants
    .filter(Boolean)
    .filter((place) => {
      const normalized =
        normalizeName(
          place.name
        );

      if (!normalized) {
        return false;
      }

      if (
        seen.has(normalized)
      ) {
        return false;
      }

      seen.add(normalized);

      return true;
    });
}

/*
 * Remove duplicate hotels and
 * keep the closest valid hotels first.
 */
function prepareHotels(
  hotels = []
) {
  const seen = new Set();

  return hotels
    .filter(Boolean)
    .filter((place) => {
      const normalized =
        normalizeName(
          place.name
        );

      if (!normalized) {
        return false;
      }

      if (
        seen.has(normalized)
      ) {
        return false;
      }

      seen.add(normalized);

      return true;
    })
    .sort(
      (a, b) =>
        (a.distance || 0) -
        (b.distance || 0)
    );
}

/*
 * Choose the closest hotel to the day's attractions.
 */
function chooseHotel(
  hotels,
  attractions = []
) {
  if (!hotels.length) {
    return null;
  }

  if (!attractions.length) {
    return hotels[0];
  }

  const center = attractions.reduce(
    (result, place) => {
      result.latitude +=
        place.latitude;

      result.longitude +=
        place.longitude;

      return result;
    },
    {
      latitude: 0,
      longitude: 0,
    }
  );

  center.latitude /=
    attractions.length;

  center.longitude /=
    attractions.length;

  return [...hotels].sort(
    (a, b) => {
      const distanceA =
        distanceBetweenPlaces(
          center,
          a
        );

      const distanceB =
        distanceBetweenPlaces(
          center,
          b
        );

      return (
        distanceA - distanceB
      );
    }
  )[0];
}

/*
 * Select restaurants closest to the day's attraction centroid
 * and rotate them so the same restaurant is not reused.
 */
function createRestaurantPlan(
  restaurants,
  attractions = [],
  dayNumber
) {
  if (!restaurants.length) {
    return {
      breakfast: null,
      lunch: null,
      dinner: null,
    };
  }

  if (!attractions.length) {
    return {
      breakfast:
        restaurants[
          (dayNumber - 1) %
            restaurants.length
        ],

      lunch:
        restaurants[
          dayNumber %
            restaurants.length
        ],

      dinner:
        restaurants[
          (dayNumber + 1) %
            restaurants.length
        ],
    };
  }

  const center =
    attractions.reduce(
      (result, place) => {
        result.latitude +=
          place.latitude;

        result.longitude +=
          place.longitude;

        return result;
      },
      {
        latitude: 0,
        longitude: 0,
      }
    );

  center.latitude /=
    attractions.length;

  center.longitude /=
    attractions.length;

  const nearbyRestaurants =
    [...restaurants].sort(
      (a, b) => {
        const distanceA =
          distanceBetweenPlaces(
            center,
            a
          );

        const distanceB =
          distanceBetweenPlaces(
            center,
            b
          );

        return (
          distanceA - distanceB
        );
      }
    );

  const count =
    nearbyRestaurants.length;

  return {
    breakfast:
      nearbyRestaurants[
        (dayNumber - 1) %
          count
      ],

    lunch:
      nearbyRestaurants[
        dayNumber % count
      ],

    dinner:
      nearbyRestaurants[
        (dayNumber + 1) % count
      ],
  };
}

/*
 * Calculate distance between two
 * attraction objects.
 */
function distanceBetweenPlaces(
  placeA,
  placeB
) {
  if (
    !placeA ||
    !placeB
  ) {
    return Infinity;
  }

  return calculateDistanceKm(
    placeA.latitude,
    placeA.longitude,
    placeB.latitude,
    placeB.longitude
  );
}

/*
 * Group attractions geographically.
 *
 * Each day gets up to two attractions.
 *
 * The second attraction is selected
 * based on proximity to the first one,
 * instead of simply taking the next
 * item in the ranking.
 */
function distributeAttractions(
  attractions,
  days
) {
  const result = Array.from(
    { length: days },
    () => []
  );

  if (!attractions.length) {
    return result;
  }

  /*
   * First select the strongest attractions.
   * We allow a maximum of 2 attractions
   * per day.
   */
  const maxAttractions = Math.min(
    attractions.length,
    days * 2
  );

  const selected = attractions
    .slice(0, maxAttractions);

  /*
   * Start with the highest-ranked attraction.
   * Then repeatedly choose the closest
   * unused attraction.
   */
  const remaining = [
    ...selected,
  ];

  const ordered = [];

  while (remaining.length) {
    if (!ordered.length) {
      ordered.push(
        remaining.shift()
      );

      continue;
    }

    const previous =
      ordered[
        ordered.length - 1
      ];

    let closestIndex = 0;
    let closestDistance =
      Infinity;

    remaining.forEach(
      (place, index) => {
        const distance =
          distanceBetweenPlaces(
            previous,
            place
          );

        if (
          distance <
          closestDistance
        ) {
          closestDistance =
            distance;

          closestIndex =
            index;
        }
      }
    );

    ordered.push(
      remaining.splice(
        closestIndex,
        1
      )[0]
    );
  }

  /*
   * Put nearby attractions together.
   *
   * Example:
   *
   * Day 1:
   * attraction 1 + attraction 2
   *
   * Day 2:
   * attraction 3 + attraction 4
   *
   * Day 3:
   * attraction 5 + attraction 6
   */
  ordered.forEach(
    (place, index) => {
      const dayIndex =
        Math.floor(index / 2);

      if (
        dayIndex < result.length
      ) {
        result[dayIndex].push(
          place
        );
      }
    }
  );

  return result;
}

/*
 * Create one day of the itinerary.
 */
function createDayPlan(
  dayNumber,
  attractions,
  hotel,
  restaurants,
  weather
) {
  const morning =
    attractions[0] || null;

  const afternoon =
    attractions[1] || null;

  const restaurantPlan =
    createRestaurantPlan(
      restaurants,
      attractions,
      dayNumber
    );

  return {
    day: dayNumber,

    theme:
      attractions.length > 0
        ? `Exploring ${attractions
            .map(
              (place) =>
                place.name
            )
            .join(" and ")}`
        : `Day ${dayNumber} exploration`,

    hotel,

    breakfast:
      restaurantPlan.breakfast,

    morning: morning
      ? [morning]
      : [],

    lunch:
      restaurantPlan.lunch,

    afternoon: afternoon
      ? [afternoon]
      : [],

    evening: null,

    dinner:
      restaurantPlan.dinner,

    stay: hotel,

    weatherAdvice:
      weather?.weather ||
      "Current weather information is not available.",

    schedule: [],

    budget: {
      hotel: null,
      breakfast: null,
      lunch: null,
      dinner: null,
      transport: null,
      attractions: null,
      total: null,
    },
  };
}

/*
 * Main trip planner controller.
 */
export const getTripPlan = async (
  req,
  res
) => {
  try {
    const {
      destination,
      days,
    } = req.query;

    /*
     * Validate destination.
     */
    if (
      !destination ||
      !destination.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Destination is required.",
      });
    }

    /*
     * Support 1–7 days.
     */
    const numberOfDays =
      Number(days) || 3;

    if (
      !Number.isInteger(
        numberOfDays
      ) ||
      numberOfDays < 1 ||
      numberOfDays > 7
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Trip duration must be between 1 and 7 days.",
      });
    }

    const cleanDestination =
      destination.trim();

    console.log(
      `🧳 Creating ${numberOfDays}-day trip plan for ${cleanDestination}`
    );

    /*
     * ------------------------------------------------
     * STEP 1
     * Get destination coordinates.
     * ------------------------------------------------
     */
    const coordinates =
      await getCoordinates(
        cleanDestination
      );

    if (
      !coordinates ||
      coordinates.latitude ==
        null ||
      coordinates.longitude ==
        null
    ) {
      return res.status(404).json({
        success: false,
        message:
          `Unable to find the destination "${cleanDestination}".`,
      });
    }

    console.log(
      "📍 Coordinates:",
      coordinates
    );

    /*
     * ------------------------------------------------
     * STEP 2
     * Fetch live travel information.
     * ------------------------------------------------
     */
    const [
      attractions,
      hotels,
      restaurants,
      weather,
    ] = await Promise.all([
      getNearbyPlaces(
        coordinates.latitude,
        coordinates.longitude,
        "tourism.attraction",
        20000,
        50
      ),

      getNearbyPlaces(
        coordinates.latitude,
        coordinates.longitude,
        "accommodation.hotel",
        10000,
        30
      ),

      getNearbyPlaces(
        coordinates.latitude,
        coordinates.longitude,
        "catering.restaurant",
        10000,
        30
      ),

      getWeather(
        cleanDestination
      ),
    ]);

    console.log(
      `📍 Raw attractions: ${
        attractions?.length || 0
      }`
    );

    console.log(
      `🏨 Hotels: ${
        hotels?.length || 0
      }`
    );

    console.log(
      `🍽️ Restaurants: ${
        restaurants?.length || 0
      }`
    );

    /*
     * ------------------------------------------------
     * STEP 3
     * Prepare verified live data.
     * ------------------------------------------------
     */
    const preparedAttractions =
      prepareAttractions(
        attractions
      );

    const preparedHotels =
      prepareHotels(
        hotels
      );

    const preparedRestaurants =
      prepareRestaurants(
        restaurants
      );

    console.log(
      `✅ Verified attractions: ${preparedAttractions.length}`
    );

    console.log(
      `✅ Verified hotels: ${preparedHotels.length}`
    );

    console.log(
      `✅ Verified restaurants: ${preparedRestaurants.length}`
    );

    /*
     * ------------------------------------------------
     * STEP 4
     * Require at least one attraction.
     * ------------------------------------------------
     */
    if (
      !preparedAttractions.length
    ) {
      return res.status(404).json({
        success: false,
        message:
          `No verified attractions were found for ${cleanDestination}.`,
      });
    }

    /*
     * ------------------------------------------------
     * STEP 5
     * Group attractions geographically.
     * ------------------------------------------------
     */
    const dailyAttractions =
      distributeAttractions(
        preparedAttractions,
        numberOfDays
      );

    /*
     * ------------------------------------------------
     * STEP 6
     * Build each requested day.
     * ------------------------------------------------
     */
    const itinerary = [];

    for (
      let day = 1;
      day <= numberOfDays;
      day++
    ) {
      const dayAttractions =
        dailyAttractions[
          day - 1
        ] || [];

      const dayHotel =
        chooseHotel(
          preparedHotels,
          dayAttractions
        );

      itinerary.push(
        createDayPlan(
          day,
          dayAttractions,
          dayHotel,
          preparedRestaurants,
          weather
        )
      );
    }

    /*
     * ------------------------------------------------
     * STEP 7
     * Return complete trip data.
     * ------------------------------------------------
     */
    return res.json({
      success: true,

      destination:
        cleanDestination,

      days: numberOfDays,

      coordinates: {
        latitude:
          coordinates.latitude,

        longitude:
          coordinates.longitude,
      },

      weather:
        weather || null,

      dataSources: {
        coordinates:
          "Geoapify",

        attractions:
          "Geoapify",

        hotels:
          "Geoapify",

        restaurants:
          "Geoapify",

        weather:
          "Weather service",
      },

      itinerary,
    });
  } catch (error) {
    console.error(
      "❌ Trip Planner Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create the trip plan right now.",
    });
  }
};