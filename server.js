// Simple local API server — replaces vercel dev for local testing
// Loads .env.local, serves every file under /api as /api/<name>

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
  console.log(
    "   GOOGLE_PLACES_API_KEY:",
    process.env.GOOGLE_PLACES_API_KEY ? "set" : "not set (Reviews will show fallback)",
  );
  console.log(
    "   GOOGLE_PLACE_ID:",
    process.env.GOOGLE_PLACE_ID || "not set (Reviews will show fallback)",
  );
} else {
  console.warn("❌ .env.local NOT FOUND at:", envPath);
}

require("ts-node").register({ transpileOnly: true, esm: false });

const API_DIR = path.join(__dirname, "api");

function loadHandler(name) {
  const file = path.join(API_DIR, `${name}.ts`);
  if (!fs.existsSync(file)) return null;
  // Bust require cache so edits are picked up without restarting.
  delete require.cache[require.resolve(file)];
  return require(file);
}

// ── HTTP server ───────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  // CORS for local dev
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const match = (req.url || "").match(/^\/api\/([a-zA-Z0-9-_]+)\/?(\?.*)?$/);
  if (!match) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const name = match[1];
  let handler;
  try {
    handler = loadHandler(name);
  } catch (e) {
    console.error(`Failed to load api/${name}.ts:`, e.message);
  }

  if (!handler) {
    res.writeHead(404);
    res.end(`No handler for /api/${name}`);
    return;
  }

  // Wrap Node's IncomingMessage to provide Express-like res API
  const mockRes = {
    _status: 200,
    status(code) {
      this._status = code;
      return this;
    },
    setHeader(k, v) {
      res.setHeader(k, v);
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
    console.error(`Handler error in api/${name}.ts:`, err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🔌 API server running on http://localhost:${PORT}/api/*`);
});
