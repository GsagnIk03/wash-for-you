#!/bin/bash

# ─── Wash For U — Local Dev Startup ────────────────────────
GREEN="\033[0;32m"
CYAN="\033[0;36m"
YELLOW="\033[1;33m"
RESET="\033[0m"

echo -e "${CYAN}"
echo "  ╔════════════════════════════════════════╗"
echo "  ║        Wash For U — Dev Server       ║"
echo "  ╚════════════════════════════════════════╝"
echo -e "${RESET}"

# ── Pre-flight ────────────────────────────────────────────────
if ! command -v node &>/dev/null; then
  echo -e "${YELLOW}⚠  Node.js not found. Install from https://nodejs.org${RESET}"
  exit 1
fi

# ── .env.local check ─────────────────────────────────────────
if [ ! -f ".env.local" ]; then
  echo -e "${YELLOW}⚠  .env.local not found — creating template...${RESET}"
  cat > .env.local << 'ENVEOF'
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
BUSINESS_EMAIL=support@washforu.com
VITE_WHATSAPP_NUMBER=919477588518
ENVEOF
  echo -e "${YELLOW}   → Fill in your RESEND_API_KEY in .env.local then re-run this script.${RESET}"
  exit 1
fi

# ── Install deps ──────────────────────────────────────────────
if [ ! -d "node_modules" ]; then
  echo -e "${CYAN}📦 Installing dependencies...${RESET}"
  npm install
fi

# ── Install ts-node if missing ────────────────────────────────
if ! node -e "require('ts-node')" 2>/dev/null; then
  echo -e "${CYAN}📦 Installing ts-node...${RESET}"
  npm install --save-dev ts-node
fi

# ── Cleanup on Ctrl+C ─────────────────────────────────────────
cleanup() {
  echo -e "\n${YELLOW}Stopping servers...${RESET}"
  kill "$API_PID" "$VITE_PID" 2>/dev/null
  exit 0
}
trap cleanup SIGINT SIGTERM

# ── Start API server on :3001 ─────────────────────────────────
echo -e "${CYAN}🔌 Starting API server on http://localhost:3001 ...${RESET}"
node server.js &
API_PID=$!
sleep 1

# ── Start Vite on :3000 ───────────────────────────────────────
echo -e "${GREEN}⚡ Starting Vite on http://localhost:3000 ...${RESET}"
echo ""
echo -e "   ${GREEN}▶ Open: http://localhost:3000${RESET}"
echo -e "   Press ${YELLOW}Ctrl+C${RESET} to stop."
echo ""
npx vite --port 3000 &
VITE_PID=$!

wait "$API_PID" "$VITE_PID"