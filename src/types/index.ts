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
  suvSurcharge?: number; // extra charge for SUV/MUV
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
