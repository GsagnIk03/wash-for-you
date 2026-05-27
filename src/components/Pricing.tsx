import React, { useEffect } from "react";
import { useInView } from "../hooks";
import { PRICING_PLANS } from "../data";
import type { PricingPlan } from "../types";

interface PricingProps {
  onSelectPlan: (planName: string) => void;
}

const PRICING_CSS = `
  @media (max-width: 1100px) {
    .pricing-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }
  @media (max-width: 600px) {
    .pricing-grid { grid-template-columns: 1fr !important; }
  }
`;

const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  useEffect(() => {
    const id = "pricing-responsive-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = PRICING_CSS;
    document.head.appendChild(style);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);

  return (
    <section id="pricing" style={{ padding: "100px 5%", background: "#fff" }}>
      <div style={{ marginBottom: 56 }}>
        <div className="section-label">Transparent Pricing</div>
        <h2 className="section-title">Simple, Honest Rates</h2>
        <p className="section-sub">
          No hidden charges. No upselling. Just premium eco-friendly waterless
          wash at fair prices across South Kolkata.
        </p>
      </div>

      <div
        className="pricing-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 24,
          alignItems: "start",
        }}
      >
        {PRICING_PLANS.map((plan, i) => (
          <PricingCard
            key={i}
            plan={plan}
            delay={i * 100}
            onSelect={() => onSelectPlan(plan.name)}
          />
        ))}
      </div>
    </section>
  );
};

/* --- Pricing Card Component --- */
const PricingCard: React.FC<{
  plan: PricingPlan;
  delay: number;
  onSelect: () => void;
}> = ({ plan, delay, onSelect }) => {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [hovered, setHovered] = React.useState(false);
  const [btnHovered, setBtnHovered] = React.useState(false);

  return (
    <div
      ref={ref}
      className={`fade-up${inView ? " visible" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 20,
        padding: "36px 28px",
        border: plan.featured ? "none" : "2px solid #E8F1FB",
        background: plan.featured
          ? "linear-gradient(160deg, #0A2540, #1A4F8A)"
          : "#fff",
        color: plan.featured ? "#fff" : "#0A2540",
        transform: hovered ? "translateY(-6px)" : "none",
        boxShadow: hovered
          ? "0 20px 60px rgba(10,37,64,0.18)"
          : plan.featured
          ? "0 8px 32px rgba(10,37,64,0.18)"
          : "none",
        transition: "all 0.35s ease",
        transitionDelay: `${delay}ms`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Plan name */}
      <div
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.1rem",
          fontWeight: 700,
          lineHeight: 1.3,
          minHeight: "2.8rem",
        }}
      >
        {plan.name}
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: "0.8rem",
          opacity: 0.7,
          marginTop: 6,
          minHeight: "2.4rem",
        }}
      >
        {plan.tagline}
      </div>

      {/* Price */}
      <div
        style={{
          fontSize: "2.6rem",
          fontWeight: 900,
          margin: "20px 0 4px",
          letterSpacing: "-1px",
        }}
      >
        ₹{plan.price}
      </div>

      {/* Vehicle note (if any) */}
      {plan.vehicleNote && (
        <div
          style={{
            fontSize: "0.72rem",
            opacity: 0.65,
            marginBottom: 16,
            fontStyle: "italic",
          }}
        >
          * {plan.vehicleNote}
        </div>
      )}

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: plan.featured
            ? "rgba(255,255,255,0.15)"
            : "rgba(10,37,64,0.08)",
          margin: "16px 0",
        }}
      />

      {/* Features list */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "0 0 24px",
          flex: 1,
        }}
      >
        {plan.features.map((f, i) => (
          <li
            key={i}
            style={{
              padding: "6px 0",
              fontSize: "0.85rem",
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
              opacity: plan.featured ? 1 : 0.85,
            }}
          >
            <span
              style={{
                color: plan.featured ? "#3ECFCF" : "#2979D8",
                fontWeight: 700,
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        onClick={onSelect}
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
        style={{
          width: "100%",
          padding: "13px 0",
          borderRadius: 12,
          background: plan.featured
            ? "#3ECFCF"
            : btnHovered
            ? "#2979D8"
            : "transparent",
          color: plan.featured
            ? "#0A2540"
            : btnHovered
            ? "#fff"
            : "#2979D8",
          border: plan.featured ? "none" : "2px solid #2979D8",
          fontWeight: 700,
          fontSize: "0.9rem",
          cursor: "pointer",
          transition: "all 0.3s ease",
          marginTop: "auto",
        }}
      >
        Book This Plan
      </button>
    </div>
  );
};

export default Pricing;