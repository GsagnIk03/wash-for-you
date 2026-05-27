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
    name: "Rapid Wash",
    tagline: "Quick exterior refresh at your doorstep",
    price: 299,
    features: [
      "Doorstep service",
      "Waterless exterior wash",
      "Exterior polish",
      "Tyre & rim polish",
    ],
  },
  {
    name: "Basic Interior & Exterior Clean",
    tagline: "A thorough clean inside and out",
    price: 599,
    features: [
      "Doorstep service",
      "Waterless exterior wash",
      "Exterior polish",
      "Tyre & rim polish",
      "Glass polish",
      "Semi interior vacuum",
      "Door cleaning",
      "Dashboard & seats dusting, cleaning & polish (3M foam)",
    ],
    featured: true,
  },
  {
    name: "Advance Interior & Exterior Clean",
    tagline: "Deep clean with interior steam treatment",
    price: 1299,
    vehicleNote: "Provide max 1 bucket of water & electric point",
    features: [
      "Doorstep service",
      "Waterless exterior wash",
      "Exterior polish",
      "Tyre & rim polish",
      "Glass polish",
      "Interior vacuum",
      "Door cleaning",
      "Interior steam cleaning",
      "Dashboard & seats dusting, cleaning & polish (3M foam)",
      "Foot mat cleaning",
    ],
  },
  {
    name: "360 Wash",
    tagline: "Complete exterior & interior deep clean",
    price: 1999,
    vehicleNote: "Provide max 1 bucket of water & electric point",
    features: [
      "Doorstep service",
      "Waterless exterior wash",
      "Exterior polish",
      "Tyre & rim polish",
      "Glass polish",
      "Interior vacuum",
      "Door cleaning",
      "Interior steam cleaning",
      "Dashboard & seats dusting, cleaning & polish (3M foam)",
      "Foot mat cleaning",
      "Roof cleaning",
      "AC vent cleaning",
      "Engine bay cleaning",
    ],
  },
];

export const ADDONS: AddonItem[] = [];

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