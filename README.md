# Trust Pass — Digital Service Passport

**Know your asset, trust your service.**

A portable Digital Service Passport for transparent repair and maintenance in Bangladesh by **Trust Pass Ltd.**

## Features

- Registration for service receivers and service providers
- Provider profiles with rating, reviews and near → far distance sorting
- Booking with asset details and a problem note
- Live job tracker: Requested → Accepted → Work in progress → Report → Paid → Provider paid
- Receiver submits the work done and parts replaced; the platform fixes the price
- Online payment (bKash / Nagad / Card) and provider payout (10% commission)
- Digital Service Passport: verified lifetime history per asset, with QR sharing
- Receiver, Provider and Platform (admin) dashboards
- Info panels explaining each step of the service journey

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
