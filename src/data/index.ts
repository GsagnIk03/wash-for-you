import type {
  TimelineItem,
  ServiceItem,
  PricingPlan,
  AddonItem,
  ContactInfo,
} from '../types';

export const TIMELINE_ITEMS: TimelineItem[] = [
  {
    year: '2019 — The Beginning',
    icon: '🌱',
    title: 'First Steam Wash Unit, Salt Lake',
    description:
      'We launched our first steam car wash station in Salt Lake, Kolkata, serving 15–20 cars daily with a lean team of 4 enthusiasts driven by a green vision — and Wash For You was born.',
  },
  {
    year: '2021 — Recognition',
    icon: '🏆',
    title: 'Best Eco-Business Award, West Bengal',
    description:
      'Recognised by the West Bengal Green Initiative Council for outstanding contribution to water conservation in the automobile service sector.',
  },
  {
    year: '2022 — Expansion',
    icon: '📍',
    title: '3 New Locations Across Kolkata',
    description:
      'Expanded to Tollygunge, New Town, and Behala — bringing eco-friendly steam washing closer to thousands of car owners across the city.',
  },
  {
    year: '2024 — Today',
    icon: '🚀',
    title: "Kolkata's Most Trusted Steam Wash",
    description:
      'With over 3,000 satisfied customers, a 4.9-star rating, and a commitment to zero-chemical cleaning, we continue to set the standard for sustainable car care in the city.',
  },
];

export const SERVICES: ServiceItem[] = [
  {
    icon: '💨',
    title: 'Exterior Steam Wash',
    description:
      'High-temperature steam jets blast away road grime, dust, bird droppings, and pollutants from every exterior surface — including under the wheel arches.',
    tag: 'Most Popular',
  },
  {
    icon: '🪑',
    title: 'Interior Deep Steam Clean',
    description:
      'Steam penetrates deep into upholstery, seat crevices, carpets, and floor mats — eliminating bacteria, allergens, and odours without soaking the fabric.',
    tag: 'Hygienic',
  },
  {
    icon: '✨',
    title: 'Full Car Detailing',
    description:
      'Our comprehensive package combines exterior steam wash, interior deep clean, dashboard polish, tyre dressing, and a streak-free glass treatment.',
    tag: 'Premium',
  },
  {
    icon: '🔧',
    title: 'Engine Bay Steam Clean',
    description:
      'Safe, controlled steam cleaning of your engine bay removes accumulated grease and oil deposits — improving heat dissipation and giving your engine a factory-fresh look.',
    tag: 'Specialised',
  },
  {
    icon: '🛞',
    title: 'Tyre & Alloy Wheel Clean',
    description:
      'Stubborn brake dust and kerb grime are no match for our steam jets. Alloy wheels are cleaned and dressed to restore their original shine safely.',
    tag: 'Add-on Available',
  },
  {
    icon: '🚐',
    title: 'SUV & Commercial Wash',
    description:
      'Dedicated steam wash packages for SUVs, MPVs, and commercial vehicles with extended reach equipment and reinforced cleaning protocols.',
    tag: 'All Sizes',
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Essential Clean',
    tagline: 'Perfect for quick, routine upkeep',
    price: 499,
    vehicleNote: 'Hatchback / Sedan',
    features: [
      'Exterior steam wash',
      'Tyre surface clean',
      'Door sill wipe-down',
      'Glass exterior rinse',
      'Air freshener spray',
    ],
  },
  {
    name: 'Premium Detail',
    tagline: 'Full inside-out transformation',
    price: 999,
    vehicleNote: 'Hatchback · ₹1,199 for Sedan · ₹1,499 for SUV',
    features: [
      'Exterior + interior steam clean',
      'Upholstery & carpet steam',
      'Dashboard & console polish',
      'Tyre dressing & alloy clean',
      'Full glass treatment',
      'Deodorisation',
    ],
    featured: true,
  },
  {
    name: 'Ultimate Spa',
    tagline: 'The complete luxury experience',
    price: 1799,
    vehicleNote: 'Hatchback · ₹2,099 Sedan · ₹2,499 SUV',
    features: [
      'Everything in Premium Detail',
      'Engine bay steam clean',
      'Paint decontamination prep',
      'Ceramic spray coating',
      'Leather conditioning',
      'Priority scheduling',
    ],
  },
];

export const ADDONS: AddonItem[] = [
  { emoji: '🔧', name: 'Engine Bay Clean', price: 349 },
  { emoji: '🪟', name: 'Glass Polish', price: 199 },
  { emoji: '🛡️', name: 'Ceramic Spray', price: 499 },
  { emoji: '🌸', name: 'Ozone Odour Treatment', price: 249 },
];

export const CONTACT_INFO: ContactInfo[] = [
  { icon: '📞', label: 'Call / WhatsApp', value: '+91 98300 XXXXX' },
  { icon: '✉️', label: 'Email Us', value: 'support@washforyou.com' },
  {
    icon: '📍',
    label: 'Our Locations',
    value: 'Salt Lake · New Town · Tollygunge · Behala',
  },
];

// ─── EmailJS Config ───────────────────────────────────────────
// ⚠️ Replace these with your actual EmailJS credentials
export const EMAILJS_CONFIG = {
  publicKey: 'YOUR_PUBLIC_KEY',       // ← Replace
  serviceId: 'YOUR_SERVICE_ID',       // ← Replace
  templateToOwner: 'template_to_owner', // ← Replace
  templateToUser: 'template_to_user',   // ← Replace
  businessEmail: 'support@washforyou.com', // ✅ Already set
} as const;
