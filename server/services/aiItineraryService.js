function distributePlaces(places, days) {
  if (!places || places.length === 0) {
    return Array(days).fill([]);
  }

  const result = Array.from({ length: days }, () => []);

  places.forEach((place, index) => {
    result[index % days].push(place);
  });

  return result;
}

const dayThemes = [
  "City Exploration",
  "Nature & Adventure",
  "Culture & Heritage",
  "Food Discovery",
  "Shopping & Leisure",
];

const timeSlots = [
  {
    label: "Breakfast",
    time: "08:00 AM",
  },
  {
    label: "Morning Sightseeing",
    time: "09:30 AM",
  },
  {
    label: "Lunch",
    time: "01:00 PM",
  },
  {
    label: "Afternoon Tour",
    time: "02:30 PM",
  },
  {
    label: "Dinner",
    time: "07:00 PM",
  },
];

function getWeatherAdvice(weather) {
  if (!weather) {
    return "Weather data unavailable.";
  }

  const condition =
    weather.weather?.toLowerCase() || "";

  if (condition.includes("rain")) {
    return "Carry an umbrella and prioritize indoor attractions.";
  }

  if (condition.includes("cloud")) {
    return "Pleasant weather. Great for sightseeing.";
  }

  if (condition.includes("clear")) {
    return "Perfect day for outdoor activities.";
  }

  return "Enjoy your trip!";
}

function estimateBudget(hotel) {
  const hotelCost = hotel ? 3500 : 0;

  const breakfast = 250;
  const lunch = 450;
  const dinner = 500;
  const transport = 400;
  const attractions = 600;

  return {
    hotel: hotelCost,
    breakfast,
    lunch,
    dinner,
    transport,
    attractions,
    total:
      hotelCost +
      breakfast +
      lunch +
      dinner +
      transport +
      attractions,
  };
}

function buildDay(dayNumber, destination, dayPlaces) {
  const hotels = destination.hotels || [];
  const restaurants = destination.restaurants || [];

  const hotel =
    hotels.length > 0
      ? hotels[(dayNumber - 1) % hotels.length]
      : null;

  const breakfast =
    restaurants.length > 0
      ? restaurants[(dayNumber - 1) % restaurants.length]
      : null;

  const lunch =
    restaurants.length > 1
      ? restaurants[(dayNumber + 1) % restaurants.length]
      : breakfast;

  const dinner =
    restaurants.length > 2
      ? restaurants[(dayNumber + 2) % restaurants.length]
      : lunch;

  // Split attractions into Morning / Afternoon / Evening evenly if counts are small
  let morning = [];
  let afternoon = [];
  let evening = [];

  if (dayPlaces.length === 1) {
    morning = [dayPlaces[0]];
  } else if (dayPlaces.length === 2) {
    morning = [dayPlaces[0]];
    afternoon = [dayPlaces[1]];
  } else if (dayPlaces.length === 3) {
    morning = [dayPlaces[0]];
    afternoon = [dayPlaces[1]];
    evening = [dayPlaces[2]];
  } else {
    morning = dayPlaces.slice(0, 2);
    afternoon = dayPlaces.slice(2, 4);
    evening = dayPlaces.slice(4);
  }

  console.log("Hotel:", hotel);
  console.log("Morning:", morning);
  console.log("Afternoon:", afternoon);
  console.log("Evening:", evening);

  const budget = estimateBudget(hotel);

  return {
    day: dayNumber,

    theme: dayThemes[(dayNumber - 1) % dayThemes.length],

    hotel,

    breakfast,

    morning,

    lunch,

    afternoon,

    evening,

    dinner,

    stay: hotel,

    budget,

    schedule: timeSlots,

    weatherAdvice: getWeatherAdvice(destination.weather),
  };
}

export async function generateItinerary(destination) {
  const places3 = distributePlaces(
    destination.attractions,
    3
  );

  const places5 = distributePlaces(
    destination.attractions,
    5
  );

  const threeDays = [];
  for (let i = 0; i < 3; i++) {
    threeDays.push(
      buildDay(
        i + 1,
        destination,
        places3[i]
      )
    );
  }

  const fiveDays = [];
  for (let i = 0; i < 5; i++) {
    fiveDays.push(
      buildDay(
        i + 1,
        destination,
        places5[i]
      )
    );
  }

  console.log("Destination attractions:", destination.attractions.length);
  console.log(places3);
  console.log(places5);

  return {
    threeDays,
    fiveDays,
  };
}