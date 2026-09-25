import Destination from "../models/Destination.js";
import Attraction from "../models/Attraction.js";

export async function getDestinationKnowledge(destinationName) {
  try {
    const destination = await Destination.findOne({
      name: { $regex: `^${destinationName}$`, $options: "i" },
    }).lean();

    if (!destination) {
      return null;
    }

    return {
      type: "destination",
      name: destination.name,
      state: destination.state,
      category: destination.category,
      importance: destination.importance,
      famousFor: destination.famousFor,
      description: destination.description,
      history: destination.history,
      bestTime: destination.bestTime,
      tags: destination.tags,
      knowledgeText: destination.knowledgeText,
    };
  } catch (error) {
    console.error("❌ Destination RAG Error:", error);
    return null;
  }
}

export async function getAttractionKnowledge(
  attractionName,
  destinationName
) {
  try {
    const attraction = await Attraction.findOne({
      name: { $regex: `^${attractionName}$`, $options: "i" },
      destination: { $regex: `^${destinationName}$`, $options: "i" },
    }).lean();

    if (!attraction) {
      return null;
    }

    return {
      type: "attraction",

      name: attraction.name,
      destination: attraction.destination,

      state: attraction.state,
      category: attraction.category,
      typeName: attraction.type,

      importance: attraction.importance,
      famousFor: attraction.famousFor,

      description: attraction.description,
      history: attraction.history,

      tips: attraction.tips || [],
      tags: attraction.tags || [],

      knowledgeText: attraction.knowledgeText,

      latitude: attraction.latitude,
      longitude: attraction.longitude,

      image: attraction.image || null,
      images: attraction.images || [],
    };
  } catch (error) {
    console.error("❌ Attraction RAG Error:", error);
    return null;
  }
}