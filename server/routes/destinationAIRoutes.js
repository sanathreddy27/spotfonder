import express from "express";
import { getDestinationAI } from "../controllers/destinationAIController.js";

const router = express.Router();

router.get("/:name", getDestinationAI);

export default router;