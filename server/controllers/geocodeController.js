import { getCoordinates } from "../services/geoapifyService.js";

export const geocodeCity = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City is required",
      });
    }

    const coordinates = await getCoordinates(city);

    if (!coordinates) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    res.json({
      success: true,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      formatted: coordinates.formatted,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};