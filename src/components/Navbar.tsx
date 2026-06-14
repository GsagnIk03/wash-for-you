import React, { useEffect } from "react";
import { useScrolled } from "../hooks";
import logoImg from "../logo_final.png";

const NAVBAR_CSS = `
  html {
    scroll-behavior: smooth;
    scroll-padding-top: 90px;
  }

  .nav-container {
    height: 90px;
    padding: 0 5% 0 16px;
  }

  .nav-logo-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
    height: 100%;
    flex-shrink: 0;
    overflow: hidden;
  }

  .nav-logo-img {
    height: 88px;
    width: auto;
    object-fit: contain;
    object-position: left center;
    display: block;
    transition: opacity 0.25s ease;
  }

  .nav-logo-img:hover {
    opacity: 0.85;
  }

  .nav-links-list {
    gap: 36px;
  }

  @media (max-width: 1024px) {
    .nav-links-list { gap: 20px; }
  }

  @media (max-width: 768px) {
    .nav-container {
      height: 90px;
      padding: 0 4% 0 16px;
    }
    .nav-logo-img { height: 85px; }
    .nav-links-list { gap: 10px; }
    .nav-link-desktop-only { display: none; }
    .nav-book-btn {
      padding: 7px 16px !important;
      font-size: 0.82rem !important;
    }
    .nav-pricing-btn {
      padding: 7px 14px !important;
      font-size: 0.82rem !important;
    }
  }

  @media (max-width: 375px) {
    .nav-container {
      height: 90px;
      padding: 0 3% 0 16px;
    }
    .nav-logo-img { height: 85px; }
  }
`;

interface NavbarProps {
  onOpenBooking: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
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
        background: "#fff",
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
      <div
        className="nav-logo-wrapper"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <img src={logoImg} alt="Wash For U Logo" className="nav-logo-img" />
      </div>

      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <NavLinks scrollTo={scrollTo} onOpenBooking={onOpenBooking} />
      </div>
    </nav>
  );
};

const NavLinks: React.FC<{
  scrollTo: (id: string) => void;
  onOpenBooking: () => void;
}> = ({ scrollTo, onOpenBooking }) => {
  const links = [
    { label: "Our Story", id: "history" },
    { label: "Services", id: "services" },
  ];

  return (
    <ul
      className="nav-links-list"
      style={{
        display: "flex",
        listStyle: "none",
        alignItems: "center",
        margin: 0,
        padding: 0,
      }}
    >
      {links.map((link) => (
        <li key={link.id} className="nav-link-desktop-only">
          <NavLink label={link.label} onClick={() => scrollTo(link.id)} />
        </li>
      ))}
      {/* Pricing — always visible */}
      <li>
        <button
          className="nav-pricing-btn"
          onClick={() => scrollTo("pricing")}
          style={{
            background: "transparent",
            color: "#2979D8",
            padding: "9px 20px",
            borderRadius: 50,
            fontWeight: 600,
            fontSize: "0.9rem",
            border: "2px solid #2979D8",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#2979D8";
            (e.currentTarget as HTMLButtonElement).style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "#2979D8";
          }}
        >
          Pricing
        </button>
      </li>
      <li>
        <button
          className="nav-book-btn"
          onClick={() => onOpenBooking()}
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
