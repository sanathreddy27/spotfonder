export async function generateItinerary(destination) {
  const attractions = destination.attractions || [];
  const hotels = destination.hotels || [];
  const restaurants = destination.restaurants || [];

  return {
    threeDays: [
      {
        day: 1,
        hotel: hotels[0] || "Recommended Hotel",
        breakfast: restaurants[0] || "Local Cafe",
        places: attractions.slice(0, 2),
        lunch: restaurants[1] || "Popular Restaurant",
        dinner: restaurants[2] || "Fine Dining",
      },
      {
        day: 2,
        hotel: hotels[0] || "Recommended Hotel",
        breakfast: restaurants[0] || "Local Cafe",
        places: attractions.slice(2, 4),
        lunch: restaurants[1] || "Popular Restaurant",
        dinner: restaurants[2] || "Fine Dining",
      },
      {
        day: 3,
        hotel: hotels[0] || "Recommended Hotel",
        breakfast: restaurants[0] || "Local Cafe",
        places: attractions.slice(4, 6),
        lunch: restaurants[1] || "Popular Restaurant",
        dinner: restaurants[2] || "Fine Dining",
      },
    ],

    fiveDays: [
      {
        day: 1,
        hotel: hotels[0] || "Recommended Hotel",
        places: attractions.slice(0, 1),
      },
      {
        day: 2,
        hotel: hotels[1] || hotels[0] || "Recommended Hotel",
        places: attractions.slice(1, 2),
      },
      {
        day: 3,
        hotel: hotels[1] || hotels[0] || "Recommended Hotel",
        places: attractions.slice(2, 3),
      },
      {
        day: 4,
        hotel: hotels[2] || hotels[0] || "Recommended Hotel",
        places: attractions.slice(3, 4),
      },
      {
        day: 5,
        hotel: hotels[2] || hotels[0] || "Recommended Hotel",
        places: attractions.slice(4, 5),
      },
    ],
  };
}