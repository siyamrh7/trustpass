"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Lightbulb, Menu, RotateCcw, X } from "lucide-react";
import { Logo, useNotes } from "./ui";
import { useStore } from "@/lib/store";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/providers", label: "Find Providers" },
  { href: "/passport", label: "Service Passport" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { on, toggle } = useNotes();
  const { user } = useStore();

  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive(l.href) ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            onClick={toggle}
            title="Show / hide the yellow explanation boxes"
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition ${
              on ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-500"
            }`}
          >
            <Lightbulb size={14} /> Notes {on ? "ON" : "OFF"}
          </button>
          <Link
            href="/register"
            className="rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            {user.role === "provider" ? "Provider: " + user.name.split(" ")[0] : "Register"}
          </Link>
        </div>

        <button className="rounded-lg p-2 text-slate-700 lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
                isActive(l.href) ? "bg-emerald-50 text-emerald-700" : "text-slate-700"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-2 flex gap-2">
            <button onClick={toggle} className="flex-1 rounded-lg bg-amber-100 px-3 py-2.5 text-sm font-semibold text-amber-800">
              Notes {on ? "ON" : "OFF"}
            </button>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-lg bg-slate-900 px-3 py-2.5 text-center text-sm font-semibold text-white"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const { resetDemo } = useStore();
  return (
    <footer className="mt-20 bg-slate-950 text-slate-400">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-3 text-sm font-medium text-emerald-400">Know your asset, trust your service.</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed">
            Trust Pass Ltd. builds a portable Digital Service Passport for transparent repair and maintenance in
            Bangladesh — connecting asset owners with verified service providers.
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-white">Platform</p>
          <ul className="space-y-2 text-sm">
            {LINKS.slice(1).map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-white">Contact</p>
          <ul className="space-y-2 text-sm">
            <li>House 12, Road 5, Dhanmondi, Dhaka</li>
            <li>hello@trustpass.com.bd</li>
            <li>+880 9610-000000</li>
          </ul>
          <button
            onClick={resetDemo}
            className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
          >
            <RotateCcw size={12} /> Reset demo data
          </button>
        </div>
      </div>
      <div className="border-t border-slate-800 py-5 text-center text-xs">
        © 2026 Trust Pass Ltd. · University project prototype (frontend only — all data is simulated)
      </div>
    </footer>
  );
}
