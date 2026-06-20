import React, { useEffect } from "react";

const INSTAGRAM_URL = "https://www.instagram.com/wash_for_u";
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61590411313790";

const FOOTER_CSS = `
  @media (max-width: 600px) {
    .footer-top { flex-direction: column !important; align-items: flex-start !important; }
    .footer-links { gap: 14px !important; }
  }
`;

const Footer: React.FC = () => {
  useEffect(() => {
    const id = "footer-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = FOOTER_CSS;
    document.head.appendChild(style);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);
  const scrollTo = (id: string) => {
    history.replaceState(null, "", `#${id}`);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const links = [
    { label: "Our Story", id: "history" },
    { label: "Services", id: "services" },
    { label: "Pricing", id: "pricing" },
    { label: "Gallery", id: "gallery" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <footer
      style={{
        background: "#0A2540",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "40px 5%",
        boxSizing: "border-box",
      }}
    >
      <div
        className="footer-top"
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 20,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#fff",
          }}
        >
          Wash For <span style={{ color: "#3ECFCF" }}>U</span> — Kolkata
        </div>

        <ul
          className="footer-links"
          style={{
            display: "flex",
            gap: 20,
            listStyle: "none",
            flexWrap: "wrap",
            margin: 0,
            padding: 0,
            alignItems: "center",
          }}
        >
          {links.map((l) => (
            <li key={l.id}>
              <FooterLink label={l.label} onClick={() => scrollTo(l.id)} />
            </li>
          ))}
        </ul>

        {/* Social icons */}
        <div style={{ display: "flex", gap: 10 }}>
          <SocialBtn href={INSTAGRAM_URL} label="Instagram" color="#E1306C">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </SocialBtn>
          <SocialBtn href={FACEBOOK_URL} label="Facebook" color="#1877F2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </SocialBtn>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: 20,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)" }}>
          © {new Date().getFullYear()} Wash For U. All rights reserved.
        </div>
        <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)" }}>
          South Kolkata · Jadavpur · Baghajatin · Garia · Dhakuria
        </div>
      </div>
    </footer>
  );
};

const SocialBtn: React.FC<{
  href: string;
  label: string;
  color: string;
  children: React.ReactNode;
}> = ({ href, label, color, children }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: hovered ? color : "rgba(255,255,255,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        transition: "all 0.25s ease",
        textDecoration: "none",
      }}
    >
      {children}
    </a>
  );
};

const FooterLink: React.FC<{ label: string; onClick: () => void }> = ({
  label,
  onClick,
}) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.85rem",
        color: hovered ? "#3ECFCF" : "rgba(255,255,255,0.5)",
        transition: "color 0.3s ease",
      }}
    >
      {label}
    </button>
  );
};

export default Footer;
