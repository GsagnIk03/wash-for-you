import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, CalendarCheck } from "lucide-react";
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
    font-family: 'Inter', sans-serif;
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
    body { padding-bottom: calc(72px + env(safe-area-inset-bottom)); }
  }

  /* Sticky bottom "Book Your Wash" bar — mobile only */
  .mobile-sticky-cta { display: none; }
  @media (max-width: 768px) {
    .mobile-sticky-cta {
      display: flex;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 997;
      padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
      background: rgba(255,255,255,0.97);
      backdrop-filter: blur(10px);
      box-shadow: 0 -6px 24px rgba(10,37,64,0.16);
      box-sizing: border-box;
    }
    .mobile-sticky-cta button { width: 100%; }
  }
  @media (max-width: 375px) {
    .nav-container { height: 90px; padding: 0 3% 0 12px; }
    .nav-logo-img { height: 80px; }
  }
`;

interface NavLinkItem {
  label: string;
  id: string;
  route?: string; // if set, navigates to a dedicated page instead of scrolling
}

const NAV_LINKS: NavLinkItem[] = [
  { label: "Our Story", id: "history", route: "/history" },
  { label: "Services", id: "services" },
  { label: "Reviews", id: "reviews" },
  { label: "Gallery", id: "gallery", route: "/gallery" },
  { label: "Contact", id: "contact" },
];

interface NavbarProps {
  onOpenBooking: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const scrolled = useScrolled(40);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  const goTo = (link: NavLinkItem) => {
    setMenuOpen(false);
    if (link.route) {
      navigate(link.route);
      return;
    }
    if (location.pathname !== "/") {
      navigate(`/#${link.id}`);
      return;
    }
    history.replaceState(null, "", `#${link.id}`);
    setTimeout(() => {
      document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const scrollTo = (id: string) => goTo({ label: "", id });

  const goHome = () => {
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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
        <div className="nav-logo-wrapper" onClick={goHome}>
          <img src={logoImg} alt="Wash For U Logo" className="nav-logo-img" />
        </div>

        {/* Desktop nav */}
        <ul className="nav-desktop-links">
          {NAV_LINKS.map((link) => (
            <li key={link.id} className="nav-link-desktop-only">
              <NavLinkButton label={link.label} onClick={() => goTo(link)} />
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
                fontFamily: "'Inter', sans-serif",
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
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "linear-gradient(135deg, #3ECFCF, #2979D8)",
                color: "#0A2540",
                padding: "12px 26px",
                borderRadius: 50,
                fontWeight: 700,
                fontSize: "0.95rem",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(41,121,216,0.35)",
                fontFamily: "'Inter', sans-serif",
                transition: "transform 0.35s ease",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(-2px) scale(1.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(0) scale(1)";
              }}
            >
              <CalendarCheck size={16} strokeWidth={2.4} />
              Book Your Wash
            </button>
          </li>
        </ul>

        {/* Mobile right side: Hamburger (booking CTA lives in the sticky bottom bar) */}
        <div
          className="nav-hamburger"
          style={{ display: "none", alignItems: "center", gap: 8 }}
        >
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: menuOpen ? "#2979D8" : "#0A2540",
            }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      <div className={`nav-mobile-menu${menuOpen ? " open" : ""}`}>
        {NAV_LINKS.map((link) => (
          <button
            key={link.id}
            className="nav-mobile-link"
            onClick={() => goTo(link)}
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

      {/* Sticky bottom booking CTA — mobile only, stays visible while scrolling */}
      <div className="mobile-sticky-cta">
        <button
          className="nav-book-btn-mobile"
          onClick={() => onOpenBooking()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            background: "linear-gradient(135deg, #3ECFCF, #2979D8)",
            color: "#0A2540",
            padding: "14px 0",
            borderRadius: 50,
            fontWeight: 700,
            fontSize: "1rem",
            border: "none",
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
            boxShadow: "0 4px 16px rgba(41,121,216,0.35)",
          }}
        >
          <CalendarCheck size={17} strokeWidth={2.4} />
          Book Your Wash
        </button>
      </div>
    </>
  );
};

const NavLinkButton: React.FC<{ label: string; onClick: () => void }> = ({
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
        fontFamily: "'Inter', sans-serif",
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
