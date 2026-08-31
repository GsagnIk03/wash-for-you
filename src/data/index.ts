import type {
  TimelineItem,
  PricingPlan,
  AddonItem,
  ContactInfo,
  ReviewItem,
} from "../types";

// The neighbourhoods we currently send technicians to — shown in the "Why
// Wash For U?" section's Service Areas chips, and reused by the booking
// form's Locality field to gate car/bike bookings to areas we can actually
// reach (see BookingModal.tsx).
export const SERVICE_AREAS = [
  "Abhishikta",
  "Ajaynagar",
  "Baghajatin",
  "Ballygunge",
  "Garia",
  "Golpark",
  "Haltu",
  "Jadavpur",
  "Jadavpur P.S",
  "Mukundapur",
  "New Garia",
  "Panchashayar",
  "Patuli",
  "Ramlal Bazar",
  "Safuipara",
  "South City Mall",
  "Survey Park",
  "Tollygunge",
];

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

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Rapid Wash",
    tagline: "A fast, thorough exterior refresh — right at your curb",
    price: 299,
    bgImageKey: "rapid",
    fullPhotoBg: true,
    estimatedTime: "Up to 45 minutes — varies with add-ons selected",
    features: [
      "Doorstep service",
      "High-pressure exterior wash",
      "Rich foam pre-wash",
      "Ceramic exterior polish",
      "Tyre dressing & shine",
    ],
    addOnGroups: [
      {
        id: "vehicle-type",
        title: "Vehicle Type",
        helperText: "Required — sets your base price",
        selectionType: "single-required",
        choices: [
          { id: "sedan-hatch", label: "Sedan / Hatchback", price: 0 },
          { id: "suv-muv", label: "SUV / MUV", price: 50 },
        ],
      },
      {
        id: "boosters",
        title: "Wash Boosters",
        helperText: "Optional — add as many as you like",
        selectionType: "multi-optional",
        choices: [
          {
            id: "double-foam",
            label: "Double foam wash",
            price: 39,
            recommended: true,
          },
          { id: "glass-polish", label: "Glass polish", price: 49 },
        ],
      },
      {
        id: "interior-addon",
        title: "Interior Add-on",
        helperText: "Optional — choose up to one",
        selectionType: "single-optional",
        choices: [
          {
            id: "semi-interior-vacuum",
            label: "Semi interior vacuum",
            price: 79,
          },
          {
            id: "full-interior-vacuum",
            label: "Full interior vacuum",
            price: 149,
          },
          {
            id: "interior-vacuum-no-boot-iron",
            label: "Interior vacuum (no boot) + iron removal",
            price: 149,
          },
        ],
      },
    ],
  },
  {
    name: "Basic Interior & Exterior Clean",
    tagline: "A thorough clean inside and out",
    price: 599,
    bgImageKey: "basic",
    fullPhotoBg: true,
    estimatedTime: "60–90 minutes — varies with add-ons selected",
    features: [
      "Exterior pressure wash",
      "Foam wash",
      "Exterior ceramic polish",
      "Tyre dressing",
      "Interior & door vacuum",
      "Door cleaning",
      "Glass polish",
      "Dashboard & seats polish",
    ],
    featured: true,
    addOnGroups: [
      {
        id: "vehicle-type",
        title: "Vehicle Type",
        helperText: "Required — sets your base price",
        selectionType: "single-required",
        choices: [
          { id: "sedan-hatch", label: "Sedan / Hatchback", price: 0 },
          { id: "suv-muv", label: "SUV / MUV", price: 100 },
        ],
      },
      {
        id: "boosters",
        title: "Wash Boosters",
        helperText: "Optional — add as many as you like",
        selectionType: "multi-optional",
        choices: [
          {
            id: "double-foam",
            label: "Double foam wash",
            price: 39,
            recommended: true,
          },
          { id: "engine-bay", label: "Engine bay cleaning", price: 299 },
          {
            id: "stain-removal",
            label: "Stain removal",
            price: 99,
            recommended: true,
            note: "For light stains",
          },
          { id: "iron-removal", label: "Iron removal", price: 149 },
        ],
      },
    ],
  },
  {
    name: "Advance Interior & Exterior Clean",
    tagline: "Deep clean with full interior steam treatment",
    price: 1299,
    bgImageKey: "advance",
    fullPhotoBg: true,
    estimatedTime: "2–2.5 hours — varies with add-ons selected",
    features: [
      "Exterior pressure wash",
      "Foam wash",
      "Exterior ceramic polish",
      "Tyre dressing",
      "Interior & door vacuum",
      "Door cleaning",
      "Light stain removal",
      "Glass polish",
      "Dashboard & seats polish",
      "Boot vacuum",
      "Interior dry wash",
    ],
    addOnGroups: [
      {
        id: "vehicle-type",
        title: "Vehicle Type",
        helperText: "Required — sets your base price",
        selectionType: "single-required",
        choices: [
          { id: "sedan-hatch", label: "Sedan / Hatchback", price: 0 },
          { id: "suv-muv", label: "SUV / MUV", price: 200 },
        ],
      },
      {
        id: "boosters",
        title: "Wash Boosters",
        helperText: "Optional — add as many as you like",
        selectionType: "multi-optional",
        choices: [
          {
            id: "double-foam",
            label: "Double foam wash",
            price: 39,
            recommended: true,
          },
          { id: "engine-bay", label: "Engine bay cleaning", price: 299 },
          { id: "ac-cleaning", label: "AC cleaning", price: 199 },
          { id: "iron-removal", label: "Iron removal", price: 149 },
        ],
      },
    ],
  },
  {
    name: "Premium Car Spa",
    tagline: "Deep clean with steam treatment",
    price: 1799,
    bgImageKey: "premium",
    fullPhotoBg: true,
    estimatedTime: "180–200 minutes — varies with add-ons selected",
    features: [
      "Exterior pressure wash",
      "Foam wash",
      "Tyre dressing",
      "Glass polish",
      "Interior vacuum",
      "Boot vacuum",
      "Door cleaning",
      "Interior dry wash",
      "Interior steam cleaning",
      "Roof cleaning",
      "AC vent cleaning",
      "Odor treatment",
      "Heavy stain removal",
    ],
    addOnGroups: [
      {
        id: "vehicle-type",
        title: "Vehicle Type",
        helperText: "Required — sets your base price",
        selectionType: "single-required",
        choices: [
          { id: "sedan-hatch", label: "Sedan / Hatchback", price: 0 },
          { id: "suv-muv", label: "SUV / MUV", price: 400 },
        ],
      },
      {
        id: "boosters",
        title: "Wash Boosters",
        helperText: "Optional — add as many as you like",
        selectionType: "multi-optional",
        choices: [
          { id: "engine-bay", label: "Engine bay cleaning", price: 199 },
          { id: "iron-removal", label: "Iron removal", price: 99 },
        ],
      },
    ],
  },
];

export const BIKE_PLAN: PricingPlan = {
  name: "Bike Wash",
  tagline: "Full wash for two-wheelers at your doorstep",
  price: 199,
  isBike: true,
  bgImageKey: "bike",
  fullPhotoBg: true,
  estimatedTime: "Up to 30 minutes",
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
