import express from "express";
import { getItinerary } from "../controllers/itineraryController.js";

const router = express.Router();

router.post("/itinerary", getItinerary);

export default router;