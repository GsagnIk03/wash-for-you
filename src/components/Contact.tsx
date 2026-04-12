import React, { useState, useEffect } from "react";
import { useInView, useEmailJS } from "../hooks";
import { CONTACT_INFO, EMAILJS_CONFIG } from "../data";
import type { BookingFormData, ToastState } from "../types";

interface ContactProps {
  preselectedService?: string;
  onServiceConsumed?: () => void;
}

const SERVICES = [
  "Essential Clean",
  "Interior Premium Deep Detailing",
  "Ultimate Spa",
  "General Query",
];
const VEHICLES = ["Hatchback", "Sedan", "SUV / MUV", "Commercial Van"];

// WhatsApp & Phone number (digits only, with country code)
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

const RESPONSIVE_CSS = `
  /* ── Tablet: iPad Mini / Air / Pro (601px – 1024px) ── */
  @media (min-width: 601px) and (max-width: 1024px) {
    .contact-section {
      padding: 80px 6% !important;
    }
    .contact-grid {
      grid-template-columns: 1fr !important;
      gap: 48px !important;
    }
    .contact-info-text {
      grid-column: 1 / -1;
    }
    .booking-form-card {
      padding: 40px 36px !important;
    }
    .form-name-phone-grid {
      grid-template-columns: 1fr 1fr !important;
    }
    .form-service-grid {
      grid-template-columns: 1fr 1fr !important;
    }
    .form-vehicle-number {
      grid-column: 1 / -1 !important;
    }
  }

  /* ── Mobile: ≤ 600px ── */
  @media (max-width: 600px) {
    .contact-section {
      padding: 60px 5% !important;
    }
    .contact-grid {
      grid-template-columns: 1fr !important;
      gap: 40px !important;
    }
    .booking-form-card {
      padding: 32px 20px !important;
      border-radius: 16px !important;
    }
    .form-name-phone-grid {
      grid-template-columns: 1fr !important;
      gap: 0 !important;
    }
    .form-service-grid {
      grid-template-columns: 1fr !important;
      gap: 0 !important;
    }
    .form-vehicle-number {
      grid-column: 1 / -1 !important;
    }
    .action-buttons-container {
      flex-direction: column !important;
    }
    .action-btn {
      width: 100% !important;
      justify-content: center !important;
    }
  }
`;

const Contact: React.FC<ContactProps> = ({
  preselectedService,
  onServiceConsumed,
}) => {
  const emailJSReady = useEmailJS(EMAILJS_CONFIG.publicKey);

  useEffect(() => {
    const id = "contact-responsive-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = RESPONSIVE_CSS;
    document.head.appendChild(style);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);

  const [form, setForm] = useState<BookingFormData>({
    from_name: "",
    from_email: "",
    phone: "",
    service: "",
    vehicle: "",
    vehicleNumber: "",
    preferred_date: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    message: "",
    status: "idle",
  });

  React.useEffect(() => {
    if (preselectedService) {
      setForm((f) => ({ ...f, service: preselectedService }));
      onServiceConsumed?.();
    }
  }, [preselectedService]);

  const showToast = (message: string, isError = false) => {
    setToast({ message, status: isError ? "error" : "success" });
    setTimeout(() => setToast({ message: "", status: "idle" }), 6000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const sanitizedValue = value.replace(/[^\d\s+]/g, "");
      setForm((f) => ({ ...f, [name]: sanitizedValue }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const buildWhatsAppURL = (f: BookingFormData) => {
    const lines = [
      `🚗 *New Booking — Wash For You*`,
      ``,
      `👤 *Name:* ${f.from_name}`,
      `📞 *Phone:* ${f.phone}`,
      `📧 *Email:* ${f.from_email}`,
      `🧽 *Service:* ${f.service}`,
      `🚙 *Vehicle:* ${f.vehicle}${f.vehicleNumber ? ` (${f.vehicleNumber})` : ""}`,
      `📅 *Date & Time:* ${f.preferred_date || "Not specified"}`,
      `📝 *Notes:* ${f.message || "None"}`,
    ];
    const text = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneRegex = /^(?:\+?91[\s-]?)?[6-9]\d{9}$/;

    if (!phoneRegex.test(form.phone.trim())) {
      showToast("Please enter a valid 10-digit phone number.", true);
      return;
    }

    setSubmitting(true);
    const payload = {
      ...form,
      to_email: EMAILJS_CONFIG.businessEmail,
      business_name: "Wash For You",
    };

    if (emailJSReady) {
      try {
        const ejs = (window as any).emailjs;
        await ejs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateToOwner,
          payload,
        );
        await ejs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateToUser,
          { ...payload, to_email: form.from_email },
        );
      } catch (err) {
        console.error("EmailJS error:", err);
      }
    }

    window.open(buildWhatsAppURL(form), "_blank", "noopener,noreferrer");
    showToast("✅ Booking sent! WhatsApp has opened.");
    setForm({
      from_name: "",
      from_email: "",
      phone: "",
      service: "",
      vehicle: "",
      vehicleNumber: "",
      preferred_date: "",
      message: "",
    });
    setSubmitting(false);
  };

  return (
    <section
      id="contact"
      className="contact-section"
      style={{
        padding: "100px 5%",
        background: "linear-gradient(160deg, #0A2540 0%, #0F3875 100%)",
        position: "relative",
        overflow: "hidden",
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
            "radial-gradient(circle, rgba(62,207,207,0.1) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />
      <div
        className="contact-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.4fr",
          gap: 80,
          alignItems: "start",
          position: "relative",
          zIndex: 2,
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <ContactInfo />
        <BookingForm
          form={form}
          submitting={submitting}
          toast={toast}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </section>
  );
};

const ContactInfo: React.FC = () => {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`fade-up${inView ? " visible" : ""}`}>
      <div className="contact-info-text">
        <div className="section-label" style={{ color: "#3ECFCF" }}>
          Get in Touch
        </div>
        <h2 className="section-title" style={{ color: "#fff" }}>
          Visit, Call,
          <br />
          or Book Online
        </h2>
        <p className="section-sub" style={{ color: "rgba(255,255,255,0.65)" }}>
          We're here every day of the week. Drop by any of our South Kolkata
          locations, give us a call, or fill the form.
        </p>
      </div>

      <div
        style={{
          marginTop: 40,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {CONTACT_INFO.map((c, i) => (
          <ContactCard key={i} icon={c.icon} label={c.label} value={c.value} />
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 28 }}>
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

      {/* Action Buttons Container */}
      <div
        className="action-buttons-container"
        style={{ display: "flex", gap: 12, marginTop: 28 }}
      >
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="action-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "linear-gradient(135deg, #25D366, #1EB858)",
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.9rem",
            padding: "12px 22px",
            borderRadius: 50,
            textDecoration: "none",
            boxShadow: "0 6px 20px rgba(37,211,102,0.35)",
            transition: "all 0.3s ease",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </a>

        <a
          href={`tel:+${WHATSAPP_NUMBER}`}
          className="action-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "linear-gradient(135deg, #2979D8, #1A4F8A)",
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.9rem",
            padding: "12px 22px",
            borderRadius: 50,
            textDecoration: "none",
            boxShadow: "0 6px 20px rgba(41,121,216,0.35)",
            transition: "all 0.3s ease",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          Call Now
        </a>
      </div>
    </div>
  );
};

const ContactCard: React.FC<{ icon: string; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => {
  const [hovered, setHovered] = React.useState(false);
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`fade-up${inView ? " visible" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? "rgba(255,255,255,0.12)"
          : "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 14,
        padding: "20px 22px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          flexShrink: 0,
          background: "rgba(62,207,207,0.18)",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.3rem",
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontSize: "0.78rem",
            color: "rgba(255,255,255,0.5)",
            marginBottom: 3,
          }}
        >
          {label}
        </div>
        <div style={{ fontWeight: 600, color: "#fff", fontSize: "0.95rem" }}>
          {value}
        </div>
      </div>
    </div>
  );
};

interface BookingFormProps {
  form: BookingFormData;
  submitting: boolean;
  toast: ToastState;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  border: "1.5px solid rgba(41,121,216,0.2)",
  borderRadius: 10,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.92rem",
  color: "#0A2540",
  background: "#F3F8FF",
  outline: "none",
  transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
  boxSizing: "border-box",
};

const FocusableInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props,
) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <input
      {...props}
      style={{
        ...inputStyle,
        borderColor: focused ? "#2979D8" : "rgba(41,121,216,0.2)",
        background: focused ? "#fff" : "#F3F8FF",
        boxShadow: focused ? "0 0 0 4px rgba(41,121,216,0.1)" : "none",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
};

const FocusableSelect: React.FC<
  React.SelectHTMLAttributes<HTMLSelectElement>
> = ({ children, ...props }) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <select
      {...props}
      style={{
        ...inputStyle,
        borderColor: focused ? "#2979D8" : "rgba(41,121,216,0.2)",
        background: focused ? "#fff" : "#F3F8FF",
        boxShadow: focused ? "0 0 0 4px rgba(41,121,216,0.1)" : "none",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {children}
    </select>
  );
};

const BookingForm: React.FC<BookingFormProps> = ({
  form,
  submitting,
  toast,
  onChange,
  onSubmit,
}) => {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [btnHovered, setBtnHovered] = React.useState(false);
  return (
    <div
      ref={ref}
      id="booking-form"
      className={`fade-up booking-form-card${inView ? " visible" : ""}`}
      style={{
        background: "#fff",
        borderRadius: 24,
        padding: "48px 40px",
        boxShadow: "0 20px 60px rgba(10,37,64,0.18)",
        width: "100%",
        boxSizing: "border-box",
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)",
          fontWeight: 800,
          color: "#0A2540",
          marginBottom: 6,
        }}
      >
        Book a Service or Send a Query
      </div>
      <div style={{ fontSize: "0.88rem", color: "#4A6FA5", marginBottom: 28 }}>
        We'll confirm your booking via email within 30 minutes.
      </div>
      <form onSubmit={onSubmit} style={{ width: "100%" }}>
        <div
          className="form-name-phone-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <FormGroup label="Full Name *">
            <FocusableInput
              type="text"
              name="from_name"
              value={form.from_name}
              onChange={onChange}
              placeholder="Rahul Sharma"
              required
            />
          </FormGroup>
          <FormGroup label="Phone / WhatsApp *">
            <FocusableInput
              type="tel"
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder="+91 98300 00000"
              pattern="^(?:\+?91[\s-]?)?[6-9]\d{9}$"
              required
            />
          </FormGroup>
        </div>
        <FormGroup label="Email Address *">
          <FocusableInput
            type="email"
            name="from_email"
            value={form.from_email}
            onChange={onChange}
            placeholder="rahul@example.com"
            required
          />
        </FormGroup>
        <div
          className="form-service-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 16,
          }}
        >
          <FormGroup label="Service Required *">
            <FocusableSelect
              name="service"
              value={form.service}
              onChange={onChange}
              required
            >
              <option value="" disabled>
                Select service…
              </option>
              {SERVICES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </FocusableSelect>
          </FormGroup>
          <FormGroup label="Vehicle Type *">
            <FocusableSelect
              name="vehicle"
              value={form.vehicle}
              onChange={onChange}
              required
            >
              <option value="" disabled>
                Select vehicle…
              </option>
              {VEHICLES.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </FocusableSelect>
          </FormGroup>
          <div className="form-vehicle-number">
            <FormGroup label="Vehicle Number (Optional)">
              <FocusableInput
                type="text"
                name="vehicleNumber"
                value={form.vehicleNumber}
                onChange={onChange}
                placeholder="WB 06 AB 1234"
              />
            </FormGroup>
          </div>
        </div>
        <FormGroup label="Preferred Date & Time">
          <FocusableInput
            type="datetime-local"
            name="preferred_date"
            value={form.preferred_date}
            onChange={onChange}
          />
        </FormGroup>
        <FormGroup label="Additional Notes / Query">
          <FocusableTextarea
            name="message"
            value={form.message}
            onChange={onChange}
            rows={4}
            placeholder="Any special requests…"
          />
        </FormGroup>
        <button
          type="submit"
          disabled={submitting}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            width: "100%",
            padding: 15,
            background: submitting
              ? "rgba(41,121,216,0.5)"
              : btnHovered
                ? "linear-gradient(135deg, #25D366, #1EB858)"
                : "linear-gradient(135deg, #2979D8, #1A4F8A)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "1rem",
            fontWeight: 700,
            cursor: submitting ? "not-allowed" : "pointer",
            boxShadow:
              btnHovered && !submitting
                ? "0 12px 30px rgba(37,211,102,0.4)"
                : "0 6px 20px rgba(41,121,216,0.35)",
            transform: btnHovered && !submitting ? "translateY(-2px)" : "none",
            transition: "all 0.35s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          {submitting ? "⏳ Sending…" : "📅 Submit & Open WhatsApp"}
        </button>
        {toast.status !== "idle" && (
          <div
            style={{
              background: toast.status === "success" ? "#E8F7F0" : "#FEF0F0",
              border: `1.5px solid ${toast.status === "success" ? "#27AE60" : "#E74C3C"}`,
              color: toast.status === "success" ? "#1A7245" : "#922B2B",
              borderRadius: 10,
              padding: "14px 18px",
              fontSize: "0.88rem",
              fontWeight: 500,
              marginTop: 16,
              textAlign: "center",
            }}
          >
            {toast.message}
          </div>
        )}
      </form>
    </div>
  );
};

const FormGroup: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div style={{ marginBottom: 18 }}>
    <label
      style={{
        display: "block",
        fontSize: "0.82rem",
        fontWeight: 600,
        color: "#0A2540",
        marginBottom: 7,
      }}
    >
      {label}
    </label>
    {children}
  </div>
);

const FocusableTextarea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
> = (props) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <textarea
      {...props}
      style={{
        ...inputStyle,
        resize: "vertical",
        borderColor: focused ? "#2979D8" : "rgba(41,121,216,0.2)",
        background: focused ? "#fff" : "#F3F8FF",
        boxShadow: focused ? "0 0 0 4px rgba(41,121,216,0.1)" : "none",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
};

export default Contact;
