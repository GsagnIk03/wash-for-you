import React from "react";

const CarWashIllustration: React.FC = () => (
  <svg
    viewBox="0 0 560 400"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "100%", height: "auto", overflow: "visible" }}
  >
    <defs>
      <radialGradient id="bodyGrad" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#3A8FE8" />
        <stop offset="100%" stopColor="#1A5CB8" />
      </radialGradient>
      <radialGradient id="windowGrad" cx="40%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#B8DEFF" stopOpacity={0.95} />
        <stop offset="100%" stopColor="#5AAAE8" stopOpacity={0.8} />
      </radialGradient>
      <radialGradient id="wheelGrad" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#4A5568" />
        <stop offset="100%" stopColor="#1A202C" />
      </radialGradient>
      <filter id="softGlow">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="WaterlessBlur">
        <feGaussianBlur stdDeviation="3" />
      </filter>
      <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1E4A8A" stopOpacity={0.5} />
        <stop offset="100%" stopColor="#0A2540" stopOpacity={0.2} />
      </linearGradient>
      <linearGradient id="hoseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2563EB" />
        <stop offset="100%" stopColor="#1E40AF" />
      </linearGradient>
      <linearGradient id="nozzleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#64748B" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>
    </defs>

    {/* Ground reflection */}
    <ellipse cx="270" cy="355" rx="200" ry="18" fill="url(#groundGrad)" />

    {/* CAR GROUP (floats) */}
    <g style={{ animation: "carFloat 5s ease-in-out infinite" }}>
      {/* Shadow */}
      <ellipse
        cx="268"
        cy="352"
        rx="160"
        ry="10"
        fill="#061525"
        opacity={0.35}
      />
      {/* Body */}
      <rect
        x="80"
        y="255"
        width="380"
        height="90"
        rx="18"
        fill="url(#bodyGrad)"
      />
      {/* Cabin */}
      <path
        d="M160 255 Q180 185 230 175 L340 175 Q390 185 410 255 Z"
        fill="url(#bodyGrad)"
      />
      <path
        d="M175 253 Q193 198 235 189 L335 189 Q378 198 396 253 Z"
        fill="#4A9AEE"
        opacity={0.3}
      />
      {/* Windshield */}
      <path
        d="M200 252 Q215 202 248 192 L320 192 Q348 202 362 252 Z"
        fill="url(#windowGrad)"
      />
      <path
        d="M215 248 Q225 215 245 207 L268 207 Q255 218 242 248 Z"
        fill="white"
        opacity={0.25}
      />
      {/* Side windows */}
      <rect
        x="158"
        y="210"
        width="38"
        height="40"
        rx="5"
        fill="url(#windowGrad)"
        opacity={0.85}
      />
      <rect
        x="366"
        y="210"
        width="38"
        height="40"
        rx="5"
        fill="url(#windowGrad)"
        opacity={0.85}
      />
      {/* Door lines */}
      <line
        x1="265"
        y1="258"
        x2="265"
        y2="340"
        stroke="#1A5CB8"
        strokeWidth={1.5}
        opacity={0.4}
      />
      <line
        x1="80"
        y1="295"
        x2="460"
        y2="295"
        stroke="#1A5CB8"
        strokeWidth={1}
        opacity={0.25}
      />
      {/* Grille */}
      <rect
        x="82"
        y="290"
        width="50"
        height="22"
        rx="6"
        fill="#0F3875"
        opacity={0.8}
      />
      <rect
        x="88"
        y="294"
        width="38"
        height="5"
        rx="2"
        fill="#3ECFCF"
        opacity={0.7}
      />
      <rect
        x="88"
        y="302"
        width="38"
        height="5"
        rx="2"
        fill="#3ECFCF"
        opacity={0.5}
      />
      {/* Headlights */}
      <ellipse
        cx="108"
        cy="275"
        rx="18"
        ry="10"
        fill="#FFF9C4"
        opacity={0.9}
        filter="url(#softGlow)"
      />
      <ellipse cx="108" cy="275" rx="12" ry="6" fill="white" opacity={0.95} />
      <path d="M90 272 L40 260 L40 285 L90 278 Z" fill="white" opacity={0.06} />
      {/* Rear lights */}
      <rect
        x="420"
        y="268"
        width="20"
        height="14"
        rx="4"
        fill="#FF6B6B"
        opacity={0.9}
      />
      <rect
        x="422"
        y="270"
        width="16"
        height="10"
        rx="3"
        fill="#FF4444"
        opacity={0.8}
      />
      {/* Bumpers */}
      <rect x="75" y="327" width="55" height="16" rx="8" fill="#0F3875" />
      <rect x="410" y="327" width="55" height="16" rx="8" fill="#0F3875" />
      {/* Hood */}
      <path
        d="M82 260 Q110 250 160 255"
        stroke="#4A9AEE"
        strokeWidth={1.5}
        fill="none"
        opacity={0.4}
      />

      {/* Wheels — Front */}
      <circle cx="160" cy="345" r="42" fill="url(#wheelGrad)" />
      <circle cx="160" cy="345" r="32" fill="#2D3748" />
      <circle cx="160" cy="345" r="20" fill="#4A5568" />
      <line
        x1="160"
        y1="313"
        x2="160"
        y2="377"
        stroke="#718096"
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      <line
        x1="128"
        y1="345"
        x2="192"
        y2="345"
        stroke="#718096"
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      <line
        x1="137"
        y1="322"
        x2="183"
        y2="368"
        stroke="#718096"
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      <line
        x1="183"
        y1="322"
        x2="137"
        y2="368"
        stroke="#718096"
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      <circle cx="160" cy="345" r="10" fill="#CBD5E0" />
      <circle cx="160" cy="345" r="5" fill="#E2E8F0" />

      {/* Wheels — Rear */}
      <circle cx="375" cy="345" r="42" fill="url(#wheelGrad)" />
      <circle cx="375" cy="345" r="32" fill="#2D3748" />
      <circle cx="375" cy="345" r="20" fill="#4A5568" />
      <line
        x1="375"
        y1="313"
        x2="375"
        y2="377"
        stroke="#718096"
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      <line
        x1="343"
        y1="345"
        x2="407"
        y2="345"
        stroke="#718096"
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      <line
        x1="352"
        y1="322"
        x2="398"
        y2="368"
        stroke="#718096"
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      <line
        x1="398"
        y1="322"
        x2="352"
        y2="368"
        stroke="#718096"
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      <circle cx="375" cy="345" r="10" fill="#CBD5E0" />
      <circle cx="375" cy="345" r="5" fill="#E2E8F0" />

      {/* Drips */}
      <ellipse
        cx="230"
        cy="182"
        rx="3"
        ry="5"
        fill="#B8DEFF"
        opacity={0.8}
        style={{ animation: "drip 1.4s ease-in infinite" }}
      />
      <ellipse
        cx="268"
        cy="178"
        rx="2.5"
        ry="4"
        fill="#3ECFCF"
        opacity={0.7}
        style={{ animation: "drip 1.4s ease-in infinite 0.35s" }}
      />
      <ellipse
        cx="310"
        cy="180"
        rx="3"
        ry="5"
        fill="#B8DEFF"
        opacity={0.75}
        style={{ animation: "drip 1.4s ease-in infinite 0.7s" }}
      />
      <ellipse
        cx="350"
        cy="184"
        rx="2"
        ry="4"
        fill="#3ECFCF"
        opacity={0.65}
        style={{ animation: "drip 1.4s ease-in infinite 1.05s" }}
      />
      {/* Wet sheen */}
      <path
        d="M110 280 Q160 270 210 278"
        stroke="white"
        strokeWidth={1.5}
        fill="none"
        opacity={0.15}
        strokeLinecap="round"
      />
      <path
        d="M200 300 Q260 292 320 298"
        stroke="white"
        strokeWidth={1}
        fill="none"
        opacity={0.12}
        strokeLinecap="round"
      />
    </g>

    {/* Waterless WAND */}
    <path
      d="M510 80 Q520 140 500 200 Q488 240 476 268"
      stroke="url(#hoseGrad)"
      strokeWidth={14}
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M512 84 Q521 142 501 201 Q489 241 477 269"
      stroke="#60A5FA"
      strokeWidth={4}
      fill="none"
      strokeLinecap="round"
      opacity={0.4}
    />
    <rect
      x="466"
      y="255"
      width="22"
      height="48"
      rx="8"
      fill="url(#nozzleGrad)"
      transform="rotate(-30 477 279)"
    />
    <rect
      x="471"
      y="272"
      width="14"
      height="6"
      rx="3"
      fill="#94A3B8"
      transform="rotate(-30 478 275)"
    />
    <ellipse
      cx="452"
      cy="240"
      rx="18"
      ry="9"
      fill="#475569"
      transform="rotate(-30 452 240)"
    />
    <ellipse
      cx="444"
      cy="234"
      rx="10"
      ry="5"
      fill="#64748B"
      transform="rotate(-30 444 234)"
    />
    <circle cx="440" cy="232" r="2.5" fill="#1E293B" />
    <circle cx="447" cy="229" r="2" fill="#1E293B" />

    {/* SPRAY LINES */}
    <g opacity={0.7}>
      <path
        className="spray-arc"
        d="M440 232 Q400 220 380 208"
        stroke="#3ECFCF"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        style={{
          strokeDasharray: 60,
          animation: "sprayArc 1.6s ease-in-out infinite",
        }}
      />
      <path
        d="M440 232 Q395 225 370 218"
        stroke="#B8DEFF"
        strokeWidth={1.5}
        fill="none"
        strokeLinecap="round"
        style={{
          strokeDasharray: 60,
          animation: "sprayArc 1.6s ease-in-out infinite 0.2s",
        }}
      />
      <path
        d="M440 232 Q405 215 388 200"
        stroke="#3ECFCF"
        strokeWidth={1.5}
        fill="none"
        strokeLinecap="round"
        style={{
          strokeDasharray: 60,
          animation: "sprayArc 1.6s ease-in-out infinite 0.5s",
        }}
      />
      <circle
        cx="410"
        cy="218"
        r="2.5"
        fill="#3ECFCF"
        opacity={0.6}
        style={{ animation: "drip 1.4s ease-in infinite" }}
      />
      <circle
        cx="395"
        cy="212"
        r="2"
        fill="white"
        opacity={0.5}
        style={{ animation: "drip 1.4s ease-in infinite 0.35s" }}
      />
      <circle
        cx="420"
        cy="210"
        r="1.8"
        fill="#B8DEFF"
        opacity={0.55}
        style={{ animation: "drip 1.4s ease-in infinite 0.7s" }}
      />
    </g>

    {/* Waterless PUFFS */}
    <g filter="url(#WaterlessBlur)">
      <circle
        cx="430"
        cy="220"
        r="28"
        fill="white"
        opacity={0}
        style={{ animation: "puff1 2.8s ease-in infinite" }}
      />
      <circle
        cx="415"
        cy="210"
        r="22"
        fill="#B8DEFF"
        opacity={0}
        style={{ animation: "puff2 3.3s ease-in infinite 0.9s" }}
      />
      <circle
        cx="445"
        cy="205"
        r="18"
        fill="white"
        opacity={0}
        style={{ animation: "puff3 2.5s ease-in infinite 1.7s" }}
      />
      <circle
        cx="405"
        cy="225"
        r="24"
        fill="#3ECFCF"
        opacity={0}
        style={{ animation: "puff1 3s ease-in infinite 0.4s" }}
      />
      <circle
        cx="460"
        cy="215"
        r="16"
        fill="white"
        opacity={0}
        style={{ animation: "puff2 2.7s ease-in infinite 1.3s" }}
      />
    </g>
    <g opacity={0.55}>
      <path
        d="M425 222 Q418 200 425 185 Q430 175 422 165"
        stroke="white"
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
        style={{ animation: "puff1 2.8s ease-in infinite" }}
      />
      <path
        d="M438 215 Q445 195 440 178 Q436 168 443 158"
        stroke="#B8DEFF"
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
        style={{ animation: "puff2 3.3s ease-in infinite 0.9s" }}
      />
      <path
        d="M412 228 Q405 210 410 196 Q414 185 407 174"
        stroke="white"
        strokeWidth={3.5}
        fill="none"
        strokeLinecap="round"
        style={{ animation: "puff3 2.5s ease-in infinite 1.7s" }}
      />
    </g>

    {/* SOAP BUBBLES */}
    <circle
      cx="330"
      cy="155"
      r="9"
      fill="none"
      stroke="#B8DEFF"
      strokeWidth={1.5}
      opacity={0.5}
      style={{ animation: "puff2 3.3s ease-in infinite 0.9s" }}
    />
    <circle
      cx="310"
      cy="135"
      r="6"
      fill="none"
      stroke="#3ECFCF"
      strokeWidth={1.2}
      opacity={0.4}
      style={{ animation: "puff3 2.5s ease-in infinite 1.7s" }}
    />
    <circle
      cx="355"
      cy="142"
      r="7"
      fill="none"
      stroke="white"
      strokeWidth={1.2}
      opacity={0.35}
      style={{ animation: "puff1 2.8s ease-in infinite" }}
    />
    <circle
      cx="345"
      cy="125"
      r="4.5"
      fill="none"
      stroke="#B8DEFF"
      strokeWidth={1}
      opacity={0.4}
      style={{ animation: "puff1 3s ease-in infinite 0.4s" }}
    />
    <circle
      cx="326"
      cy="151"
      r="2.5"
      fill="white"
      opacity={0.5}
      style={{ animation: "puff2 3.3s ease-in infinite 0.9s" }}
    />
    <circle
      cx="307"
      cy="131"
      r="1.8"
      fill="white"
      opacity={0.45}
      style={{ animation: "puff3 2.5s ease-in infinite 1.7s" }}
    />

    {/* ECO BADGE */}
    <g transform="translate(30, 50)">
      <rect
        width="130"
        height="44"
        rx="22"
        fill="rgba(62,207,207,0.18)"
        stroke="rgba(62,207,207,0.5)"
        strokeWidth={1.5}
      />
      <text
        x="12"
        y="28"
        fontFamily="DM Sans, sans-serif"
        fontSize={13}
        fontWeight={700}
        fill="#3ECFCF"
      >
        🌿 ECO SAFE
      </text>
    </g>
    {/* WATER SAVED BADGE */}
    <g transform="translate(390, 30)">
      <rect
        width="140"
        height="52"
        rx="14"
        fill="rgba(10,37,64,0.7)"
        stroke="rgba(41,121,216,0.4)"
        strokeWidth={1.5}
      />
      <text
        x="14"
        y="22"
        fontFamily="DM Sans, sans-serif"
        fontSize={11}
        fontWeight={600}
        fill="rgba(255,255,255,0.6)"
      >
        Water Saved
      </text>
      <text
        x="14"
        y="42"
        fontFamily="Playfair Display, serif"
        fontSize={20}
        fontWeight={900}
        fill="#3ECFCF"
      >
        95%
      </text>
    </g>
  </svg>
);

export default CarWashIllustration;
