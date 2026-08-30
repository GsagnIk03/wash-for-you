# Wash For U — React TypeScript Landing Page

Doorstep Car & Bike Wash | Kolkata

## Project Structure

```
wash-for-you/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── server.js                          # Local dev API server (mirrors Vercel functions)
├── api/
│   ├── send-booking.ts                # Booking form → Resend emails (owner + customer)
│   └── get-reviews.ts                 # Live Google rating + up to 5 reviews
└── src/
    ├── main.tsx                       # React entry point, wraps App in BrowserRouter
    ├── App.tsx                        # Routes + shared Navbar/Footer/BookingModal
    ├── pages/
    │   ├── Home.tsx                   # Landing page: Hero, Pricing, Services, Reviews, Contact
    │   ├── GalleryPage.tsx            # /gallery
    │   └── HistoryPage.tsx            # /history
    ├── types/
    │   └── index.ts                   # All TypeScript interfaces
    ├── data/
    │   └── index.ts                   # Site content (services, pricing, timeline, contact info)
    ├── hooks/
    │   └── index.ts                   # useScrolled, useInView
    ├── styles/
    │   └── globals.css                # CSS variables, resets, fonts, animations
    └── components/
        ├── Navbar.tsx                 # Fixed nav — routes to /gallery, /history; scrolls elsewhere
        ├── Hero.tsx                   # Hero section with photo background + stats
        ├── PageHeader.tsx             # Shared header for standalone pages
        ├── History.tsx                # Our Story / Timeline (rendered on /history)
        ├── Services.tsx               # Service cards
        ├── Pricing.tsx                # Plans + booking CTA
        ├── Reviews.tsx                # Google Reviews section (see setup below)
        ├── Gallery.tsx                # Photo grid + lightbox (rendered on /gallery)
        ├── ContactStrip.tsx           # Contact info + CTAs
        ├── BookingModal.tsx           # Booking form (name, phone, email, address, service…)
        └── Footer.tsx                 # Footer with nav links
```

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start dev server + local API (opens at http://localhost:3000)
./dev.sh

# 3. Build for production
npm run build
```

`dev.sh` creates a `.env.local` template on first run — fill in the values
below before booking/reviews will work locally.

## Environment variables

| Variable | Used by | Required for |
|---|---|---|
| `RESEND_API_KEY` | `api/send-booking.ts` | Sending booking confirmation emails |
| `BUSINESS_EMAIL` | `api/send-booking.ts` | Where new-booking emails are sent |
| `VITE_WHATSAPP_NUMBER` | Frontend | WhatsApp deep links |
| `GOOGLE_PLACES_API_KEY` | `api/get-reviews.ts` | Live Google Reviews section |
| `GOOGLE_PLACE_ID` | `api/get-reviews.ts` | Live Google Reviews section |

In production (Vercel), set these under Project Settings → Environment Variables.

### Setting up the Google Reviews section

The Reviews section on the landing page calls `/api/get-reviews`, which
fetches the business's rating and its most recent reviews from Google's
Places API (New). If the two env vars above aren't set, the section shows a
graceful fallback message instead of breaking.

1. In the [Google Cloud Console](https://console.cloud.google.com/), create
   a project (or use an existing one) and enable **Places API (New)**.
2. Create an API key under **APIs & Services → Credentials**, and restrict
   it to the Places API (and ideally to your server's IP or your domain's
   HTTP referrer) — this is `GOOGLE_PLACES_API_KEY`.
3. Find the Place ID for the Wash For U Business Profile using Google's
   [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id) —
   search for "Wash For U" and copy the ID it shows. This is `GOOGLE_PLACE_ID`.
4. Add both values to `.env.local` (local dev) and to the Vercel project's
   environment variables (production), then redeploy.

**Note:** Google's Places API only ever exposes up to 5 reviews for a
place — this is a platform-wide limit, not something this integration can
work around. The Reviews section links out to the full Google listing so
visitors can read more.
