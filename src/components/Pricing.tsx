import React, { useEffect, useState } from "react";
import { useInView } from "../hooks";
import { PRICING_PLANS } from "../data";
import type { PricingPlan } from "../types";

interface PricingProps {
  onSelectPlan: (planName: string) => void;
}

const REVIEWS = [
  {
    name: "Arjun Mehta",
    location: "Jadavpur",
    rating: 5,
    review:
      "Absolutely blown away! My car looks brand new without a drop of water. The team was punctual, professional, and thorough. Will never go back to a traditional car wash.",
    avatar: "AM",
    service: "Ultimate Spa",
  },
  {
    name: "Priya Sengupta",
    location: "Garia",
    rating: 5,
    review:
      "The waterless wash is genuinely impressive. No water wastage, no mess, and the finish is spotless. Booked twice this month already — highly recommend the Premium Detail!",
    avatar: "PS",
    service: "Premium Detail",
  },
  {
    name: "Rohit Das",
    location: "Dhakuria",
    rating: 5,
    review:
      "Easy to book, on-time service, and amazing results. My SUV had stubborn dust and they got it looking showroom-fresh. Great value for money.",
    avatar: "RD",
    service: "Essential Clean",
  },
  {
    name: "Susmita Bose",
    location: "Baghajatin",
    rating: 5,
    review:
      "Love that it's 100% chemical-free. As someone who cares about the environment, Wash For You is the only car wash service I'll trust. Fantastic team!",
    avatar: "SB",
    service: "Ultimate Spa",
  },
  {
    name: "Debajyoti Roy",
    location: "Jadavpur",
    rating: 4,
    review:
      "Very professional service. The interior detailing was meticulous — every corner was cleaned. Booking via WhatsApp was super easy. Will definitely return.",
    avatar: "DR",
    service: "Premium Detail",
  },
  {
    name: "Ananya Chakraborty",
    location: "Garia",
    rating: 5,
    review:
      "I was skeptical about waterless washing but after seeing the results, I'm converted. Crystal clear windows, shiny exterior — all done in under an hour!",
    avatar: "AC",
    service: "Essential Clean",
  },
];

const REVIEWS_CSS = `
  .reviews-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  @media (min-width: 601px) and (max-width: 1024px) {
    .reviews-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    .pricing-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }
  @media (max-width: 600px) {
    .reviews-grid {
      grid-template-columns: 1fr !important;
    }
    .pricing-grid {
      grid-template-columns: 1fr !important;
    }
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
      {/* ── Pricing Section ── */}
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

      {/* ── Customer Reviews Section ── */}
      <section
        id="reviews"
        style={{
          padding: "100px 5%",
          background: "linear-gradient(160deg, #0A2540 0%, #0F3875 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            top: -150,
            right: -150,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(62,207,207,0.08) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 2 }}>
          {/* Header */}
          <div style={{ marginBottom: 16, textAlign: "center" }}>
            <div
              className="section-label"
              style={{ color: "#3ECFCF", justifyContent: "center" }}
            >
              What Customers Say
            </div>
            <h2
              className="section-title"
              style={{ color: "#fff", textAlign: "center" }}
            >
              Loved by Car Owners
              <br />
              Across South Kolkata
            </h2>
          </div>

          {/* Overall rating bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              marginBottom: 56,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 16,
                padding: "20px 36px",
                display: "flex",
                alignItems: "center",
                gap: 20,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "3.5rem",
                    fontWeight: 900,
                    color: "#fff",
                    lineHeight: 1,
                  }}
                >
                  4.9
                </div>
                <div
                  style={{
                    color: "#F5C518",
                    fontSize: "1.3rem",
                    letterSpacing: 2,
                  }}
                >
                  ★★★★★
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "0.8rem",
                    marginTop: 4,
                  }}
                >
                  Average Rating
                </div>
              </div>
              <div
                style={{
                  width: 1,
                  height: 60,
                  background: "rgba(255,255,255,0.15)",
                  margin: "0 8px",
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { stars: 5, pct: 91 },
                  { stars: 4, pct: 7 },
                  { stars: 3, pct: 2 },
                ].map(({ stars, pct }) => (
                  <div
                    key={stars}
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        color: "#F5C518",
                        fontSize: "0.8rem",
                        minWidth: 16,
                      }}
                    >
                      {stars}★
                    </span>
                    <div
                      style={{
                        width: 120,
                        height: 6,
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          background:
                            "linear-gradient(90deg, #3ECFCF, #2979D8)",
                          borderRadius: 3,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: "0.78rem",
                        minWidth: 28,
                      }}
                    >
                      {pct}%
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  width: 1,
                  height: 60,
                  background: "rgba(255,255,255,0.15)",
                  margin: "0 8px",
                }}
              />
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "2rem",
                    fontWeight: 900,
                    color: "#fff",
                    lineHeight: 1,
                  }}
                >
                  200+
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "0.8rem",
                    marginTop: 4,
                  }}
                >
                  Verified Reviews
                </div>
              </div>
            </div>
          </div>

          {/* Review cards */}
          <div className="reviews-grid">
            {REVIEWS.map((r, i) => (
              <ReviewCard key={i} review={r} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

/* ── Review Card ── */
const ReviewCard: React.FC<{ review: (typeof REVIEWS)[0]; delay: number }> = ({
  review,
  delay,
}) => {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      className={`fade-up${inView ? " visible" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? "rgba(255,255,255,0.11)"
          : "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 18,
        padding: "28px 24px",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        transitionDelay: `${delay}ms`,
        transform: hovered ? "translateY(-4px)" : "none",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Stars */}
      <div style={{ color: "#F5C518", fontSize: "1rem", letterSpacing: 2 }}>
        {"★".repeat(review.rating)}
        {review.rating < 5 && (
          <span style={{ color: "rgba(255,255,255,0.2)" }}>
            {"★".repeat(5 - review.rating)}
          </span>
        )}
      </div>

      {/* Quote */}
      <p
        style={{
          fontSize: "0.9rem",
          lineHeight: 1.7,
          color: "rgba(255,255,255,0.8)",
          fontStyle: "italic",
          flexGrow: 1,
        }}
      >
        "{review.review}"
      </p>

      {/* Service tag */}
      <div>
        <span
          style={{
            display: "inline-block",
            background: "rgba(62,207,207,0.15)",
            border: "1px solid rgba(62,207,207,0.3)",
            color: "#3ECFCF",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            padding: "3px 10px",
            borderRadius: 50,
            textTransform: "uppercase",
          }}
        >
          {review.service}
        </span>
      </div>

      {/* Author */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #2979D8, #3ECFCF)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "0.8rem",
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {review.avatar}
        </div>
        <div>
          <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.9rem" }}>
            {review.name}
          </div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem" }}>
            📍 {review.location}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Pricing Card ── */
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
        background: plan.featured
          ? "linear-gradient(160deg, #0A2540, #1A4F8A)"
          : "#fff",
        color: plan.featured ? "#fff" : "#0A2540",
        transform: plan.featured
          ? hovered
            ? "scale(1.04) translateY(-6px)"
            : "scale(1.04)"
          : hovered
            ? "translateY(-6px)"
            : "none",
        boxShadow:
          plan.featured || hovered ? "0 20px 60px rgba(10,37,64,0.18)" : "none",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        position: "relative",
        transitionDelay: `${delay}ms`,
      }}
    >
      {plan.featured && (
        <div
          style={{
            position: "absolute",
            top: -14,
            left: "50%",
            transform: "translateX(-50%)",
            background: "linear-gradient(90deg, #3ECFCF, #6FE0E0)",
            color: "#0A2540",
            fontSize: "0.75rem",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "5px 18px",
            borderRadius: 50,
            whiteSpace: "nowrap",
          }}
        >
          ⭐ Recommended
        </div>
      )}

      <div
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.3rem",
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        {plan.name}
      </div>
      <div
        style={{
          fontSize: "0.85rem",
          marginBottom: 24,
          color: plan.featured ? "rgba(255,255,255,0.6)" : "#4A6FA5",
        }}
      >
        {plan.tagline}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 4,
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 6 }}>
          ₹
        </span>
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "3rem",
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {plan.price.toLocaleString("en-IN")}
        </span>
      </div>
      <div
        style={{
          fontSize: "0.82rem",
          marginBottom: 28,
          color: plan.featured ? "rgba(255,255,255,0.55)" : "#4A6FA5",
        }}
      >
        {plan.vehicleNote}
      </div>

      <ul style={{ listStyle: "none", marginBottom: 32 }}>
        {plan.features.map((f, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: "0.9rem",
              padding: "7px 0",
              borderBottom: plan.featured
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid rgba(41,121,216,0.08)",
            }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                flexShrink: 0,
                background: plan.featured ? "rgba(62,207,207,0.25)" : "#E8F1FB",
                color: plan.featured ? "#3ECFCF" : "#2979D8",
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7rem",
                fontWeight: 800,
              }}
            >
              ✓
            </span>
            {f}
          </li>
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
          border: plan.featured
            ? "none"
            : `2px solid ${btnHovered ? "transparent" : "#2979D8"}`,
          background: plan.featured
            ? btnHovered
              ? "linear-gradient(135deg, #27B5B5, #1E9B9B)"
              : "linear-gradient(135deg, #3ECFCF, #27B5B5)"
            : btnHovered
              ? "#2979D8"
              : "transparent",
          color: plan.featured ? "#0A2540" : btnHovered ? "#fff" : "#2979D8",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.95rem",
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: plan.featured
            ? btnHovered
              ? "0 10px 28px rgba(62,207,207,0.5)"
              : "0 6px 20px rgba(62,207,207,0.35)"
            : "none",
          transform: plan.featured && btnHovered ? "translateY(-2px)" : "none",
          transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        Book This Plan
      </button>
    </div>
  );
};

export default Pricing;
