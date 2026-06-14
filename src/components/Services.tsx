import React from "react";
import { useInView } from "../hooks";
import { SERVICES } from "../data";
import type { ServiceItem } from "../types";

const Services: React.FC = () => (
  <section
    id="services"
    style={{
      padding: "100px 5%",
      background: "linear-gradient(160deg, #0A2540 0%, #0F3875 100%)",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Background decoration */}
    <div
      style={{
        position: "absolute",
        top: -200,
        right: -200,
        width: 600,
        height: 600,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(62,207,207,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: -150,
        left: -150,
        width: 500,
        height: 500,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(41,121,216,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }}
    />

    <div style={{ position: "relative", zIndex: 2 }}>
      <div style={{ marginBottom: 56 }}>
        <div className="section-label" style={{ color: "#3ECFCF" }}>
          What We Offer
        </div>
        <h2 className="section-title" style={{ color: "#fff" }}>
          Our Services
        </h2>
        <p className="section-sub" style={{ color: "rgba(255,255,255,0.65)" }}>
          Professional doorstep wash for cars and bikes — high-pressure clean,
          right where you park.
        </p>
      </div>

      <ServicesGrid />
    </div>
  </section>
);

const ServicesGrid: React.FC = () => {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 24,
      }}
    >
      {SERVICES.map((svc, i) => (
        <ServiceCard key={i} service={svc} delay={i * 80} inView={inView} />
      ))}
    </div>
  );
};

const ServiceCard: React.FC<{
  service: ServiceItem;
  delay: number;
  inView: boolean;
}> = ({ service, delay, inView }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      className={`fade-up${inView ? " visible" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? "rgba(255,255,255,0.12)"
          : "rgba(255,255,255,0.06)",
        border: hovered
          ? "1px solid rgba(62,207,207,0.4)"
          : "1px solid rgba(255,255,255,0.1)",
        borderRadius: 16,
        padding: "32px 28px",
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.25)" : "none",
        transform: hovered ? "translateY(-6px)" : "none",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        transitionDelay: `${delay}ms`,
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "20%",
          bottom: "20%",
          width: 3,
          background: hovered
            ? "linear-gradient(180deg, #3ECFCF, #2979D8)"
            : "transparent",
          borderRadius: "0 4px 4px 0",
          transition: "all 0.35s ease",
        }}
      />

      {/* Icon */}
      <div
        style={{
          width: 56,
          height: 56,
          background: hovered
            ? "rgba(62,207,207,0.25)"
            : "rgba(255,255,255,0.1)",
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.6rem",
          marginBottom: 20,
          transition: "all 0.35s ease",
        }}
      >
        {service.icon}
      </div>

      <h3
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.1rem",
          fontWeight: 700,
          marginBottom: 10,
          color: "#fff",
        }}
      >
        {service.title}
      </h3>
      <p
        style={{
          fontSize: "0.87rem",
          lineHeight: 1.75,
          color: "rgba(255,255,255,0.65)",
        }}
      >
        {service.description}
      </p>
      <span
        style={{
          display: "inline-block",
          marginTop: 16,
          fontSize: "0.75rem",
          fontWeight: 600,
          color: "#3ECFCF",
          background: "rgba(62,207,207,0.15)",
          border: "1px solid rgba(62,207,207,0.3)",
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
