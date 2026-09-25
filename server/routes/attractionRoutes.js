import express from "express";

import {
  getAttractionDetails,
} from "../controllers/attractionController.js";

const router = express.Router();

router.get(
  "/:destinationName/:attractionName",
  getAttractionDetails
);

export default router;