import express from "express";
import {
  saveFavorite,
  getFavorites,
  deleteFavorite,
} from "../controllers/favoriteController.js";

const router = express.Router();

// Save a favorite
router.post("/favorites", saveFavorite);

// Get all favorites
router.get("/favorites", getFavorites);

// Delete favorite
router.delete("/favorites/:id", deleteFavorite);

export default router;