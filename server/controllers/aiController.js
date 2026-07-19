import { buildTravelContext } from "../services/travelContextService.js";

function getTravelStatus(temp, weather) {
  weather = weather.toLowerCase();

  if (weather.includes("rain")) {
    return {
      status: "Avoid",
      color: "red",
      reason: "Heavy chances of rain."
    };
  }

  if (temp >= 15 && temp <= 25) {
    return {
      status: "Excellent",
      color: "green",
      reason: "Perfect weather for sightseeing."
    };
  }

  if (temp >= 26 && temp <= 30) {
    return {
      status: "Good",
      color: "yellow",
      reason: "Warm but comfortable."
    };
  }

  if (temp > 35) {
    return {
      status: "Not Recommended",
      color: "red",
      reason: "Very hot weather."
    };
  }

  return {
    status: "Good",
    color: "green",
    reason: "Pleasant weather."
  };
}

export const getRecommendations = async (req, res) => {
  try {
    const destinations = await buildTravelContext();

    const recommendations = destinations
      .filter(
        (place) =>
          place.weather &&
          place.coordinates
      )
      .map((place) => {
        let score = 50;

        const temp = place.weather.temperature;
        const weather = place.weather.weather.toLowerCase();

        const attractionCount = place.attractions.length;
        const hotelCount = place.hotels.length;
        const restaurantCount = place.restaurants.length;

        const travelStatus = getTravelStatus(temp, weather);

        // Temperature Score
        if (temp >= 15 && temp <= 25) score += 25;
        else if (temp >= 26 && temp <= 30) score += 15;
        else if (temp > 35) score -= 20;

        // Weather Score
        if (weather.includes("clear")) score += 15;
        else if (weather.includes("cloud")) score += 10;
        else if (weather.includes("rain")) score -= 15;

        // Category Bonus
        if (
          place.category === "Hill Station" ||
          place.category === "Adventure"
        ) {
          score += 10;
        }

        // Attractions Bonus
        if (attractionCount >= 5) score += 10;
        else if (attractionCount >= 3) score += 5;
        else if (attractionCount >= 1) score += 2;

        // Hotels Bonus
        if (hotelCount >= 8) score += 8;
        else if (hotelCount >= 5) score += 5;
        else if (hotelCount >= 2) score += 2;

        // Restaurants Bonus
        if (restaurantCount >= 8) score += 8;
        else if (restaurantCount >= 5) score += 5;
        else if (restaurantCount >= 2) score += 2;

        return {
          name: place.name,
          state: place.state,
          category: place.category,

          // ✅ Pexels Image
          image: place.image,

          weather: place.weather.weather,
          temperature: temp,

          attractionCount,
          hotelCount,
          restaurantCount,

          aiScore: score,

          bestTime: travelStatus.status,
          statusColor: travelStatus.color,
          travelReason: travelStatus.reason,

          reason: `${place.name} has ${attractionCount} attractions, ${hotelCount} hotels and ${restaurantCount} restaurants with ${temp}°C ${place.weather.weather} weather, making it one of today's best destinations.`,
        };
      })
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 10);

    res.json({
      success: true,
      recommendations,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};