import Link from "next/link";
import { Code2, Eye, Layers, Rocket, Target, Users } from "lucide-react";
import { Explain, PageHeader } from "@/components/ui";

const PAGES = [
  ["/", "Home", "Problem, solution, 8-step flow, features and benefits."],
  ["/how-it-works", "How It Works", "Detailed workflow, money flow and pricing formula."],
  ["/register", "Register", "Sign-up for service receivers and service providers."],
  ["/providers", "Find Providers", "Profiles with rating, filters and near-to-far sorting."],
  ["/provider?id=p1", "Provider Profile", "Reviews, stats and the booking form with a problem note."],
  ["/booking?id=TP-10231", "Job Tracker", "Live status, work report, fixed invoice, online payment, payout."],
  ["/passport", "Service Passport", "Lifetime verified service history per asset, with QR sharing."],
  ["/dashboard", "Dashboard", "Receiver, provider and platform (admin) views."],
];

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About Trust Pass Ltd."
        title="Know your asset, trust your service."
        sub="Trust Pass: A Portable Digital Service Passport for Transparent Repair and Maintenance in Bangladesh."
      />
      <div className="mx-auto max-w-6xl space-y-14 px-4 py-12 sm:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { i: Target, t: "Mission", d: "Bring transparency, fair pricing and accountability to the repair and maintenance sector of Bangladesh." },
            { i: Eye, t: "Vision", d: "Every vehicle and appliance in Bangladesh has a trusted digital service history that travels with it." },
            { i: Users, t: "Target users", d: "Car & bike owners, households, small offices — and the thousands of independent mechanics and technicians." },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <x.i className="text-emerald-600" />
              <h3 className="mt-3 text-lg font-bold">{x.t}</h3>
              <p className="mt-1 text-sm text-slate-600">{x.d}</p>
            </div>
          ))}
        </div>

        <section>
          <h2 className="flex items-center gap-2 text-2xl font-extrabold"><Layers className="text-emerald-600" /> Website map</h2>
          <p className="mt-1 text-slate-600">Every page of this prototype and what it demonstrates.</p>
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {PAGES.map(([href, name, desc], i) => (
              <Link key={href} href={href} className="flex flex-col gap-1 border-b border-slate-100 px-5 py-4 transition last:border-0 hover:bg-emerald-50/50 sm:flex-row sm:items-center sm:gap-6">
                <span className="w-8 text-sm font-bold text-emerald-600">{String(i + 1).padStart(2, "0")}</span>
                <span className="w-44 font-semibold">{name}</span>
                <span className="flex-1 text-sm text-slate-600">{desc}</span>
                <span className="font-mono text-xs text-slate-400">{href}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="flex items-center gap-2 text-xl font-extrabold"><Code2 className="text-emerald-600" /> Technology used</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li><b>Next.js 15 (App Router)</b> — React framework for pages and routing</li>
              <li><b>TypeScript</b> — type-safe code</li>
              <li><b>Tailwind CSS</b> — responsive, modern styling</li>
              <li><b>React Context + localStorage</b> — simulates the database (no backend)</li>
              <li><b>Lucide icons</b> — icon set</li>
            </ul>
            <div className="mt-5">
              <Explain title="Why no backend?">
                This is a <b>frontend prototype</b> to demonstrate the user experience and business logic. All providers,
                prices and payments are simulated in the browser. In production, a backend (e.g. Node.js + PostgreSQL) and
                real payment gateways (bKash / Nagad / SSLCommerz APIs) would be connected.
              </Explain>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="flex items-center gap-2 text-xl font-extrabold"><Rocket className="text-emerald-600" /> Future scope</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {[
                ["Real backend & database", "User accounts, authentication and permanent records."],
                ["Payment gateway integration", "bKash, Nagad and SSLCommerz for real payments and automatic payouts."],
                ["Live GPS tracking", "Track the provider on a map as they travel to you."],
                ["Mobile app & Bangla language", "Android / iOS apps with full Bangla support."],
                ["Tamper-proof records", "Digitally signed passport entries that cannot be edited."],
                ["Partnerships", "BRTA, insurance companies and used-car marketplaces."],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                  <span><b className="text-slate-800">{t}</b> — {d}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
