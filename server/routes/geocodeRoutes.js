import express from "express";
import { geocodeCity } from "../controllers/geocodeController.js";

const router = express.Router();

router.get("/geocode", geocodeCity);

export default router;