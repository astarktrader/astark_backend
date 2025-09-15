import express from "express";
import WebSocket from "ws";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // allow frontend requests

// Deriv API Token (from Render Environment Variables)
const API_TOKEN = process.env.DERIV_API_TOKEN;

if (!API_TOKEN) {
  console.error("❌ DERIV_API_TOKEN not set!");
  process.exit(1);
}

// Create WebSocket connection to Deriv
const ws = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089");

// Simple endpoint for health check
app.get("/", (req, res) => {
  res.send("✅ ASTARK Backend is running and connected to Deriv API!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
