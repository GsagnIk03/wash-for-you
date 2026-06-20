import React, { useEffect, useState } from "react";
import { useScrolled } from "../hooks";
import logoImg from "../logo_final.jpeg";

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
  .nav-logo-img:hover { opacity: 0.85; }

  /* Desktop links */
  .nav-desktop-links {
    display: flex;
    align-items: center;
    gap: 20px;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .nav-link-desktop-only { display: list-item; }

  /* Hamburger — hidden on desktop */
  .nav-hamburger { display: none; }

  /* Mobile menu drawer */
  .nav-mobile-menu {
    display: none;
    position: fixed;
    top: 90px;
    left: 0;
    right: 0;
    background: #fff;
    border-bottom: 1px solid rgba(41,121,216,0.12);
    box-shadow: 0 8px 32px rgba(10,37,64,0.12);
    z-index: 998;
    flex-direction: column;
    padding: 16px 5% 24px;
    gap: 4px;
    animation: slideDownMenu 0.25s cubic-bezier(0.4,0,0.2,1);
  }
  .nav-mobile-menu.open { display: flex; }

  @keyframes slideDownMenu {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .nav-mobile-link {
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    color: #0A2540;
    padding: 12px 0;
    text-align: left;
    border-bottom: 1px solid rgba(41,121,216,0.08);
    width: 100%;
    transition: color 0.2s ease;
  }
  .nav-mobile-link:last-child { border-bottom: none; }
  .nav-mobile-link:hover { color: #2979D8; }

  @media (max-width: 768px) {
    .nav-container { height: 90px; padding: 0 4% 0 16px; }
    .nav-logo-img { height: 85px; }
    .nav-desktop-links { display: none !important; }
    .nav-hamburger { display: flex !important; }
  }
  @media (max-width: 375px) {
    .nav-container { height: 90px; padding: 0 3% 0 12px; }
    .nav-logo-img { height: 80px; }
  }
`;

interface NavbarProps {
  onOpenBooking: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const scrolled = useScrolled(40);
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Close menu on scroll
  useEffect(() => {
    const handler = () => setMenuOpen(false);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    history.replaceState(null, "", `#${id}`);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const mobileLinks = [
    { label: "Our Story", id: "history" },
    { label: "Services", id: "services" },
    { label: "Gallery", id: "gallery" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <>
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
        {/* Logo */}
        <div
          className="nav-logo-wrapper"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img src={logoImg} alt="Wash For U Logo" className="nav-logo-img" />
        </div>

        {/* Desktop nav */}
        <ul className="nav-desktop-links">
          {[
            { label: "Our Story", id: "history" },
            { label: "Services", id: "services" },
            { label: "Gallery", id: "gallery" },
            { label: "Contact", id: "contact" },
          ].map((link) => (
            <li key={link.id} className="nav-link-desktop-only">
              <NavLink label={link.label} onClick={() => scrollTo(link.id)} />
            </li>
          ))}
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
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#2979D8";
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
                transition: "all 0.35s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(0)";
              }}
            >
              Book Now
            </button>
          </li>
        </ul>

        {/* Mobile right side: Book Now + Hamburger */}
        <div
          className="nav-hamburger"
          style={{ display: "none", alignItems: "center", gap: 8 }}
        >
          <button
            onClick={() => onOpenBooking()}
            style={{
              background: "linear-gradient(135deg, #2979D8, #1A4F8A)",
              color: "#fff",
              padding: "7px 16px",
              borderRadius: 50,
              fontWeight: 600,
              fontSize: "0.82rem",
              border: "none",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Book Now
          </button>
          {/* Hamburger icon */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              gap: 5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                display: "block",
                width: 22,
                height: 2,
                background: menuOpen ? "#2979D8" : "#0A2540",
                borderRadius: 2,
                transition: "all 0.25s ease",
                transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: 22,
                height: 2,
                background: menuOpen ? "#2979D8" : "#0A2540",
                borderRadius: 2,
                transition: "all 0.25s ease",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: "block",
                width: 22,
                height: 2,
                background: menuOpen ? "#2979D8" : "#0A2540",
                borderRadius: 2,
                transition: "all 0.25s ease",
                transform: menuOpen
                  ? "rotate(-45deg) translateY(-7px)"
                  : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      <div className={`nav-mobile-menu${menuOpen ? " open" : ""}`}>
        {mobileLinks.map((link) => (
          <button
            key={link.id}
            className="nav-mobile-link"
            onClick={() => scrollTo(link.id)}
          >
            {link.label}
          </button>
        ))}
        <button
          className="nav-mobile-link"
          onClick={() => scrollTo("pricing")}
          style={{ color: "#2979D8", fontWeight: 600 }}
        >
          Pricing
        </button>
      </div>
    </>
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
        transition: "all 0.3s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </button>
  );
};

export default Navbar;
