"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Bike,
  Check,
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  Minus,
  PartyPopper,
  Plus,
  Smartphone,
  Star,
  Truck,
  Wrench,
} from "lucide-react";
import { CATALOG, PLATFORM_COMMISSION, Provider, VAT_RATE, bdt } from "@/lib/data";
import { Booking, LineItem, STATUS_FLOW, computeBill, useStore } from "@/lib/store";
import { Explain, btnPrimary, btnSecondary, inputCls } from "@/components/ui";

const EXPLAIN: Record<Booking["status"], React.ReactNode> = {
  requested: (
    <>The booking has been sent and the provider has been notified by SMS and app notification. The status updates
      automatically as soon as the provider accepts.</>
  ),
  accepted: <>The provider accepted and is travelling to the receiver&apos;s location. Live status keeps the receiver informed.</>,
  in_progress: (
    <>When the work is finished, the <b>receiver</b> asks the provider what was repaired and what parts were replaced, then
      selects them below. The prices come from the <b>platform&apos;s fixed catalogue</b> — the provider cannot change them.
      The bill on the right updates live.</>
  ),
  reported: (
    <>The platform has calculated the <b>fixed final price</b>. The receiver now pays online. The money goes to Trust Pass
      first (escrow) — not directly to the provider.</>
  ),
  paid: (
    <>Payment is safely held by Trust Pass. The platform now keeps its {PLATFORM_COMMISSION * 100}% commission and
      releases the rest to the provider&apos;s bKash or bank account.</>
  ),
  completed: (
    <>Done! The provider has been paid and this service is now permanently recorded in the asset&apos;s <b>Digital Service
      Passport</b>. The receiver can rate the provider.</>
  ),
};

export function BookingView() {
  const id = useSearchParams().get("id") ?? "";
  const { bookings, providers, ready, updateBooking } = useStore();
  const b = bookings.find((x) => x.id === id);

  if (!ready) return <div className="p-20 text-center text-slate-400">Loading…</div>;
  if (!b)
    return (
      <div className="p-20 text-center">
        Booking not found. <Link href="/dashboard" className="text-emerald-700 underline">Go to dashboard</Link>
      </div>
    );
  const p = providers.find((x) => x.id === b.providerId)!;
  const idx = STATUS_FLOW.findIndex((s) => s.key === b.status);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-slate-500">Booking {b.id}</p>
          <h1 className="text-2xl font-extrabold sm:text-3xl">
            {b.service} · {b.asset.brand} {b.asset.model}
          </h1>
          <p className="text-sm text-slate-500">
            with <Link href={`/provider?id=${p.id}`} className="font-semibold text-emerald-700 hover:underline">{p.name}</Link> · {b.area} · {b.date}
          </p>
        </div>
        <span className="rounded-full bg-emerald-600 px-3 py-1 text-sm font-semibold text-white">{STATUS_FLOW[idx].label}</span>
      </div>

      {/* Stepper */}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <ol className="flex min-w-[640px] items-start">
          {STATUS_FLOW.map((s, i) => (
            <li key={s.key} className="relative flex flex-1 flex-col items-center text-center">
              {i > 0 && (
                <span className={`absolute right-1/2 top-4 h-0.5 w-full ${i <= idx ? "bg-emerald-500" : "bg-slate-200"}`} />
              )}
              <span
                className={`relative z-10 grid h-8 w-8 place-items-center rounded-full text-sm font-bold ${
                  i < idx || b.status === "completed"
                    ? "bg-emerald-500 text-white"
                    : i === idx
                    ? "bg-emerald-600 text-white ring-4 ring-emerald-100"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {i < idx || b.status === "completed" ? <Check size={16} /> : i + 1}
              </span>
              <span className={`mt-2 text-xs font-semibold ${i <= idx ? "text-slate-900" : "text-slate-400"}`}>{s.label}</span>
              <span className="text-[10px] text-slate-400">{s.who}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Explain title={`Step: ${STATUS_FLOW[idx].label}`}>{EXPLAIN[b.status]}</Explain>

          {b.status === "requested" && (
            <Panel icon={Loader2} spin title="Waiting for the provider to accept…" text={`${p.name} has received your request and note.`}>
              <SimButton who="Provider update" onClick={() => updateBooking(b.id, { status: "accepted" })}>
                Provider accepts the job
              </SimButton>
            </Panel>
          )}

          {b.status === "accepted" && (
            <Panel icon={p.assets.includes("Motorbike") ? Bike : Truck} title={`${p.owner} is on the way`} text={`Estimated arrival in 25 minutes at ${b.area}. Contact: ${p.phone}`}>
              <SimButton who="Provider update" onClick={() => updateBooking(b.id, { status: "in_progress" })}>
                Provider arrived — start work
              </SimButton>
            </Panel>
          )}

          {b.status === "in_progress" && <WorkReport booking={b} provider={p} onSubmit={(items) => updateBooking(b.id, { items, status: "reported" })} />}

          {b.status === "reported" && <Payment booking={b} provider={p} providers={providers} onPaid={(method, txn) => updateBooking(b.id, { status: "paid", payMethod: method, txnId: txn, paidAt: new Date().toISOString() })} />}

          {b.status === "paid" && (
            <Panel icon={Lock} title="Payment received & held securely" text={`Transaction ${b.txnId} via ${b.payMethod}. Trust Pass is now processing the provider payout.`}>
              <PayoutBreakdown booking={b} providers={providers} />
              <SimButton who="Trust Pass payout system" onClick={() => updateBooking(b.id, { status: "completed", payoutAt: new Date().toISOString() })}>
                Release payment to provider
              </SimButton>
            </Panel>
          )}

          {b.status === "completed" && (
            <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 sm:p-8">
              <PartyPopper className="text-emerald-600" size={36} />
              <h2 className="mt-3 text-2xl font-extrabold">Service completed & recorded</h2>
              <p className="mt-1 text-slate-600">
                The provider has been paid and this service has been added to the passport of <b>{b.asset.regNo}</b>.
              </p>
              <div className="mt-5">
                <PayoutBreakdown booking={b} providers={providers} />
              </div>
              <div className="mt-6 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
                <p className="font-semibold">Rate {p.name}</p>
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => updateBooking(b.id, { rating: n })} aria-label={`${n} stars`}>
                      <Star size={30} className={n <= (b.rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
                    </button>
                  ))}
                </div>
                {b.rating && <p className="mt-1 text-sm text-emerald-700">Thanks! Your {b.rating}-star rating updates the provider&apos;s public profile.</p>}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/passport?asset=${encodeURIComponent(b.asset.regNo)}`} className={btnPrimary}>
                  View Service Passport <ArrowRight size={16} />
                </Link>
                <Link href="/dashboard" className={btnSecondary}>Go to dashboard</Link>
              </div>
            </div>
          )}
        </div>

        {/* Side details */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm shadow-sm">
            <p className="font-bold">Job details</p>
            <dl className="mt-3 space-y-2">
              <Row k="Asset" v={b.asset.type} />
              <Row k="Brand / model" v={`${b.asset.brand} ${b.asset.model}`} />
              <Row k="Reg / serial" v={b.asset.regNo} mono />
              <Row k="Service" v={b.service} />
              <Row k="Receiver" v={b.receiverName} />
              <Row k="Location" v={b.area} />
            </dl>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Receiver&apos;s note</p>
            <p className="mt-1 rounded-xl bg-amber-50 p-3 italic text-slate-700">“{b.note}”</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className={`grid h-11 w-11 place-items-center rounded-xl font-bold text-white ${p.color}`}>{p.initials}</div>
            <div className="text-sm">
              <p className="flex items-center gap-1 font-semibold">
                {p.name} {p.verified && <BadgeCheck size={15} className="text-emerald-600" />}
              </p>
              <p className="text-slate-500">{p.phone}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ---------------- Sub components ----------------

function Panel({
  icon: Icon,
  spin,
  title,
  text,
  children,
}: {
  icon: React.ElementType;
  spin?: boolean;
  title: string;
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
        <Icon size={28} className={spin ? "animate-spin" : ""} />
      </span>
      <h2 className="mt-4 text-xl font-extrabold">{title}</h2>
      <p className="mt-1 text-slate-600">{text}</p>
      <div className="mt-6 space-y-5">{children}</div>
    </div>
  );
}

function SimButton({ who, onClick, children }: { who: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">{who}</p>
      <button onClick={onClick} className={btnPrimary}>
        {children} <ArrowRight size={16} />
      </button>
    </div>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-500">{k}</dt>
      <dd className={`text-right font-medium ${mono ? "font-mono text-xs" : ""}`}>{v}</dd>
    </div>
  );
}

function WorkReport({ booking, provider, onSubmit }: { booking: Booking; provider: Provider; onSubmit: (items: LineItem[]) => void }) {
  const [qty, setQty] = useState<Record<string, number>>({});
  const [confirm, setConfirm] = useState(false);
  const available = CATALOG.filter((c) => c.assets.includes(booking.asset.type));
  const items: LineItem[] = Object.entries(qty)
    .filter(([, q]) => q > 0)
    .map(([catalogId, q]) => ({ catalogId, qty: q }));
  const bill = computeBill({ items, providerId: provider.id }, [provider]);

  const set = (id: string, d: number) => setQty((s) => ({ ...s, [id]: Math.max(0, Math.min(9, (s[id] ?? 0) + d)) }));

  const renderSection = (kind: "labour" | "part", title: string) => (
    <div>
      <p className="mb-2 text-sm font-bold text-slate-700">{title}</p>
      <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200">
        {available
          .filter((c) => c.kind === kind)
          .map((c) => {
            const q = qty[c.id] ?? 0;
            return (
              <div key={c.id} className={`flex items-center justify-between gap-3 px-4 py-3 ${q ? "bg-emerald-50/60" : ""}`}>
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-slate-500">Fixed price {bdt(c.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => set(c.id, -1)} className="grid h-8 w-8 place-items-center rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100">
                    <Minus size={14} />
                  </button>
                  <span className="w-5 text-center font-bold">{q}</span>
                  <button type="button" onClick={() => set(c.id, 1)} className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
          <Wrench size={24} />
        </span>
        <div>
          <h2 className="text-xl font-extrabold">Work report</h2>
          <p className="text-sm text-slate-500">Submitted by {booking.receiverName} after hearing from the provider</p>
        </div>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_260px]">
        <div className="space-y-5">
          {renderSection("labour", "Work / repairs done")}
          {renderSection("part", "Parts replaced")}
        </div>
        <div className="xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-2xl bg-slate-900 p-5 text-sm text-slate-300">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Live bill (platform)</p>
            <div className="mt-3 space-y-1.5">
              <Line k="Labour" v={bdt(bill.labour)} />
              <Line k="Parts" v={bdt(bill.parts)} />
              <Line k="Visit charge" v={bdt(bill.visit)} />
              <Line k={`VAT ${VAT_RATE * 100}%`} v={bdt(bill.vat)} />
            </div>
            <div className="mt-3 flex justify-between border-t border-slate-700 pt-3 text-base font-bold text-white">
              <span>Total</span>
              <span>{bdt(bill.total)}</span>
            </div>
          </div>
          <label className="mt-4 flex gap-2 text-xs text-slate-600">
            <input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} className="mt-0.5 accent-emerald-600" />
            I confirm the provider told me this work was done and these parts were replaced.
          </label>
          <button disabled={!items.length || !confirm} onClick={() => onSubmit(items)} className={btnPrimary + " mt-3 w-full"}>
            Submit report
          </button>
          {!items.length && <p className="mt-2 text-center text-xs text-slate-400">Add at least one item</p>}
        </div>
      </div>
    </div>
  );
}

function Line({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <span>{k}</span>
      <span className="text-white">{v}</span>
    </div>
  );
}

function Invoice({ booking, providers }: { booking: Booking; providers: Provider[] }) {
  const bill = computeBill(booking, providers);
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-2.5">Item</th>
            <th className="px-2 py-2.5 text-center">Qty</th>
            <th className="px-4 py-2.5 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {booking.items.map((li) => {
            const c = CATALOG.find((x) => x.id === li.catalogId)!;
            return (
              <tr key={li.catalogId}>
                <td className="px-4 py-2.5">
                  {c.name}
                  <span className={`ml-2 rounded px-1.5 py-0.5 text-[10px] font-semibold ${c.kind === "part" ? "bg-sky-50 text-sky-700" : "bg-violet-50 text-violet-700"}`}>
                    {c.kind === "part" ? "PART" : "WORK"}
                  </span>
                </td>
                <td className="px-2 py-2.5 text-center">{li.qty}</td>
                <td className="px-4 py-2.5 text-right">{bdt(c.price * li.qty)}</td>
              </tr>
            );
          })}
          <tr>
            <td className="px-4 py-2.5">Visit charge</td>
            <td className="px-2 py-2.5 text-center">1</td>
            <td className="px-4 py-2.5 text-right">{bdt(bill.visit)}</td>
          </tr>
        </tbody>
        <tfoot className="bg-slate-50">
          <tr>
            <td colSpan={2} className="px-4 py-2 text-slate-500">Subtotal</td>
            <td className="px-4 py-2 text-right">{bdt(bill.subtotal)}</td>
          </tr>
          <tr>
            <td colSpan={2} className="px-4 py-2 text-slate-500">VAT {VAT_RATE * 100}%</td>
            <td className="px-4 py-2 text-right">{bdt(bill.vat)}</td>
          </tr>
          <tr className="text-base font-extrabold">
            <td colSpan={2} className="px-4 py-3">Total payable</td>
            <td className="px-4 py-3 text-right text-emerald-700">{bdt(bill.total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function Payment({
  booking,
  provider,
  providers,
  onPaid,
}: {
  booking: Booking;
  provider: Provider;
  providers: Provider[];
  onPaid: (method: string, txn: string) => void;
}) {
  const [method, setMethod] = useState<"bKash" | "Nagad" | "Card">("bKash");
  const [processing, setProcessing] = useState(false);
  const bill = computeBill(booking, providers);

  const pay = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      const txn = method.slice(0, 3).toUpperCase() + Math.random().toString(36).slice(2, 10).toUpperCase();
      onPaid(method, txn);
    }, 1800);
  };

  const methods = [
    { k: "bKash", c: "bg-pink-600", icon: Smartphone },
    { k: "Nagad", c: "bg-orange-500", icon: Smartphone },
    { k: "Card", c: "bg-slate-800", icon: CreditCard },
  ] as const;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-extrabold">Fixed-price invoice</h2>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          <BadgeCheck size={14} /> Price fixed by Trust Pass
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        Provider: {provider.name} · Report submitted by {booking.receiverName}
      </p>
      <div className="mt-5">
        <Invoice booking={booking} providers={providers} />
      </div>

      <form onSubmit={pay} className="mt-6">
        <p className="text-sm font-bold">Pay online</p>
        <div className="mt-2 grid grid-cols-3 gap-3">
          {methods.map((m) => (
            <button
              type="button"
              key={m.k}
              onClick={() => setMethod(m.k)}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 text-sm font-semibold transition ${
                method === m.k ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <span className={`grid h-9 w-9 place-items-center rounded-lg text-white ${m.c}`}>
                <m.icon size={18} />
              </span>
              {m.k}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {method === "Card" ? (
            <>
              <input required className={inputCls + " sm:col-span-2"} placeholder="Card number  4242 4242 4242 4242" />
              <input required className={inputCls} placeholder="MM / YY" />
              <input required className={inputCls} placeholder="CVC" />
            </>
          ) : (
            <>
              <input required className={inputCls} placeholder={`${method} account number`} defaultValue="01700000000" />
              <input required type="password" className={inputCls} placeholder="PIN" />
            </>
          )}
        </div>
        <button disabled={processing} className={btnPrimary + " mt-5 w-full py-3.5 text-base"}>
          {processing ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Processing payment…
            </>
          ) : (
            <>
              <Lock size={16} /> Pay {bdt(bill.total)} with {method}
            </>
          )}
        </button>
        <p className="mt-2 text-center text-xs text-slate-400">Payments are processed securely through Trust Pass.</p>
      </form>
    </div>
  );
}

function PayoutBreakdown({ booking, providers }: { booking: Booking; providers: Provider[] }) {
  const bill = computeBill(booking, providers);
  const done = booking.status === "completed";
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Box label="Receiver paid" value={bdt(bill.total)} sub={`${booking.payMethod} · ${booking.txnId}`} tone="bg-sky-50 text-sky-800" />
      <Box label={`Trust Pass commission (${PLATFORM_COMMISSION * 100}%)`} value={bdt(bill.commission)} sub={`+ VAT ${bdt(bill.vat)} to NBR`} tone="bg-slate-100 text-slate-800" />
      <Box
        label={done ? "Paid to provider" : "Provider will receive"}
        value={bdt(bill.payout)}
        sub={done ? "✔ Transferred" : "Pending release"}
        tone={done ? "bg-emerald-100 text-emerald-800" : "bg-amber-50 text-amber-800"}
        icon={done ? CheckCircle2 : undefined}
      />
    </div>
  );
}

function Box({ label, value, sub, tone, icon: Icon }: { label: string; value: string; sub: string; tone: string; icon?: React.ElementType }) {
  return (
    <div className={`rounded-2xl p-4 ${tone}`}>
      <p className="text-xs font-semibold opacity-80">{label}</p>
      <p className="mt-1 flex items-center gap-1.5 text-xl font-extrabold">
        {Icon && <Icon size={18} />} {value}
      </p>
      <p className="mt-0.5 truncate text-xs opacity-70">{sub}</p>
    </div>
  );
}
