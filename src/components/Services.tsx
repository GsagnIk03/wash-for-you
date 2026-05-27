import React from "react";
import { useInView } from "../hooks";
import { SERVICES } from "../data";
import type { ServiceItem } from "../types";

const Services: React.FC = () => (
  <section
    id="services"
    style={{
      padding: "100px 5%",
      background: "#F3F8FF",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Background glow */}
    <div
      style={{
        position: "absolute",
        top: -200,
        right: -200,
        width: 600,
        height: 600,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(41,121,216,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }}
    />

    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        marginBottom: 56,
        flexWrap: "wrap",
        gap: 24,
      }}
    >
      <div>
        <div className="section-label">What We Offer</div>
        <h2 className="section-title">Our Services</h2>
        <p className="section-sub">
          Every service uses excellent waterless mechanism — minimal water,
          maximum cleanliness.
        </p>
      </div>
    </div>

    <div className="services-grid">
      {SERVICES.map((svc, i) => (
        <ServiceCard key={i} service={svc} delay={i * 80} />
      ))}
    </div>
  </section>
);

const ServiceCard: React.FC<{ service: ServiceItem; delay: number }> = ({
  service,
  delay,
}) => {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      ref={ref}
      className={`fade-up${inView ? " visible" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: "36px 28px",
        border: hovered
          ? "1px solid transparent"
          : "1px solid rgba(41,121,216,0.1)",
        boxShadow: hovered ? "0 20px 60px rgba(10,37,64,0.18)" : "none",
        transform: hovered ? "translateY(-8px)" : "none",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        transitionDelay: `${delay}ms`,
      }}
    >
      {/* Bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, #2979D8, #3ECFCF)",
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      />

      {/* Icon */}
      <div
        style={{
          width: 58,
          height: 58,
          background: hovered
            ? "linear-gradient(135deg, #2979D8, #1A4F8A)"
            : "#E8F1FB",
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.7rem",
          marginBottom: 22,
          transform: hovered ? "scale(1.1) rotate(-5deg)" : "none",
          transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {service.icon}
      </div>

      <h3
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.15rem",
          fontWeight: 700,
          marginBottom: 10,
          color: "#0A2540",
        }}
      >
        {service.title}
      </h3>
      <p style={{ fontSize: "0.88rem", lineHeight: 1.75, color: "#4A6FA5" }}>
        {service.description}
      </p>
      <span
        style={{
          display: "inline-block",
          marginTop: 16,
          fontSize: "0.75rem",
          fontWeight: 600,
          color: "#2979D8",
          background: "#E8F1FB",
          padding: "4px 12px",
          borderRadius: 50,
        }}
      >
        {service.tag}
      </span>
    </div>
  );
};

export default Services;