import express from "express";
import { routePlanner } from "../controllers/routeController.js";

const router = express.Router();

// GET /api/route
router.get("/route", routePlanner);

export default router;