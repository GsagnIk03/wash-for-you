# Wash For You — React TypeScript Landing Page

Eco-Friendly Waterless Car Wash | Kolkata

## 🗂 Project Structure

```
wash-for-you/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
└── src/
    ├── main.tsx                         # React entry point
    ├── App.tsx                          # Root component
    ├── types/
    │   └── index.ts                     # All TypeScript interfaces
    ├── data/
    │   └── index.ts                     # Site content + EmailJS config
    ├── hooks/
    │   └── index.ts                     # useScrolled, useInView, useEmailJS
    ├── styles/
    │   └── globals.css                  # CSS variables, resets, animations
    └── components/
        ├── Navbar.tsx                   # Fixed nav with scroll shadow
        ├── Hero.tsx                     # Hero section + stats
        ├── CarWashIllustration.tsx      # Animated SVG car wash scene
        ├── History.tsx                  # Section 1 — Our Story / Timeline
        ├── Services.tsx                 # Section 2 — Service cards
        ├── Pricing.tsx                  # Section 3 — Plans + Add-ons
        ├── Contact.tsx                  # Section 4 — Info + Booking form
        └── Footer.tsx                   # Footer with nav links
```

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (opens at http://localhost:3000)
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

## ✉️ EmailJS Setup (required for contact form)

1. Sign up free at https://www.emailjs.com
2. Connect your Gmail / Outlook account as a **Service**
3. Create **two Email Templates**:
   - `template_to_owner` — booking details sent to YOUR inbox
   - `template_to_user` — confirmation email sent to the CUSTOMER
4. Open `src/data/index.ts` and fill in:

```ts
export const EMAILJS_CONFIG = {
  publicKey: "YOUR_PUBLIC_KEY", // ← from EmailJS Account > API Keys
  serviceId: "YOUR_SERVICE_ID", // ← from EmailJS Email Services
  templateToOwner: "template_to_owner", // ← your template ID
  templateToUser: "template_to_user", // ← your template ID
  businessEmail: "support@washforu.com", // ✅ already set
};
```

### Recommended EmailJS template variables

Both templates can reference these variables:
| Variable | Description |
|-------------------|------------------------------|
| `{{from_name}}` | Customer's full name |
| `{{from_email}}` | Customer's email |
| `{{phone}}` | Customer's phone/WhatsApp |
| `{{service}}` | Selected service |
| `{{vehicle}}` | Vehicle type |
| `{{preferred_date}}` | Preferred booking date |
| `{{message}}` | Additional notes |
| `{{to_email}}` | Recipient (set per template) |
| `{{business_name}}` | "Wash For You" |

## 📞 Update Your Contact Details

In `src/data/index.ts`, update `CONTACT_INFO`:

```ts
export const CONTACT_INFO = [
  { icon: "📞", label: "Call / WhatsApp", value: "+91 XXXXX XXXXX" }, // ← your number
  { icon: "✉️", label: "Email Us", value: "support@washforu.com" },
  { icon: "📍", label: "Our Locations", value: "Salt Lake · New Town · ..." },
];
```

## 🎨 Customisation

All site content lives in `src/data/index.ts`:

- `TIMELINE_ITEMS` — history section entries
- `SERVICES` — service cards (icon, title, desc, tag)
- `PRICING_PLANS` — pricing tiers (name, price, features)
- `ADDONS` — add-on cards
- `CONTACT_INFO` — phone, email, locations

## 🏗 Tech Stack

- **React 18** with **TypeScript**
- **Vite** for fast dev/build
- **Pure CSS-in-JS** inline styles + global CSS (no extra libraries)
- **EmailJS** for serverless email (free tier)
- **Google Fonts** — Playfair Display + DM Sans
