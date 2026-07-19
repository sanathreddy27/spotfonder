export function calculateBudget({
  days,
  travelers,
  transport,
  budgetType,
}) {
  let hotelPerNight = 2500;
  let foodPerPerson = 600;
  let activityPerDay = 500;

  switch (budgetType) {
    case "budget":
      hotelPerNight = 1500;
      foodPerPerson = 350;
      activityPerDay = 300;
      break;

    case "standard":
      hotelPerNight = 3000;
      foodPerPerson = 700;
      activityPerDay = 600;
      break;

    case "luxury":
      hotelPerNight = 7000;
      foodPerPerson = 1500;
      activityPerDay = 1200;
      break;

    default:
      break;
  }

  const travelCost = {
    car: 4500,
    bus: 1800,
    train: 2500,
    flight: 7000,
  };

  const hotel = hotelPerNight * (days - 1);
  const food = foodPerPerson * travelers * days;
  const activities = activityPerDay * travelers * days;
  const travel = travelCost[transport] || 0;

  const total = hotel + food + activities + travel;

  return {
    hotel,
    food,
    activities,
    travel,
    total,
  };
}