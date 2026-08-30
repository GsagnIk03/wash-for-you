import React, { useEffect } from "react";
import { CalendarCheck, ArrowRight, Check } from "lucide-react";
import heroBg from "../assets/hero-bg.jpg";

const HERO_CSS = `
  .hero-bg-photo {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 60% 38%;
    filter: blur(2px) saturate(1.05) brightness(0.62);
    transform: scale(1.05);
  }
  .hero-bg-scrim {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(100deg, rgba(6,20,38,0.96) 0%, rgba(8,27,50,0.9) 32%, rgba(10,37,64,0.62) 58%, rgba(10,37,64,0.38) 100%),
      linear-gradient(0deg, rgba(6,20,38,0.55) 0%, transparent 30%);
  }
  @media (min-width: 601px) and (max-width: 1024px) {
    .hero-section { padding: 120px 5% 80px !important; }
    .hero-content {
      max-width: 68% !important;
    }
  }
  @media (max-width: 600px) {
    .hero-section { padding: 108px 5% 64px !important; }
    .hero-content { max-width: 100% !important; }
    .hero-cta-row { flex-direction: column !important; }
    .hero-cta-row button, .hero-cta-row a {
      width: 100% !important;
      justify-content: center !important;
      box-sizing: border-box !important;
    }
    .hero-trust { gap: 16px 22px !important; margin-top: 22px !important; padding-top: 18px !important; }
    .hero-bg-photo { object-position: 72% 38%; }
  }
`;

interface HeroProps {
  onOpenBooking: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const scrollTo = (id: string) => {
    history.replaceState(null, "", `#${id}`);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

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
        display: "flex",
        alignItems: "center",
        padding: "132px 5% 80px",
        position: "relative",
        overflow: "hidden",
        background: "#0A2540",
      }}
    >
      <img src={heroBg} alt="" className="hero-bg-photo" aria-hidden="true" />
      <div className="hero-bg-scrim" aria-hidden="true" />

      {/* Content */}
      <div
        className="hero-content"
        style={{
          maxWidth: 560,
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(62,207,207,0.16)",
            border: "1px solid rgba(62,207,207,0.4)",
            color: "#3ECFCF",
            fontSize: "0.76rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "7px 16px",
            borderRadius: 50,
            marginBottom: 22,
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          Kolkata&apos;s Doorstep Car &amp; Bike Wash
        </div>

        <h1
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            color: "#fff",
            marginBottom: 18,
          }}
        >
          Skip the queue,
          <br />
          <span style={{ color: "#3ECFCF" }}>we come to you.</span>
        </h1>

        <p
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "1.15rem",
            fontWeight: 600,
            lineHeight: 1.55,
            color: "rgba(255,255,255,0.94)",
            marginBottom: 32,
            maxWidth: 480,
          }}
        >
          Premium car wash at your doorstep, starting at just ₹299.
        </p>

        <div
          className="hero-cta-row"
          style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
        >
          <HeroButton primary onClick={onOpenBooking}>
            <CalendarCheck size={17} strokeWidth={2.3} />
            Book a Service
          </HeroButton>
          <HeroButton onClick={() => scrollTo("pricing")}>
            View Pricing
            <ArrowRight size={16} strokeWidth={2.3} />
          </HeroButton>
        </div>

        {/* Trust strip — replaces the old numeric stats row */}
        <div
          className="hero-trust"
          style={{
            display: "flex",
            gap: "12px 28px",
            flexWrap: "wrap",
            marginTop: 36,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          {[
            "No pickup or drop-off",
            "Cars & bikes",
            "Serving South Kolkata",
          ].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Check size={15} strokeWidth={2.6} color="#3ECFCF" />
              <span
                style={{
                  fontSize: "0.84rem",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.8)",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HeroButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
}> = ({ children, onClick, primary }) => {
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
        fontWeight: 600,
        fontSize: "0.95rem",
        padding: primary ? "15px 30px" : "13px 28px",
        borderRadius: 50,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        cursor: "pointer",
        fontFamily: "'Inter', sans-serif",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {children}
    </button>
  );
};

export default Hero;
