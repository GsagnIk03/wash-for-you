// ─── Data Types ───────────────────────────────────────────────

// Keys into the icon maps declared alongside each component
// (see IconKey usage in History.tsx, ContactStrip.tsx).
export type IconKey = string;

export interface TimelineItem {
  year: string;
  icon: IconKey;
  title: string;
  description: string;
}

// ─── Add-ons / configurable plans ───────────────────────────────

export interface AddOnChoice {
  id: string;
  label: string;
  price: number; // 0 = no extra charge
  recommended?: boolean;
  note?: string; // short muted caption shown under the label, e.g. "Recommended for light stains"
}

// single-required: exactly one choice, pre-selected, changes the price (e.g. vehicle type)
// single-optional: zero or one choice ("choose any 1")
// multi-optional: zero or more choices, independently toggleable
export type AddOnSelectionType =
  | "single-required"
  | "single-optional"
  | "multi-optional";

export interface AddOnGroup {
  id: string;
  title: string;
  helperText?: string;
  selectionType: AddOnSelectionType;
  choices: AddOnChoice[];
}

export interface PricingPlan {
  name: string;
  tagline: string;
  price: number;
  suvSurcharge?: number; // extra charge for SUV/MUV — used by plans without addOnGroups
  vehicleNote?: string;
  features: string[];
  featured?: boolean;
  isBike?: boolean;
  bgImageKey?: string; // key into PRICING_BG_IMAGES (see Pricing.tsx)
  fullPhotoBg?: boolean; // when true, the photo covers the entire card instead of just a header band
  estimatedTime?: string; // e.g. "Up to 45 minutes — varies with add-ons"
  addOnGroups?: AddOnGroup[]; // when present, the card renders the add-on configurator
}

export interface AddonItem {
  icon: IconKey;
  name: string;
  price: number;
}

// ─── Cart ────────────────────────────────────────────────────────

export interface CartAddOnSelection {
  groupId: string;
  groupTitle: string;
  choiceIds: string[];
  choiceLabels: string[];
  addedPrice: number;
}

export interface CartItem {
  id: string;
  planName: string;
  basePrice: number;
  addOns: CartAddOnSelection[];
  totalPrice: number;
  estimatedTime?: string;

  // ─── Per-vehicle booking details ──────────────────────────────
  // Filled in on the booking form itself (not at add-to-cart time), since a
  // customer often hasn't decided addresses/dates until they see the whole
  // order together. Each cart item represents one "Vehicle #N" in the form.
  vehicleType?: string; // "Bike" | "Scooty" — only meaningful for Bike Wash items
  vehicleModel?: string;
  vehicleNumber?: string;
  address?: string;
  locality?: string;
  preferredDate?: string;

  // When true (the default for every item after the first), this item's
  // Address+Locality / Preferred Date / Vehicle Model mirror Vehicle #1's —
  // see the "Same as Vehicle #1" checkboxes in BookingModal. Meaningless for
  // the first item, which always shows and owns its own values. Vehicle
  // Number has no such shortcut — it's always entered per vehicle.
  sameAddressAsFirst?: boolean;
  sameDateAsFirst?: boolean;
  sameModelAsFirst?: boolean;
}

export interface ContactInfo {
  icon: IconKey;
  label: string;
  value: string;
}

export interface ReviewItem {
  author: string;
  rating: number; // 1-5
  text: string;
  relativeTime: string;
  profilePhotoUrl?: string;
}

// ─── Form Types ───────────────────────────────────────────────

// Shared contact details — the only fields that apply to the whole booking
// rather than to one vehicle. Everything vehicle-specific now lives on each
// CartItem (see above) and is resolved into a VehicleBookingPayload per item
// at submit time.
export interface BookingFormData {
  from_name: string;
  from_email: string;
  phone: string;
  message: string;
}

// One resolved, ready-to-send vehicle line — "Same as Vehicle #1" checkboxes
// have already been applied, so every field here is a concrete value.
export interface VehicleBookingPayload {
  vehicleLabel: string; // "Vehicle #1", "Vehicle #2", …
  service: string;
  vehicleType: string; // "Bike" | "Scooty" | "" (cars carry their type inside `service`)
  vehicleModel: string;
  vehicleNumber: string;
  address: string;
  locality: string;
  preferredDate: string;
  price: string;
}

export type ToastStatus = "idle" | "success" | "error";

export interface ToastState {
  message: string;
  status: ToastStatus;
}
