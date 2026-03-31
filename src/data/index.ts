import type {
  TimelineItem,
  ServiceItem,
  PricingPlan,
  AddonItem,
  ContactInfo,
} from "../types";

export const TIMELINE_ITEMS: TimelineItem[] = [
  {
    year: "2026 — The Beginning",
    icon: "🌱",
    title: "Day 1 in Kolkata",
    description:
      "Launched our first waterless car wash service with a simple goal — to clean cars efficiently while reducing water usage.",
  },
  {
    year: "2026 — Getting Started",
    icon: "📍",
    title: "Serving Our First Customers",
    description:
      "Began operations in select areas, focusing on delivering consistent quality, convenience, and building trust from the very first service.",
  },
  {
    year: "2026 — Learning & Improving",
    icon: "🚀",
    title: "Refining Our Process",
    description:
      "Continuously improving our waterless cleaning techniques, products, and workflow based on real customer feedback.",
  },
  {
    year: "2026 — Building Trust",
    icon: "🚀",
    title: "Growing Step by Step",
    description:
      "Working towards building a reliable service through attention to detail, consistency, and word-of-mouth growth.",
  },
];

export const SERVICES: ServiceItem[] = [
  {
    icon: "💨",
    title: "Exterior Waterless Wash",
    description:
      "High-temperature waterless jets blast away road grime, dust, bird droppings, and pollutants from every exterior surface — including under the wheel arches.",
    tag: "Most Popular",
  },
  {
    icon: "🪑",
    title: "Interior Deep Waterless Clean",
    description:
      "Waterless penetrates deep into upholstery, seat crevices, carpets, and floor mats — eliminating bacteria, allergens, and odours without soaking the fabric.",
    tag: "Hygienic",
  },
  {
    icon: "✨",
    title: "Full Car Detailing",
    description:
      "Our comprehensive package combines exterior waterless wash, interior deep clean, dashboard polish, tyre dressing, and a streak-free glass treatment.",
    tag: "Premium",
  },
  {
    icon: "🔧",
    title: "Engine Bay Waterless Clean",
    description:
      "Safe, controlled waterless cleaning of your engine bay removes accumulated grease and oil deposits — improving heat dissipation and giving your engine a factory-fresh look.",
    tag: "Specialised",
  },
  {
    icon: "🛞",
    title: "Tyre & Alloy Wheel Clean",
    description:
      "Stubborn brake dust and kerb grime are no match for our waterless jets. Alloy wheels are cleaned and dressed to restore their original shine safely.",
    tag: "Add-on Available",
  },
  {
    icon: "🚐",
    title: "SUV & Commercial Wash",
    description:
      "Dedicated waterless wash packages for SUVs, MPVs, and commercial vehicles with extended reach equipment and reinforced cleaning protocols.",
    tag: "All Sizes",
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Essential Clean",
    tagline: "Perfect for quick, routine upkeep",
    price: 399,
    vehicleNote: "Hatchback / Sedan",
    features: [
      "Doorstep service convenience",
      "Exterior waterless wash (body surface cleaning)",
      "Dust & light dirt removal",
      "Tyre surface cleaning",
      "Exterior glass cleaning (streak-free)",
    ],
  },
  {
    name: "Interior Premium Deep Detailing",
    tagline: "Deep interior cleaning & restoration",
    price: 999,
    vehicleNote: "Hatchback · ₹999 for Sedan · ₹1,299 for SUV",
    features: [
      "Complete interior vacuuming (seats, carpets, boot)",
      "Seat & upholstery deep cleaning (stain removal where possible)",
      "Carpet & floor mat shampoo/clean",
      "Dashboard, console & door panel detailing",
      "AC vents & hard-to-reach area cleaning",
      "Interior sanitization & odor removal",
      "Interior glass cleaning (streak-free finish)",
    ],
    featured: true,
  },
  {
    name: "Ultimate Spa",
    tagline: "The complete luxury experience",
    price: 1999,
    vehicleNote: "Hatchback · ₹1,999 Sedan · ₹2,299 SUV",
    features: [
      "Everything in Premium Detail",
      "Engine bay Waterless clean",
      "Paint decontamination prep",
      "Ceramic spray coating",
      "Leather conditioning",
      "Priority scheduling",
    ],
  },
];

export const ADDONS: AddonItem[] = [
  { emoji: "🔧", name: "Engine Bay Clean", price: 349 },
  { emoji: "🪟", name: "Glass Polish", price: 199 },
  { emoji: "🛡️", name: "Ceramic Spray", price: 499 },
  { emoji: "🌸", name: "Ozone Odour Treatment", price: 249 },
];

export const CONTACT_INFO: ContactInfo[] = [
  {
    icon: "📞",
    label: "Call / WhatsApp",
    value: "+91 94775 88518 / +91 62918 81932",
  },
  { icon: "✉️", label: "Email Us", value: "support@washforu.com" },
  {
    icon: "📍",
    label: "Our Locations",
    value: "Jadavpur · Baghajatin · Garia · Dhakuria",
  },
];

// ─── EmailJS Config ───────────────────────────────────────────
// ⚠️ Replace these with your actual EmailJS credentials
export const EMAILJS_CONFIG = {
  publicKey: "HYeMUNKyzOjWcm4pL",
  serviceId: "service_zfrdbze",
  templateToOwner: "template_j8k6ruu",
  templateToUser: "template_b1osyxe",
  businessEmail: "support@washforyou.com",
} as const;
