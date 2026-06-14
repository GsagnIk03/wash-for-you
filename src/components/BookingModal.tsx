import React, { useState, useEffect, useRef } from "react";
import { PRICING_PLANS, BIKE_PLAN } from "../data";
import type { BookingFormData, ToastState } from "../types";

const ALL_PLANS = [...PRICING_PLANS, BIKE_PLAN];
const SERVICES = [...ALL_PLANS.map((p) => p.name), "General Query"];
const CAR_VEHICLES = ["Hatchback", "Sedan", "SUV / MUV", "Commercial Van"];
const BIKE_TYPES = ["Bike", "Scooty"];

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

const isBikeService = (service: string) => service === BIKE_PLAN.name;

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  border: "1.5px solid rgba(41,121,216,0.2)",
  borderRadius: 10,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.9rem",
  color: "#0A2540",
  background: "#F3F8FF",
  outline: "none",
  transition: "all 0.3s ease",
  boxSizing: "border-box",
};

const MODAL_CSS = `
  .modal-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(10,37,64,0.75);
    backdrop-filter: blur(6px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fadeInOverlay 0.25s ease;
  }
  .modal-box {
    background: #fff;
    border-radius: 24px;
    width: 100%;
    max-width: 640px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 32px 80px rgba(10,37,64,0.35);
    animation: slideUpModal 0.3s cubic-bezier(0.4,0,0.2,1);
    scrollbar-width: thin;
    scrollbar-color: #2979D8 #F3F8FF;
  }
  .modal-box::-webkit-scrollbar { width: 5px; }
  .modal-box::-webkit-scrollbar-track { background: #F3F8FF; }
  .modal-box::-webkit-scrollbar-thumb { background: #2979D8; border-radius: 3px; }
  .modal-header {
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 10;
    padding: 28px 32px 20px;
    border-bottom: 1px solid rgba(41,121,216,0.1);
  }
  .modal-body { padding: 24px 32px 32px; }
  .bike-type-group {
    display: flex;
    gap: 12px;
  }
  .bike-type-btn {
    flex: 1;
    padding: 10px 0;
    border-radius: 10px;
    border: 1.5px solid rgba(41,121,216,0.2);
    background: #F3F8FF;
    color: #4A6FA5;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .bike-type-btn.active {
    background: #2979D8;
    border-color: #2979D8;
    color: #fff;
    box-shadow: 0 4px 12px rgba(41,121,216,0.3);
  }
  @keyframes fadeInOverlay {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUpModal {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @media (max-width: 600px) {
    .modal-grid { grid-template-columns: 1fr !important; gap: 0 !important; }
    .modal-header { padding: 20px 20px 16px; }
    .modal-body { padding: 16px 20px 24px; }
    .modal-actions { flex-direction: column !important; }
    .modal-actions button { width: 100% !important; }
    .bike-type-group { gap: 8px; }
  }
`;

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
  onServiceConsumed?: () => void;
}

const EMPTY_FORM: BookingFormData = {
  from_name: "",
  from_email: "",
  phone: "",
  service: "",
  vehicle: "",
  vehicleModel: "",
  vehicleNumber: "",
  preferred_date: "",
  message: "",
};

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedService,
  onServiceConsumed,
}) => {
  useEffect(() => {
    const id = "modal-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = MODAL_CSS;
    document.head.appendChild(style);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);

  const [form, setForm] = useState<BookingFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    message: "",
    status: "idle",
  });
  const overlayRef = useRef<HTMLDivElement>(null);

  const bikeSelected = isBikeService(form.service);

  // Preselect plan from pricing card click
  useEffect(() => {
    if (preselectedService) {
      setForm((f) => ({
        ...f,
        service: preselectedService,
        // reset vehicle when service changes
        vehicle: "",
      }));
      onServiceConsumed?.();
    }
  }, [preselectedService]);

  // When service switches between bike/car, reset vehicle field
  useEffect(() => {
    setForm((f) => ({ ...f, vehicle: "" }));
  }, [bikeSelected]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const showToast = (message: string, isError = false) => {
    setToast({ message, status: isError ? "error" : "success" });
    setTimeout(() => setToast({ message: "", status: "idle" }), 8000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setForm((f) => ({ ...f, [name]: value.replace(/[^\d\s+]/g, "") }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const buildWhatsAppURL = (f: BookingFormData) => {
    const vehicleLabel = isBikeService(f.service)
      ? `${f.vehicle} (Bike Wash)`
      : f.vehicle;
    const lines = [
      `🚗 New Booking — Wash For U`,
      ``,
      `👤 Name: ${f.from_name}`,
      `📞 Phone: ${f.phone}`,
      `📧 Email: ${f.from_email}`,
      ``,
      `🧽 Service: ${f.service}`,
      `🚙 Vehicle: ${vehicleLabel}`,
      `📋 Model: ${f.vehicleModel || "Not specified"}`,
      `🔢 Number: ${f.vehicleNumber || "Not specified"}`,
      `📅 Date & Time: ${f.preferred_date || "Not specified"}`,
      `📝 Notes: ${f.message || "None"}`,
    ];
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneRegex = /^(?:\+?91[\s-]?)?[6-9]\d{9}$/;
    if (!phoneRegex.test(form.phone.trim())) {
      showToast("Please enter a valid 10-digit phone number.", true);
      return;
    }
    if (!form.vehicle) {
      showToast(
        bikeSelected
          ? "Please select Bike or Scooty."
          : "Please select a vehicle type.",
        true,
      );
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/send-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        throw new Error(
          "Server returned an invalid response. Please try again.",
        );
      }

      if (!res.ok) {
        throw new Error(data.error || `Server error (${res.status})`);
      }

      // ✅ Success — capture form data before resetting, then show message and open WhatsApp
      const submittedForm = { ...form };
      showToast("✅ Booking confirmed! Opening WhatsApp now…");
      setForm(EMPTY_FORM);
      setTimeout(() => {
        window.open(
          buildWhatsAppURL(submittedForm),
          "_blank",
          "noopener,noreferrer",
        );
      }, 1500);
      setTimeout(() => onClose(), 4000);
    } catch (err: any) {
      console.error("Booking submission error:", err);
      showToast(
        `❌ ${err.message || "Something went wrong. Please try again."}`,
        true,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="modal-box" id="booking-form">
        {/* Header */}
        <div className="modal-header">
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  color: "#0A2540",
                  margin: "0 0 4px",
                }}
              >
                Book a Service
              </h2>
              <p style={{ fontSize: "0.83rem", color: "#4A6FA5", margin: 0 }}>
                We'll confirm your booking within 30 minutes.
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "#F3F8FF",
                border: "none",
                borderRadius: "50%",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "1.1rem",
                color: "#4A6FA5",
                flexShrink: 0,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#E8F1FB";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#F3F8FF";
              }}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
          <div
            style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}
          >
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "#16a34a",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: 50,
                padding: "5px 14px",
                textDecoration: "none",
              }}
            >
              <span>💬</span> WhatsApp
            </a>
            <a
              href="tel:+919477588518"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "#2979D8",
                background: "#EFF6FF",
                border: "1px solid #bfdbfe",
                borderRadius: 50,
                padding: "5px 14px",
                textDecoration: "none",
              }}
            >
              <span>📞</span> Call Now
            </a>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {/* Name + Phone */}
            <div className="modal-grid">
              <FormGroup label="Full Name *">
                <FocusInput
                  type="text"
                  name="from_name"
                  value={form.from_name}
                  onChange={handleChange}
                  placeholder="Rahul Sharma"
                  required
                />
              </FormGroup>
              <FormGroup label="Phone / WhatsApp *">
                <FocusInput
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98300 00000"
                  required
                />
              </FormGroup>
            </div>

            {/* Email */}
            <FormGroup label="Email Address *">
              <FocusInput
                type="email"
                name="from_email"
                value={form.from_email}
                onChange={handleChange}
                placeholder="rahul@example.com"
                required
              />
            </FormGroup>

            {/* Service */}
            <FormGroup label="Service Required *">
              <FocusSelect
                name="service"
                value={form.service}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select service…
                </option>
                {SERVICES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </FocusSelect>
            </FormGroup>

            {/* Bike wash area notice */}
            {bikeSelected && (
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  background: "#fefce8",
                  border: "1.5px solid #fde047",
                  borderRadius: 10,
                  padding: "12px 14px",
                  marginBottom: 16,
                  fontSize: "0.82rem",
                  color: "#854d0e",
                  lineHeight: 1.55,
                }}
              >
                <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>📍</span>
                <span>
                  Standalone bike wash is available{" "}
                  <strong>within 2 km of Jadavpur, Kolkata only</strong>.
                  Outside this area, bike wash is available only when combined
                  with a car wash booking. Not sure? Call us at{" "}
                  <strong>+91 94775 88518</strong>.
                </span>
              </div>
            )}

            {/* Vehicle field — conditional */}
            {bikeSelected ? (
              <FormGroup label="Two-Wheeler Type *">
                <div className="bike-type-group">
                  {BIKE_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`bike-type-btn${form.vehicle === type ? " active" : ""}`}
                      onClick={() => setForm((f) => ({ ...f, vehicle: type }))}
                    >
                      {type === "Bike" ? "🏍️" : "🛵"} {type}
                    </button>
                  ))}
                </div>
              </FormGroup>
            ) : (
              <FormGroup label="Vehicle Type *">
                <FocusSelect
                  name="vehicle"
                  value={form.vehicle}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select vehicle…
                  </option>
                  {CAR_VEHICLES.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </FocusSelect>
              </FormGroup>
            )}

            {/* Vehicle Model — always shown */}
            <FormGroup label="Vehicle Model *">
              <FocusInput
                type="text"
                name="vehicleModel"
                value={form.vehicleModel}
                onChange={handleChange}
                placeholder={
                  bikeSelected
                    ? "e.g. Honda Activa, Royal Enfield 350…"
                    : "e.g. Maruti Swift, Hyundai Creta…"
                }
                required
              />
            </FormGroup>

            {/* Vehicle Number + Date */}
            <div className="modal-grid">
              <FormGroup label="Vehicle Number (Optional)">
                <FocusInput
                  type="text"
                  name="vehicleNumber"
                  value={form.vehicleNumber}
                  onChange={handleChange}
                  placeholder="WB 06 AB 1234"
                />
              </FormGroup>
              <FormGroup label="Preferred Date & Time">
                <FocusInput
                  type="datetime-local"
                  name="preferred_date"
                  value={form.preferred_date}
                  onChange={handleChange}
                />
              </FormGroup>
            </div>

            {/* Notes */}
            <FormGroup label="Additional Notes">
              <FocusTextarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={3}
                placeholder="Any special requests…"
              />
            </FormGroup>

            {/* Toast — shown above action buttons */}
            {toast.status !== "idle" && (
              <div
                style={{
                  background:
                    toast.status === "success" ? "#E8F7F0" : "#FEF0F0",
                  border: `2px solid ${toast.status === "success" ? "#27AE60" : "#E74C3C"}`,
                  color: toast.status === "success" ? "#1A7245" : "#922B2B",
                  borderRadius: 12,
                  padding: "14px 18px",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  marginBottom: 16,
                  textAlign: "center",
                  lineHeight: 1.5,
                  boxShadow:
                    toast.status === "success"
                      ? "0 4px 16px rgba(39,174,96,0.2)"
                      : "0 4px 16px rgba(231,76,60,0.2)",
                }}
              >
                {toast.message}
                {toast.status === "error" && (
                  <div style={{ marginTop: 10 }}>
                    <a
                      href={buildWhatsAppURL(form)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        background: "#25D366",
                        color: "#fff",
                        padding: "8px 18px",
                        borderRadius: 50,
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      💬 Book directly via WhatsApp
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div
              className="modal-actions"
              style={{ display: "flex", gap: 12, marginTop: 8 }}
            >
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "13px 0",
                  borderRadius: 12,
                  background: "#F3F8FF",
                  border: "1.5px solid #dbeafe",
                  color: "#4A6FA5",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#E8F1FB";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#F3F8FF";
                }}
              >
                Cancel
              </button>
              <SubmitButton submitting={submitting} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const SubmitButton: React.FC<{ submitting: boolean }> = ({ submitting }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      type="submit"
      disabled={submitting}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 2,
        padding: "13px 0",
        background: submitting
          ? "rgba(41,121,216,0.5)"
          : hovered
            ? "linear-gradient(135deg, #25D366, #1EB858)"
            : "linear-gradient(135deg, #2979D8, #1A4F8A)",
        color: "#fff",
        border: "none",
        borderRadius: 12,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.95rem",
        fontWeight: 700,
        cursor: submitting ? "not-allowed" : "pointer",
        boxShadow:
          hovered && !submitting
            ? "0 8px 24px rgba(37,211,102,0.35)"
            : "0 4px 16px rgba(41,121,216,0.3)",
        transform: hovered && !submitting ? "translateY(-1px)" : "none",
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      {submitting ? "⏳ Sending…" : "📅 Submit Booking"}
    </button>
  );
};

const FormGroup: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div style={{ marginBottom: 16 }}>
    <label
      style={{
        display: "block",
        fontSize: "0.8rem",
        fontWeight: 600,
        color: "#0A2540",
        marginBottom: 6,
      }}
    >
      {label}
    </label>
    {children}
  </div>
);

const FocusInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
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
        boxShadow: focused ? "0 0 0 3px rgba(41,121,216,0.1)" : "none",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
};

const FocusSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({
  children,
  ...props
}) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <select
      {...props}
      style={{
        ...inputStyle,
        borderColor: focused ? "#2979D8" : "rgba(41,121,216,0.2)",
        background: focused ? "#fff" : "#F3F8FF",
        boxShadow: focused ? "0 0 0 3px rgba(41,121,216,0.1)" : "none",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {children}
    </select>
  );
};

const FocusTextarea: React.FC<
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
        boxShadow: focused ? "0 0 0 3px rgba(41,121,216,0.1)" : "none",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
};

export default BookingModal;
