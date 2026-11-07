"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Lightbulb, ShieldCheck, Star } from "lucide-react";

// ---------- Presentation notes (can be toggled from the navbar) ----------

const NotesCtx = createContext<{ on: boolean; toggle: () => void }>({ on: true, toggle: () => {} });

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    try {
      if (localStorage.getItem("tp-notes") === "off") setOn(false);
    } catch {}
  }, []);
  const toggle = () =>
    setOn((v) => {
      try {
        localStorage.setItem("tp-notes", v ? "off" : "on");
      } catch {}
      return !v;
    });
  return <NotesCtx.Provider value={{ on, toggle }}>{children}</NotesCtx.Provider>;
}

export const useNotes = () => useContext(NotesCtx);

/** Yellow "explainer" box shown to the teacher during the presentation. */
export function Explain({ title = "How this works", children }: { title?: string; children: React.ReactNode }) {
  const { on } = useNotes();
  if (!on) return null;
  return (
    <div className="rounded-2xl border border-dashed border-amber-400 bg-amber-50 p-4 text-sm text-amber-950 sm:p-5">
      <div className="mb-1.5 flex items-center gap-2 font-semibold">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-400 text-white">
          <Lightbulb size={14} />
        </span>
        {title}
      </div>
      <div className="leading-relaxed text-amber-900 [&_b]:text-amber-950 [&_li]:ml-4 [&_li]:list-disc">{children}</div>
    </div>
  );
}

// ---------- Small building blocks ----------

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-sm">
        <ShieldCheck size={20} />
      </span>
      <span className={`text-lg font-extrabold tracking-tight ${light ? "text-white" : "text-slate-900"}`}>
        Trust<span className="text-emerald-500">Pass</span>
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
  "inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50";

export const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50";

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}
