import React, { useEffect } from "react";
import CarWashIllustration from "./CarWashIllustration";

const HERO_CSS = `
  .hero-illustration {
    position: absolute;
    right: 4%;
    top: 50%;
    transform: translateY(-50%);
    width: 46%;
    max-width: 580px;
    z-index: 2;
    pointer-events: none;
    animation: heroFadeUp 1.1s 0.25s ease both;
  }
  @media (min-width: 601px) and (max-width: 1024px) {
    .hero-section { padding: 120px 5% 80px !important; }
    .hero-illustration {
      width: 42% !important;
      right: -2% !important;
      opacity: 0.5 !important;
    }
    .hero-content {
      max-width: 65% !important;
      position: relative !important;
      z-index: 5 !important;
    }
  }
  @media (max-width: 600px) {
    .hero-illustration { display: none !important; }
    .hero-section { padding: 100px 5% 64px !important; }
    .hero-content { max-width: 100% !important; }
    .hero-cta-row { flex-direction: column !important; }
    .hero-cta-row button {
      width: 100% !important;
      justify-content: center !important;
      box-sizing: border-box !important;
    }
    .hero-stats { gap: 24px !important; }
    .hero-promo-banner { font-size: 0.75rem !important; padding: 7px 14px !important; }
  }
`;

interface HeroProps {
  onOpenBooking: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const id = "hero-responsive-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = HERO_CSS;
    document.head.appendChild(style);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);

  return (
    <section
      className="hero-section"
      style={{
        minHeight: "100vh",
        background: `
          radial-gradient(ellipse 80% 60% at 70% 50%, rgba(41,121,216,0.18) 0%, transparent 65%),
          radial-gradient(ellipse 60% 80% at 10% 80%, rgba(62,207,207,0.12) 0%, transparent 55%),
          linear-gradient(160deg, #0A2540 0%, #0D3260 55%, #183F77 100%)
        `,
        display: "flex",
        alignItems: "center",
        padding: "120px 5% 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glows */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: 340,
          height: 340,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(62,207,207,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -80,
          left: "8%",
          width: 280,
          height: 280,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(41,121,216,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        className="hero-content"
        style={{
          maxWidth: 520,
          position: "relative",
          zIndex: 2,
          animation: "heroFadeUp 0.9s ease both",
        }}
      >
        {/* Promo Banner — in flow, not absolute */}
        <div
          className="hero-promo-banner"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "linear-gradient(90deg, #3ECFCF, #2979D8, #3ECFCF)",
            backgroundSize: "200% 100%",
            animation: "shimmer 3s linear infinite",
            borderRadius: 50,
            padding: "8px 18px",
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "0.03em",
            boxShadow: "0 4px 20px rgba(62,207,207,0.4)",
            marginBottom: 20,
            maxWidth: "100%",
            boxSizing: "border-box",
            flexWrap: "wrap",
          }}
        >
          🎉 10% OFF on all bookings — Limited offer till 31st December 2026!
        </div>

        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(62,207,207,0.18)",
            border: "1px solid rgba(62,207,207,0.4)",
            color: "#3ECFCF",
            fontSize: "0.78rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "6px 16px",
            borderRadius: 50,
            marginBottom: 24,
            maxWidth: "100%",
            boxSizing: "border-box",
            flexWrap: "wrap",
          }}
        >
          🚗 Kolkata's Premier Doorstep Car &amp; Bike Wash — Wash For U
        </div>

        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.6rem, 5.5vw, 4.2rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            color: "#fff",
            marginBottom: 24,
          }}
        >
          Professional.
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, #3ECFCF, #6FE0E0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Doorstep.
          </span>
          <br />
          Spotless Clean.
        </h1>

        <p
          style={{
            fontSize: "1.05rem",
            lineHeight: 1.75,
            color: "rgba(255,255,255,0.72)",
            marginBottom: 14,
            maxWidth: 480,
          }}
        >
          We bring high-pressure wash equipment to your home, delivering a deep,
          thorough clean for your car or bike — right where you park it.
        </p>

        <p
          style={{
            fontSize: "0.85rem",
            color: "rgba(62,207,207,0.9)",
            marginBottom: 36,
            fontWeight: 500,
          }}
        >
          📌 Customers provide water &amp; an electric point for our pressure
          washer.
        </p>

        <div
          className="hero-cta-row"
          style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
        >
          <HeroButton
            primary
            onClick={onOpenBooking}
            label="📅 Book a Service"
          />
          <HeroButton
            onClick={() => scrollTo("pricing")}
            label="View Pricing →"
          />
        </div>

        {/* Stats */}
        <div
          className="hero-stats"
          style={{ display: "flex", gap: 36, marginTop: 48, flexWrap: "wrap" }}
        >
          {[
            { num: "₹149", label: "Bike Wash Starts At" },
            { num: "₹299", label: "Car Wash Starts At" },
            { num: "10%", label: "Launch Discount" },
          ].map((s) => (
            <div key={s.label}>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.9rem",
                  fontWeight: 900,
                  color: "#fff",
                }}
              >
                {s.num}
              </div>
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "rgba(255,255,255,0.55)",
                  marginTop: 2,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SVG Illustration */}
      <div className="hero-illustration">
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "75%",
            height: 40,
            background:
              "radial-gradient(ellipse, rgba(62,207,207,0.35) 0%, transparent 70%)",
            filter: "blur(12px)",
            borderRadius: "50%",
            animation: "glowPulse 3s ease-in-out infinite",
          }}
        />
        <CarWashIllustration />
      </div>
    </section>
  );
};

const HeroButton: React.FC<{
  label: string;
  onClick: () => void;
  primary?: boolean;
}> = ({ label, onClick, primary }) => {
  const [hovered, setHovered] = React.useState(false);

  const baseStyle: React.CSSProperties = primary
    ? {
        background: hovered
          ? "linear-gradient(135deg, #27B5B5, #1E9B9B)"
          : "linear-gradient(135deg, #3ECFCF, #27B5B5)",
        color: "#0A2540",
        boxShadow: hovered
          ? "0 14px 36px rgba(62,207,207,0.5)"
          : "0 8px 28px rgba(62,207,207,0.4)",
        transform: hovered ? "translateY(-3px)" : "none",
        border: "none",
      }
    : {
        border: `2px solid ${hovered ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)"}`,
        background: hovered ? "rgba(255,255,255,0.1)" : "transparent",
        color: "#fff",
      };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...baseStyle,
        fontWeight: 700,
        fontSize: "0.95rem",
        padding: primary ? "15px 32px" : "13px 30px",
        borderRadius: 50,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {label}
    </button>
  );
};

export default Hero;
