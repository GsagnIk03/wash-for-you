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
