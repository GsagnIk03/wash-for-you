import React from "react";
import { CONTACT_INFO } from "../data";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

// Slim contact section replacing the old full Contact page
const ContactStrip: React.FC = () => (
  <section
    id="contact"
    style={{
      padding: "80px 5%",
      background: "linear-gradient(160deg, #0A2540 0%, #0F3875 100%)",
      position: "relative",
      overflow: "hidden",
      boxSizing: "border-box",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: -200,
        left: -200,
        width: 600,
        height: 600,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(62,207,207,0.08) 0%, transparent 65%)",
        pointerEvents: "none",
      }}
    />

    <div
      style={{
        position: "relative",
        zIndex: 2,
        maxWidth: 1100,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <div
        className="section-label"
        style={{ color: "#3ECFCF", justifyContent: "center" }}
      >
        Get In Touch
      </div>
      <h2
        className="section-title"
        style={{ color: "#fff", textAlign: "center" }}
      >
        We're Here For You
      </h2>
      <p
        className="section-sub"
        style={{
          color: "rgba(255,255,255,0.65)",
          textAlign: "center",
          margin: "0 auto 48px",
        }}
      >
        Drop by, call, or WhatsApp us. We're available every day of the week
        across South Kolkata.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 40,
        }}
      >
        {CONTACT_INFO.map((c, i) => (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 14,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              flex: "1 1 260px",
              maxWidth: 360,
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                flexShrink: 0,
                background: "rgba(62,207,207,0.18)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
              }}
            >
              {c.icon}
            </div>
            <div style={{ minWidth: 0, textAlign: "left" }}>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: 3,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {c.label}
              </div>
              <div
                style={{
                  fontWeight: 600,
                  color: "#fff",
                  fontSize: "0.9rem",
                  wordBreak: "break-word",
                  lineHeight: 1.4,
                }}
              >
                {c.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hours */}
      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: 36,
        }}
      >
        {["Mon – Sat: 7 AM – 5 PM", "Sunday: 9 AM – 6 PM"].map((h) => (
          <span
            key={h}
            style={{
              background: "rgba(41,121,216,0.25)",
              border: "1px solid rgba(41,121,216,0.4)",
              borderRadius: 8,
              padding: "6px 14px",
              fontSize: "0.82rem",
              color: "rgba(255,255,255,0.8)",
              fontWeight: 500,
            }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* CTA buttons */}
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "linear-gradient(135deg, #25D366, #1EB858)",
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.9rem",
            padding: "13px 24px",
            borderRadius: 50,
            textDecoration: "none",
            boxShadow: "0 6px 20px rgba(37,211,102,0.35)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp Us
        </a>
        <a
          href="tel:+919477588518"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "linear-gradient(135deg, #2979D8, #1A4F8A)",
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.9rem",
            padding: "13px 24px",
            borderRadius: 50,
            textDecoration: "none",
            boxShadow: "0 6px 20px rgba(41,121,216,0.35)",
          }}
        >
          📞 Call Now
        </a>
      </div>

      {/* Social links */}
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: 16,
        }}
      >
        <a
          href="https://www.instagram.com/wash_for_u"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "linear-gradient(135deg, #E1306C, #833AB4)",
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.88rem",
            padding: "11px 22px",
            borderRadius: 50,
            textDecoration: "none",
            boxShadow: "0 4px 16px rgba(225,48,108,0.3)",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
          Follow on Instagram
        </a>
        <a
          href="https://www.facebook.com/profile.php?id=61590411313790"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#1877F2",
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.88rem",
            padding: "11px 22px",
            borderRadius: 50,
            textDecoration: "none",
            boxShadow: "0 4px 16px rgba(24,119,242,0.3)",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Follow on Facebook
        </a>
      </div>
    </div>
  </section>
);

export default ContactStrip;
