import React, { useEffect } from "react";
import { useScrolled } from "../hooks";

const NAVBAR_CSS = `
  html {
    scroll-behavior: smooth;
    /* This ensures the scroll stops before hitting the sticky header */
    scroll-padding-top: 90px; 
  }
  .nav-container {
    height: 70px;
    padding: 0 5%;
  }
  .nav-links-list {
    gap: 36px;
  }
  .nav-brand-text {
    font-size: 1.25rem;
  }
  .nav-brand-icon {
    width: 42px;
    height: 42px;
    font-size: 1.3rem;
  }
  /* Mobile Responsive Adjustments */
  @media (max-width: 768px) {
    html {
      scroll-padding-top: 80px;
    }
    .nav-container {
      padding: 0 4%;
    }
    .nav-links-list {
      gap: 12px;
    }
    .nav-link-desktop-only {
      display: none; 
    }
    .nav-book-btn {
      padding: 8px 18px !important;
      font-size: 0.85rem !important;
    }
    .nav-brand-text {
      font-size: 1.1rem !important;
    }
    .nav-brand-icon {
      width: 36px !important;
      height: 36px !important;
      font-size: 1.1rem !important;
    }
  }
`;

const Navbar: React.FC = () => {
  const scrolled = useScrolled(40);

  useEffect(() => {
    const id = "navbar-responsive-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = NAVBAR_CSS;
    document.head.appendChild(style);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="nav-container"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(41,121,216,0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: scrolled
          ? "0 4px 24px rgba(10,37,64,0.14)"
          : "0 2px 12px rgba(10,37,64,0.08)",
        transition: "box-shadow 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          className="nav-brand-icon"
          style={{
            background: "linear-gradient(135deg, #2979D8, #3ECFCF)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          💧
        </div>
        <span
          className="nav-brand-text"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            color: "#0A2540",
          }}
        >
          Wash For <span style={{ color: "#2979D8" }}>You</span>
        </span>
      </div>

      {/* Links */}
      <NavLinks scrollTo={scrollTo} />
    </nav>
  );
};

const NavLinks: React.FC<{ scrollTo: (id: string) => void }> = ({
  scrollTo,
}) => {
  const links = [
    { label: "Our Story", id: "history" },
    { label: "Services", id: "services" },
    { label: "Pricing", id: "pricing" },
  ];

  return (
    <ul
      className="nav-links-list"
      style={{ display: "flex", listStyle: "none", alignItems: "center" }}
    >
      {links.map((link) => (
        <li key={link.id} className="nav-link-desktop-only">
          <NavLink label={link.label} onClick={() => scrollTo(link.id)} />
        </li>
      ))}
      <li>
        <button
          className="nav-book-btn"
          /* Changed from 'contact' to 'booking-form' for precise mobile scrolling */
          onClick={() => scrollTo("booking-form")}
          style={{
            background: "linear-gradient(135deg, #2979D8, #1A4F8A)",
            color: "#fff",
            padding: "9px 22px",
            borderRadius: 50,
            fontWeight: 600,
            fontSize: "0.9rem",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(41,121,216,0.35)",
            fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform =
              "translateY(-2px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 8px 24px rgba(41,121,216,0.45)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform =
              "translateY(0)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 4px 16px rgba(41,121,216,0.35)";
          }}
        >
          Book Now
        </button>
      </li>
    </ul>
  );
};

const NavLink: React.FC<{ label: string; onClick: () => void }> = ({
  label,
  onClick,
}) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.9rem",
        fontWeight: 500,
        color: hovered ? "#2979D8" : "#4A6FA5",
        padding: "2px 0",
        borderBottom: hovered ? "2px solid #2979D8" : "2px solid transparent",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </button>
  );
};

export default Navbar;
