import React from "react";
import { useInView } from "../hooks";
import { TIMELINE_ITEMS } from "../data";
import type { TimelineItem } from "../types";

const History: React.FC = () => (
  <section
    id="history"
    style={{
      padding: "100px 5%",
      background: "#F3F8FF",
      boxSizing: "border-box",
    }}
  >
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 60,
        alignItems: "center",
      }}
    >
      <HistoryCard />
      <Timeline />
    </div>
  </section>
);

const HistoryCard: React.FC = () => (
  <div style={{ position: "relative" }}>
    <div
      style={{
        background: "linear-gradient(135deg, #0A2540, #1A4F8A)",
        borderRadius: 24,
        padding: "48px 40px",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(10,37,64,0.18)",
      }}
    >
      {/* Watermark */}
      <div
        style={{
          position: "absolute",
          right: -10,
          bottom: -10,
          fontSize: "8rem",
          opacity: 0.08,
          pointerEvents: "none",
        }}
      >
        🚗
      </div>

      <div
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "4.5rem",
          fontWeight: 900,
          color: "#3ECFCF",
          lineHeight: 1,
          marginBottom: 12,
        }}
      >
        2026
      </div>

      <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 12 }}>
        When It All Began
      </h3>
      <p
        style={{
          fontSize: "0.95rem",
          lineHeight: 1.8,
          color: "rgba(255,255,255,0.75)",
        }}
      >
        Built on a simple promise — professional car and bike care that comes to
        you. We started operations across Jadavpur, Baghajatin, Garia, and
        Dhakuria, bringing quality doorstep washing closer to home.
      </p>
    </div>

    {/* Floating badge */}
    <div
      style={{
        position: "absolute",
        top: -20,
        right: -20,
        background: "#3ECFCF",
        color: "#0A2540",
        fontWeight: 800,
        fontSize: "0.85rem",
        padding: "12px 18px",
        borderRadius: 14,
        boxShadow: "0 8px 32px rgba(10,37,64,0.14)",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <span style={{ fontSize: "1.1rem" }}>📍</span>
      <span>Est. 2026</span>
      <span>Kolkata</span>
    </div>
  </div>
);

const Timeline: React.FC = () => (
  <div>
    <div className="section-label">Our Journey</div>
    <h2 className="section-title">
      A Story Built on
      <br />
      Trust & Consistency
    </h2>
    <p className="section-sub" style={{ marginBottom: 36 }}>
      We're a growing car and bike wash service in South Kolkata, focused on
      doing things right — professional equipment, punctual service, and
      consistent results.
    </p>
    {TIMELINE_ITEMS.map((item, i) => (
      <TimelineRow key={i} item={item} delay={i * 100} />
    ))}
  </div>
);

const TimelineRow: React.FC<{ item: TimelineItem; delay: number }> = ({
  item,
  delay,
}) => {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [dotHovered, setDotHovered] = React.useState(false);

  return (
    <div
      ref={ref}
      className={`fade-up${inView ? " visible" : ""}`}
      style={{
        display: "flex",
        gap: 20,
        marginBottom: 32,
        transitionDelay: `${delay}ms`,
      }}
    >
      <div
        onMouseEnter={() => setDotHovered(true)}
        onMouseLeave={() => setDotHovered(false)}
        style={{
          width: 44,
          height: 44,
          flexShrink: 0,
          background: dotHovered ? "#2979D8" : "#E8F1FB",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
          border: "2px solid rgba(41,121,216,0.2)",
          transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
          transform: dotHovered ? "scale(1.1)" : "scale(1)",
          cursor: "default",
        }}
      >
        {item.icon}
      </div>
      <div>
        <div
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#2979D8",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 4,
          }}
        >
          {item.year}
        </div>
        <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 4 }}>
          {item.title}
        </div>
        <div style={{ fontSize: "0.9rem", color: "#4A6FA5", lineHeight: 1.65 }}>
          {item.description}
        </div>
      </div>
    </div>
  );
};

export default History;
