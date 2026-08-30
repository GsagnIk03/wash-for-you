import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Check,
  MessageCircle,
  Phone,
  CalendarCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Bike as BikeIcon,
} from "lucide-react";
import { PRICING_PLANS, BIKE_PLAN } from "../data";
import { useCart } from "../context/CartContext";
import type { BookingFormData, ToastState, AddOnGroup } from "../types";

const ALL_PLANS = [...PRICING_PLANS, BIKE_PLAN];
const SERVICES = [...ALL_PLANS.map((p) => p.name), "General Query"];
const CAR_VEHICLES = ["Hatchback", "Sedan", "SUV / MUV", "Commercial Van"];
const BIKE_TYPES = ["Bike", "Scooty"];

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

const isBikeService = (service: string) => service === BIKE_PLAN.name;

// Default add-on selections for a plan: single-required groups start on their
// first (usually free) choice, everything else starts unselected.
const buildAddOnDefaults = (
  groups: AddOnGroup[] = [],
): Record<string, string[]> => {
  const init: Record<string, string[]> = {};
  groups.forEach((g) => {
    init[g.id] = g.selectionType === "single-required" ? [g.choices[0].id] : [];
  });
  return init;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  border: "1.5px solid rgba(41,121,216,0.2)",
  borderRadius: 10,
  fontFamily: "'Inter', sans-serif",
  fontSize: "0.9rem",
  color: "#0A2540",
  background: "#F3F8FF",
  outline: "none",
  transition: "all 0.3s ease",
  boxSizing: "border-box",
};

const MODAL_CSS = `
  .modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(10,37,64,0.75);
    backdrop-filter: blur(6px); z-index: 1000; display: flex;
    align-items: center; justify-content: center; padding: 20px;
    animation: fadeInOverlay 0.25s ease;
  }
  .modal-box {
    background: #fff; border-radius: 24px; width: 100%; max-width: 640px;
    max-height: 90vh; overflow-y: auto; box-shadow: 0 32px 80px rgba(10,37,64,0.35);
    animation: slideUpModal 0.3s cubic-bezier(0.4,0,0.2,1);
    scrollbar-width: thin; scrollbar-color: #2979D8 #F3F8FF;
  }
  .modal-box::-webkit-scrollbar { width: 5px; }
  .modal-box::-webkit-scrollbar-track { background: #F3F8FF; }
  .modal-box::-webkit-scrollbar-thumb { background: #2979D8; border-radius: 3px; }
  .modal-header { position: sticky; top: 0; background: #fff; z-index: 10; padding: 28px 32px 20px; border-bottom: 1px solid rgba(41,121,216,0.1); }
  .modal-body { padding: 24px 32px 32px; }
  .bike-type-group { display: flex; gap: 12px; }
  .bike-type-btn {
    flex: 1; padding: 10px 0; border-radius: 10px;
    border: 1.5px solid rgba(41,121,216,0.2); background: #F3F8FF; color: #4A6FA5;
    font-family: 'Inter', sans-serif; font-size: 0.9rem; font-weight: 600;
    cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center;
    justify-content: center; gap: 8px;
  }
  .bike-type-btn.active { background: #2979D8; border-color: #2979D8; color: #fff; box-shadow: 0 4px 12px rgba(41,121,216,0.3); }
  .bkaddon-group { padding: 14px 0; border-bottom: 1px solid #EEF3FA; }
  .bkaddon-group:last-of-type { border-bottom: none; }
  .bkaddon-group-tag {
    font-size: 0.64rem; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase;
    padding: 3px 8px; border-radius: 5px; white-space: nowrap; flex-shrink: 0;
  }
  .bkaddon-group-tag.required { background: #FEEDEE; color: #E5484D; }
  .bkaddon-group-tag.optional { background: #EAF3FF; color: #2979D8; }
  .bkaddon-row { display: flex; align-items: center; gap: 12px; padding: 8px 2px; cursor: pointer; -webkit-tap-highlight-color: transparent; }
  .bkaddon-row-indicator {
    width: 20px; height: 20px; flex-shrink: 0; border: 2px solid #CBD9EB;
    display: flex; align-items: center; justify-content: center; transition: all 0.15s ease; box-sizing: border-box;
  }
  .bkaddon-row-indicator.radio { border-radius: 50%; }
  .bkaddon-row-indicator.checkbox { border-radius: 6px; }
  .bkaddon-row-indicator.checked { border-color: #2979D8; background: #2979D8; }
  .bkaddon-row-indicator .bkradio-dot { width: 8px; height: 8px; border-radius: 50%; background: #fff; }
  .bkaddon-row-label { flex: 1; font-size: 0.86rem; color: #17293D; font-weight: 500; display: flex; flex-direction: column; align-items: flex-start; gap: 3px; }
  .bkaddon-row-label-line { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; }
  .bkaddon-row-note { font-size: 0.7rem; font-weight: 400; color: #8598B3; }
  .bkaddon-row-rec { font-size: 0.6rem; font-weight: 800; color: #fff; background: #2979D8; padding: 2px 7px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.02em; }
  .bkaddon-row-price { font-size: 0.82rem; font-weight: 700; color: #0A2540; flex-shrink: 0; }
  @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUpModal { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .spin-icon { animation: spin 0.9s linear infinite; }
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
  // When true, the form is prefilled and locked to the current cart's
  // contents (service + price) instead of the single-plan dropdown flow.
  cartMode?: boolean;
}

const EMPTY_FORM: BookingFormData = {
  from_name: "",
  from_email: "",
  phone: "",
  address: "",
  service: "",
  vehicle: "",
  vehicleModel: "",
  vehicleNumber: "",
  preferred_date: "",
  price: "",
  message: "",
};

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedService,
  onServiceConsumed,
  cartMode,
}) => {
  const cart = useCart();
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

  // Direct-booking flow state: which plan is picked from the "Service
  // Required" dropdown, and which of its add-ons are selected. This drives
  // form.service / form.price the same way the cart drives them in cartMode,
  // so a customer gets an identical price and summary whichever way they
  // book — straight from this form, or via "Add to Cart" on a pricing card.
  const [directPlanName, setDirectPlanName] = useState("");
  const [directSelections, setDirectSelections] = useState<
    Record<string, string[]>
  >({});
  const directPlanObj = ALL_PLANS.find((p) => p.name === directPlanName);
  const directHasAddOns = !!directPlanObj?.addOnGroups?.length;

  const cartHasBike = cart.items.some((i) => i.planName === BIKE_PLAN.name);
  const bikeSelected = cartMode ? cartHasBike : isBikeService(directPlanName);

  // Preselect plan (e.g. from a "Book This Plan" card) — not used in cart-checkout mode.
  useEffect(() => {
    if (preselectedService && !cartMode) {
      setDirectPlanName(preselectedService);
      setForm((f) => ({ ...f, vehicle: "" }));
      onServiceConsumed?.();
    }
  }, [preselectedService, cartMode]);

  // Populate the form from the cart once, when the modal opens in cart mode.
  useEffect(() => {
    if (cartMode && isOpen) {
      const serviceText = cart.items
        .map((item) => {
          const addOnText = item.addOns
            .flatMap((a) => a.choiceLabels)
            .join(", ");
          return addOnText ? `${item.planName} (${addOnText})` : item.planName;
        })
        .join("; ");
      setForm((f) => ({
        ...f,
        service: serviceText,
        vehicle: "",
        price: `₹${cart.total}`,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartMode, isOpen]);

  // Reset the operational "Vehicle Type" field whenever the customer
  // switches between a bike plan and a car plan — the two use different
  // option sets (Bike/Scooty vs Hatchback/Sedan/…).
  useEffect(() => {
    if (cartMode) return;
    setForm((f) => ({ ...f, vehicle: "" }));
  }, [bikeSelected, cartMode]);

  // Reset add-on selections to that plan's defaults whenever the directly-
  // selected plan changes.
  useEffect(() => {
    if (cartMode) return;
    setDirectSelections(buildAddOnDefaults(directPlanObj?.addOnGroups));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartMode, directPlanName]);

  // Populate form.service / form.price from the directly-selected plan and
  // its add-on choices — the same computation the pricing section's cart
  // uses, so the price matches regardless of entry point.
  useEffect(() => {
    if (cartMode) return;
    if (!directPlanName) {
      setForm((f) => ({ ...f, service: "", price: "" }));
      return;
    }
    if (!directPlanObj) {
      // "General Query" — no pricing applies.
      setForm((f) => ({ ...f, service: directPlanName, price: "" }));
      return;
    }
    const groups = directPlanObj.addOnGroups ?? [];
    const addOnLabels = groups.flatMap((g) =>
      g.choices
        .filter((c) => (directSelections[g.id] ?? []).includes(c.id))
        .map((c) => c.label),
    );
    const addOnsTotal = groups.reduce((sum, g) => {
      const chosen = directSelections[g.id] ?? [];
      return (
        sum +
        g.choices
          .filter((c) => chosen.includes(c.id))
          .reduce((s, c) => s + c.price, 0)
      );
    }, 0);
    const serviceText =
      addOnLabels.length > 0
        ? `${directPlanName} — ${addOnLabels.join(", ")}`
        : directPlanName;
    setForm((f) => ({
      ...f,
      service: serviceText,
      price: `₹${directPlanObj.price + addOnsTotal}`,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartMode, directPlanName, directSelections]);

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

  // Toggle one add-on choice within the directly-selected plan's groups —
  // same single-required / single-optional / multi-optional rules used by
  // the pricing section's customization sheet.
  const toggleDirectChoice = (group: AddOnGroup, choiceId: string) => {
    setDirectSelections((prev) => {
      const current = prev[group.id] ?? [];
      if (group.selectionType === "single-required") {
        return { ...prev, [group.id]: [choiceId] };
      }
      if (group.selectionType === "single-optional") {
        return {
          ...prev,
          [group.id]: current[0] === choiceId ? [] : [choiceId],
        };
      }
      const has = current.includes(choiceId);
      return {
        ...prev,
        [group.id]: has
          ? current.filter((id) => id !== choiceId)
          : [...current, choiceId],
      };
    });
  };

  const buildWhatsAppURL = (f: BookingFormData) => {
    const vehicleLabel = isBikeService(f.service)
      ? `${f.vehicle} (Bike Wash)`
      : f.vehicle;
    const lines = [
      `New Booking — Wash For U`,
      ``,
      `Name: ${f.from_name}`,
      `Phone: ${f.phone}`,
      `Email: ${f.from_email}`,
      `Address: ${f.address || "Not specified"}`,
      ``,
      `Service: ${f.service}`,
      `Vehicle: ${vehicleLabel}`,
      `Model: ${f.vehicleModel || "Not specified"}`,
      `Number: ${f.vehicleNumber || "Not specified"}`,
      `Price: ${f.price || "To be confirmed"}`,
      `Date & Time: ${f.preferred_date || "Not specified"}`,
      `Notes: ${f.message || "None"}`,
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
    if (!form.address.trim()) {
      showToast("Please enter the address for the doorstep visit.", true);
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
      if (!res.ok)
        throw new Error(data.error || `Server error (${res.status})`);
      const submittedForm = { ...form };
      showToast("Booking confirmed! Opening WhatsApp now…");
      setForm(EMPTY_FORM);
      if (cartMode) cart.clear();
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
      showToast(err.message || "Something went wrong. Please try again.", true);
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
                  fontFamily: "'Sora', sans-serif",
                  fontSize: "1.4rem",
                  fontWeight: 700,
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
              aria-label="Close modal"
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
                color: "#4A6FA5",
                flexShrink: 0,
              }}
            >
              <X size={17} strokeWidth={2.3} />
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
              <MessageCircle size={13} strokeWidth={2.3} />
              WhatsApp
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
              <Phone size={13} strokeWidth={2.3} />
              Call Now
            </a>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
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

            <FormGroup label="Address *">
              <FocusTextarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={2}
                placeholder="Flat / house no., street, landmark, area"
                required
              />
            </FormGroup>

            {cartMode ? (
              <FormGroup label="Your Order">
                <div
                  style={{
                    background: "#F3F8FF",
                    border: "1.5px solid rgba(41,121,216,0.2)",
                    borderRadius: 10,
                    padding: "12px 14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {cart.items.map((item) => (
                    <div
                      key={item.id}
                      style={{ fontSize: "0.85rem", color: "#0A2540" }}
                    >
                      <strong>{item.planName}</strong>
                      {item.addOns.length > 0 && (
                        <span style={{ color: "#4A6FA5" }}>
                          {" — "}
                          {item.addOns
                            .flatMap((a) => a.choiceLabels)
                            .join(", ")}
                        </span>
                      )}
                      <span style={{ color: "#2979D8", fontWeight: 700 }}>
                        {" "}
                        ₹{item.totalPrice}
                      </span>
                    </div>
                  ))}
                </div>
              </FormGroup>
            ) : (
              <>
                <FormGroup label="Service Required *">
                  <FocusSelect
                    name="directPlan"
                    value={directPlanName}
                    onChange={(e) => setDirectPlanName(e.target.value)}
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

                {/* Add-on configurator — same groups, same prices, as the
                    pricing section's "Customise & Add to Cart" sheet. */}
                {directHasAddOns && directPlanObj && (
                  <div style={{ marginBottom: 16 }}>
                    {(directPlanObj.addOnGroups ?? []).map((g) => {
                      const chosen = directSelections[g.id] ?? [];
                      const isMulti = g.selectionType === "multi-optional";
                      const showNoneRow = g.selectionType === "single-optional";
                      return (
                        <div className="bkaddon-group" key={g.id}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              gap: 8,
                              marginBottom: 8,
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  fontSize: "0.85rem",
                                  fontWeight: 700,
                                  color: "#0A2540",
                                }}
                              >
                                {g.title}
                              </div>
                              {g.helperText && (
                                <div
                                  style={{
                                    fontSize: "0.72rem",
                                    color: "#8598B3",
                                    marginTop: 2,
                                  }}
                                >
                                  {g.helperText}
                                </div>
                              )}
                            </div>
                            <span
                              className={`bkaddon-group-tag ${g.selectionType === "single-required" ? "required" : "optional"}`}
                            >
                              {g.selectionType === "single-required"
                                ? "Required"
                                : g.selectionType === "multi-optional"
                                  ? "Select any"
                                  : "Select up to 1"}
                            </span>
                          </div>

                          {showNoneRow && (
                            <label
                              className="bkaddon-row"
                              onClick={() =>
                                setDirectSelections((prev) => ({
                                  ...prev,
                                  [g.id]: [],
                                }))
                              }
                            >
                              <span
                                className={`bkaddon-row-indicator radio${chosen.length === 0 ? " checked" : ""}`}
                              >
                                {chosen.length === 0 && (
                                  <span className="bkradio-dot" />
                                )}
                              </span>
                              <span
                                className="bkaddon-row-label"
                                style={{ color: "#8598B3" }}
                              >
                                None, thanks
                              </span>
                            </label>
                          )}

                          {g.choices.map((c) => {
                            const isChecked = chosen.includes(c.id);
                            const shape = isMulti ? "checkbox" : "radio";
                            return (
                              <label
                                key={c.id}
                                className="bkaddon-row"
                                onClick={() => toggleDirectChoice(g, c.id)}
                              >
                                <span
                                  className={`bkaddon-row-indicator ${shape}${isChecked ? " checked" : ""}`}
                                >
                                  {isChecked &&
                                    (shape === "checkbox" ? (
                                      <Check
                                        size={12}
                                        strokeWidth={3.2}
                                        color="#fff"
                                      />
                                    ) : (
                                      <span className="bkradio-dot" />
                                    ))}
                                </span>
                                <span className="bkaddon-row-label">
                                  <span className="bkaddon-row-label-line">
                                    {c.label}
                                    {c.recommended && (
                                      <span className="bkaddon-row-rec">
                                        Recommended
                                      </span>
                                    )}
                                  </span>
                                  {c.note && (
                                    <span className="bkaddon-row-note">
                                      {c.note}
                                    </span>
                                  )}
                                </span>
                                <span className="bkaddon-row-price">
                                  {c.price > 0 ? `+₹${c.price}` : "Free"}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

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
                <MapPin
                  size={17}
                  strokeWidth={2.2}
                  style={{ flexShrink: 0, marginTop: 1 }}
                />
                <span>
                  Standalone bike wash is available{" "}
                  <strong>within 2 km of Jadavpur, Kolkata only</strong>.
                  Outside this area, bike wash is available only when combined
                  with a car wash booking. Not sure? Call us at{" "}
                  <strong>+91 94775 88518</strong>.
                </span>
              </div>
            )}

            {/* Vehicle field */}
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
                      <BikeIcon size={15} strokeWidth={2.2} />
                      {type}
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

            {/* Price display */}
            {form.price && (
              <div
                style={{
                  background: "linear-gradient(135deg, #EFF6FF, #F3F8FF)",
                  border: "2px solid #2979D8",
                  borderRadius: 12,
                  padding: "12px 16px",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#0A2540",
                  }}
                >
                  {cartMode ? "Order Total" : "Estimated Price"}
                </span>
                <span
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    color: "#2979D8",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {form.price}
                </span>
              </div>
            )}

            <FormGroup label="Vehicle Model (Optional)">
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
              />
            </FormGroup>

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

            <FormGroup label="Additional Notes">
              <FocusTextarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={3}
                placeholder="Any special requests…"
              />
            </FormGroup>

            {/* Toast */}
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
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    justifyContent: "center",
                  }}
                >
                  {toast.status === "success" ? (
                    <CheckCircle2 size={17} strokeWidth={2.2} />
                  ) : (
                    <AlertCircle size={17} strokeWidth={2.2} />
                  )}
                  {toast.message}
                </span>
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
                      <MessageCircle size={14} strokeWidth={2.3} />
                      Book directly via WhatsApp
                    </a>
                  </div>
                )}
              </div>
            )}

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
                  fontFamily: "'Inter', sans-serif",
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
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.95rem",
        fontWeight: 700,
        cursor: submitting ? "not-allowed" : "pointer",
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      {submitting ? (
        <>
          <Loader2 size={16} strokeWidth={2.4} className="spin-icon" />
          Sending…
        </>
      ) : (
        <>
          <CalendarCheck size={16} strokeWidth={2.4} />
          Submit Booking
        </>
      )}
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
