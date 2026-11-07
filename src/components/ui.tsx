"use client";

import { Info, Star } from "lucide-react";

/** Information panel explaining the current step / page. */
export function Explain({ title = "How this works", children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-slate-700 sm:p-5">
      <div className="mb-1.5 flex items-center gap-2 font-semibold text-slate-900">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-600 text-white">
          <Info size={14} />
        </span>
        {title}
      </div>
      <div className="leading-relaxed [&_b]:text-slate-900 [&_li]:ml-4 [&_li]:list-disc">{children}</div>
    </div>
  );
}

// ---------- Small building blocks ----------

/** Shield + check mark that grows into a leaf: trust, verification and a natural, honest service. */
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <linearGradient id="tp-shield" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5a844b" />
          <stop offset="1" stopColor="#1f3320" />
        </linearGradient>
        <linearGradient id="tp-leaf" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#c9a24a" />
          <stop offset="1" stopColor="#f0d58c" />
        </linearGradient>
      </defs>
      <path d="M20 2.5 35 8v11.2c0 9.3-6.3 15.9-15 18.3C11.3 35.1 5 28.5 5 19.2V8L20 2.5Z" fill="url(#tp-shield)" />
      <path d="M20 5.6 32 10v9.2c0 7.6-5 13-12 15.2-7-2.2-12-7.6-12-15.2V10l12-4.4Z" fill="none" stroke="#f0d58c" strokeOpacity=".35" strokeWidth=".8" />
      <path d="M12.5 20.2 18 25.6 26.4 15.4" fill="none" stroke="#fbf7ec" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26 15.8c-.3-4.4 2.4-7.4 7.2-7.6.3 4.5-2.6 7.5-7.2 7.6Z" fill="url(#tp-leaf)" />
      <path d="M26.6 15.2 31.2 10.2" stroke="#1f3320" strokeOpacity=".45" strokeWidth=".7" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark size={38} />
      <span className="leading-none">
        <span className={`font-display block text-[22px] font-semibold tracking-tight ${light ? "text-white" : "text-slate-900"}`}>
          Trust<span className="italic text-amber-600">Pass</span>
        </span>
        <span className={`mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.22em] ${light ? "text-emerald-300" : "text-emerald-700"}`}>
          Service Passport
        </span>
      </span>
    </span>
  );
}

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(value) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}
        />
      ))}
    </span>
  );
}

export function PageHeader({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="border-b border-slate-200 bg-gradient-to-b from-emerald-50/70 to-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
        {sub && <p className="mt-3 max-w-2xl text-slate-600">{sub}</p>}
      </div>
    </div>
  );
}

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}>{children}</div>;
}

export function Badge({ children, tone = "emerald" }: { children: React.ReactNode; tone?: "emerald" | "slate" | "amber" | "sky" | "rose" }) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    sky: "bg-sky-50 text-sky-700 ring-sky-200",
    rose: "bg-rose-50 text-rose-700 ring-rose-200",
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${tones[tone]}`}>{children}</span>;
}

export const inputCls =
  "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50";

export const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50";

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}
