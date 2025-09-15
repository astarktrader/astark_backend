import express from "express";
import WebSocket from "ws";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Deriv API Token (from Render Environment Variables)
const API_TOKEN = process.env.DERIV_API_TOKEN;

if (!API_TOKEN) {
  console.error("❌ DERIV_API_TOKEN not set!");
  process.exit(1);
}

// Create WebSocket connection to Deriv
let ws = null;
let botRunning = false;

// Connect function
function connectToDeriv() {
  ws = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089");

  ws.on("open", () => {
    console.log("✅ Connected to Deriv WebSocket");
    // authorize with token
    ws.send(JSON.stringify({ authorize: API_TOKEN }));
  });

  ws.on("message", (msg) => {
    const data = JSON.parse(msg);
    console.log("📩", data);
  });

  ws.on("close", () => {
    console.log("❌ Disconnected from Deriv WebSocket");
  });
}

// Start Bot endpoint
app.post("/start", (req, res) => {
  if (!botRunning) {
    botRunning = true;
    connectToDeriv();
    res.json({ success: true, message: "🚀 Bot started" });
  } else {
    res.json({ success: false, message: "⚠️ Bot already running" });
  }
});

// Stop Bot endpoint
app.post("/stop", (req, res) => {
  if (botRunning && ws) {
    ws.close();
    botRunning = false;
    res.json({ success: true, message: "🛑 Bot stopped" });
  } else {
    res.json({ success: false, message: "⚠️ Bot not running" });
  }
});

// Status endpoint
app.get("/status", (req, res) => {
  res.json({ running: botRunning });
});

// Health check
app.get("/", (req, res) => {
  res.send("✅ ASTARK Backend is running and ready!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
