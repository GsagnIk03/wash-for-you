import React from "react";
import {
  Wallet,
  MapPinned,
  Sparkles,
  MapPin,
  ShieldCheck,
  ClipboardCheck,
  MessageCircle,
  PhoneCall,
  CarFront,
  Droplet,
  type LucideIcon,
} from "lucide-react";
import { useInView } from "../hooks";
import { SERVICE_AREAS } from "../data";

interface Reason {
  icon: LucideIcon;
  title: string;
  description: string;
}

// ─── 1. Why Wash For U ───────────────────────────────────────────
const REASONS: Reason[] = [
  {
    icon: ShieldCheck,
    title: "Scratch-Conscious Cleaning",
    description:
      "pH-neutral shampoo, a dedicated microfiber for every zone — paint, glass, wheels — and professional-grade equipment, so your car comes out clean without picking up a single new scratch.",
  },
  {
    icon: MapPinned,
    title: "Doorstep Convenience, On Your Time",
    description:
      "No dropping the car off, no waiting around at a local wash. We bring the pressure washer and detailing kit straight to where it's parked, on a schedule that fits your day.",
  },
  {
    icon: Sparkles,
    title: "Attention to Every Detail",
    description:
      "Exterior wash, interior deep clean, dashboard wipe-down, tyre & alloy dressing — every inch gets the same unhurried care, every single time.",
  },
  {
    icon: Wallet,
    title: "Transparent, Pocket-Friendly Pricing",
    description:
      "Fixed, upfront rates that undercut most typical doorstep and garage washes — no hidden charges, no upselling once we arrive.",
  },
];

// ─── 1b. Why we're different from a local car wash ──────────────
interface ComparisonRow {
  factor: string;
  traditional: string;
  washforu: string;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    factor: "Time required from you",
    traditional: "45–90 minutes of your day",
    washforu: "Zero — it runs while you're busy",
  },
  {
    factor: "Products used",
    traditional: "Often unknown, or harsh & alkaline",
    washforu: "pH-neutral, paint-safe",
  },
  {
    factor: "Paint safety",
    traditional: "Risk from shared, dirty equipment",
    washforu: "Dedicated microfiber + proper technique",
  },
  {
    factor: "Pricing",
    traditional: "Variable, often negotiated on the spot",
    washforu: "Fixed, package-based",
  },
  {
    factor: "Consistency",
    traditional: "Depends on who's working that day",
    washforu: "The same defined process, every time",
  },
  {
    factor: "Flexibility",
    traditional: "Their location, their hours",
    washforu: "Your spot, your time slot",
  },
];

// ─── 2. How It Works ──────────────────────────────────────────────
interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

const HOW_IT_WORKS_STEPS: Step[] = [
  {
    icon: ClipboardCheck,
    title: "Service Booked",
    description:
      "You pick a plan, add any extras, and confirm your preferred date, time and location.",
  },
  {
    icon: MessageCircle,
    title: "Technicians Notified",
    description:
      "Your booking lands with our technicians instantly over WhatsApp and email — nothing sits in a queue.",
  },
  {
    icon: PhoneCall,
    title: "Support Confirms",
    description:
      "Our support team calls to confirm the date, time and address before anyone heads out to you.",
  },
  {
    icon: CarFront,
    title: "Technician Arrives",
    description:
      "Your assigned technician reaches your doorstep at the scheduled slot, fully equipped.",
  },
  {
    icon: Droplet,
    title: "Water & Power Check",
    description:
      "They ask for a water source and an electrical point, and check it themselves — one less thing for you to arrange or explain.",
  },
  {
    icon: Sparkles,
    title: "Service Delivered",
    description:
      "The full wash is carried out exactly as booked, right where your vehicle is parked. Enjoy the shine.",
  },
];

// ─── 3. Service Areas — stylized map ──────────────────────────────
// Laid out as a two-column "route map": every area gets a slot computed
// purely from its position in SERVICE_AREAS, so the map scales cleanly to
// any number of neighbourhoods (today 18) without needing a hand-placed
// coordinate per name, and never overlaps or falls back to a crammed row.
const MAP_VIEWBOX_WIDTH = 640;
const MAP_COL_OFFSET = 135; // distance of each column from horizontal center
const MAP_ROW_HEIGHT = 46;
const MAP_TOP_PAD = 46;
const MAP_BOTTOM_PAD = 40;

interface AreaPin {
  name: string;
  x: number;
  y: number;
  side: "left" | "right";
}

function layoutAreaPins(areas: string[]): {
  pins: AreaPin[];
  viewBoxHeight: number;
} {
  const centerX = MAP_VIEWBOX_WIDTH / 2;
  const rows = Math.ceil(areas.length / 2);
  const pins: AreaPin[] = areas.map((name, i) => {
    const side: "left" | "right" = i % 2 === 0 ? "left" : "right";
    const row = Math.floor(i / 2);
    return {
      name,
      x: side === "left" ? centerX - MAP_COL_OFFSET : centerX + MAP_COL_OFFSET,
      y: MAP_TOP_PAD + row * MAP_ROW_HEIGHT,
      side,
    };
  });
  const viewBoxHeight = MAP_TOP_PAD + rows * MAP_ROW_HEIGHT + MAP_BOTTOM_PAD;
  return { pins, viewBoxHeight };
}

const WHY_US_CSS = `
  .why-us-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 22px; }
  .why-us-card {
    background: #fff;
    border: 1px solid rgba(41,121,216,0.1);
    border-radius: 16px;
    padding: 28px 26px;
    transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
  }
  .why-us-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 44px rgba(10,37,64,0.1);
    border-color: rgba(41,121,216,0.25);
  }
  .why-us-tagline {
    text-align: center;
    margin-top: 36px;
    font-family: 'Sora', sans-serif;
    font-size: 1.05rem;
    color: #1A4F8A;
  }
  .why-us-tagline strong { color: #2979D8; }
  .why-us-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(41,121,216,0.18), transparent);
    margin: 64px 0;
  }
  .why-us-compare-wrap {
    margin-top: 28px;
    border-radius: 16px;
    border: 1px solid rgba(41,121,216,0.12);
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    background: #fff;
  }
  .why-us-compare-table { width: 100%; min-width: 620px; border-collapse: collapse; }
  .why-us-compare-table th, .why-us-compare-table td {
    padding: 14px 22px;
    text-align: left;
    font-size: 0.88rem;
    line-height: 1.5;
  }
  .why-us-compare-table thead th {
    background: #0A2540;
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-weight: 700;
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .why-us-compare-table thead th:last-child { color: #3ECFCF; }
  .why-us-compare-table tbody tr:nth-child(even) { background: #F3F8FF; }
  .why-us-compare-table td:first-child { font-weight: 700; color: #0A2540; }
  .why-us-compare-table td:nth-child(2) { color: #6B7C93; }
  .why-us-compare-table td:nth-child(3) { color: #1A4F8A; font-weight: 600; }
  .how-it-works-steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 30px 22px;
    margin-top: 46px;
  }
  .how-it-works-step {
    position: relative;
    background: #fff;
    border: 1px solid rgba(41,121,216,0.1);
    border-radius: 16px;
    padding: 30px 22px 24px;
    transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
  }
  .how-it-works-step:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 44px rgba(10,37,64,0.1);
    border-color: rgba(41,121,216,0.25);
  }
  .how-it-works-step-num {
    position: absolute;
    top: -16px;
    left: 22px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #2979D8;
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-weight: 700;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 16px rgba(41,121,216,0.35);
  }
  .why-us-areas {
    text-align: center;
  }
  .service-map-wrap {
    max-width: 620px;
    margin: 40px auto 0;
  }
  .service-map-svg {
    width: 100%;
    height: auto;
    overflow: visible;
  }
  .service-map-pin-group {
    cursor: default;
    transform-box: fill-box;
    transform-origin: center;
    transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
  }
  .service-map-pin-group:hover {
    transform: scale(1.12);
  }
  .service-map-pin-group:hover .service-map-label {
    fill: #2979D8;
    font-weight: 800;
  }
  .service-map-pin-group:hover .service-map-pin-ring {
    stroke: #2979D8;
  }
  .service-map-pin-ping {
    animation: serviceMapPing 2.6s cubic-bezier(0.4,0,0.6,1) infinite;
    transform-box: fill-box;
    transform-origin: center;
  }
  @keyframes serviceMapPing {
    0% { transform: scale(1); opacity: 0.55; }
    75%, 100% { transform: scale(2.4); opacity: 0; }
  }
  .service-map-label {
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    font-weight: 700;
    fill: #17293D;
    transition: fill 0.2s ease, font-weight 0.2s ease;
  }
  .service-map-caption {
    margin-top: 22px;
    font-size: 0.88rem;
    color: #4A6FA5;
  }
  .service-map-caption strong { color: #2979D8; }
`;

const WhyChooseUs: React.FC = () => {
  const [gridRef, gridInView] = useInView<HTMLDivElement>();
  const [stepsRef, stepsInView] = useInView<HTMLDivElement>();

  React.useEffect(() => {
    const id = "why-us-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = WHY_US_CSS;
    document.head.appendChild(style);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);

  return (
    <section
      id="why-us"
      style={{ padding: "100px 5% 60px", background: "#F3F8FF" }}
    >
      {/* ═══════════════════ 1. Why Wash For U ═══════════════════ */}
      <div>
        <div className="section-label">The Wash For U Difference</div>
        <h2 className="section-title">Why Wash For U?</h2>
        <p className="section-sub">
          Plenty of car washes will come to your door. Here's what actually
          changes when you book with us.
        </p>

        <div ref={gridRef} className="why-us-grid" style={{ marginTop: 40 }}>
          {REASONS.map((reason, i) => (
            <ReasonCard
              key={reason.title}
              reason={reason}
              delay={i * 70}
              inView={gridInView}
            />
          ))}
        </div>

        <p className="why-us-tagline">
          Professional equipment. Proper cleaning process.{" "}
          <strong>Enjoy the shine.</strong>
        </p>

        {/* ─── Sub-section: how we differ from a local wash ─── */}
        <div style={{ marginTop: 64 }}>
          <div className="section-label">Old Way vs. Our Way</div>
          <h3
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#0A2540",
              margin: 0,
            }}
          >
            Why We're Different From Your Local Car Wash
          </h3>
          <p
            style={{
              fontSize: "0.95rem",
              color: "#4A6FA5",
              marginTop: 10,
              maxWidth: 640,
              lineHeight: 1.8,
            }}
          >
            The traditional car-wash model in India hasn't changed much — drive
            in, hand over the keys, wait around, and collect. The process is
            opaque, the products are a mystery, and the time cost is real.
            Doorstep service flips all of that.
          </p>

          <div className="why-us-compare-wrap">
            <table className="why-us-compare-table">
              <thead>
                <tr>
                  <th>Factor</th>
                  <th>Traditional Car Wash</th>
                  <th>Wash For U — Doorstep</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.factor}>
                    <td>{row.factor}</td>
                    <td>{row.traditional}</td>
                    <td>{row.washforu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="why-us-divider" />

      {/* ═══════════════════ 2. How It Works ═══════════════════ */}
      <div>
        <div className="section-label">The Process</div>
        <h2 className="section-title">How It Works</h2>
        <p className="section-sub">
          From the moment you hit book, to the moment your vehicle shines —
          here's exactly what happens next.
        </p>

        <div ref={stepsRef} className="how-it-works-steps">
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <StepCard
              key={step.title}
              step={step}
              index={i + 1}
              delay={i * 70}
              inView={stepsInView}
            />
          ))}
        </div>
      </div>

      <div className="why-us-divider" />

      {/* ═══════════════════ 3. Service Areas ═══════════════════ */}
      <div id="service-areas" className="why-us-areas">
        <div className="section-label" style={{ justifyContent: "center" }}>
          Where We Operate
        </div>
        <h3
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#0A2540",
            margin: 0,
          }}
        >
          Service Areas
        </h3>
        <p
          style={{
            fontSize: "0.95rem",
            color: "#4A6FA5",
            marginTop: 8,
            maxWidth: 520,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Currently taking doorstep bookings across these South Kolkata
          neighbourhoods.
        </p>
        <ServiceAreaMap areas={SERVICE_AREAS} />

        <p className="service-map-caption">
          <MapPin
            size={15}
            strokeWidth={2.4}
            color="#2979D8"
            style={{ verticalAlign: -2, marginRight: 4 }}
          />
          <strong>{SERVICE_AREAS.length} neighbourhoods</strong> across South
          Kolkata, and counting — not on the map? Ask us anyway, we're expanding
          every month.
        </p>

        {/* Plain-text list for screen readers / search crawlers — the map
            above is the visual, this is the accessible fallback. */}
        <span
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: "hidden",
            clip: "rect(0,0,0,0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        >
          Service areas: {SERVICE_AREAS.join(", ")}.
        </span>
      </div>
    </section>
  );
};

const ReasonCard: React.FC<{
  reason: Reason;
  delay: number;
  inView: boolean;
}> = ({ reason, delay, inView }) => {
  const Icon = reason.icon;
  return (
    <div
      className={`why-us-card fade-up${inView ? " visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background:
            "linear-gradient(135deg, rgba(62,207,207,0.15), rgba(41,121,216,0.12))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
        }}
      >
        <Icon size={23} strokeWidth={1.8} color="#2979D8" />
      </div>
      <h3
        style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: "1.05rem",
          fontWeight: 700,
          color: "#0A2540",
          marginBottom: 8,
        }}
      >
        {reason.title}
      </h3>
      <p style={{ fontSize: "0.87rem", lineHeight: 1.7, color: "#4A6FA5" }}>
        {reason.description}
      </p>
    </div>
  );
};

const StepCard: React.FC<{
  step: Step;
  index: number;
  delay: number;
  inView: boolean;
}> = ({ step, index, delay, inView }) => {
  const Icon = step.icon;
  return (
    <div
      className={`how-it-works-step fade-up${inView ? " visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="how-it-works-step-num">{index}</div>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background:
            "linear-gradient(135deg, rgba(62,207,207,0.15), rgba(41,121,216,0.12))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <Icon size={21} strokeWidth={1.8} color="#2979D8" />
      </div>
      <h3
        style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: "1rem",
          fontWeight: 700,
          color: "#0A2540",
          marginBottom: 8,
        }}
      >
        {step.title}
      </h3>
      <p style={{ fontSize: "0.86rem", lineHeight: 1.7, color: "#4A6FA5" }}>
        {step.description}
      </p>
    </div>
  );
};

// A stylized service-area "route map": a rounded coverage panel with a pin +
// always-visible label per neighbourhood, arranged as two clean columns down
// a central spine. The layout is computed from the area count (layoutAreaPins
// above), so it scales to any number of neighbourhoods without ever
// overlapping or needing per-name coordinates.
const ServiceAreaMap: React.FC<{ areas: string[] }> = ({ areas }) => {
  const { pins, viewBoxHeight } = layoutAreaPins(areas);
  const centerX = MAP_VIEWBOX_WIDTH / 2;
  const spineTop = MAP_TOP_PAD;
  const spineBottom = viewBoxHeight - MAP_BOTTOM_PAD + 10;
  const panelPad = 18;

  return (
    <div className="service-map-wrap">
      <svg
        className="service-map-svg"
        viewBox={`0 0 ${MAP_VIEWBOX_WIDTH} ${viewBoxHeight}`}
        role="img"
        aria-label={`Map of Wash For U service areas: ${areas.join(", ")}`}
      >
        <defs>
          <linearGradient id="serviceMapBlob" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(41,121,216,0.08)" />
            <stop offset="100%" stopColor="rgba(62,207,207,0.09)" />
          </linearGradient>
        </defs>

        {/* Rounded coverage panel behind the pins — sized to fit the list */}
        <rect
          x={panelPad}
          y={panelPad}
          width={MAP_VIEWBOX_WIDTH - panelPad * 2}
          height={viewBoxHeight - panelPad * 2}
          rx={28}
          fill="url(#serviceMapBlob)"
          stroke="rgba(41,121,216,0.16)"
          strokeWidth="1.5"
        />

        {/* Dashed central spine linking the two columns, like one running route */}
        <line
          x1={centerX}
          y1={spineTop}
          x2={centerX}
          y2={spineBottom}
          stroke="rgba(41,121,216,0.22)"
          strokeWidth="2"
          strokeDasharray="2 8"
          strokeLinecap="round"
        />

        {pins.map((pin) => (
          <g className="service-map-pin-group" key={pin.name}>
            {/* Connector from the pin in to the central spine */}
            <line
              x1={pin.x}
              y1={pin.y}
              x2={centerX}
              y2={pin.y}
              stroke="rgba(41,121,216,0.18)"
              strokeWidth="1.5"
            />
            {/* Pulsing halo */}
            <circle
              className="service-map-pin-ping"
              cx={pin.x}
              cy={pin.y}
              r={6}
              fill="#3ECFCF"
            />
            {/* Pin body */}
            <circle
              cx={pin.x}
              cy={pin.y}
              r={6}
              fill="#2979D8"
              stroke="#fff"
              strokeWidth="2"
            />
            <circle
              className="service-map-pin-ring"
              cx={pin.x}
              cy={pin.y}
              r={10}
              fill="none"
              stroke="rgba(41,121,216,0.4)"
              strokeWidth="1.5"
            />
            <text
              className="service-map-label"
              x={pin.side === "right" ? pin.x + 15 : pin.x - 15}
              y={pin.y + 5}
              textAnchor={pin.side === "right" ? "start" : "end"}
            >
              {pin.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default WhyChooseUs;
