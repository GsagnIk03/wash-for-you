import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

// Shared header for standalone pages (Gallery, Our Story) reached via routing —
// keeps a consistent "back to home" pattern instead of relying on scroll anchors.
const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => (
  <div
    style={{
      background: "linear-gradient(160deg, #0A2540 0%, #0F3875 100%)",
      padding: "132px 5% 56px",
      boxSizing: "border-box",
    }}
  >
    <Link
      to="/"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        color: "#3ECFCF",
        fontSize: "0.85rem",
        fontWeight: 600,
        marginBottom: 20,
        textDecoration: "none",
      }}
    >
      <ArrowLeft size={16} strokeWidth={2.3} />
      Back to Home
    </Link>
    <h1
      style={{
        fontFamily: "'Sora', sans-serif",
        fontSize: "clamp(1.9rem, 3.5vw, 2.6rem)",
        fontWeight: 700,
        letterSpacing: "-0.01em",
        color: "#fff",
        marginBottom: 12,
      }}
    >
      {title}
    </h1>
    <p
      style={{
        fontSize: "1rem",
        lineHeight: 1.7,
        color: "rgba(255,255,255,0.65)",
        maxWidth: 560,
      }}
    >
      {subtitle}
    </p>
  </div>
);

export default PageHeader;
