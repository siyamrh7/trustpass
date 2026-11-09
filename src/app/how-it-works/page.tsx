import Link from "next/link";
import { ArrowDown, ArrowRight, Building2, Landmark, User, Wrench } from "lucide-react";
import { Explain, PageHeader } from "@/components/ui";

const FLOW = [
  {
    n: 1,
    who: "Provider & Receiver",
    title: "Registration",
    page: { href: "/register", label: "Register page" },
    points: [
      "Service provider registers business name, owner, phone, location, asset types handled and visit charge.",
      "Service receiver registers name, phone and area (location is used to find nearby providers).",
      "Providers are verified by NID and trade licence before they get the ✔ Verified badge.",
    ],
  },
  {
    n: 2,
    who: "Receiver",
    title: "Browse & choose a provider",
    page: { href: "/providers", label: "Find Providers page" },
    points: [
      "Each provider has a profile with rating, number of completed jobs, experience and reviews.",
      "The list is sorted from nearest to farthest using the receiver's location (distance in km).",
      "Receiver can filter by asset type (car, bike, AC…) and service (repair, wash, maintenance).",
    ],
  },
  {
    n: 3,
    who: "Receiver",
    title: "Book with a note",
    page: { href: "/provider?id=p1", label: "Provider profile page" },
    points: [
      "Receiver enters asset details (brand, model, registration / serial number).",
      "Receiver writes a note describing the problem — e.g. “Brakes squeaking when stopping”.",
      "A booking ID is created and the provider is notified.",
    ],
  },
  {
    n: 4,
    who: "Provider",
    title: "Provider arrives & does the work",
    page: null,
    points: [
      "Provider accepts the request and travels to the receiver's location.",
      "Provider completes the repair, wash or maintenance on site.",
      "Status is updated live: Accepted → Work in progress.",
    ],
  },
  {
    n: 5,
    who: "Receiver",
    title: "Receiver records the work done",
    page: null,
    points: [
      "After the work, the receiver hears from the provider what was repaired and which parts were replaced.",
      "Receiver selects those items from the platform's standard list and submits under their own name.",
      "Because the receiver submits the report, the record is confirmed by the asset owner.",
    ],
  },
  {
    n: 6,
    who: "Platform",
    title: "Trust Pass fixes the price",
    page: null,
    points: [
      "The platform calculates the bill from a fixed price catalogue — the provider cannot change prices.",
      "Bill = Labour + Parts + Visit charge + 5% VAT.",
      "Receiver sees a clear itemised invoice before paying.",
    ],
  },
  {
    n: 7,
    who: "Receiver",
    title: "Online payment",
    page: null,
    points: [
      "Receiver pays the total online with bKash, Nagad or a debit/credit card.",
      "Money goes to Trust Pass first (escrow), not directly to the provider.",
    ],
  },
  {
    n: 8,
    who: "Platform",
    title: "Provider payout & Passport update",
    page: { href: "/passport", label: "Service Passport page" },
    points: [
      "Trust Pass keeps a 20% commission and pays the rest to the provider's bKash / bank account.",
      "The completed service is permanently added to the asset's Digital Service Passport.",
      "Receiver can rate the provider, which updates the provider's public rating.",
    ],
  },
];

export default function HowItWorks() {
  return (
    <>
      <PageHeader
        eyebrow="Workflow"
        title="How Trust Pass works"
        sub="A step-by-step explanation of the full service journey — who does what, and what the website does at each step."
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Explain title="Why the platform sits in the middle">
          The main idea of Trust Pass is that <b>the price and the payment are controlled by the platform</b>, not by
          the mechanic. This removes bargaining and hidden charges. Because the receiver submits the work report, we also
          get an honest, owner-confirmed history of every asset — that is the <b>Digital Service Passport</b>.
        </Explain>

        {/* Timeline */}
        <div className="relative mt-12">
          <div className="absolute bottom-0 left-5 top-0 w-0.5 bg-gradient-to-b from-emerald-400 via-emerald-300 to-transparent sm:left-6" />
          <div className="space-y-8">
            {FLOW.map((s) => (
              <div key={s.n} className="relative flex gap-5 sm:gap-8">
                <div className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-600 font-bold text-white ring-4 ring-white sm:h-12 sm:w-12 sm:text-lg">
                  {s.n}
                </div>
                <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold">{s.title}</h3>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">{s.who}</span>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                    {s.points.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  {s.page && (
                    <Link href={s.page.href} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:underline">
                      Open {s.page.label} <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Money flow */}
        <section className="mt-20">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Money flow</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight">Where does the money go?</h2>
          <p className="mt-2 max-w-2xl text-slate-600">Example: a brake repair job with a subtotal of ৳ 3,300.</p>

          <div className="mt-8 grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
            <FlowBox icon={User} title="Receiver pays" amount="৳ 3,465" lines={["Subtotal ৳ 3,300", "+ VAT 5% ৳ 165"]} tone="bg-sky-50 border-sky-200 text-sky-700" />
            <Arrow />
            <FlowBox icon={Building2} title="Trust Pass holds" amount="৳ 3,465" lines={["Keeps 20% commission ৳ 660", "Sends VAT ৳ 165 to NBR"]} tone="bg-emerald-50 border-emerald-200 text-emerald-700" />
            <Arrow />
            <FlowBox icon={Wrench} title="Provider receives" amount="৳ 2,640" lines={["Subtotal − commission", "Paid to bKash / bank"]} tone="bg-amber-50 border-amber-200 text-amber-700" />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="flex items-center gap-2 font-bold">
                <Landmark size={18} className="text-emerald-600" /> Pricing formula
              </h3>
              <div className="mt-3 space-y-1 rounded-xl bg-slate-900 p-4 font-mono text-sm text-emerald-300">
                <p>subtotal = labour + parts + visit_charge</p>
                <p>vat      = subtotal × 5%</p>
                <p>total    = subtotal + vat</p>
                <p>commission = subtotal × 20%</p>
                <p>payout   = subtotal − commission</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="font-bold">Revenue model of Trust Pass Ltd.</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>• <b>20% commission</b> on every completed job.</li>
                <li>• <b>Featured listing</b> subscription for providers who want to appear first.</li>
                <li>• <b>Verified passport reports</b> sold to used-car buyers, banks and insurance companies (with owner permission).</li>
                <li>• <b>Parts partnerships</b> with genuine parts suppliers.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function FlowBox({
  icon: Icon,
  title,
  amount,
  lines,
  tone,
}: {
  icon: React.ElementType;
  title: string;
  amount: string;
  lines: string[];
  tone: string;
}) {
  return (
    <div className={`rounded-2xl border p-6 ${tone}`}>
      <Icon size={24} />
      <p className="mt-3 text-sm font-semibold">{title}</p>
      <p className="text-3xl font-extrabold text-slate-900">{amount}</p>
      <ul className="mt-2 space-y-0.5 text-xs text-slate-600">
        {lines.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </div>
  );
}

function Arrow() {
  return (
    <div className="grid place-items-center text-slate-400">
      <ArrowRight className="hidden md:block" />
      <ArrowDown className="md:hidden" />
    </div>
  );
}
