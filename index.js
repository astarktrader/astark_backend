import express from "express";
import WebSocket from "ws";

const app = express();
const PORT = process.env.PORT || 3000;

// Your Deriv API Token (set in Render Environment Variables)
const API_TOKEN = process.env.DERIV_API_TOKEN;

// Create WebSocket connection to Deriv
const ws = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089");

ws.on("open", () => {
  console.log("🔗 Connected to Deriv API WebSocket");

  // Authorize with API token
  ws.send(JSON.stringify({ authorize: API_TOKEN }));
});

ws.on("message", (msg) => {
  const data = JSON.parse(msg.toString());

  if (data.msg_type === "authorize") {
    console.log(`✅ Authorized as: ${data.authorize.loginid}`);
  }

  // Handle contract responses (mock for now)
  if (data.msg_type === "proposal") {
    console.log("📩 Proposal received:", data.proposal);
  }

  if (data.msg_type === "buy") {
    console.log("🟢 Trade sent. Contract ID:", data.buy.contract_id);
  }

  if (data.msg_type === "proposal_open_contract") {
    console.log("🔵 Contract update:", data.proposal_open_contract);
  }
});

// Simple API route for testing
app.get("/", (req, res) => {
  res.send("🚀 Astark Backend is running and connected to Deriv API!");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
