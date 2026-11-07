"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, CheckCircle2, User } from "lucide-react";
import { AREAS, ASSET_TYPES, AssetType, SERVICE_KINDS, ServiceKind } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Explain, Field, PageHeader, btnPrimary, inputCls } from "@/components/ui";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, addProvider, providers } = useStore();
  const [role, setRole] = useState<"receiver" | "provider">("receiver");
  const [done, setDone] = useState(false);

  // shared
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [area, setArea] = useState("Dhanmondi");
  // provider only
  const [business, setBusiness] = useState("");
  const [nid, setNid] = useState("");
  const [years, setYears] = useState("3");
  const [visit, setVisit] = useState("300");
  const [bio, setBio] = useState("");
  const [assets, setAssets] = useState<AssetType[]>(["Car"]);
  const [services, setServices] = useState<ServiceKind[]>(["Repair"]);

  const toggle = <T,>(list: T[], v: T, set: (x: T[]) => void) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "provider") {
      const id = "p" + (providers.length + 1) + "-" + Date.now().toString(36);
      const a = AREAS.find((x) => x.name === area)!;
      addProvider({
        id,
        name: business,
        owner: name,
        phone,
        area,
        lat: a.lat + (Math.random() - 0.5) * 0.01,
        lng: a.lng + (Math.random() - 0.5) * 0.01,
        rating: 0,
        jobs: 0,
        years: Number(years) || 0,
        verified: false,
        assets,
        services,
        visitCharge: Number(visit) || 0,
        bio: bio || "Newly registered provider on Trust Pass.",
        initials: business
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        color: "bg-emerald-600",
        reviews: [],
      });
      setUser({ role, name, phone, email, area, providerId: id });
    } else {
      setUser({ role, name, phone, email, area });
    }
    setDone(true);
    setTimeout(() => router.push(role === "provider" ? "/dashboard" : "/providers"), 1400);
  };

  return (
    <>
      <PageHeader
        eyebrow="Step 1 · Registration"
        title="Create your Trust Pass account"
        sub="Choose whether you need a service (receiver) or you offer a service (provider)."
      />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_340px]">
        <div>
          {/* Role tabs */}
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { k: "receiver", icon: User, t: "Service Receiver", d: "I own a car, bike or appliance and need service." },
                { k: "provider", icon: Briefcase, t: "Service Provider", d: "I am a mechanic, technician or washing service." },
              ] as const
            ).map((r) => (
              <button
                key={r.k}
                type="button"
                onClick={() => setRole(r.k)}
                className={`rounded-2xl border-2 p-4 text-left transition sm:p-5 ${
                  role === r.k ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <r.icon className={role === r.k ? "text-emerald-600" : "text-slate-400"} />
                <p className="mt-2 font-bold">{r.t}</p>
                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">{r.d}</p>
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            {done ? (
              <div className="py-10 text-center">
                <CheckCircle2 size={56} className="mx-auto text-emerald-500" />
                <p className="mt-3 text-xl font-bold">Registration successful!</p>
                <p className="text-slate-500">
                  Redirecting to {role === "provider" ? "your provider dashboard" : "nearby providers"}…
                </p>
              </div>
            ) : (
              <>
                {role === "provider" && (
                  <Field label="Business / workshop name">
                    <input required className={inputCls} value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="e.g. Karim Auto Works" />
                  </Field>
                )}
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={role === "provider" ? "Owner full name" : "Full name"}>
                    <input required className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ayesha Rahman" />
                  </Field>
                  <Field label="Mobile number">
                    <input required className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+880 1XXX-XXXXXX" />
                  </Field>
                  <Field label="Email">
                    <input type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                  </Field>
                  <Field label="Area / location" hint="Used to sort providers from near to far.">
                    <select className={inputCls} value={area} onChange={(e) => setArea(e.target.value)}>
                      {AREAS.map((a) => (
                        <option key={a.name}>{a.name}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                {role === "provider" && (
                  <>
                    <div className="grid gap-5 sm:grid-cols-3">
                      <Field label="NID number" hint="For verification">
                        <input className={inputCls} value={nid} onChange={(e) => setNid(e.target.value)} placeholder="10 / 17 digits" />
                      </Field>
                      <Field label="Years of experience">
                        <input type="number" min={0} className={inputCls} value={years} onChange={(e) => setYears(e.target.value)} />
                      </Field>
                      <Field label="Visit charge (৳)">
                        <input type="number" min={0} className={inputCls} value={visit} onChange={(e) => setVisit(e.target.value)} />
                      </Field>
                    </div>
                    <Field label="Assets you service">
                      <div className="flex flex-wrap gap-2">
                        {ASSET_TYPES.map((a) => (
                          <Chip key={a} on={assets.includes(a)} onClick={() => toggle(assets, a, setAssets)}>
                            {a}
                          </Chip>
                        ))}
                      </div>
                    </Field>
                    <Field label="Services you offer">
                      <div className="flex flex-wrap gap-2">
                        {SERVICE_KINDS.map((s) => (
                          <Chip key={s} on={services.includes(s)} onClick={() => toggle(services, s, setServices)}>
                            {s}
                          </Chip>
                        ))}
                      </div>
                    </Field>
                    <Field label="Short description">
                      <textarea rows={3} className={inputCls} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="What are you expert in?" />
                    </Field>
                  </>
                )}

                <label className="flex items-start gap-2 text-sm text-slate-600">
                  <input required type="checkbox" className="mt-1 accent-emerald-600" />
                  I agree to the Trust Pass terms — prices are fixed by the platform and payments are made through the platform.
                </label>
                <button className={btnPrimary + " w-full py-3"}>
                  Register as {role === "provider" ? "Service Provider" : "Service Receiver"}
                </button>
              </>
            )}
          </form>
        </div>

        <aside className="space-y-4">
          <Explain title="What happens here?">
            <ul className="space-y-1.5">
              <li>Two types of users can register: <b>receivers</b> and <b>providers</b>.</li>
              <li>A provider&apos;s profile (name, services, location, visit charge) becomes visible on the Find Providers page.</li>
              <li>The receiver&apos;s <b>area</b> is used to calculate distance and sort providers near → far.</li>
            </ul>
          </Explain>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm">
            <p className="font-bold">Provider verification process</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-slate-600">
              <li>NID & trade licence check</li>
              <li>Phone OTP verification</li>
              <li>Skill test / workshop visit</li>
              <li>Verified ✔ badge on profile</li>
            </ol>
          </div>
        </aside>
      </div>
    </>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
        on ? "border-emerald-500 bg-emerald-600 text-white" : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
      }`}
    >
      {children}
    </button>
  );
}
