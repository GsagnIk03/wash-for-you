// ─── Data Types ───────────────────────────────────────────────

// Keys into the icon maps declared alongside each component
// (see IconKey usage in Services.tsx, History.tsx, ContactStrip.tsx).
export type IconKey = string;

export interface TimelineItem {
  year: string;
  icon: IconKey;
  title: string;
  description: string;
}

export interface ServiceItem {
  icon: IconKey;
  title: string;
  description: string;
  tag: string;
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

export interface BookingFormData {
  from_name: string;
  from_email: string;
  phone: string;
  address: string;
  service: string;
  vehicle: string;
  vehicleModel: string;
  vehicleNumber: string;
  preferred_date: string;
  price: string; // final price including surcharge
  message: string;
}

export type ToastStatus = "idle" | "success" | "error";

export interface ToastState {
  message: string;
  status: ToastStatus;
}
