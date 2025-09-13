import express from "express";
import WebSocket from "ws";

const app = express();
const PORT = process.env.PORT || 3000;

const API_TOKEN = process.env.DERIV_API_TOKEN; // Demo or Live key
const DERIV_API_URL = "wss://ws.derivws.com/websockets/v3?app_id=1089";

app.get("/", (req, res) => {
  res.send("✅ Astark bot backend is running and connected to Deriv API!");
});

// Start WebSocket connection
const ws = new WebSocket(DERIV_API_URL);

ws.on("open", () => {
  console.log("🔗 Connected to Deriv API WebSocket");

  // Authorize with token
  ws.send(JSON.stringify({ authorize: API_TOKEN }));
});

ws.on("message", (msg) => {
  const data = JSON.parse(msg);

  // Log authorization
  if (data.msg_type === "authorize") {
    console.log("✅ Authorized as:", data.authorize.loginid);
  }

  // Log trade results
  if (data.msg_type === "buy") {
    console.log("🟢 Trade sent. Contract ID:", data.buy.contract_id);
  }

  if (data.msg_type === "proposal_open_contract") {
    const contract = data.proposal_open_contract;
    if (contract.is_sold) {
      console.log("🔵 Trade closed:", {
        result: contract.profit >= 0 ? "WIN ✅" : "LOSS ❌",
        profit: contract.profit,
        balance: contract.balance,
      });
    }
  }

  // Log errors
  if (data.error) {
    console.error("⚠️ ERROR:", data.error.message);
  }
});

// Function to place a Matches trade
function tradeDigitMatch(digit) {
  const payload = {
    buy: 1,
    price: 10, // stake amount
    parameters: {
      contract_type: "DIGITMATCH",
      amount: 10,
      basis: "stake",
      currency: "USD",
      duration: 1,
      duration_unit: "t",
      symbol: "R_100",
      barrier: digit.toString(),
    },
  };
  console.log("📤 Sending trade:", payload.parameters);
  ws.send(JSON.stringify(payload));
}

// Example: place trade on digit 7 after 5s
setTimeout(() => {
  tradeDigitMatch(7);
}, 5000);

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
