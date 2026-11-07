"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Briefcase, Building2, CircleDollarSign, Clock, Inbox, Landmark, Star, User, Wallet } from "lucide-react";
import { bdt } from "@/lib/data";
import { Booking, STATUS_FLOW, computeBill, useStore } from "@/lib/store";
import { Explain, PageHeader } from "@/components/ui";

type Tab = "receiver" | "provider" | "platform";

const STATUS_TONE: Record<Booking["status"], string> = {
  requested: "bg-amber-50 text-amber-700",
  accepted: "bg-sky-50 text-sky-700",
  in_progress: "bg-violet-50 text-violet-700",
  reported: "bg-orange-50 text-orange-700",
  paid: "bg-teal-50 text-teal-700",
  completed: "bg-emerald-50 text-emerald-700",
};

export default function Dashboard() {
  const { user, bookings, providers, ready, updateBooking } = useStore();
  const [tab, setTab] = useState<Tab>("receiver");
  const [providerId, setProviderId] = useState("p1");

  useEffect(() => {
    if (!ready) return;
    if (user.role === "provider") {
      setTab("provider");
      if (user.providerId) setProviderId(user.providerId);
    }
  }, [ready, user]);

  const label = (s: Booking["status"]) => STATUS_FLOW.find((x) => x.key === s)!.label;
  const prov = providers.find((p) => p.id === providerId);

  return (
    <>
      <PageHeader eyebrow="Dashboard" title={`Welcome, ${user.name}`} sub="Switch between the three views to see the system from each stakeholder's side." />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
          {(
            [
              ["receiver", "Receiver", User],
              ["provider", "Provider", Briefcase],
              ["platform", "Platform (Admin)", Building2],
            ] as const
          ).map(([k, l, I]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition sm:px-4 ${
                tab === k ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <I size={15} /> {l}
            </button>
          ))}
        </div>

        {/* RECEIVER */}
        {tab === "receiver" && (
          <div className="mt-6 space-y-6">
            <Explain title="Receiver view">
              The service receiver sees all their bookings, the current status of each job and total money spent. Click any
              booking to continue its flow.
            </Explain>
            <div className="grid gap-4 sm:grid-cols-3">
              <Kpi icon={Clock} label="Active jobs" value={String(bookings.filter((b) => b.status !== "completed").length)} />
              <Kpi icon={Star} label="Completed services" value={String(bookings.filter((b) => b.status === "completed").length)} />
              <Kpi
                icon={Wallet}
                label="Total spent"
                value={bdt(bookings.filter((b) => b.status === "paid" || b.status === "completed").reduce((s, b) => s + computeBill(b, providers).total, 0))}
              />
            </div>
            <Table
              rows={bookings}
              cols={["Booking", "Asset", "Provider", "Status", ""]}
              render={(b) => [
                <span key="1" className="font-mono text-xs">{b.id}</span>,
                <span key="2">{b.asset.brand} {b.asset.model}<br /><span className="text-xs text-slate-400">{b.service}</span></span>,
                providers.find((p) => p.id === b.providerId)?.name,
                <span key="4" className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_TONE[b.status]}`}>{label(b.status)}</span>,
                <Link key="5" href={`/booking?id=${b.id}`} className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:underline">
                  Open <ArrowRight size={14} />
                </Link>,
              ]}
            />
          </div>
        )}

        {/* PROVIDER */}
        {tab === "provider" && prov && (() => {
          const mine = bookings.filter((b) => b.providerId === prov.id);
          const earned = mine.filter((b) => b.status === "completed").reduce((s, b) => s + computeBill(b, providers).payout, 0);
          const pending = mine.filter((b) => b.status === "paid").reduce((s, b) => s + computeBill(b, providers).payout, 0);
          const requests = mine.filter((b) => b.status === "requested");
          return (
            <div className="mt-6 space-y-6">
              <Explain title="Provider view">
                The provider sees new job requests (with the receiver&apos;s note), accepts them, and tracks <b>earnings</b>.
                Earnings are paid by the platform after the receiver pays — already minus the 10% commission.
              </Explain>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-slate-500">Viewing as provider:</span>
                <select value={providerId} onChange={(e) => setProviderId(e.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 font-semibold">
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Kpi icon={Inbox} label="New requests" value={String(requests.length)} />
                <Kpi icon={Wallet} label="Total earned (paid out)" value={bdt(earned)} />
                <Kpi icon={Clock} label="Pending payout" value={bdt(pending)} />
                <Kpi icon={Star} label="Rating" value={prov.jobs ? prov.rating.toFixed(1) : "New"} />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="font-bold">Incoming requests</p>
                {requests.length === 0 && <p className="mt-2 text-sm text-slate-500">No new requests. Book this provider from the Find Providers page to see one here.</p>}
                <div className="mt-3 space-y-3">
                  {requests.map((b) => (
                    <div key={b.id} className="flex flex-col justify-between gap-3 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center">
                      <div>
                        <p className="font-semibold">{b.service} · {b.asset.brand} {b.asset.model} <span className="font-mono text-xs text-slate-400">{b.id}</span></p>
                        <p className="text-sm text-slate-500">{b.receiverName} · {b.area} · {b.date}</p>
                        <p className="mt-1 text-sm italic text-slate-600">“{b.note}”</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => updateBooking(b.id, { status: "accepted" })} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                          Accept
                        </button>
                        <Link href={`/booking?id=${b.id}`} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">View</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="font-bold">All jobs & payouts</p>
              <Table
                rows={mine}
                cols={["Booking", "Customer", "Status", "Job value", "Your payout"]}
                render={(b) => {
                  const bill = computeBill(b, providers);
                  return [
                    <Link key="1" href={`/booking?id=${b.id}`} className="font-mono text-xs text-emerald-700 hover:underline">{b.id}</Link>,
                    b.receiverName,
                    <span key="3" className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_TONE[b.status]}`}>{label(b.status)}</span>,
                    b.items.length ? bdt(bill.subtotal) : "—",
                    b.items.length ? <b key="5" className={b.status === "completed" ? "text-emerald-700" : ""}>{bdt(bill.payout)}</b> : "—",
                  ];
                }}
              />
            </div>
          );
        })()}

        {/* PLATFORM */}
        {tab === "platform" && (() => {
          const paid = bookings.filter((b) => b.status === "paid" || b.status === "completed");
          const sum = (f: (x: ReturnType<typeof computeBill>) => number) => paid.reduce((s, b) => s + f(computeBill(b, providers)), 0);
          return (
            <div className="mt-6 space-y-6">
              <Explain title="Platform (Trust Pass Ltd.) view">
                This is how the company earns money. Every payment passes through Trust Pass: we keep a <b>10% commission</b>,
                collect VAT for the government, and pay the rest to providers.
              </Explain>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Kpi icon={CircleDollarSign} label="Total collected (GMV)" value={bdt(sum((x) => x.total))} />
                <Kpi icon={Building2} label="Commission revenue" value={bdt(sum((x) => x.commission))} />
                <Kpi icon={Landmark} label="VAT collected" value={bdt(sum((x) => x.vat))} />
                <Kpi icon={Wallet} label="Paid to providers" value={bdt(paid.filter((b) => b.status === "completed").reduce((s, b) => s + computeBill(b, providers).payout, 0))} />
              </div>
              <Table
                rows={paid}
                cols={["Txn", "Provider", "Total", "Commission", "Payout status"]}
                render={(b) => {
                  const bill = computeBill(b, providers);
                  return [
                    <span key="1" className="font-mono text-xs">{b.txnId}<br /><span className="text-slate-400">{b.payMethod}</span></span>,
                    providers.find((p) => p.id === b.providerId)?.name,
                    bdt(bill.total),
                    bdt(bill.commission),
                    b.status === "completed" ? (
                      <span key="5" className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Released {bdt(bill.payout)}</span>
                    ) : (
                      <Link key="5" href={`/booking?id=${b.id}`} className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">Pending → release</Link>
                    ),
                  ];
                }}
              />
            </div>
          );
        })()}
      </div>
    </>
  );
}

function Kpi({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
        <Icon size={20} />
      </span>
      <p className="mt-3 text-2xl font-extrabold">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

function Table({ rows, cols, render }: { rows: Booking[]; cols: string[]; render: (b: Booking) => React.ReactNode[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>{cols.map((c) => <th key={c} className="px-4 py-3">{c}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 && (
            <tr><td colSpan={cols.length} className="px-4 py-8 text-center text-slate-400">Nothing here yet.</td></tr>
          )}
          {rows.map((b) => (
            <tr key={b.id} className="hover:bg-slate-50/60">
              {render(b).map((cell, i) => <td key={i} className="px-4 py-3 align-middle">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
