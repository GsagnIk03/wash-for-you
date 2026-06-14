// Simple local API server — replaces vercel dev for local testing
// Loads .env.local, serves /api/send-booking on port 3001

const http = require("http");
const path = require("path");
const fs = require("fs");

// ── Load .env.local manually ──────────────────────────────────
const envPath = path.join(__dirname, ".env.local");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed
      .slice(idx + 1)
      .trim()
      .replace(/^["']|["']$/g, "") // strip surrounding quotes
      .replace(/^\\"|\\\"$/g, "") // strip escaped quotes \"...\"
      .replace(/\\\\/g, "\\"); // unescape backslashes
    if (key) process.env[key] = val;
  }
  console.log("✅ Loaded .env.local");
  console.log(
    "   RESEND_API_KEY:",
    process.env.RESEND_API_KEY
      ? `"${process.env.RESEND_API_KEY.slice(0, 15)}..." (length: ${process.env.RESEND_API_KEY.length})`
      : "❌ NOT SET",
  );
  console.log("   BUSINESS_EMAIL:", process.env.BUSINESS_EMAIL || "❌ NOT SET");
} else {
  console.warn("❌ .env.local NOT FOUND at:", envPath);
}

// ── Load the API handler ──────────────────────────────────────
// Compile TS on the fly using ts-node if available, else require JS fallback
let handler;
try {
  require("ts-node").register({ transpileOnly: true, esm: false });
  handler = require("./api/send-booking.ts");
} catch (e) {
  console.error("ts-node not found, trying direct require...", e.message);
  handler = require("./api/send-booking");
}

// ── HTTP server ───────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  // CORS for local dev
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === "/api/send-booking" || req.url === "/api/send-booking/") {
    // Wrap Node's IncomingMessage to provide Express-like res API
    const mockRes = {
      _status: 200,
      _body: "",
      status(code) {
        this._status = code;
        return this;
      },
      json(obj) {
        res.writeHead(this._status, { "Content-Type": "application/json" });
        res.end(JSON.stringify(obj));
      },
    };
    try {
      await handler(req, mockRes);
    } catch (err) {
      console.error("Handler error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(
    `🔌 API server running on http://localhost:${PORT}/api/send-booking`,
  );
});
