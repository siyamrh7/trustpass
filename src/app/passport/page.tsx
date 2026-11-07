"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BadgeCheck, Car, Download, Package, Share2, ShieldCheck, Wrench, X } from "lucide-react";
import { CATALOG, bdt } from "@/lib/data";
import { Booking, computeBill, useStore } from "@/lib/store";
import { Explain, PageHeader, btnPrimary, btnSecondary } from "@/components/ui";

export default function PassportPage() {
  return (
    <Suspense>
      <Passport />
    </Suspense>
  );
}

function Passport() {
  const params = useSearchParams();
  const { bookings, providers, ready } = useStore();
  const [share, setShare] = useState(false);

  // group completed bookings by asset registration number
  const assets = useMemo(() => {
    const map = new Map<string, Booking[]>();
    bookings
      .filter((b) => b.status === "completed")
      .forEach((b) => map.set(b.asset.regNo, [...(map.get(b.asset.regNo) ?? []), b]));
    return [...map.entries()].map(([reg, list]) => ({
      reg,
      asset: list[0].asset,
      history: list.sort((a, b) => b.date.localeCompare(a.date)),
    }));
  }, [bookings]);

  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => {
    const q = params.get("asset");
    if (q) setSelected(q);
  }, [params]);

  const current = assets.find((a) => a.reg === selected) ?? assets[0];

  return (
    <>
      <PageHeader
        eyebrow="Digital Service Passport"
        title="Your asset's complete service history"
        sub="Every completed and paid job is recorded here automatically — what was repaired, which parts were replaced, who did it and what it cost."
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Explain title="What is a Digital Service Passport?">
          Like a passport for a person, each asset (car, bike, AC, fridge…) gets its own permanent record, identified by its
          <b> registration or serial number</b>. Because entries are created only after the receiver confirms the work and
          pays through the platform, the history is <b>trustworthy</b>. The owner can share it with a buyer, a bank or an
          insurance company using the QR code — this increases resale value and stops fraud.
        </Explain>

        {!ready ? null : assets.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
            No completed services yet. <Link href="/providers" className="text-emerald-700 underline">Book a service</Link>
          </div>
        ) : (
          <>
            {/* Asset selector */}
            <div className="mt-8 flex gap-3 overflow-x-auto pb-2">
              {assets.map((a) => (
                <button
                  key={a.reg}
                  onClick={() => setSelected(a.reg)}
                  className={`min-w-[220px] rounded-2xl border-2 p-4 text-left transition ${
                    current?.reg === a.reg ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <p className="text-xs font-semibold text-slate-500">{a.asset.type}</p>
                  <p className="font-bold">
                    {a.asset.brand} {a.asset.model}
                  </p>
                  <p className="truncate font-mono text-xs text-slate-500">{a.reg}</p>
                </button>
              ))}
            </div>

            {current && (
              <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
                {/* Passport card */}
                <div className="lg:sticky lg:top-24 lg:self-start">
                  <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-900 p-6 text-white shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-300">
                        <ShieldCheck size={14} /> Trust Pass
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-slate-400">Service Passport</span>
                    </div>
                    <div className="mt-6 flex items-end justify-between gap-4">
                      <div>
                        <Car className="text-emerald-300" />
                        <p className="mt-2 text-2xl font-extrabold leading-tight">
                          {current.asset.brand}
                          <br />
                          {current.asset.model}
                        </p>
                        <p className="mt-1 font-mono text-xs text-slate-400">{current.reg}</p>
                      </div>
                      <QR seed={current.reg} />
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-center">
                      <Mini label="Services" value={String(current.history.length)} />
                      <Mini label="Total spent" value={bdt(current.history.reduce((s, b) => s + computeBill(b, providers).total, 0))} />
                      <Mini label="Health" value={Math.min(100, 70 + current.history.length * 8) + "/100"} />
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button onClick={() => setShare(true)} className={btnPrimary}>
                      <Share2 size={16} /> Share
                    </button>
                    <button onClick={() => window.print()} className={btnSecondary}>
                      <Download size={16} /> Print / PDF
                    </button>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <p className="mb-4 font-bold">Service history</p>
                  <div className="relative space-y-5 border-l-2 border-emerald-200 pl-6">
                    {current.history.map((b) => {
                      const p = providers.find((x) => x.id === b.providerId);
                      const bill = computeBill(b, providers);
                      const work = b.items.map((li) => ({ ...CATALOG.find((c) => c.id === li.catalogId)!, qty: li.qty }));
                      return (
                        <div key={b.id} className="relative">
                          <span className="absolute -left-[33px] top-5 grid h-4 w-4 place-items-center rounded-full bg-emerald-500 ring-4 ring-white" />
                          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <p className="text-xs font-semibold text-slate-400">
                                  {new Date(b.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} · {b.id}
                                </p>
                                <p className="text-lg font-bold">{b.service}</p>
                                <p className="text-sm text-slate-500">
                                  by <span className="font-medium text-slate-700">{p?.name}</span>
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-extrabold">{bdt(bill.total)}</p>
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                                  <BadgeCheck size={13} /> Verified · {b.payMethod}
                                </span>
                              </div>
                            </div>
                            <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm italic text-slate-600">“{b.note}”</p>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                              <List icon={Wrench} title="Work done" items={work.filter((w) => w.kind === "labour").map((w) => w.name)} />
                              <List icon={Package} title="Parts replaced" items={work.filter((w) => w.kind === "part").map((w) => `${w.name}${w.qty > 1 ? " × " + w.qty : ""}`)} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {share && current && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4" onClick={() => setShare(false)}>
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end">
              <button onClick={() => setShare(false)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <p className="text-lg font-bold">Share this passport</p>
            <p className="text-sm text-slate-500">A buyer or insurer scans this to see the verified history.</p>
            <div className="mx-auto mt-5 w-fit rounded-2xl bg-slate-900 p-4">
              <QR seed={current.reg} size={160} />
            </div>
            <p className="mt-4 break-all rounded-lg bg-slate-100 px-3 py-2 font-mono text-xs">
              trustpass.com.bd/p/{current.reg.replace(/\s+/g, "-").toLowerCase()}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-bold">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
    </div>
  );
}

function List({ icon: Icon, title, items }: { icon: React.ElementType; title: string; items: string[] }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
        <Icon size={13} /> {title}
      </p>
      <ul className="mt-1.5 space-y-1 text-sm">
        {items.length ? items.map((i) => <li key={i}>• {i}</li>) : <li className="text-slate-400">—</li>}
      </ul>
    </div>
  );
}

/** Decorative QR-style code generated from the registration number. */
function QR({ seed, size = 76 }: { seed: string; size?: number }) {
  const n = 21;
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const rand = () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 100) / 100;
  };
  const finder = (x: number, y: number) =>
    [[0, 0], [n - 7, 0], [0, n - 7]].some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);
  const finderOn = (x: number, y: number) => {
    for (const [fx, fy] of [[0, 0], [n - 7, 0], [0, n - 7]]) {
      const dx = x - fx, dy = y - fy;
      if (dx >= 0 && dx < 7 && dy >= 0 && dy < 7) {
        return dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4);
      }
    }
    return false;
  };
  const cells: [number, number][] = [];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) if (finder(x, y) ? finderOn(x, y) : rand() > 0.5) cells.push([x, y]);
  return (
    <svg width={size} height={size} viewBox={`-1 -1 ${n + 2} ${n + 2}`} className="shrink-0 rounded-md bg-white">
      {cells.map(([x, y]) => (
        <rect key={x + "-" + y} x={x} y={y} width={1} height={1} fill="#0f172a" />
      ))}
    </svg>
  );
}
