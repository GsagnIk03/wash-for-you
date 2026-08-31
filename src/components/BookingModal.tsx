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
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { PRICING_PLANS, BIKE_PLAN, SERVICE_AREAS } from "../data";
import { useCart } from "../context/CartContext";
import type {
  BookingFormData,
  ToastState,
  AddOnGroup,
  CartItem,
  CartAddOnSelection,
  VehicleBookingPayload,
} from "../types";

const ALL_PLANS = [...PRICING_PLANS, BIKE_PLAN];
const BIKE_TYPES = ["Bike", "Scooty"];

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;
const SUPPORT_PHONE_DISPLAY = "+91 94775 88518";

// Named-locality dropdown for the serviceability check — picking from an
// exact area name sidesteps the fuzziness of pincode boundaries entirely.
// Car bookings are serviceable across every area we already advertise in
// "Service Areas". Bike-only bookings use a tighter footprint — just
// Jadavpur itself — matching the ~2km radius called out in the bike-wash
// area notice below.
const OTHER_LOCALITY = "Other";
const LOCALITY_OPTIONS = [...SERVICE_AREAS, OTHER_LOCALITY];
const CAR_SERVICEABLE_AREAS = SERVICE_AREAS;
const BIKE_SERVICEABLE_AREAS = ["Jadavpur"];

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

// Reconstructs a selections map from an existing cart item's stored add-ons —
// used to seed the "edit add-ons" panel with what's already chosen.
const selectionsFromCartItem = (
  item: CartItem,
  groups: AddOnGroup[],
): Record<string, string[]> => {
  const init: Record<string, string[]> = {};
  groups.forEach((g) => {
    const found = item.addOns.find((a) => a.groupId === g.id);
    init[g.id] = found
      ? found.choiceIds
      : g.selectionType === "single-required"
        ? [g.choices[0].id]
        : [];
  });
  return init;
};

// Same single-required / single-optional / multi-optional toggle rules used
// everywhere add-ons are picked (Pricing's sheet, the "add a service" panel,
// and the per-item "edit add-ons" panel here).
function toggleAddOnChoice(
  prev: Record<string, string[]>,
  group: AddOnGroup,
  choiceId: string,
): Record<string, string[]> {
  const current = prev[group.id] ?? [];
  if (group.selectionType === "single-required") {
    return { ...prev, [group.id]: [choiceId] };
  }
  if (group.selectionType === "single-optional") {
    return { ...prev, [group.id]: current[0] === choiceId ? [] : [choiceId] };
  }
  const has = current.includes(choiceId);
  return {
    ...prev,
    [group.id]: has
      ? current.filter((id) => id !== choiceId)
      : [...current, choiceId],
  };
}

function computeAddOns(
  groups: AddOnGroup[],
  selections: Record<string, string[]>,
): { addOns: CartAddOnSelection[]; addOnsTotal: number } {
  const addOns: CartAddOnSelection[] = groups
    .map((g) => {
      const chosenIds = selections[g.id] ?? [];
      const chosenChoices = g.choices.filter((c) => chosenIds.includes(c.id));
      if (chosenChoices.length === 0) return null;
      return {
        groupId: g.id,
        groupTitle: g.title,
        choiceIds: chosenChoices.map((c) => c.id),
        choiceLabels: chosenChoices.map((c) => c.label),
        addedPrice: chosenChoices.reduce((s, c) => s + c.price, 0),
      } as CartAddOnSelection;
    })
    .filter((x): x is CartAddOnSelection => x !== null);
  const addOnsTotal = addOns.reduce((s, a) => s + a.addedPrice, 0);
  return { addOns, addOnsTotal };
}

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

  .pill-toggle-group { display: flex; gap: 10px; margin-bottom: 20px; }
  .pill-toggle-btn {
    flex: 1; padding: 11px 0; border-radius: 10px; border: 1.5px solid rgba(41,121,216,0.2); background: #F3F8FF;
    color: #4A6FA5; font-family: 'Inter', sans-serif; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 0.2s ease;
  }
  .pill-toggle-btn.active { background: #2979D8; border-color: #2979D8; color: #fff; box-shadow: 0 4px 12px rgba(41,121,216,0.3); }

  .vehicle-card { border: 1.5px solid rgba(41,121,216,0.15); border-radius: 14px; padding: 16px; margin-bottom: 14px; background: #FAFCFF; }
  .vehicle-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 10px; }
  .vehicle-badge {
    display: inline-flex; align-items: center; font-size: 0.68rem; font-weight: 800; letter-spacing: 0.04em;
    text-transform: uppercase; color: #2979D8; background: #EAF3FF; padding: 3px 9px; border-radius: 6px; margin-bottom: 4px;
  }
  .vehicle-icon-btn {
    width: 30px; height: 30px; border-radius: 8px; border: none; display: flex; align-items: center;
    justify-content: center; cursor: pointer; flex-shrink: 0; transition: background 0.2s ease;
  }
  .vehicle-icon-btn.edit { background: #EAF3FF; color: #2979D8; }
  .vehicle-icon-btn.edit:hover { background: #d9ecff; }
  .vehicle-icon-btn.remove { background: #FEF0F0; color: #E74C3C; }
  .vehicle-icon-btn.remove:hover { background: #fde2e2; }

  .same-as-row { display: flex; align-items: center; gap: 10px; padding: 6px 2px; cursor: pointer; margin-bottom: 4px; -webkit-tap-highlight-color: transparent; }
  .same-as-note { font-size: 0.76rem; color: #8598B3; margin: 0 0 12px 30px; line-height: 1.5; }

  .add-service-toggle-btn {
    width: 100%; padding: 13px 0; border-radius: 12px; border: 1.5px dashed rgba(41,121,216,0.35);
    background: #F3F8FF; color: #2979D8; font-family: 'Inter', sans-serif; font-weight: 700; font-size: 0.88rem;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s ease; margin-bottom: 16px;
  }
  .add-service-toggle-btn:hover { background: #E8F1FB; }
  .add-service-panel { border: 1.5px solid rgba(41,121,216,0.2); border-radius: 14px; padding: 16px; margin-bottom: 16px; background: #F9FBFF; }
  .empty-cart-hint {
    text-align: center; padding: 22px 10px; color: #8598B3; font-size: 0.85rem;
    border: 1.5px dashed rgba(41,121,216,0.2); border-radius: 12px; margin-bottom: 16px; line-height: 1.6;
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
}

const EMPTY_FORM: BookingFormData = {
  from_name: "",
  from_email: "",
  phone: "",
  message: "",
};

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
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

  const [mode, setMode] = useState<"service" | "general">("service");
  const [form, setForm] = useState<BookingFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    message: "",
    status: "idle",
  });
  // Defaults to checked — most doorstep visits do need this, and unchecking
  // it is a deliberate "actually, I can't provide this" signal from the
  // customer, which we then block on (see handleSubmit).
  const [waterElectricConfirmed, setWaterElectricConfirmed] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Inline "add a service" panel — appends a new item straight into the
  // shared cart, same as Pricing's "Customise & Add to Cart" sheet.
  const [addPickerOpen, setAddPickerOpen] = useState(false);
  const [addPickerPlanName, setAddPickerPlanName] = useState("");
  const [addPickerSelections, setAddPickerSelections] = useState<
    Record<string, string[]>
  >({});

  // Which existing cart item's add-ons are being re-customized inline.
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editSelections, setEditSelections] = useState<
    Record<string, string[]>
  >({});

  // Reset transient form state each time the modal is (re)opened — the cart
  // itself is left untouched, since persisting it across opens/closes is the
  // whole point (see App.tsx / CartDrawer.tsx).
  useEffect(() => {
    if (isOpen) {
      setMode("service");
      setForm(EMPTY_FORM);
      setWaterElectricConfirmed(true);
      setAddPickerOpen(false);
      setAddPickerPlanName("");
      setAddPickerSelections({});
      setEditingItemId(null);
      setToast({ message: "", status: "idle" });
    }
  }, [isOpen]);

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

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setForm((f) => ({ ...f, [name]: value.replace(/[^\d\s+]/g, "") }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  // ── "Add a service" inline picker ──────────────────────────────────────
  const addPickerPlan = ALL_PLANS.find((p) => p.name === addPickerPlanName);
  const addPickerGroups = addPickerPlan?.addOnGroups ?? [];
  const { addOnsTotal: addPickerAddOnsTotal } = computeAddOns(
    addPickerGroups,
    addPickerSelections,
  );
  const addPickerTotalPrice = addPickerPlan
    ? addPickerPlan.price + addPickerAddOnsTotal
    : 0;

  const openAddPicker = () => {
    setAddPickerOpen(true);
    setAddPickerPlanName("");
    setAddPickerSelections({});
  };

  const handleAddPickerPlanChange = (planName: string) => {
    setAddPickerPlanName(planName);
    const plan = ALL_PLANS.find((p) => p.name === planName);
    setAddPickerSelections(buildAddOnDefaults(plan?.addOnGroups));
  };

  const confirmAddService = () => {
    if (!addPickerPlan) return;
    const { addOns, addOnsTotal } = computeAddOns(
      addPickerGroups,
      addPickerSelections,
    );
    const isFirst = cart.items.length === 0;
    cart.addItem({
      planName: addPickerPlan.name,
      basePrice: addPickerPlan.price,
      addOns,
      totalPrice: addPickerPlan.price + addOnsTotal,
      estimatedTime: addPickerPlan.estimatedTime,
      vehicleType: "",
      vehicleModel: "",
      vehicleNumber: "",
      address: "",
      locality: "",
      preferredDate: "",
      // Every item after the first defaults to mirroring Vehicle #1 — most
      // multi-vehicle bookings are the same address/date, and unchecking is
      // one click away (see VehicleCard's "Same as Vehicle #1" rows).
      sameAddressAsFirst: !isFirst,
      sameDateAsFirst: !isFirst,
      sameModelAsFirst: !isFirst,
    });
    setAddPickerOpen(false);
    setAddPickerPlanName("");
    setAddPickerSelections({});
  };

  // ── Editing an existing item's add-ons ─────────────────────────────────
  const startEditItem = (item: CartItem) => {
    const plan = ALL_PLANS.find((p) => p.name === item.planName);
    setEditingItemId(item.id);
    setEditSelections(selectionsFromCartItem(item, plan?.addOnGroups ?? []));
  };

  const saveEditItem = (item: CartItem) => {
    const plan = ALL_PLANS.find((p) => p.name === item.planName);
    const groups = plan?.addOnGroups ?? [];
    const { addOns, addOnsTotal } = computeAddOns(groups, editSelections);
    cart.updateItem(item.id, {
      addOns,
      totalPrice: (plan?.price ?? item.basePrice) + addOnsTotal,
    });
    setEditingItemId(null);
  };

  // Removing Vehicle #1 promotes Vehicle #2 into that slot — if it was
  // mirroring Vehicle #1's address/date/model, carry those values down first
  // so they don't just vanish along with the item that owned them.
  const removeVehicle = (removedId: string) => {
    const idx = cart.items.findIndex((i) => i.id === removedId);
    if (idx === 0 && cart.items.length > 1) {
      const oldFirst = cart.items[0];
      const newFirst = cart.items[1];
      const patch: Partial<CartItem> = {};
      if (newFirst.sameAddressAsFirst ?? true) {
        patch.address = oldFirst.address;
        patch.locality = oldFirst.locality;
      }
      if (newFirst.sameDateAsFirst ?? true) {
        patch.preferredDate = oldFirst.preferredDate;
      }
      if (newFirst.sameModelAsFirst ?? true) {
        patch.vehicleModel = oldFirst.vehicleModel;
      }
      if (Object.keys(patch).length > 0) {
        cart.updateItem(newFirst.id, patch);
      }
    }
    cart.removeItem(removedId);
    if (editingItemId === removedId) setEditingItemId(null);
  };

  // ── Payload / message building ──────────────────────────────────────────
  const buildVehiclePayloads = (): VehicleBookingPayload[] => {
    const first = cart.items[0];
    return cart.items.map((item, idx) => {
      const isFirst = idx === 0;
      const usesOwnAddress = isFirst || !(item.sameAddressAsFirst ?? true);
      const usesOwnDate = isFirst || !(item.sameDateAsFirst ?? true);
      const usesOwnModel = isFirst || !(item.sameModelAsFirst ?? true);
      const addOnLabels = item.addOns.flatMap((a) => a.choiceLabels);
      const serviceLabel =
        addOnLabels.length > 0
          ? `${item.planName} — ${addOnLabels.join(", ")}`
          : item.planName;
      return {
        vehicleLabel: `Vehicle #${idx + 1}`,
        service: serviceLabel,
        vehicleType:
          item.planName === BIKE_PLAN.name ? (item.vehicleType ?? "") : "",
        vehicleModel:
          (usesOwnModel ? item.vehicleModel : first?.vehicleModel) ?? "",
        vehicleNumber: item.vehicleNumber ?? "",
        address: (usesOwnAddress ? item.address : first?.address) ?? "",
        locality: (usesOwnAddress ? item.locality : first?.locality) ?? "",
        preferredDate:
          (usesOwnDate ? item.preferredDate : first?.preferredDate) ?? "",
        price: `₹${item.totalPrice}`,
      };
    });
  };

  const buildWhatsAppURL = () => {
    if (mode === "general") {
      const lines = [
        `New General Query — Wash For U`,
        ``,
        `Name: ${form.from_name}`,
        `Phone: ${form.phone}`,
        `Email: ${form.from_email}`,
        `Message: ${form.message}`,
      ];
      return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    }
    const vehicles = buildVehiclePayloads();
    const lines = [
      `New Booking — Wash For U`,
      ``,
      `Name: ${form.from_name}`,
      `Phone: ${form.phone}`,
      `Email: ${form.from_email}`,
      ``,
      ...vehicles.flatMap((v) => [
        `— ${v.vehicleLabel} —`,
        `Service: ${v.service}`,
        ...(v.vehicleType ? [`Vehicle Type: ${v.vehicleType}`] : []),
        `Model: ${v.vehicleModel || "Not specified"}`,
        `Number: ${v.vehicleNumber || "Not specified"}`,
        `Address: ${v.address || "Not specified"}`,
        `Locality: ${v.locality || "Not specified"}`,
        `Date & Time: ${v.preferredDate || "Not specified"}`,
        `Price: ${v.price}`,
        ``,
      ]),
      `Notes: ${form.message || "None"}`,
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

    let payload: Record<string, unknown>;

    if (mode === "general") {
      if (!form.message.trim()) {
        showToast("Please describe your question.", true);
        return;
      }
      payload = {
        mode: "general",
        from_name: form.from_name,
        from_email: form.from_email,
        phone: form.phone,
        message: form.message,
      };
    } else {
      if (cart.items.length === 0) {
        showToast("Please add at least one service to your booking.", true);
        return;
      }
      const vehicles = buildVehiclePayloads();
      for (let i = 0; i < vehicles.length; i++) {
        const v = vehicles[i];
        const item = cart.items[i];
        const isBikeItem = item.planName === BIKE_PLAN.name;
        if (!v.address.trim()) {
          showToast(`Please enter the address for ${v.vehicleLabel}.`, true);
          return;
        }
        if (!v.locality) {
          showToast(`Please select the locality for ${v.vehicleLabel}.`, true);
          return;
        }
        const serviceableAreas = isBikeItem
          ? BIKE_SERVICEABLE_AREAS
          : CAR_SERVICEABLE_AREAS;
        if (!serviceableAreas.includes(v.locality)) {
          showToast(
            `We may not be serviceable to your area for ${v.vehicleLabel}. Please call our support number (${SUPPORT_PHONE_DISPLAY}) directly to check if a technician is available to visit you.`,
            true,
          );
          return;
        }
        if (isBikeItem && !v.vehicleType) {
          showToast(
            `Please select Bike or Scooty for ${v.vehicleLabel}.`,
            true,
          );
          return;
        }
      }
      if (!waterElectricConfirmed) {
        showToast(
          "Without providing either water or an electrical point, the service request cannot be placed.",
          true,
        );
        return;
      }
      payload = {
        mode: "service",
        from_name: form.from_name,
        from_email: form.from_email,
        phone: form.phone,
        message: form.message,
        vehicles,
      };
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/send-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

      // Build the WhatsApp link from the current (pre-reset) state before
      // clearing anything below.
      const whatsAppUrl = buildWhatsAppURL();
      showToast(
        mode === "general"
          ? "Query submitted! Opening WhatsApp now…"
          : "Booking confirmed! Opening WhatsApp now…",
      );
      setForm(EMPTY_FORM);
      setWaterElectricConfirmed(true);
      if (mode === "service") cart.clear();
      setTimeout(() => {
        window.open(whatsAppUrl, "_blank", "noopener,noreferrer");
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
            {/* Book a Service vs General Question */}
            <div className="pill-toggle-group">
              <button
                type="button"
                className={`pill-toggle-btn${mode === "service" ? " active" : ""}`}
                onClick={() => setMode("service")}
              >
                Book a Service
              </button>
              <button
                type="button"
                className={`pill-toggle-btn${mode === "general" ? " active" : ""}`}
                onClick={() => setMode("general")}
              >
                General Question
              </button>
            </div>

            {/* Shared contact fields */}
            <div className="modal-grid">
              <FormGroup label="Full Name *">
                <FocusInput
                  type="text"
                  name="from_name"
                  value={form.from_name}
                  onChange={handleFieldChange}
                  placeholder="Rahul Sharma"
                  required
                />
              </FormGroup>
              <FormGroup label="Phone / WhatsApp *">
                <FocusInput
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleFieldChange}
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
                onChange={handleFieldChange}
                placeholder="rahul@example.com"
                required
              />
            </FormGroup>

            {mode === "general" ? (
              <FormGroup label="Your Question / Message *">
                <FocusTextarea
                  name="message"
                  value={form.message}
                  onChange={handleFieldChange}
                  rows={4}
                  placeholder="What would you like to know?"
                  required
                />
              </FormGroup>
            ) : (
              <>
                {cart.items.length === 0 && !addPickerOpen && (
                  <div className="empty-cart-hint">
                    No services added yet — add one below to get started.
                  </div>
                )}

                {cart.items.map((item, idx) => (
                  <VehicleCard
                    key={item.id}
                    item={item}
                    index={idx}
                    firstItem={cart.items[0]}
                    isEditing={editingItemId === item.id}
                    editSelections={editSelections}
                    onStartEdit={() => startEditItem(item)}
                    onCancelEdit={() => setEditingItemId(null)}
                    onToggleEditChoice={(g, cid) =>
                      setEditSelections((prev) =>
                        toggleAddOnChoice(prev, g, cid),
                      )
                    }
                    onSelectNoneEdit={(g) =>
                      setEditSelections((prev) => ({ ...prev, [g.id]: [] }))
                    }
                    onSaveEdit={() => saveEditItem(item)}
                    onRemove={() => removeVehicle(item.id)}
                    onPatch={(patch) => cart.updateItem(item.id, patch)}
                  />
                ))}

                {cart.items.length > 0 && (
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
                      Total ({cart.items.length}{" "}
                      {cart.items.length === 1 ? "service" : "services"})
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
                      ₹{cart.total}
                    </span>
                  </div>
                )}

                {addPickerOpen ? (
                  <div className="add-service-panel">
                    <FormGroup label="Service *">
                      <FocusSelect
                        value={addPickerPlanName}
                        onChange={(e) =>
                          handleAddPickerPlanChange(e.target.value)
                        }
                        required
                      >
                        <option value="" disabled>
                          Select service…
                        </option>
                        {ALL_PLANS.map((p) => (
                          <option key={p.name} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </FocusSelect>
                    </FormGroup>

                    {addPickerPlan && addPickerGroups.length > 0 && (
                      <AddOnGroupsEditor
                        groups={addPickerGroups}
                        selections={addPickerSelections}
                        onToggle={(g, cid) =>
                          setAddPickerSelections((prev) =>
                            toggleAddOnChoice(prev, g, cid),
                          )
                        }
                        onSelectNone={(g) =>
                          setAddPickerSelections((prev) => ({
                            ...prev,
                            [g.id]: [],
                          }))
                        }
                      />
                    )}

                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <button
                        type="button"
                        onClick={() => setAddPickerOpen(false)}
                        style={{
                          flex: 1,
                          padding: "11px 0",
                          borderRadius: 10,
                          border: "1.5px solid #dbeafe",
                          background: "#fff",
                          color: "#4A6FA5",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={!addPickerPlan}
                        onClick={confirmAddService}
                        style={{
                          flex: 2,
                          padding: "11px 0",
                          borderRadius: 10,
                          border: "none",
                          background: addPickerPlan ? "#2979D8" : "#a9c3e8",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          cursor: addPickerPlan ? "pointer" : "not-allowed",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Add to Booking
                        {addPickerPlan ? ` · ₹${addPickerTotalPrice}` : ""}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="add-service-toggle-btn"
                    onClick={openAddPicker}
                  >
                    <Plus size={16} strokeWidth={2.6} />
                    {cart.items.length === 0
                      ? "Add a Service"
                      : "Add Another Service"}
                  </button>
                )}

                {cart.items.length > 0 && (
                  <div
                    className="bkaddon-row"
                    style={{ padding: "4px 2px", marginBottom: 8 }}
                    onClick={() => setWaterElectricConfirmed((v) => !v)}
                  >
                    <span
                      className={`bkaddon-row-indicator checkbox${waterElectricConfirmed ? " checked" : ""}`}
                    >
                      {waterElectricConfirmed && (
                        <Check size={12} strokeWidth={3.2} color="#fff" />
                      )}
                    </span>
                    <span
                      className="bkaddon-row-label"
                      style={{ fontWeight: 500 }}
                    >
                      Provide water + one electrical point
                    </span>
                  </div>
                )}

                <FormGroup label="Additional Notes">
                  <FocusTextarea
                    name="message"
                    value={form.message}
                    onChange={handleFieldChange}
                    rows={3}
                    placeholder="Any special requests…"
                  />
                </FormGroup>
              </>
            )}

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
                      href={buildWhatsAppURL()}
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

// ─── One "Vehicle #N" card in the itemized list ───────────────────────────
const VehicleCard: React.FC<{
  item: CartItem;
  index: number;
  firstItem: CartItem;
  isEditing: boolean;
  editSelections: Record<string, string[]>;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onToggleEditChoice: (group: AddOnGroup, choiceId: string) => void;
  onSelectNoneEdit: (group: AddOnGroup) => void;
  onSaveEdit: () => void;
  onRemove: () => void;
  onPatch: (patch: Partial<CartItem>) => void;
}> = ({
  item,
  index,
  firstItem,
  isEditing,
  editSelections,
  onStartEdit,
  onCancelEdit,
  onToggleEditChoice,
  onSelectNoneEdit,
  onSaveEdit,
  onRemove,
  onPatch,
}) => {
  const plan = ALL_PLANS.find((p) => p.name === item.planName);
  const isBikeItem = item.planName === BIKE_PLAN.name;
  const isFirst = index === 0;
  const hasAddOns = !!plan?.addOnGroups?.length;

  const sameAddress = item.sameAddressAsFirst ?? true;
  const sameDate = item.sameDateAsFirst ?? true;
  const sameModel = item.sameModelAsFirst ?? true;

  const modelPlaceholder = isBikeItem
    ? "e.g. Honda Activa, Royal Enfield 350…"
    : "e.g. Maruti Swift, Hyundai Creta…";

  return (
    <div className="vehicle-card">
      <div className="vehicle-card-header">
        <div>
          <div className="vehicle-badge">Vehicle #{index + 1}</div>
          <div
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700,
              fontSize: "0.95rem",
              color: "#0A2540",
            }}
          >
            {item.planName}
          </div>
          {item.addOns.length > 0 && (
            <div
              style={{ fontSize: "0.76rem", color: "#4A6FA5", marginTop: 2 }}
            >
              {item.addOns.flatMap((a) => a.choiceLabels).join(", ")}
            </div>
          )}
          <div
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700,
              color: "#2979D8",
              marginTop: 4,
            }}
          >
            ₹{item.totalPrice}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          {hasAddOns && !isEditing && (
            <button
              type="button"
              className="vehicle-icon-btn edit"
              onClick={onStartEdit}
              aria-label={`Edit add-ons for Vehicle ${index + 1}`}
              title="Edit add-ons"
            >
              <Pencil size={14} strokeWidth={2.2} />
            </button>
          )}
          <button
            type="button"
            className="vehicle-icon-btn remove"
            onClick={onRemove}
            aria-label={`Remove Vehicle ${index + 1}`}
            title="Remove"
          >
            <Trash2 size={14} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {isEditing && plan?.addOnGroups && (
        <div
          style={{
            marginBottom: 14,
            borderTop: "1px solid #EEF3FA",
            borderBottom: "1px solid #EEF3FA",
            padding: "4px 0 8px",
          }}
        >
          <AddOnGroupsEditor
            groups={plan.addOnGroups}
            selections={editSelections}
            onToggle={onToggleEditChoice}
            onSelectNone={onSelectNoneEdit}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button
              type="button"
              onClick={onCancelEdit}
              style={{
                flex: 1,
                padding: "9px 0",
                borderRadius: 8,
                border: "1.5px solid #dbeafe",
                background: "#fff",
                color: "#4A6FA5",
                fontWeight: 600,
                fontSize: "0.82rem",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSaveEdit}
              style={{
                flex: 1,
                padding: "9px 0",
                borderRadius: 8,
                border: "none",
                background: "#2979D8",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {isBikeItem && (
        <FormGroup label="Two-Wheeler Type *">
          <div className="bike-type-group">
            {BIKE_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                className={`bike-type-btn${item.vehicleType === type ? " active" : ""}`}
                onClick={() => onPatch({ vehicleType: type })}
              >
                <BikeIcon size={15} strokeWidth={2.2} />
                {type}
              </button>
            ))}
          </div>
        </FormGroup>
      )}

      {/* Vehicle Model */}
      {isFirst ? (
        <FormGroup label="Vehicle Model (Optional)">
          <FocusInput
            type="text"
            value={item.vehicleModel ?? ""}
            onChange={(e) => onPatch({ vehicleModel: e.target.value })}
            placeholder={modelPlaceholder}
          />
        </FormGroup>
      ) : (
        <>
          <label
            className="same-as-row"
            onClick={() => onPatch({ sameModelAsFirst: !sameModel })}
          >
            <span
              className={`bkaddon-row-indicator checkbox${sameModel ? " checked" : ""}`}
            >
              {sameModel && <Check size={12} strokeWidth={3.2} color="#fff" />}
            </span>
            <span
              style={{ fontSize: "0.85rem", color: "#17293D", fontWeight: 500 }}
            >
              Same vehicle model as Vehicle #1
            </span>
          </label>
          {sameModel ? (
            firstItem.vehicleModel && (
              <div className="same-as-note">{firstItem.vehicleModel}</div>
            )
          ) : (
            <FormGroup label="Vehicle Model (Optional)">
              <FocusInput
                type="text"
                value={item.vehicleModel ?? ""}
                onChange={(e) => onPatch({ vehicleModel: e.target.value })}
                placeholder={modelPlaceholder}
              />
            </FormGroup>
          )}
        </>
      )}

      {/* Vehicle Number — always its own field; two vehicles are never the
          same number, so there's no "same as" shortcut for it. */}
      <FormGroup label="Vehicle Number (Optional)">
        <FocusInput
          type="text"
          value={item.vehicleNumber ?? ""}
          onChange={(e) => onPatch({ vehicleNumber: e.target.value })}
          placeholder="WB 06 AB 1234"
        />
      </FormGroup>

      {/* Address + Locality (bundled under one "Same as" checkbox) */}
      {isFirst ? (
        <>
          <FormGroup label="Address *">
            <FocusTextarea
              value={item.address ?? ""}
              onChange={(e) => onPatch({ address: e.target.value })}
              rows={2}
              placeholder="Flat / house no., street, landmark, area"
              required
            />
          </FormGroup>
          <FormGroup label="Locality *">
            <FocusSelect
              value={item.locality ?? ""}
              onChange={(e) => onPatch({ locality: e.target.value })}
              required
            >
              <option value="" disabled>
                Select your area…
              </option>
              {LOCALITY_OPTIONS.map((area) => (
                <option key={area} value={area}>
                  {area === OTHER_LOCALITY
                    ? "Other (outside these areas)"
                    : area}
                </option>
              ))}
            </FocusSelect>
          </FormGroup>
        </>
      ) : (
        <>
          <label
            className="same-as-row"
            onClick={() => onPatch({ sameAddressAsFirst: !sameAddress })}
          >
            <span
              className={`bkaddon-row-indicator checkbox${sameAddress ? " checked" : ""}`}
            >
              {sameAddress && (
                <Check size={12} strokeWidth={3.2} color="#fff" />
              )}
            </span>
            <span
              style={{ fontSize: "0.85rem", color: "#17293D", fontWeight: 500 }}
            >
              Same address as Vehicle #1
            </span>
          </label>
          {sameAddress ? (
            (firstItem.address || firstItem.locality) && (
              <div className="same-as-note">
                {[firstItem.address, firstItem.locality]
                  .filter(Boolean)
                  .join(" — ")}
              </div>
            )
          ) : (
            <>
              <FormGroup label="Address *">
                <FocusTextarea
                  value={item.address ?? ""}
                  onChange={(e) => onPatch({ address: e.target.value })}
                  rows={2}
                  placeholder="Flat / house no., street, landmark, area"
                  required
                />
              </FormGroup>
              <FormGroup label="Locality *">
                <FocusSelect
                  value={item.locality ?? ""}
                  onChange={(e) => onPatch({ locality: e.target.value })}
                  required
                >
                  <option value="" disabled>
                    Select your area…
                  </option>
                  {LOCALITY_OPTIONS.map((area) => (
                    <option key={area} value={area}>
                      {area === OTHER_LOCALITY
                        ? "Other (outside these areas)"
                        : area}
                    </option>
                  ))}
                </FocusSelect>
              </FormGroup>
            </>
          )}
        </>
      )}

      {isBikeItem && (
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
            <strong>within 2 km of Jadavpur, Kolkata only</strong>. Outside this
            area, bike wash is available only when combined with a car wash
            booking. Not sure? Call us at{" "}
            <strong>{SUPPORT_PHONE_DISPLAY}</strong>.
          </span>
        </div>
      )}

      {/* Preferred Date & Time */}
      {isFirst ? (
        <FormGroup label="Preferred Date & Time">
          <FocusInput
            type="datetime-local"
            value={item.preferredDate ?? ""}
            onChange={(e) => onPatch({ preferredDate: e.target.value })}
          />
        </FormGroup>
      ) : (
        <>
          <label
            className="same-as-row"
            onClick={() => onPatch({ sameDateAsFirst: !sameDate })}
          >
            <span
              className={`bkaddon-row-indicator checkbox${sameDate ? " checked" : ""}`}
            >
              {sameDate && <Check size={12} strokeWidth={3.2} color="#fff" />}
            </span>
            <span
              style={{ fontSize: "0.85rem", color: "#17293D", fontWeight: 500 }}
            >
              Same date &amp; time as Vehicle #1
            </span>
          </label>
          {sameDate ? (
            firstItem.preferredDate && (
              <div className="same-as-note">
                {firstItem.preferredDate.replace("T", " ")}
              </div>
            )
          ) : (
            <FormGroup label="Preferred Date & Time">
              <FocusInput
                type="datetime-local"
                value={item.preferredDate ?? ""}
                onChange={(e) => onPatch({ preferredDate: e.target.value })}
              />
            </FormGroup>
          )}
        </>
      )}
    </div>
  );
};

// Shared add-on group renderer — used by both the "add a service" panel and
// each VehicleCard's inline "edit add-ons" panel.
const AddOnGroupsEditor: React.FC<{
  groups: AddOnGroup[];
  selections: Record<string, string[]>;
  onToggle: (group: AddOnGroup, choiceId: string) => void;
  onSelectNone: (group: AddOnGroup) => void;
}> = ({ groups, selections, onToggle, onSelectNone }) => (
  <>
    {groups.map((g) => {
      const chosen = selections[g.id] ?? [];
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
            <label className="bkaddon-row" onClick={() => onSelectNone(g)}>
              <span
                className={`bkaddon-row-indicator radio${chosen.length === 0 ? " checked" : ""}`}
              >
                {chosen.length === 0 && <span className="bkradio-dot" />}
              </span>
              <span className="bkaddon-row-label" style={{ color: "#8598B3" }}>
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
                onClick={() => onToggle(g, c.id)}
              >
                <span
                  className={`bkaddon-row-indicator ${shape}${isChecked ? " checked" : ""}`}
                >
                  {isChecked &&
                    (shape === "checkbox" ? (
                      <Check size={12} strokeWidth={3.2} color="#fff" />
                    ) : (
                      <span className="bkradio-dot" />
                    ))}
                </span>
                <span className="bkaddon-row-label">
                  <span className="bkaddon-row-label-line">
                    {c.label}
                    {c.recommended && (
                      <span className="bkaddon-row-rec">Recommended</span>
                    )}
                  </span>
                  {c.note && <span className="bkaddon-row-note">{c.note}</span>}
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
  </>
);

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
