// ─── Data Types ───────────────────────────────────────────────

export interface TimelineItem {
  year: string;
  icon: string;
  title: string;
  description: string;
}

export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  tag: string;
}

export interface PricingPlan {
  name: string;
  tagline: string;
  price: number;
  originalPrice: number;
  vehicleNote?: string;
  features: string[];
  featured?: boolean;
  isBike?: boolean;
}

export interface AddonItem {
  emoji: string;
  name: string;
  price: number;
}

export interface ContactInfo {
  icon: string;
  label: string;
  value: string;
}

// ─── Form Types ───────────────────────────────────────────────

export interface BookingFormData {
  from_name: string;
  from_email: string;
  phone: string;
  service: string;
  vehicle: string; // car vehicle type OR bike type (Bike / Scooty)
  vehicleModel: string; // new field — always present
  vehicleNumber: string;
  preferred_date: string;
  message: string;
}

export type ToastStatus = "idle" | "success" | "error";

export interface ToastState {
  message: string;
  status: ToastStatus;
}
