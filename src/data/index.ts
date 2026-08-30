import type {
  TimelineItem,
  ServiceItem,
  PricingPlan,
  AddonItem,
  ContactInfo,
  ReviewItem,
} from "../types";

export const TIMELINE_ITEMS: TimelineItem[] = [
  {
    year: "2026 — The Beginning",
    icon: "rocket",
    title: "Launched in Kolkata",
    description:
      "Started Wash For U with a clear mission — professional doorstep car and bike wash, bringing quality cleaning right to our customers' homes across South Kolkata.",
  },
  {
    year: "2026 — Getting Started",
    icon: "map-pin",
    title: "First Customers, First Trust",
    description:
      "Began serving our first customers across Jadavpur, Baghajatin, Garia, and Dhakuria — building trust through punctuality, consistency, and attention to detail.",
  },
  {
    year: "2026 — Expanding",
    icon: "bike",
    title: "Bikes Join the Fleet",
    description:
      "Added dedicated bike wash services to our offering — a full exterior clean, tyre shine, and detailed treatment for two-wheelers, minus the chain to protect the lubrication.",
  },
  {
    year: "2026 — Growing Strong",
    icon: "trending-up",
    title: "Built on Word of Mouth",
    description:
      "Every booking referral is a vote of confidence. We are growing step by step, driven by customer satisfaction and a commitment to showing up, every single time.",
  },
];

export const SERVICES: ServiceItem[] = [
  {
    icon: "droplets",
    title: "Pressure Exterior Wash",
    description:
      "High-pressure jets clear away road grime, dust, bird droppings, and pollutants from every exterior surface — including under the wheel arches. Customers provide water and an electric point.",
    tag: "Most Popular",
  },
  {
    icon: "shield-check",
    title: "Interior Deep Clean",
    description:
      "We deep clean upholstery, seat crevices, carpets, and floor mats — eliminating bacteria, allergens, and odours. Dashboard, door panels, and AC vents get a thorough wipe-down.",
    tag: "Hygienic",
  },
  {
    icon: "award",
    title: "Full Car Detailing",
    description:
      "Our comprehensive package combines exterior pressure wash, interior deep clean, dashboard polish, tyre dressing, interior steam cleaning, roof clean, and a streak-free glass treatment.",
    tag: "Premium",
  },
  {
    icon: "disc",
    title: "Tyre & Alloy Wheel Clean",
    description:
      "Stubborn brake dust and kerb grime are no match for our pressure jets. Alloy wheels are cleaned and dressed to restore their original shine safely without causing damage.",
    tag: "Add-on Available",
  },
  {
    icon: "bike",
    title: "Bike Wash",
    description:
      "Professional doorstep bike wash covering full exterior body, fuel tank, fairings, wheels, and tyres. We skip the chain to preserve lubrication — everything else gets a showroom finish.",
    tag: "Two-Wheelers",
  },
  {
    icon: "truck",
    title: "SUV & Commercial Wash",
    description:
      "Dedicated wash packages for SUVs, MPVs, and commercial vehicles with extended reach equipment and reinforced cleaning protocols. Full interior and exterior coverage.",
    tag: "All Sizes",
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Rapid Wash",
    tagline: "Quick exterior refresh at your doorstep",
    price: 299,
    suvSurcharge: 50,
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
    suvSurcharge: 100,
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
    suvSurcharge: 200,
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
    icon: "phone",
    label: "Call / WhatsApp",
    value: "+91 94775 88518 / +91 62918 81932",
  },
  { icon: "mail", label: "Email Us", value: "support@washforu.com" },
  {
    icon: "map-pin",
    label: "Our Locations",
    value: "Jadavpur · Baghajatin · Garia · Dhakuria",
  },
];

// Fallback shown if the live Google Reviews API isn't configured yet or
// fails to respond — keeps the Reviews section populated at all times.
// These are 5 real, verified reviews copied from the Wash For U Google
// Business Profile (https://share.google/5elS5dXojNOiuimz7). Once
// GOOGLE_PLACES_API_KEY / GOOGLE_PLACE_ID are set (see api/get-reviews.ts),
// the live API response takes over automatically and this list is only
// used as a safety net if that call ever fails.
export const FALLBACK_REVIEWS: ReviewItem[] = [
  {
    author: "Avijit Indra",
    rating: 5,
    relativeTime: "9 weeks ago",
    text: "I'm extremely happy with the service. My car had a persistent bad odor, and the team did a thorough deep cleaning that removed most of the smell. The entire service was completed at my doorstep, and the pricing was very reasonable. A special thanks to Sagnik for staying until the job was completed and ensuring everything was done perfectly. There was another team member whose name I didn't get, but he was also very professional, hardworking, and helpful. Excellent service—highly recommended!",
  },
  {
    author: "Dr. Subhadeep Biswas",
    rating: 5,
    relativeTime: "3 weeks ago",
    text: "I had my car washed by Wash For U today, and I'm genuinely very satisfied with the service. The overall experience was quite good, and the car was cleaned thoroughly with proper attention to detail. The difference was clearly noticeable after the wash, especially in the areas that usually get overlooked during a routine cleaning. I would especially like to appreciate Debashis and Subhankar for their hard work — both were very sincere, hardworking, and took their time to make sure the car was properly cleaned, paying attention to the small details as well. I'm happy with the quality of work done today and would definitely consider using Wash For U again for my car cleaning needs. Thank you to the entire team, and especially Debashis and Subhankar, for the good work. Keep it up!",
  },
  {
    author: "Samrat",
    rating: 5,
    relativeTime: "2 weeks ago",
    text: "Great price. Busyness: a little busy.",
  },
  {
    author: "Souren Bhattacharjee",
    rating: 5,
    relativeTime: "9 weeks ago",
    text: "Awesome service. Real priority on satisfactory service. Exceptionally good compared to any other app service. Highly recommended.",
  },
  {
    author: "Herak Bhowmik",
    rating: 5,
    relativeTime: "10 weeks ago",
    text: "A very new initiative. They washed my car very thoroughly and particularly. Very satisfied with their job. I would definitely recommend them.",
  },
];
