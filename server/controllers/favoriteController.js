import Favorite from "../models/Favorite.js";

// Save Favorite
export const saveFavorite = async (req, res) => {
  try {
    const { name, state, image, about } = req.body;

    const existing = await Favorite.findOne({ name });

    if (existing) {
      return res.json({
        success: true,
        message: "Already in favorites",
        favorite: existing,
      });
    }

    const favorite = await Favorite.create({
      name,
      state,
      image,
      about,
    });

    res.status(201).json({
      success: true,
      message: "Destination saved successfully",
      favorite,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Favorites
export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      favorites,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Favorite
export const deleteFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    await Favorite.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Favorite deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};