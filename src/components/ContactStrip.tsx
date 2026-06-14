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
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              flex: "1 1 200px",
              maxWidth: 320,
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
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: 3,
                }}
              >
                {c.label}
              </div>
              <div
                style={{
                  fontWeight: 600,
                  color: "#fff",
                  fontSize: "0.88rem",
                  wordBreak: "break-word",
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
    </div>
  </section>
);

export default ContactStrip;
