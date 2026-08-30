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

export interface PricingPlan {
  name: string;
  tagline: string;
  price: number;
  suvSurcharge?: number; // extra charge for SUV/MUV
  vehicleNote?: string;
  features: string[];
  featured?: boolean;
  isBike?: boolean;
}

export interface AddonItem {
  icon: IconKey;
  name: string;
  price: number;
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
