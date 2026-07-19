export function calculateTransport(distanceKm) {
  return {
    car: {
      price: Math.round(distanceKm * 8),
      time: (distanceKm / 60).toFixed(1),
    },

    bus: {
      price: Math.round(distanceKm * 1),
      time: (distanceKm / 50).toFixed(1),
    },

    train: {
      price: Math.round(distanceKm * 0.7),
      time: (distanceKm / 65).toFixed(1),
    },

    flight: {
      price: Math.round(distanceKm * 3.2),
      time:
        distanceKm > 400
          ? (distanceKm / 700 + 1.5).toFixed(1)
          : "Not Recommended",
    },
  };
}