import express from "express";
import { getDestinationDetails } from "../controllers/destinationController.js";

const router = express.Router();

router.get("/destination/:name", getDestinationDetails);

export default router;