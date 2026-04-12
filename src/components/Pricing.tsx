import React, { useEffect, useState } from "react";
import { useInView } from "../hooks";
import { PRICING_PLANS } from "../data";
import type { PricingPlan } from "../types";

interface PricingProps {
  onSelectPlan: (planName: string) => void;
}

// const REVIEWS = [
//   {
//     name: "Arjun Mehta",
//     location: "Jadavpur",
//     rating: 5,
//     review: "Absolutely blown away! My car looks brand new without a drop of water. The team was punctual, professional, and thorough.",
//     avatar: "AM",
//     service: "Ultimate Spa",
//   },
//   {
//     name: "Priya Sengupta",
//     location: "Garia",
//     rating: 5,
//     review: "The waterless wash is genuinely impressive. No water wastage, no mess, and the finish is spotless.",
//     avatar: "PS",
//     service: "Interior Premium Deep Detailing",
//   },
//   {
//     name: "Rohit Das",
//     location: "Dhakuria",
//     rating: 5,
//     review: "Easy to book, on-time service, and amazing results. My SUV had stubborn dust and they got it looking showroom-fresh.",
//     avatar: "RD",
//     service: "Essential Clean",
//   },
// ];

const REVIEWS_CSS = `
  .reviews-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  @media (max-width: 1024px) {
    .reviews-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .pricing-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }
  @media (max-width: 600px) {
    .reviews-grid { grid-template-columns: 1fr !important; }
    .pricing-grid { grid-template-columns: 1fr !important; }
  }
`;

const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  useEffect(() => {
    const id = "pricing-responsive-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = REVIEWS_CSS;
    document.head.appendChild(style);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);

  return (
    <>
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
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 28,
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

      {/* ── Customer Reviews Section (Commented Out) ──
      <section
        id="reviews"
        style={{
          padding: "100px 5%",
          background: "linear-gradient(160deg, #0A2540 0%, #0F3875 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ marginBottom: 16, textAlign: "center" }}>
            <div className="section-label" style={{ color: "#3ECFCF", justifyContent: "center" }}>
              What Customers Say
            </div>
            <h2 className="section-title" style={{ color: "#fff", textAlign: "center" }}>
              Loved by Car Owners Across South Kolkata
            </h2>
          </div>

          <div className="reviews-grid">
            {REVIEWS.map((r, i) => (
              <ReviewCard key={i} review={r} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>
      */}
    </>
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
        padding: "40px 32px",
        border: plan.featured ? "none" : "2px solid #E8F1FB",
        background: plan.featured ? "linear-gradient(160deg, #0A2540, #1A4F8A)" : "#fff",
        color: plan.featured ? "#fff" : "#0A2540",
        transform: hovered ? "translateY(-6px)" : "none",
        boxShadow: hovered ? "0 20px 60px rgba(10,37,64,0.18)" : "none",
        transition: "all 0.35s ease",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700 }}>{plan.name}</div>
      <div style={{ fontSize: "3rem", fontWeight: 900, margin: "20px 0" }}>₹{plan.price}</div>
      <ul style={{ listStyle: "none", marginBottom: 30 }}>
        {plan.features.map((f, i) => (
          <li key={i} style={{ padding: "8px 0", fontSize: "0.9rem" }}>✓ {f}</li>
        ))}
      </ul>
      <button
        onClick={onSelect}
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 12,
          background: plan.featured ? "#3ECFCF" : (btnHovered ? "#2979D8" : "transparent"),
          color: plan.featured ? "#0A2540" : (btnHovered ? "#fff" : "#2979D8"),
          border: plan.featured ? "none" : "2px solid #2979D8",
          fontWeight: 700,
          cursor: "pointer",
          transition: "0.3s"
        }}
      >
        Book This Plan
      </button>
    </div>
  );
};

/* --- Review Card Component --- */
// const ReviewCard: React.FC<{ review: any; delay: number }> = ({ review, delay }) => {
//   return (
//     <div style={{ background: "rgba(255,255,255,0.07)", padding: 24, borderRadius: 18 }}>
//       <p style={{ color: "#fff", fontStyle: "italic" }}>"{review.review}"</p>
//       <div style={{ marginTop: 16, color: "#3ECFCF", fontWeight: 700 }}>{review.name}</div>
//     </div>
//   );
// };

export default Pricing;