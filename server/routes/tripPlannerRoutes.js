import express from "express";
import { getTripPlan } from "../controllers/tripPlannerController.js";

const router = express.Router();

router.get("/", getTripPlan);

export default router;