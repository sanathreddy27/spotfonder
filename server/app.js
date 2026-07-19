import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import aiRoutes from "./routes/aiRoutes.js";
import itineraryRoutes from "./routes/itineraryRoutes.js";
import contextRoutes from "./routes/contextRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";
import geocodeRoutes from "./routes/geocodeRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// Connect MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("🚀 SpotFonder Backend is Running...");
});

// API Routes
app.use("/api", aiRoutes);
app.use("/api", itineraryRoutes);
app.use("/api", contextRoutes);
app.use("/api", destinationRoutes);
app.use("/api", geocodeRoutes);
app.use("/api", routeRoutes);
app.use("/api", favoriteRoutes);
app.use("/api/auth", authRoutes);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});