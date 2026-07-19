import { getRoute } from "../services/routingService.js";

export const routePlanner = async (req, res) => {
  try {
    const { startLat, startLon, endLat, endLon } = req.query;

    if (
      !startLat ||
      !startLon ||
      !endLat ||
      !endLon
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing coordinates.",
      });
    }

    const route = await getRoute(
      Number(startLat),
      Number(startLon),
      Number(endLat),
      Number(endLon)
    );

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found.",
      });
    }

    res.json({
      success: true,
      distance: route.distance,
      time: route.time,
      geometry: route.geometry,
    });

  } catch (error) {
    console.error("Route Controller Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};