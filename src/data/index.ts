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
    icon: "🚀",
    title: "Launched in Kolkata",
    description:
      "Started Wash For U with a clear mission — professional doorstep car and bike wash, bringing quality cleaning right to our customers' homes across South Kolkata.",
  },
  {
    year: "2026 — Getting Started",
    icon: "📍",
    title: "First Customers, First Trust",
    description:
      "Began serving our first customers across Jadavpur, Baghajatin, Garia, and Dhakuria — building trust through punctuality, consistency, and attention to detail.",
  },
  {
    year: "2026 — Expanding",
    icon: "🏍️",
    title: "Bikes Join the Fleet",
    description:
      "Added dedicated bike wash services to our offering — a full exterior clean, tyre shine, and detailed treatment for two-wheelers, minus the chain to protect the lubrication.",
  },
  {
    year: "2026 — Growing Strong",
    icon: "⭐",
    title: "Built on Word of Mouth",
    description:
      "Every booking referral is a vote of confidence. We are growing step by step, driven by customer satisfaction and a commitment to showing up, every single time.",
  },
];

export const SERVICES: ServiceItem[] = [
  {
    icon: "💧",
    title: "Pressure Exterior Wash",
    description:
      "High-pressure jets blast away road grime, dust, bird droppings, and pollutants from every exterior surface — including under the wheel arches. Customers provide water and an electric point.",
    tag: "Most Popular",
  },
  {
    icon: "🪑",
    title: "Interior Deep Clean",
    description:
      "We deep clean upholstery, seat crevices, carpets, and floor mats — eliminating bacteria, allergens, and odours. Dashboard, door panels, and AC vents get a thorough wipe-down.",
    tag: "Hygienic",
  },
  {
    icon: "✨",
    title: "Full Car Detailing",
    description:
      "Our comprehensive package combines exterior pressure wash, interior deep clean, dashboard polish, tyre dressing, interior steam cleaning, roof clean, and a streak-free glass treatment.",
    tag: "Premium",
  },
  {
    icon: "🔩",
    title: "Tyre & Alloy Wheel Clean",
    description:
      "Stubborn brake dust and kerb grime are no match for our pressure jets. Alloy wheels are cleaned and dressed to restore their original shine safely without causing damage.",
    tag: "Add-on Available",
  },
  {
    icon: "🏍️",
    title: "Bike Wash",
    description:
      "Professional doorstep bike wash covering full exterior body, fuel tank, fairings, wheels, and tyres. We skip the chain to preserve lubrication — everything else gets a showroom finish.",
    tag: "Two-Wheelers",
  },
  {
    icon: "🚐",
    title: "SUV & Commercial Wash",
    description:
      "Dedicated wash packages for SUVs, MPVs, and commercial vehicles with extended reach equipment and reinforced cleaning protocols. Full interior and exterior coverage.",
    tag: "All Sizes",
  },
];

// Helper to compute original price (price is the discounted rate; original = price / 0.9)
const orig = (discounted: number) => Math.round(discounted / 0.9);

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Rapid Wash",
    tagline: "Quick exterior refresh at your doorstep",
    price: 299,
    originalPrice: orig(299),
    features: [
      "Doorstep service",
      "Pressure exterior wash",
      "Exterior polish",
      "Tyre & rim polish",
    ],
  },
  {
    name: "Basic Interior & Exterior Clean",
    tagline: "A thorough clean inside and out",
    price: 599,
    originalPrice: orig(599),
    features: [
      "Doorstep service",
      "Pressure exterior wash",
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
    tagline: "Deep clean with full interior steam treatment",
    price: 1299,
    originalPrice: orig(1299),
    features: [
      "Doorstep service",
      "Pressure exterior wash",
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
    ],
  },
];

export const BIKE_PLAN: PricingPlan = {
  name: "Bike Wash",
  tagline: "Full wash for two-wheelers at your doorstep",
  price: 149,
  originalPrice: orig(149),
  isBike: true,
  features: [
    "Doorstep service",
    "Full body pressure wash",
    "Fuel tank & fairing clean",
    "Wheel & tyre wash",
    "Tyre shine & polish",
    "Seat & handle clean",
    "Mudguard & underbody clean",
    "Mirror & headlight polish",
    "Exhaust pipe exterior clean",
  ],
};

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
