import Attraction from "../models/Attraction.js";

import {
  getCoordinates,
  getNearbyPlaces,
} from "../services/geoapifyService.js";

import {
  generateAttractionAI,
} from "../services/attractionAIService.js";

import {
  getWikipediaKnowledge,
} from "../services/wikiService.js";

export const getAttractionDetails = async (req, res) => {
  try {
    const attractionName = decodeURIComponent(
      req.params.attractionName
    );

    const destinationName = decodeURIComponent(
      req.params.destinationName
    );

    console.log(
      `📍 Loading attraction: ${attractionName} (${destinationName})`
    );

    // ----------------------------------------------------
    // 1. Find attraction in MongoDB
    // ----------------------------------------------------

    let attraction = await Attraction.findOne({
      name: {
        $regex: `^${attractionName}$`,
        $options: "i",
      },

      destination: {
        $regex: `^${destinationName}$`,
        $options: "i",
      },
    }).lean();

    // ----------------------------------------------------
    // 2. Create attraction if it does not exist
    // ----------------------------------------------------

    if (!attraction) {
      console.log(
        "📍 Attraction not found in MongoDB. Creating..."
      );

      const coordinates = await getCoordinates(
        `${attractionName}, ${destinationName}`
      );

      if (!coordinates) {
        return res.status(404).json({
          success: false,
          message:
            "Unable to find coordinates for this attraction.",
        });
      }

      const knowledgeText = `
Attraction:
${attractionName}

Destination:
${destinationName}

The attraction is located in ${destinationName}.

Additional attraction information will be retrieved
from external knowledge sources.
      `.trim();

      const createdAttraction =
        await Attraction.findOneAndUpdate(
          {
            name: attractionName,
            destination: destinationName,
          },

          {
            name: attractionName,
            destination: destinationName,

            type: "Tourist Attraction",
            category: "Attraction",

            description:
              `A tourist attraction located in ${destinationName}.`,

            history: "",

            importance:
              `${attractionName} is a notable attraction associated with ${destinationName}.`,

            famousFor: "",

            tips: [
              "Check local opening information before visiting.",
              "Follow local visitor and safety guidelines.",
            ],

            tags: [
              "attraction",
              "sightseeing",
              destinationName,
            ],

            knowledgeText,

            latitude: coordinates.latitude,
            longitude: coordinates.longitude,

            cachedAt: new Date(),
          },

          {
            new: true,
            upsert: true,
          }
        );

      attraction = createdAttraction.toObject();
    }

    // ----------------------------------------------------
    // 3. Ensure address exists
    // ----------------------------------------------------

    if (
      !attraction.address &&
      attraction.latitude != null &&
      attraction.longitude != null
    ) {
      attraction.address =
        `${attraction.latitude}, ${attraction.longitude}`;
    }

    // ----------------------------------------------------
    // 4. Retrieve Wikipedia knowledge
    // ----------------------------------------------------

    console.log("📚 Loading attraction knowledge...");

    const wikipedia =
      await getWikipediaKnowledge(
        attraction.name,
        destinationName
      );

    if (wikipedia) {
      console.log(
        `📚 Wikipedia page found: ${wikipedia.title}`
      );

      attraction.knowledgeText =
        wikipedia.knowledgeText;

      attraction.history =
        wikipedia.history || "";

      attraction.famousFor =
        wikipedia.famousFor || "";

      attraction.description =
        wikipedia.description || "";

      if (wikipedia.images?.length) {
        attraction.images =
          wikipedia.images.map(
            (image) => image.url
          );

        attraction.image =
          attraction.images[0];
      }

      await Attraction.findOneAndUpdate(
        {
          name: attraction.name,
          destination: destinationName,
        },

        {
          knowledgeText:
            attraction.knowledgeText,

          history:
            attraction.history,

          famousFor:
            attraction.famousFor,

          description:
            attraction.description,

          image:
            attraction.image,

          images:
            attraction.images,

          cachedAt: new Date(),
        }
      );
    } else {
      console.log(
        "⚠️ No Wikipedia knowledge found."
      );
    }

    // ----------------------------------------------------
    // 5. Nearby hotels
    // ----------------------------------------------------

    const initialNearbyRadius = 5000;
    const expandedNearbyRadius = 15000;

    let hotels = await getNearbyPlaces(
      attraction.latitude,
      attraction.longitude,
      "accommodation.hotel",
      initialNearbyRadius,
      10
    );

    let hotelSearchRadius =
      initialNearbyRadius;

    let hotelSearchExpanded = false;

    if (hotels.length < 5) {
      console.log(
        "🏨 Fewer than 5 hotels within 5 km. Expanding search..."
      );

      const expandedHotels =
        await getNearbyPlaces(
          attraction.latitude,
          attraction.longitude,
          "accommodation.hotel",
          expandedNearbyRadius,
          10
        );

      hotels = expandedHotels;

      hotelSearchRadius =
        expandedNearbyRadius;

      hotelSearchExpanded = true;
    }

    // ----------------------------------------------------
    // 6. Nearby restaurants
    // ----------------------------------------------------

    let restaurants = await getNearbyPlaces(
      attraction.latitude,
      attraction.longitude,
      "catering.restaurant",
      initialNearbyRadius,
      10
    );

    let restaurantSearchRadius =
      initialNearbyRadius;

    let restaurantSearchExpanded = false;

    if (restaurants.length < 5) {
      console.log(
        "🍽️ Fewer than 5 restaurants within 5 km. Expanding search..."
      );

      const expandedRestaurants =
        await getNearbyPlaces(
          attraction.latitude,
          attraction.longitude,
          "catering.restaurant",
          expandedNearbyRadius,
          10
        );

      restaurants = expandedRestaurants;

      restaurantSearchRadius =
        expandedNearbyRadius;

      restaurantSearchExpanded = true;
    }

    // ----------------------------------------------------
    // 7. Generate AI travel guide
    // ----------------------------------------------------

    console.log(
      "🤖 Generating attraction AI..."
    );

    const aiOverview =
      await generateAttractionAI({
        attractionName: attraction.name,
        destinationName,
      });

    // ----------------------------------------------------
    // 8. Return response
    // ----------------------------------------------------

    res.json({
      success: true,

      attraction: {
        name: attraction.name,

        destination:
          attraction.destination,

        type:
          attraction.type,

        category:
          attraction.category,

        address:
          attraction.address || null,

        latitude:
          attraction.latitude,

        longitude:
          attraction.longitude,

        importance:
          attraction.importance || "",

        history:
          attraction.history || "",

        famousFor:
          attraction.famousFor || "",

        description:
          attraction.description || "",

        image:
          attraction.image || null,

        images:
          attraction.images || [],

        tips:
          attraction.tips || [],
      },

      aiOverview,

      hotels,

      restaurants,

      hotelSearch: {
        initialRadius:
          initialNearbyRadius,

        searchedRadius:
          hotelSearchRadius,

        expanded:
          hotelSearchExpanded,
      },

      restaurantSearch: {
        initialRadius:
          initialNearbyRadius,

        searchedRadius:
          restaurantSearchRadius,

        expanded:
          restaurantSearchExpanded,
      },
    });
  } catch (error) {
    console.error(
      "❌ Attraction Details Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};