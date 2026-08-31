import React from "react";
import {
  Wallet,
  MapPinned,
  Sparkles,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import { useInView } from "../hooks";
import { SERVICE_AREAS } from "../data";

interface Reason {
  icon: LucideIcon;
  title: string;
  description: string;
}

const REASONS: Reason[] = [
  {
    icon: Wallet,
    title: "Honest, Pocket-Friendly Pricing",
    description:
      "Rates that undercut most typical doorstep and garage washes — no hidden charges, no upselling once we arrive. Every add-on price is shown upfront, before you book.",
  },
  {
    icon: MapPinned,
    title: "Doorstep Convenience, On Your Time",
    description:
      "No dropping the car off, no waiting around at a garage. We bring the pressure washer and detailing kit straight to where it's parked, on a schedule that fits your day.",
  },
  {
    icon: Sparkles,
    title: "End-to-End Detailing, Done Right",
    description:
      "Pressure exterior wash, interior deep clean, dashboard wipe-down, tyre & alloy dressing, using pH-balanced, vehicle-safe products — every inch gets the same care.",
  },
];

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
  .why-us-areas {
    margin-top: 40px;
    text-align: center;
  }
  .why-us-areas-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-top: 18px;
  }
  .why-us-area-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #fff;
    border: 1.5px solid rgba(41,121,216,0.18);
    color: #0A2540;
    font-size: 0.85rem;
    font-weight: 600;
    padding: 9px 18px;
    border-radius: 50px;
    transition: all 0.25s ease;
  }
  .why-us-area-chip:hover {
    border-color: #3ECFCF;
    background: rgba(62,207,207,0.08);
    transform: translateY(-2px);
  }
`;

const WhyChooseUs: React.FC = () => {
  const [gridRef, gridInView] = useInView<HTMLDivElement>();

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
      <div style={{ marginBottom: 56 }}>
        <div className="section-label">The Wash For U Difference</div>
        <h2 className="section-title">Why Wash For U?</h2>
        <p className="section-sub">
          Plenty of car washes will come to your door. Here's what actually
          changes when you book with us.
        </p>
      </div>

      <div ref={gridRef} className="why-us-grid">
        {REASONS.map((reason, i) => (
          <ReasonCard
            key={reason.title}
            reason={reason}
            delay={i * 70}
            inView={gridInView}
          />
        ))}
      </div>

      {/* Service Areas */}
      <div className="why-us-areas">
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
        <div className="why-us-areas-list">
          {SERVICE_AREAS.map((area) => (
            <span className="why-us-area-chip" key={area}>
              <MapPin size={14} strokeWidth={2.2} color="#2979D8" />
              {area}
            </span>
          ))}
        </div>
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

export default WhyChooseUs;
