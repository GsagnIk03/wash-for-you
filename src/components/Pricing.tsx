import React, { useEffect } from "react";
import { useInView } from "../hooks";
import { PRICING_PLANS, BIKE_PLAN } from "../data";
import type { PricingPlan } from "../types";

interface PricingProps {
  onSelectPlan: (planName: string) => void;
}

const PRICING_CSS = `
  .pricing-all-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    align-items: start;
  }
  @media (max-width: 1100px) {
    .pricing-all-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }
  @media (max-width: 600px) {
    .pricing-all-grid { grid-template-columns: 1fr !important; }
    .pricing-section { padding: 60px 5% !important; }
    .pricing-header-badge { white-space: normal !important; text-align: center !important; }
    .pricing-note { white-space: normal !important; }
    .subscription-callout { padding: 28px 20px !important; flex-direction: column !important; }
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

  const allPlans = [...PRICING_PLANS, BIKE_PLAN];

  return (
    <section
      id="pricing"
      className="pricing-section"
      style={{ padding: "100px 5%", background: "#fff" }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div className="section-label" style={{ justifyContent: "center" }}>
          Transparent Pricing
        </div>
        <h2 className="section-title" style={{ textAlign: "center" }}>
          Simple, Honest Rates
        </h2>
        <p
          className="section-sub"
          style={{ textAlign: "center", margin: "0 auto 16px" }}
        >
          No hidden charges. No upselling. Just premium professional wash at
          fair prices across South Kolkata.
        </p>
        {/* Discount badge */}
        <div
          className="pricing-header-badge"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "linear-gradient(135deg, #fff7ed, #fef3c7)",
            border: "1.5px solid #f59e0b",
            borderRadius: 50,
            padding: "8px 20px",
            marginTop: 12,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: "1rem" }}>🏷️</span>
          <span
            style={{ fontSize: "0.85rem", fontWeight: 700, color: "#92400e" }}
          >
            Launch Offer: 10% OFF on all plans — till 31 Dec 2026
          </span>
        </div>
      </div>

      {/* Water / electricity note */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <span
          className="pricing-note"
          style={{
            fontSize: "0.82rem",
            color: "#4A6FA5",
            background: "#F3F8FF",
            border: "1px solid #dbeafe",
            borderRadius: 8,
            padding: "6px 16px",
            display: "inline-block",
          }}
        >
          📌 For car wash plans — customer to provide water &amp; an electric
          point
        </span>
      </div>

      {/* All plans in one row */}
      <div className="pricing-all-grid">
        {allPlans.map((plan, i) => (
          <PricingCard
            key={i}
            plan={plan}
            delay={i * 80}
            onSelect={() => onSelectPlan(plan.name)}
          />
        ))}
      </div>

      {/* Subscription callout */}
      <SubscriptionCallout />
    </section>
  );
};

const SubscriptionCallout: React.FC = () => {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`fade-up subscription-callout${inView ? " visible" : ""}`}
      style={{
        marginTop: 64,
        background: "linear-gradient(135deg, #0A2540, #1A4F8A)",
        borderRadius: 20,
        padding: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -60,
          top: -60,
          width: 250,
          height: 250,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(62,207,207,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 2, flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "1.4rem" }}>🔄</span>
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.2rem",
              fontWeight: 800,
              color: "#fff",
              margin: 0,
            }}
          >
            Subscription Plans Available
          </h3>
        </div>
        <p
          style={{
            color: "rgba(255,255,255,0.72)",
            fontSize: "0.92rem",
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          Wash your car with us{" "}
          <strong style={{ color: "#3ECFCF" }}>3 times</strong>, and you'll be
          eligible for a custom subscription plan. We'll reach out with a
          personalised pricing offer. Call us to know more.
        </p>
      </div>

      <a
        href="tel:+919477588518"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          background: "#3ECFCF",
          color: "#0A2540",
          fontWeight: 700,
          fontSize: "0.92rem",
          padding: "13px 24px",
          borderRadius: 50,
          textDecoration: "none",
          whiteSpace: "nowrap",
          boxShadow: "0 8px 24px rgba(62,207,207,0.35)",
          flexShrink: 0,
          position: "relative",
          zIndex: 2,
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.transform =
            "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.transform =
            "translateY(0)";
        }}
      >
        📞 +91 94775 88518
      </a>
    </div>
  );
};

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
        padding: "32px 24px",
        border: plan.featured ? "none" : "2px solid #E8F1FB",
        background: plan.featured
          ? "linear-gradient(160deg, #0A2540, #1A4F8A)"
          : plan.isBike
            ? "linear-gradient(160deg, #f0fdf4, #dcfce7)"
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
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 10% OFF ribbon */}
      <div
        style={{
          position: "absolute",
          top: 14,
          right: -26,
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          color: "#fff",
          fontSize: "0.65rem",
          fontWeight: 800,
          padding: "4px 32px",
          transform: "rotate(35deg)",
          letterSpacing: "0.05em",
          boxShadow: "0 2px 8px rgba(245,158,11,0.4)",
        }}
      >
        10% OFF
      </div>

      {/* Bike badge */}
      {plan.isBike && (
        <>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(22,163,74,0.15)",
              border: "1px solid rgba(22,163,74,0.3)",
              borderRadius: 50,
              padding: "3px 10px",
              marginBottom: 8,
              width: "fit-content",
            }}
          >
            <span style={{ fontSize: "0.9rem" }}>🏍️</span>
            <span
              style={{ fontSize: "0.72rem", fontWeight: 700, color: "#16a34a" }}
            >
              Two-Wheeler
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 6,
              background: "#fefce8",
              border: "1px solid #fde047",
              borderRadius: 8,
              padding: "8px 10px",
              marginBottom: 10,
              fontSize: "0.72rem",
              color: "#854d0e",
              lineHeight: 1.45,
            }}
          >
            <span style={{ flexShrink: 0 }}>📍</span>
            <span>
              Standalone bike wash available{" "}
              <strong>within 2 km of Jadavpur only</strong>. Outside this area,
              bike wash is available only when combined with a car wash booking.
            </span>
          </div>
        </>
      )}

      {/* Plan name */}
      <div
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1rem",
          fontWeight: 700,
          lineHeight: 1.3,
          paddingRight: 20,
        }}
      >
        {plan.name}
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: "0.78rem",
          opacity: 0.7,
          marginTop: 6,
          marginBottom: 4,
          lineHeight: 1.4,
        }}
      >
        {plan.tagline}
      </div>

      {/* Price + strikethrough */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          margin: "16px 0 2px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            fontSize: "2.4rem",
            fontWeight: 900,
            letterSpacing: "-1px",
            color: plan.featured ? "#fff" : "#0A2540",
            lineHeight: 1,
          }}
        >
          ₹{plan.price}
        </div>
        <div
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: plan.featured ? "rgba(255,255,255,0.45)" : "#94a3b8",
            textDecoration: "line-through",
          }}
        >
          ₹{plan.originalPrice}
        </div>
      </div>
      <div
        style={{
          fontSize: "0.72rem",
          fontWeight: 600,
          color: plan.featured ? "#3ECFCF" : "#16a34a",
          marginBottom: plan.vehicleNote ? 4 : 14,
        }}
      >
        You save ₹{plan.originalPrice - plan.price}
      </div>

      {/* Vehicle note */}
      {plan.vehicleNote && (
        <div
          style={{
            fontSize: "0.7rem",
            opacity: 0.6,
            marginBottom: 14,
            fontStyle: "italic",
            lineHeight: 1.4,
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
          margin: "0 0 14px",
        }}
      />

      {/* Features */}
      <ul
        style={{ listStyle: "none", padding: 0, margin: "0 0 20px", flex: 1 }}
      >
        {plan.features.map((f, i) => (
          <li
            key={i}
            style={{
              padding: "4px 0",
              fontSize: "0.82rem",
              display: "flex",
              gap: 7,
              alignItems: "flex-start",
              lineHeight: 1.45,
            }}
          >
            <span
              style={{
                color: plan.featured
                  ? "#3ECFCF"
                  : plan.isBike
                    ? "#16a34a"
                    : "#2979D8",
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

      {/* CTA */}
      <button
        onClick={onSelect}
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
        style={{
          width: "100%",
          padding: "12px 0",
          borderRadius: 12,
          background: plan.featured
            ? "#3ECFCF"
            : plan.isBike
              ? btnHovered
                ? "#16a34a"
                : "transparent"
              : btnHovered
                ? "#2979D8"
                : "transparent",
          color: plan.featured
            ? "#0A2540"
            : plan.isBike
              ? btnHovered
                ? "#fff"
                : "#16a34a"
              : btnHovered
                ? "#fff"
                : "#2979D8",
          border: plan.featured
            ? "none"
            : plan.isBike
              ? "2px solid #16a34a"
              : "2px solid #2979D8",
          fontWeight: 700,
          fontSize: "0.88rem",
          cursor: "pointer",
          transition: "all 0.3s ease",
          marginTop: "auto",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        Book This Plan
      </button>
    </div>
  );
};

export default Pricing;
