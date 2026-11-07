"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, Briefcase, MapPin, Navigation } from "lucide-react";
import { AREAS, ASSET_TYPES, SERVICE_KINDS, bdt, haversineKm } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Explain, PageHeader, Stars, inputCls } from "@/components/ui";

export default function ProvidersPage() {
  const { providers, user, ready } = useStore();
  const [area, setArea] = useState(user.area);
  const [asset, setAsset] = useState("All");
  const [service, setService] = useState("All");
  const [sort, setSort] = useState<"distance" | "rating">("distance");

  useEffect(() => {
    if (ready) setArea(user.area);
  }, [ready, user.area]);

  const origin = AREAS.find((a) => a.name === area) ?? AREAS[0];

  const list = useMemo(() => {
    return providers
      .map((p) => ({ ...p, km: haversineKm(origin, p) }))
      .filter((p) => asset === "All" || p.assets.includes(asset as never))
      .filter((p) => service === "All" || p.services.includes(service as never))
      .sort((a, b) => (sort === "distance" ? a.km - b.km : b.rating - a.rating));
  }, [providers, origin, asset, service, sort]);

  return (
    <>
      <PageHeader
        eyebrow="Step 2 · Choose a provider"
        title="Find a trusted service provider"
        sub="Providers are shown with their rating, experience and distance from you — nearest first."
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Explain title="How the list is ordered">
          We calculate the straight-line distance between your area and each provider using their GPS coordinates
          (Haversine formula). By default the list is sorted <b>near → far</b>. You can also sort by <b>rating</b> and
          filter by asset type or service. Change “Your location” to see the order change live.
        </Explain>

        {/* Filters */}
        <div className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-xs font-semibold text-slate-500">
            Your location
            <select className={inputCls + " mt-1"} value={area} onChange={(e) => setArea(e.target.value)}>
              {AREAS.map((a) => (
                <option key={a.name}>{a.name}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold text-slate-500">
            Asset type
            <select className={inputCls + " mt-1"} value={asset} onChange={(e) => setAsset(e.target.value)}>
              <option>All</option>
              {ASSET_TYPES.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold text-slate-500">
            Service
            <select className={inputCls + " mt-1"} value={service} onChange={(e) => setService(e.target.value)}>
              <option>All</option>
              {SERVICE_KINDS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold text-slate-500">
            Sort by
            <select className={inputCls + " mt-1"} value={sort} onChange={(e) => setSort(e.target.value as "distance" | "rating")}>
              <option value="distance">Distance (near → far)</option>
              <option value="rating">Rating (high → low)</option>
            </select>
          </label>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <p className="text-sm text-slate-500">
              {list.length} provider{list.length !== 1 && "s"} found near <b className="text-slate-800">{area}</b>
            </p>
            {list.map((p, i) => (
              <Link
                key={p.id}
                href={`/provider?id=${p.id}`}
                className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-4 sm:flex-1">
                  <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-lg font-bold text-white ${p.color}`}>
                    {p.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold group-hover:text-emerald-700">{p.name}</p>
                      {p.verified && <BadgeCheck size={17} className="text-emerald-600" />}
                      {sort === "distance" && i === 0 && (
                        <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">Nearest</span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                      {p.jobs > 0 ? (
                        <span className="flex items-center gap-1">
                          <Stars value={p.rating} /> <b className="text-slate-700">{p.rating.toFixed(1)}</b>
                        </span>
                      ) : (
                        <span className="rounded bg-indigo-50 px-1.5 text-xs font-semibold text-indigo-600">New provider</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Briefcase size={13} /> {p.jobs} jobs
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={13} /> {p.area}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {p.assets.map((a) => (
                        <span key={a} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-6 border-t border-slate-100 pt-3 sm:block sm:border-0 sm:pt-0 sm:text-right">
                  <p className="flex items-center gap-1 text-lg font-extrabold text-slate-900 sm:justify-end">
                    <Navigation size={15} className="text-emerald-600" /> {p.km.toFixed(1)} km
                  </p>
                  <p className="text-xs text-slate-500">Visit charge {bdt(p.visitCharge)}</p>
                </div>
              </Link>
            ))}
            {list.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
                No provider matches these filters.
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Radar origin={origin.name} points={list.map((p) => ({ id: p.id, label: p.initials, km: p.km, dx: p.lng - origin.lng, dy: p.lat - origin.lat }))} />
          </aside>
        </div>
      </div>
    </>
  );
}

function Radar({ origin, points }: { origin: string; points: { id: string; label: string; km: number; dx: number; dy: number }[] }) {
  const R = 130;
  const maxKm = 16;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="font-bold">Distance map</p>
      <p className="text-xs text-slate-500">You are at the centre ({origin}). Rings = 4 km.</p>
      <svg viewBox="-150 -150 300 300" className="mt-3 w-full">
        {[1, 2, 3, 4].map((r) => (
          <circle key={r} r={(R * r) / 4} fill="none" stroke="#e6dfcf" strokeDasharray={r === 4 ? "" : "3 4"} />
        ))}
        {points.map((p) => {
          const ang = Math.atan2(-p.dy, p.dx * Math.cos((23.8 * Math.PI) / 180));
          const d = (Math.min(p.km, maxKm) / maxKm) * R;
          const x = Math.cos(ang) * d;
          const y = Math.sin(ang) * d;
          return (
            <g key={p.id}>
              <line x1={0} y1={0} x2={x} y2={y} stroke="#c7d7ba" />
              <circle cx={x} cy={y} r={11} fill="#4a6c3e" />
              <text x={x} y={y + 3.5} textAnchor="middle" fontSize="9" fontWeight="700" fill="white">
                {p.label}
              </text>
            </g>
          );
        })}
        <circle r={8} fill="#a67c2a" />
        <circle r={14} fill="none" stroke="#a67c2a" strokeOpacity={0.35} />
      </svg>
    </div>
  );
}
