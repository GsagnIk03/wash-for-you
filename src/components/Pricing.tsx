import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Check,
  Bike,
  Phone,
  MapPin,
  Droplet,
  RefreshCw,
  Clock,
  ShoppingCart,
  Star,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import { useInView } from "../hooks";
import { useCart } from "../context/CartContext";
import { PRICING_PLANS, BIKE_PLAN } from "../data";
import type { PricingPlan, AddOnGroup, CartAddOnSelection } from "../types";

import bgRapid from "../assets/pricing/rapid.jpg";
import bgBasic from "../assets/pricing/basic.jpg";
import bgAdvance from "../assets/pricing/advance.jpg";
import bgPremium from "../assets/pricing/premium.jpg";
import bgBike from "../assets/pricing/bike.jpg";

const PRICING_BG_IMAGES: Record<string, string> = {
  rapid: bgRapid,
  basic: bgBasic,
  advance: bgAdvance,
  premium: bgPremium,
  bike: bgBike,
};

const PRICING_CSS = `
  .pricing-all-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
    align-items: start;
  }
  @media (max-width: 1300px) {
    .pricing-all-grid { grid-template-columns: repeat(3, 1fr) !important; }
  }
  @media (max-width: 900px) {
    .pricing-all-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }
  @media (max-width: 600px) {
    .pricing-all-grid { grid-template-columns: 1fr !important; }
    .pricing-section { padding: 60px 5% !important; }
    .pricing-note { white-space: normal !important; }
    .subscription-callout { padding: 28px 20px !important; flex-direction: column !important; }
  }
  .pricing-card-photo {
    position: relative;
    height: 180px;
    overflow: hidden;
    flex-shrink: 0;
  }
  .pricing-card-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 38%;
    filter: blur(1.5px) saturate(1.15) brightness(0.72);
    transform: scale(1.06);
    transition: transform 0.5s ease;
  }
  .pricing-card:hover .pricing-card-bg {
    transform: scale(1.12);
  }
  .pricing-card-scrim {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(6,18,34,0.1) 0%, rgba(7,20,38,0.5) 58%, #0A2540 100%);
  }
  .pricing-card-bg-full {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 30%;
    filter: blur(1px) saturate(1.15) brightness(0.62);
    transform: scale(1.05);
    transition: transform 0.5s ease;
  }
  .pricing-card:hover .pricing-card-bg-full {
    transform: scale(1.1);
  }
  .pricing-card-scrim-full {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(6, 16, 30, 0.42) 0%,
      rgba(6, 17, 32, 0.6) 22%,
      rgba(7, 20, 37, 0.78) 42%,
      rgba(8, 23, 43, 0.9) 62%,
      rgba(8, 23, 43, 0.95) 100%
    );
  }
  .addon-cta-btn {
    transition: filter 0.2s ease, transform 0.15s ease;
  }
  .addon-cta-btn:hover {
    filter: brightness(1.08);
  }
  .addon-cta-btn:active {
    transform: scale(0.98);
  }

  /* ── Swiggy/Zomato-style customization sheet ───────────────────────── */
  .addon-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(8, 22, 40, 0.55);
    backdrop-filter: blur(3px);
    z-index: 1600;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    animation: addonFadeIn 0.2s ease;
  }
  @keyframes addonFadeIn { from { opacity: 0; } to { opacity: 1; } }
  @media (min-width: 641px) {
    .addon-modal-overlay { align-items: center; padding: 20px; }
  }
  .addon-modal-sheet {
    background: #fff;
    width: 100%;
    max-width: 480px;
    max-height: 86vh;
    display: flex;
    flex-direction: column;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -12px 40px rgba(10, 37, 64, 0.3);
    animation: addonSheetUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  @keyframes addonSheetUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
  @media (min-width: 641px) {
    .addon-modal-sheet {
      border-radius: 20px;
      max-height: 80vh;
      animation: addonModalPop 0.22s ease;
    }
  }
  @keyframes addonModalPop {
    from { opacity: 0; transform: translateY(14px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .addon-modal-sheet-grip {
    width: 40px;
    height: 4px;
    border-radius: 3px;
    background: #E1EAF5;
    margin: 10px auto 0;
    flex-shrink: 0;
  }
  @media (min-width: 641px) {
    .addon-modal-sheet-grip { display: none; }
  }
  .addon-modal-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px 16px;
    border-bottom: 1px solid #EDF2FA;
    flex-shrink: 0;
  }
  .addon-modal-thumb {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    object-fit: cover;
    flex-shrink: 0;
  }
  .addon-modal-close {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #F3F8FF;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #4A6FA5;
    flex-shrink: 0;
  }
  .addon-modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 4px 20px 8px;
  }
  .addon-group {
    padding: 16px 0;
    border-bottom: 1px solid #F1F5FB;
  }
  .addon-group:last-of-type {
    border-bottom: none;
  }
  .addon-group-tag {
    font-size: 0.64rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 5px;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .addon-group-tag.required { background: #FEEDEE; color: #E5484D; }
  .addon-group-tag.optional { background: #EAF3FF; color: #2979D8; }
  .addon-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 2px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .addon-row-indicator {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    border: 2px solid #CBD9EB;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
    box-sizing: border-box;
  }
  .addon-row-indicator.radio { border-radius: 50%; }
  .addon-row-indicator.checkbox { border-radius: 6px; }
  .addon-row-indicator.checked {
    border-color: #27B5B5;
    background: #27B5B5;
  }
  .addon-row-indicator .radio-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #fff;
  }
  .addon-row-label {
    flex: 1;
    font-size: 0.88rem;
    color: #17293D;
    font-weight: 500;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
  }
  .addon-row-label-line {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
  }
  .addon-row-note {
    font-size: 0.71rem;
    font-weight: 400;
    color: #8598B3;
  }
  .addon-row-rec {
    font-size: 0.6rem;
    font-weight: 800;
    color: #fff;
    background: #27B5B5;
    padding: 2px 7px;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }
  .addon-row-price {
    font-size: 0.84rem;
    font-weight: 700;
    color: #0A2540;
    flex-shrink: 0;
  }
  .addon-modal-footer {
    padding: 14px 20px;
    border-top: 1px solid #EDF2FA;
    flex-shrink: 0;
  }
  .addon-modal-cta {
    width: 100%;
    padding: 15px 0;
    border-radius: 14px;
    background: #27B5B5;
    color: #fff;
    border: none;
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    transition: filter 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .addon-modal-cta:hover { filter: brightness(1.06); }
`;

const Pricing: React.FC = () => {
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

  const allPlans = [BIKE_PLAN, ...PRICING_PLANS];

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
      </div>

      {/* All plans in one row */}
      <div className="pricing-all-grid">
        {allPlans.map((plan, i) => (
          <PricingCard key={i} plan={plan} delay={i * 80} />
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
          <RefreshCw size={20} strokeWidth={2.2} color="#3ECFCF" />
          <h3
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "1.2rem",
              fontWeight: 700,
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
        <Phone size={16} strokeWidth={2.3} />
        +91 94775 88518
      </a>
    </div>
  );
};

const PricingCard: React.FC<{
  plan: PricingPlan;
  delay: number;
}> = ({ plan, delay }) => {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [hovered, setHovered] = React.useState(false);
  const [addOnModalOpen, setAddOnModalOpen] = React.useState(false);
  const cart = useCart();
  const bgImage = plan.bgImageKey
    ? PRICING_BG_IMAGES[plan.bgImageKey]
    : undefined;
  const hasAddOns = !!plan.addOnGroups && plan.addOnGroups.length > 0;

  // Every instance of this exact plan already sitting in the cart — drives
  // the "+1" quantity stepper below, so a customer booking for two vehicles
  // can add the same plan again instead of the button looking like a no-op.
  // Adding never opens the cart drawer — the stepper itself is the feedback,
  // so the customer stays put on the pricing page.
  const itemsForPlan = cart.items.filter((i) => i.planName === plan.name);
  const countInCart = itemsForPlan.length;

  // "-" / trash removes the most recently added instance of this plan —
  // mirrors a quantity stepper's decrement rather than clearing every one.
  const removeOneFromCart = () => {
    const last = itemsForPlan[itemsForPlan.length - 1];
    if (last) cart.removeItem(last.id);
  };

  // Plans with no add-on groups (Bike Wash today) have nothing to configure,
  // so they skip the customization sheet and go straight into the cart at
  // their flat price — same button handles the first add and every "+" after.
  const handleSimpleAddToCart = () => {
    cart.addItem({
      planName: plan.name,
      basePrice: plan.price,
      addOns: [],
      totalPrice: plan.price,
      estimatedTime: plan.estimatedTime,
    });
  };

  return (
    <div
      ref={ref}
      className={`fade-up pricing-card${inView ? " visible" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 20,
        padding: 0,
        border: plan.featured
          ? "2px solid #3ECFCF"
          : "1.5px solid rgba(255,255,255,0.1)",
        background: "#0A2540",
        color: "#fff",
        transform: hovered ? "translateY(-6px)" : "none",
        boxShadow: hovered
          ? "0 24px 60px rgba(10,37,64,0.4)"
          : plan.featured
            ? "0 10px 34px rgba(62,207,207,0.22)"
            : "0 6px 20px rgba(10,37,64,0.15)",
        transition: "transform 0.35s ease, box-shadow 0.35s ease",
        transitionDelay: `${delay}ms`,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {bgImage && plan.fullPhotoBg && (
        <>
          <img
            src={bgImage}
            alt=""
            aria-hidden="true"
            className="pricing-card-bg-full"
          />
          <div className="pricing-card-scrim-full" aria-hidden="true" />
        </>
      )}
      {bgImage && !plan.fullPhotoBg && (
        <div className="pricing-card-photo">
          <img
            src={bgImage}
            alt=""
            aria-hidden="true"
            className="pricing-card-bg"
          />
          <div className="pricing-card-scrim" aria-hidden="true" />
        </div>
      )}

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding:
            bgImage && !plan.fullPhotoBg ? "18px 24px 32px" : "32px 24px",
        }}
      >
        {/* Most Popular ribbon */}
        {plan.featured && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(62,207,207,0.16)",
              border: "1px solid rgba(62,207,207,0.4)",
              borderRadius: 50,
              padding: "3px 10px",
              marginBottom: 10,
              width: "fit-content",
            }}
          >
            <Star size={12} strokeWidth={2.4} color="#3ECFCF" fill="#3ECFCF" />
            <span
              style={{ fontSize: "0.7rem", fontWeight: 700, color: "#3ECFCF" }}
            >
              Most Popular
            </span>
          </div>
        )}

        {/* Customizable badge */}
        {hasAddOns && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 50,
              padding: "3px 10px",
              marginBottom: 10,
              width: "fit-content",
            }}
          >
            <ShoppingCart
              size={11}
              strokeWidth={2.4}
              color="rgba(255,255,255,0.8)"
            />
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                color: "rgba(255,255,255,0.8)",
              }}
            >
              Build Your Own
            </span>
          </div>
        )}

        {/* Bike badge + notice */}
        {plan.isBike && (
          <>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(62,207,207,0.14)",
                border: "1px solid rgba(62,207,207,0.35)",
                borderRadius: 50,
                padding: "3px 10px",
                marginBottom: 8,
                width: "fit-content",
              }}
            >
              <Bike size={13} strokeWidth={2.4} color="#3ECFCF" />
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "#3ECFCF",
                }}
              >
                Two-Wheeler
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 6,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 8,
                padding: "8px 10px",
                marginBottom: 10,
                fontSize: "0.72rem",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.45,
              }}
            >
              <MapPin
                size={14}
                strokeWidth={2.3}
                style={{ flexShrink: 0, marginTop: 1, color: "#3ECFCF" }}
              />
              <span>
                Standalone bike wash available{" "}
                <strong style={{ color: "#fff" }}>
                  within 2 km of Jadavpur only
                </strong>
                . Outside this area, bike wash is available only when combined
                with a car wash booking.
              </span>
            </div>
          </>
        )}

        {/* Plan name */}
        <div
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "1.05rem",
            fontWeight: 700,
            lineHeight: 1.3,
            color: "#fff",
          }}
        >
          {plan.name}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "0.78rem",
            lineHeight: 1.4,
            marginTop: 4,
            marginBottom: 16,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          {plan.tagline}
        </div>

        {/* Price row */}
        <div
          style={{ marginBottom: hasAddOns ? 4 : plan.suvSurcharge ? 4 : 16 }}
        >
          {hasAddOns && (
            <div
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
                marginBottom: 2,
              }}
            >
              Starting at
            </div>
          )}
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "2.2rem",
                fontWeight: 800,
                letterSpacing: "-1px",
                color: "#fff",
                lineHeight: 1,
              }}
            >
              ₹{plan.price}
            </span>
          </div>
        </div>

        {/* SUV/MUV surcharge note (plans without add-on groups) */}
        {!hasAddOns && plan.suvSurcharge && (
          <div style={{ marginBottom: 16 }}>
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              SUV/MUV: +₹{plan.suvSurcharge}
            </span>
          </div>
        )}

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.12)",
            marginBottom: 14,
          }}
        />

        {/* Features */}
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px" }}>
          {plan.features.map((f, i) => (
            <li
              key={i}
              style={{
                padding: "4px 0",
                fontSize: "0.82rem",
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                lineHeight: 1.5,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              <Check
                size={14}
                strokeWidth={3}
                style={{ color: "#3ECFCF", flexShrink: 0, marginTop: 2 }}
              />
              {f}
            </li>
          ))}
        </ul>

        {hasAddOns ? (
          <>
            <div style={{ flex: 1 }} />

            {plan.estimatedTime && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 10,
                }}
              >
                <Clock
                  size={13}
                  strokeWidth={2.3}
                  color="rgba(255,255,255,0.45)"
                />
                <span
                  style={{
                    fontSize: "0.71rem",
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  {plan.estimatedTime}
                </span>
              </div>
            )}

            {/* Water note */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 6,
                marginBottom: 14,
                padding: "8px 10px",
                background: "rgba(255,255,255,0.06)",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Droplet
                size={14}
                strokeWidth={2.2}
                style={{
                  flexShrink: 0,
                  marginTop: 1,
                  color: "rgba(255,255,255,0.5)",
                }}
              />
              <span
                style={{
                  fontSize: "0.71rem",
                  lineHeight: 1.5,
                  color: "rgba(255,255,255,0.5)",
                  fontStyle: "italic",
                }}
              >
                Customer to provide 3-4 buckets of water &amp; electric point.
                Also, remove valuable items before handling over the vehicle.
              </span>
            </div>

            {/* Opens the Swiggy/Zomato-style customization sheet — once at
                least one is in the cart, this collapses into an "In Cart"
                indicator plus a "+" that reopens the same sheet to configure
                (or just re-confirm) another one, e.g. for a second vehicle. */}
            {countInCart === 0 ? (
              <button
                type="button"
                className="addon-cta-btn"
                onClick={() => setAddOnModalOpen(true)}
                style={{
                  width: "100%",
                  padding: "12px 0",
                  borderRadius: 12,
                  background: "#3ECFCF",
                  color: "#0A2540",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.01em",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <ShoppingCart size={15} strokeWidth={2.3} />
                Customise &amp; Add to Cart
              </button>
            ) : (
              <InCartRow
                count={countInCart}
                onAddAnother={() => setAddOnModalOpen(true)}
                onRemoveOne={removeOneFromCart}
              />
            )}

            {addOnModalOpen && (
              <AddOnModal
                plan={plan}
                bgImage={bgImage}
                onClose={() => setAddOnModalOpen(false)}
              />
            )}
          </>
        ) : (
          <>
            <div style={{ flex: 1 }} />

            {plan.estimatedTime && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 10,
                }}
              >
                <Clock
                  size={13}
                  strokeWidth={2.3}
                  color="rgba(255,255,255,0.45)"
                />
                <span
                  style={{
                    fontSize: "0.71rem",
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  {plan.estimatedTime}
                </span>
              </div>
            )}

            {/* Water note */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 6,
                marginBottom: 14,
                padding: "8px 10px",
                background: "rgba(255,255,255,0.06)",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Droplet
                size={14}
                strokeWidth={2.2}
                style={{
                  flexShrink: 0,
                  marginTop: 1,
                  color: "rgba(255,255,255,0.5)",
                }}
              />
              <span
                style={{
                  fontSize: "0.71rem",
                  lineHeight: 1.5,
                  color: "rgba(255,255,255,0.5)",
                  fontStyle: "italic",
                }}
              >
                Customer to provide 3-4 buckets of water &amp; electric point.
                Also, remove valuable items before handling over the vehicle.
              </span>
            </div>

            {/* CTA — no add-on groups to configure, so the first click adds
                it outright; once it's in the cart this becomes the same
                "In Cart" + "+" pattern the customizable plans use above. */}
            {countInCart === 0 ? (
              <button
                type="button"
                className="addon-cta-btn"
                onClick={handleSimpleAddToCart}
                style={{
                  width: "100%",
                  padding: "12px 0",
                  borderRadius: 12,
                  background: "#3ECFCF",
                  color: "#0A2540",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.01em",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <ShoppingCart size={15} strokeWidth={2.3} />
                Add to Cart
              </button>
            ) : (
              <InCartRow
                count={countInCart}
                onAddAnother={handleSimpleAddToCart}
                onRemoveOne={removeOneFromCart}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Replaces a plan's CTA once at least one is already in the cart — confirms
// it's in, shows how many, and offers a "+" to add another for a second
// vehicle without losing track of what's already been added.
// Quantity-stepper style feedback once a plan is in the cart: a "+N" badge
// showing exactly how many of this plan are queued up, plus a delete button
// (removes the most recently added one) and the existing "add another"
// button — no drawer pops open, the customer just watches this row update.
const InCartRow: React.FC<{
  count: number;
  onAddAnother: () => void;
  onRemoveOne: () => void;
}> = ({ count, onAddAnother, onRemoveOne }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "12px 0",
        borderRadius: 12,
        background: "rgba(62,207,207,0.14)",
        border: "1.5px solid rgba(62,207,207,0.4)",
        color: "#3ECFCF",
        fontWeight: 700,
        fontSize: "0.85rem",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Check size={15} strokeWidth={2.8} />+{count} in cart
    </div>
    <button
      type="button"
      onClick={onRemoveOne}
      aria-label="Remove one from cart"
      title="Remove one from cart"
      style={{
        width: 46,
        height: 46,
        flexShrink: 0,
        borderRadius: 12,
        background: "rgba(220,53,69,0.12)",
        color: "#DC3545",
        border: "1.5px solid rgba(220,53,69,0.35)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Trash2 size={18} strokeWidth={2} />
    </button>
    <button
      type="button"
      className="addon-cta-btn"
      onClick={onAddAnother}
      aria-label="Add another"
      title="Add another"
      style={{
        width: 46,
        height: 46,
        flexShrink: 0,
        borderRadius: 12,
        background: "#3ECFCF",
        color: "#0A2540",
        border: "none",
        fontWeight: 800,
        fontSize: "1.2rem",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Plus size={20} strokeWidth={2.8} />
    </button>
  </div>
);

// ─── Swiggy/Zomato-style add-on customization sheet ─────────────────────────
// Opens as a bottom sheet on mobile and a centered modal on desktop. Rendered
// via a portal so it always overlays the full viewport, regardless of any
// transform set on ancestor cards (e.g. the hover lift on PricingCard).

const AddOnModal: React.FC<{
  plan: PricingPlan;
  bgImage?: string;
  onClose: () => void;
}> = ({ plan, bgImage, onClose }) => {
  const cart = useCart();
  const groups = plan.addOnGroups ?? [];

  const buildDefaults = (): Record<string, string[]> => {
    const init: Record<string, string[]> = {};
    groups.forEach((g) => {
      init[g.id] =
        g.selectionType === "single-required" ? [g.choices[0].id] : [];
    });
    return init;
  };

  const [selections, setSelections] =
    useState<Record<string, string[]>>(buildDefaults);

  // Close on Escape, and lock page scroll while the sheet is open.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleChoice = (group: AddOnGroup, choiceId: string) => {
    setSelections((prev) => {
      const current = prev[group.id] ?? [];
      if (group.selectionType === "single-required") {
        return { ...prev, [group.id]: [choiceId] };
      }
      if (group.selectionType === "single-optional") {
        return {
          ...prev,
          [group.id]: current[0] === choiceId ? [] : [choiceId],
        };
      }
      const has = current.includes(choiceId);
      return {
        ...prev,
        [group.id]: has
          ? current.filter((id) => id !== choiceId)
          : [...current, choiceId],
      };
    });
  };

  const selectNone = (group: AddOnGroup) => {
    setSelections((prev) => ({ ...prev, [group.id]: [] }));
  };

  const addOnsTotal = groups.reduce((sum, g) => {
    const chosen = selections[g.id] ?? [];
    return (
      sum +
      g.choices
        .filter((c) => chosen.includes(c.id))
        .reduce((s, c) => s + c.price, 0)
    );
  }, 0);
  const totalPrice = plan.price + addOnsTotal;

  const handleAddToCart = () => {
    const addOns: CartAddOnSelection[] = groups
      .map((g) => {
        const chosenIds = selections[g.id] ?? [];
        const chosenChoices = g.choices.filter((c) => chosenIds.includes(c.id));
        if (chosenChoices.length === 0) return null;
        return {
          groupId: g.id,
          groupTitle: g.title,
          choiceIds: chosenChoices.map((c) => c.id),
          choiceLabels: chosenChoices.map((c) => c.label),
          addedPrice: chosenChoices.reduce((s, c) => s + c.price, 0),
        } as CartAddOnSelection;
      })
      .filter((x): x is CartAddOnSelection => x !== null);

    cart.addItem({
      planName: plan.name,
      basePrice: plan.price,
      addOns,
      totalPrice,
      estimatedTime: plan.estimatedTime,
    });

    onClose();
  };

  const groupTagLabel = (g: AddOnGroup) => {
    if (g.selectionType === "single-required") return "Required";
    if (g.selectionType === "multi-optional") return "Select any";
    return "Select up to 1";
  };

  return createPortal(
    <div
      className="addon-modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="addon-modal-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={`Customise ${plan.name}`}
      >
        <div className="addon-modal-sheet-grip" />

        <div className="addon-modal-header">
          {bgImage && (
            <img
              src={bgImage}
              alt=""
              aria-hidden="true"
              className="addon-modal-thumb"
            />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                color: "#0A2540",
              }}
            >
              {plan.name}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#6E86A8", marginTop: 2 }}>
              Base price ₹{plan.price}
            </div>
          </div>
          <button
            type="button"
            className="addon-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} strokeWidth={2.3} />
          </button>
        </div>

        <div className="addon-modal-body">
          {groups.map((g) => {
            const chosen = selections[g.id] ?? [];
            const isMulti = g.selectionType === "multi-optional";
            const showNoneRow = g.selectionType === "single-optional";

            return (
              <div className="addon-group" key={g.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "'Sora', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        color: "#0A2540",
                      }}
                    >
                      {g.title}
                    </div>
                    {g.helperText && (
                      <div
                        style={{
                          fontSize: "0.72rem",
                          color: "#8598B3",
                          marginTop: 2,
                        }}
                      >
                        {g.helperText}
                      </div>
                    )}
                  </div>
                  <span
                    className={`addon-group-tag ${g.selectionType === "single-required" ? "required" : "optional"}`}
                  >
                    {groupTagLabel(g)}
                  </span>
                </div>

                {showNoneRow && (
                  <label className="addon-row" onClick={() => selectNone(g)}>
                    <span
                      className={`addon-row-indicator radio${chosen.length === 0 ? " checked" : ""}`}
                    >
                      {chosen.length === 0 && <span className="radio-dot" />}
                    </span>
                    <span
                      className="addon-row-label"
                      style={{ color: "#8598B3" }}
                    >
                      None, thanks
                    </span>
                  </label>
                )}

                {g.choices.map((c) => {
                  const isChecked = chosen.includes(c.id);
                  const shape = isMulti ? "checkbox" : "radio";
                  return (
                    <label
                      key={c.id}
                      className="addon-row"
                      onClick={() => toggleChoice(g, c.id)}
                    >
                      <span
                        className={`addon-row-indicator ${shape}${isChecked ? " checked" : ""}`}
                      >
                        {isChecked &&
                          (shape === "checkbox" ? (
                            <Check size={12} strokeWidth={3.2} color="#fff" />
                          ) : (
                            <span className="radio-dot" />
                          ))}
                      </span>
                      <span className="addon-row-label">
                        <span className="addon-row-label-line">
                          {c.label}
                          {c.recommended && (
                            <span className="addon-row-rec">Recommended</span>
                          )}
                        </span>
                        {c.note && (
                          <span className="addon-row-note">{c.note}</span>
                        )}
                      </span>
                      <span className="addon-row-price">
                        {c.price > 0 ? `+₹${c.price}` : "Free"}
                      </span>
                    </label>
                  );
                })}
              </div>
            );
          })}

          {plan.estimatedTime && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "12px 0 4px",
              }}
            >
              <Clock size={13} strokeWidth={2.3} color="#8598B3" />
              <span style={{ fontSize: "0.76rem", color: "#6E86A8" }}>
                {plan.estimatedTime}
              </span>
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 6,
              marginTop: 10,
              padding: "8px 10px",
              background: "#F3F8FF",
              borderRadius: 8,
              border: "1px solid #E8F1FB",
            }}
          >
            <Droplet
              size={14}
              strokeWidth={2.2}
              style={{ flexShrink: 0, marginTop: 1, color: "#8598B3" }}
            />
            <span
              style={{
                fontSize: "0.72rem",
                lineHeight: 1.5,
                color: "#6E86A8",
                fontStyle: "italic",
              }}
            >
              Customer to provide 3-4 buckets of water &amp; electric point.
              Also, remove valuable items before handling over the vehicle.
            </span>
          </div>
        </div>

        <div className="addon-modal-footer">
          <button
            type="button"
            className="addon-modal-cta"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={16} strokeWidth={2.3} />
            Add to Cart · ₹{totalPrice}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default Pricing;
