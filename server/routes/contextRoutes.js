import express from "express";
import { buildTravelContext } from "../services/travelContextService.js";

const router = express.Router();

router.get("/context", async (req, res) => {
  const data = await buildTravelContext();

  res.json(data);
});

export default router;