# Trust Pass — Digital Service Passport

**Know your asset, trust your service.**

A portable Digital Service Passport for transparent repair and maintenance in Bangladesh — a university project prototype by **Trust Pass Ltd.**

> Frontend-only prototype built with Next.js. There is no backend: all data (providers, prices, bookings, payments) is simulated and saved in the browser's localStorage.

## Features

- Registration for service receivers and service providers
- Provider profiles with rating, reviews and near → far distance sorting
- Booking with asset details and a problem note
- Live job tracker: Requested → Accepted → Work in progress → Report → Paid → Provider paid
- Receiver submits the work done and parts replaced; the platform fixes the price
- Simulated online payment (bKash / Nagad / Card) and provider payout (10% commission)
- Digital Service Passport: verified lifetime history per asset, with QR sharing
- Receiver, Provider and Platform (admin) dashboards
- Yellow "presentation notes" explaining every page (toggle with **Notes ON/OFF**)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deployment

Pushing to `main` builds a static export and deploys it to GitHub Pages via `.github/workflows/deploy.yml`.

## Tech

Next.js 15 (App Router) · TypeScript · Tailwind CSS · Lucide icons
