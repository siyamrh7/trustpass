import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  CircleDollarSign,
  ClipboardList,
  FileWarning,
  HandCoins,
  History,
  MapPin,
  MessageSquareText,
  QrCode,
  Receipt,
  SearchX,
  ShieldCheck,
  Star,
  UserPlus,
  Wallet,
  Wrench,
} from "lucide-react";

const STEPS = [
  { icon: UserPlus, title: "Register", who: "Both", text: "Service providers and service receivers create an account on Trust Pass." },
  { icon: MapPin, title: "Choose a provider", who: "Receiver", text: "See provider profiles, ratings and location — sorted from nearest to farthest." },
  { icon: MessageSquareText, title: "Describe the job", who: "Receiver", text: "Write a note about the repair or wash needed, with asset details." },
  { icon: Wrench, title: "Provider comes & works", who: "Provider", text: "The provider travels to the receiver's location and completes the work." },
  { icon: ClipboardList, title: "Report the work", who: "Receiver", text: "Receiver asks the provider what was repaired and which parts were replaced, then submits it." },
  { icon: Receipt, title: "Platform fixes the price", who: "Platform", text: "Trust Pass calculates the bill from a fixed price list — no bargaining, no hidden charge." },
  { icon: Wallet, title: "Pay online", who: "Receiver", text: "Receiver pays through bKash, Nagad or card. Money is held by the platform." },
  { icon: HandCoins, title: "Provider gets paid", who: "Platform", text: "Platform pays the provider (minus commission) and saves the record in the Service Passport." },
];

const PROBLEMS = [
  { icon: CircleDollarSign, title: "Unfair & random pricing", text: "Mechanics often charge different prices to different customers for the same work." },
  { icon: FileWarning, title: "Fake or unchanged parts", text: "Owners cannot verify whether a part was actually replaced or if it was genuine." },
  { icon: History, title: "No service history", text: "Paper receipts get lost. When selling a car or bike, there is no proof of maintenance." },
  { icon: SearchX, title: "Hard to find trusted help", text: "No easy way to find a verified, well-rated provider near your home." },
];

const FEATURES = [
  { icon: BookOpenCheck, title: "Digital Service Passport", text: "Every repair, wash and part replacement is stored permanently against your asset — car, bike, AC, fridge and more." },
  { icon: Star, title: "Ratings & reviews", text: "Providers build a public reputation. Good work brings more customers." },
  { icon: MapPin, title: "Near-to-far search", text: "Providers are sorted by distance from your area, so help arrives faster." },
  { icon: Receipt, title: "Fixed transparent pricing", text: "The platform sets prices from a standard catalogue, not the mechanic." },
  { icon: Wallet, title: "Secure online payment", text: "Pay with bKash, Nagad or card. The provider is paid only after the job is reported." },
  { icon: QrCode, title: "Portable & shareable", text: "Share the passport with a buyer or insurer using a QR code — it increases resale value." },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-[#1b2c19] to-[#2a2416] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(214,171,74,0.22),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(127,162,108,0.28),transparent_55%)]" />
        <svg className="pointer-events-none absolute -right-24 -top-24 h-[520px] w-[520px] text-emerald-400/[0.07]" viewBox="0 0 200 200" aria-hidden="true">
          <path fill="currentColor" d="M100 10c50 0 90 40 90 90-40 0-70-15-90-45-20 30-50 45-90 45 0-50 40-90 90-90Z" />
          <path fill="none" stroke="currentColor" strokeWidth="2" d="M100 20v170" />
        </svg>
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-semibold tracking-wide text-amber-200">
              <ShieldCheck size={14} /> Made for Bangladesh
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Know your asset,
              <br />
              <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-emerald-300 bg-clip-text italic text-transparent">
                trust your service.
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-slate-300">
              Trust Pass is a portable <b className="text-white">Digital Service Passport</b> for transparent repair
              and maintenance. Find a verified provider, get the work done at your doorstep, pay a fixed fair price,
              and keep a lifetime record of every service.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/providers"
                className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-6 py-3 font-semibold text-emerald-950 shadow-lg shadow-amber-900/20 transition hover:bg-amber-200"
              >
                Find a provider <ArrowRight size={18} />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                See how it works
              </Link>
            </div>
          </div>

          {/* Passport preview card */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-4 rounded-[2rem] bg-amber-300/15 blur-2xl" />
            <div className="relative rounded-3xl border border-white/10 bg-white p-6 text-slate-900 shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Digital Service Passport</p>
                  <p className="mt-1 text-xl font-extrabold">Toyota Axio 2016</p>
                  <p className="font-mono text-xs text-slate-500">DHAKA METRO-GA 12-3456</p>
                </div>
                <div className="grid h-14 w-14 grid-cols-4 gap-0.5 rounded-lg bg-slate-900 p-1.5">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <span key={i} className={[0, 3, 5, 6, 9, 10, 12, 15, 2, 13].includes(i) ? "bg-white" : ""} />
                  ))}
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  { d: "22 Aug 2026", t: "Brake pad set replaced", p: "Bashundhara Motors", c: "bg-rose-500" },
                  { d: "14 Jun 2026", t: "Engine oil + oil filter", p: "Rahman Auto Care", c: "bg-emerald-500" },
                  { d: "02 Mar 2026", t: "Full foam wash", p: "Gulshan Car Spa", c: "bg-sky-500" },
                ].map((e) => (
                  <div key={e.d} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <span className={`h-9 w-1.5 rounded-full ${e.c}`} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{e.t}</p>
                      <p className="text-xs text-slate-500">
                        {e.p} · {e.d}
                      </p>
                    </div>
                    <BadgeCheck size={18} className="text-emerald-600" />
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                <span>3 verified services</span>
                <span className="font-semibold text-emerald-600">Health score 92/100</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4">
            {[
              ["8+", "Verified providers in Dhaka"],
              ["6", "Asset types supported"],
              ["100%", "Fixed, transparent pricing"],
              ["3", "Payment methods: bKash, Nagad, Card"],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="font-display text-3xl font-semibold text-amber-200">{n}</p>
                <p className="text-sm text-slate-400">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-rose-600">The problem</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Repair &amp; maintenance in Bangladesh runs on blind trust
          </h2>
          <p className="mt-3 text-slate-600">
            Millions of vehicles and home appliances are serviced every day by informal workshops. The owner usually
            has no idea what was done, what it should cost, or whether the parts were genuine.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROBLEMS.map((p) => (
            <div key={p.title} className="rounded-2xl border border-rose-100 bg-white p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-rose-50 text-rose-600">
                <p.icon size={22} />
              </span>
              <h3 className="mt-4 font-bold">{p.title}</h3>
              <p className="mt-1.5 text-sm text-slate-600">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOLUTION FLOW */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Our solution</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">From booking to payment in 8 simple steps</h2>
            <p className="mt-3 text-slate-600">
              Trust Pass sits in the middle of the service provider and the service receiver. It controls the price and
              the payment, so both sides can trust each other.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <div key={s.title} className="group relative rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-emerald-300 hover:bg-white hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-600 text-white">
                    <s.icon size={20} />
                  </span>
                  <span className="text-4xl font-extrabold text-slate-200 transition group-hover:text-emerald-100">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-4 font-bold">{s.title}</h3>
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-emerald-600">{s.who}</p>
                <p className="mt-2 text-sm text-slate-600">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/how-it-works" className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 hover:underline">
              Read the detailed workflow <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Key features</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Built around transparency</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                <f.icon size={22} />
              </span>
              <h3 className="mt-4 font-bold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-slate-600">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHO BENEFITS */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              t: "Service Receivers",
              c: "from-emerald-600 to-emerald-900",
              pts: ["Fair fixed price, no bargaining", "Know exactly what was repaired", "Lifetime service history", "Higher resale value"],
            },
            {
              t: "Service Providers",
              c: "from-slate-700 to-slate-900",
              pts: ["New customers nearby", "Guaranteed online payment", "Reputation through ratings", "No price disputes"],
            },
            {
              t: "Trust Pass Ltd.",
              c: "from-amber-600 to-amber-800",
              pts: ["20% commission per job", "Data for insurers & buyers", "Premium provider listings", "Scales to all of Bangladesh"],
            },
          ].map((b) => (
            <div key={b.t} className={`rounded-3xl bg-gradient-to-br ${b.c} p-7 text-white`}>
              <h3 className="text-xl font-bold">{b.t}</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-white/90">
                {b.pts.map((p) => (
                  <li key={p} className="flex gap-2">
                    <BadgeCheck size={18} className="shrink-0" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-8 sm:p-10 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Ready to get started?</h2>
            <p className="mt-1 text-slate-600">Register as a service receiver or provider and experience transparent service.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/register" className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700">
              Register now
            </Link>
            <Link href="/providers" className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold hover:bg-slate-50">
              Browse providers
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
