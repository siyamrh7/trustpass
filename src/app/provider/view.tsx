"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, BadgeCheck, Briefcase, CalendarDays, Clock, MapPin, Phone, Send } from "lucide-react";
import { AREAS, AssetType, ServiceKind, bdt, haversineKm } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Explain, Field, Stars, btnPrimary, inputCls } from "@/components/ui";

export function ProviderView() {
  const id = useSearchParams().get("id") ?? "";
  const router = useRouter();
  const { providers, user, ready, createBooking } = useStore();
  const p = providers.find((x) => x.id === id);

  const [assetType, setAssetType] = useState<AssetType>("Car");
  const [service, setService] = useState<ServiceKind>("Repair");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [regNo, setRegNo] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);

  useEffect(() => {
    if (p) {
      setAssetType(p.assets[0]);
      setService(p.services[0]);
    }
  }, [p]);
  useEffect(() => {
    setName(user.name);
    setPhone(user.phone);
  }, [user]);

  if (!ready) return <div className="p-20 text-center text-slate-400">Loading…</div>;
  if (!p)
    return (
      <div className="p-20 text-center">
        Provider not found. <Link href="/providers" className="text-emerald-700 underline">Back to list</Link>
      </div>
    );

  const origin = AREAS.find((a) => a.name === user.area) ?? AREAS[0];
  const km = haversineKm(origin, p);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const bid = createBooking({
      providerId: p.id,
      receiverName: name,
      receiverPhone: phone,
      area: user.area,
      asset: { type: assetType, brand, model, regNo },
      service,
      note,
      date,
    });
    router.push(`/booking?id=${bid}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link href="/providers" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900">
        <ArrowLeft size={16} /> All providers
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Profile */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="h-28 bg-gradient-to-r from-emerald-600 to-teal-700" />
            <div className="px-6 pb-6">
              <div className={`-mt-10 grid h-20 w-20 place-items-center rounded-2xl border-4 border-white text-2xl font-bold text-white ${p.color}`}>
                {p.initials}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold">{p.name}</h1>
                {p.verified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    <BadgeCheck size={14} /> Verified
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">Verification pending</span>
                )}
              </div>
              <p className="text-sm text-slate-500">Owner: {p.owner}</p>
              <p className="mt-3 text-slate-700">{p.bio}</p>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="Rating" value={p.jobs ? p.rating.toFixed(1) + " ★" : "New"} />
                <Stat label="Jobs done" value={String(p.jobs)} />
                <Stat label="Experience" value={p.years + " yrs"} />
                <Stat label="Distance" value={km.toFixed(1) + " km"} />
              </div>

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
                <span className="flex items-center gap-1.5"><MapPin size={15} /> {p.area}, Dhaka</span>
                <span className="flex items-center gap-1.5"><Phone size={15} /> {p.phone}</span>
                <span className="flex items-center gap-1.5"><Clock size={15} /> 9 AM – 9 PM, 7 days</span>
                <span className="flex items-center gap-1.5"><Briefcase size={15} /> Visit charge {bdt(p.visitCharge)}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-bold">Assets serviced</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.assets.map((a) => (
                  <span key={a} className="rounded-lg bg-slate-100 px-2.5 py-1 text-sm">{a}</span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-bold">Services offered</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.services.map((s) => (
                  <span key={s} className="rounded-lg bg-emerald-50 px-2.5 py-1 text-sm text-emerald-700">{s}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <p className="font-bold">Customer reviews</p>
            <div className="mt-4 space-y-4">
              {p.reviews.length === 0 && <p className="text-sm text-slate-500">No reviews yet.</p>}
              {p.reviews.map((r) => (
                <div key={r.by + r.date} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{r.by}</p>
                    <span className="text-xs text-slate-400">{r.date}</span>
                  </div>
                  <Stars value={r.rating} size={13} />
                  <p className="mt-1 text-sm text-slate-600">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking form */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <form onSubmit={submit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Step 3 · Book</p>
              <p className="text-xl font-extrabold">Request a service</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Asset">
                <select className={inputCls} value={assetType} onChange={(e) => setAssetType(e.target.value as AssetType)}>
                  {p.assets.map((a) => <option key={a}>{a}</option>)}
                </select>
              </Field>
              <Field label="Service">
                <select className={inputCls} value={service} onChange={(e) => setService(e.target.value as ServiceKind)}>
                  {p.services.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Brand">
                <input required className={inputCls} value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Toyota" />
              </Field>
              <Field label="Model / year">
                <input required className={inputCls} value={model} onChange={(e) => setModel(e.target.value)} placeholder="Axio 2016" />
              </Field>
            </div>
            <Field label="Registration / serial no." hint="This links the service to your asset's passport.">
              <input required className={inputCls} value={regNo} onChange={(e) => setRegNo(e.target.value.toUpperCase())} placeholder="DHAKA METRO-GA 12-3456" />
            </Field>
            <Field label="Problem note">
              <textarea
                required
                rows={4}
                className={inputCls}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Describe the problem, e.g. 'Engine makes noise when starting, AC not cold.'"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Your name">
                <input required className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field label="Preferred date">
                <div className="relative">
                  <CalendarDays size={15} className="pointer-events-none absolute right-3 top-3 text-slate-400" />
                  <input type="date" required className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
              </Field>
            </div>
            <p className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
              Service at <b>your location ({user.area})</b>. No payment now — you pay the fixed price online after the work is done.
            </p>
            <button className={btnPrimary + " w-full py-3"}>
              <Send size={16} /> Send request to {p.name.split(" ")[0]}
            </button>
          </form>
          <Explain>
            The receiver fills in asset details and writes a <b>note</b> about the problem. On submit, a booking with a
            unique ID is created and the provider is notified. The registration number links this job to the asset&apos;s
            <b> Digital Service Passport</b>.
          </Explain>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 text-center">
      <p className="text-lg font-extrabold">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
