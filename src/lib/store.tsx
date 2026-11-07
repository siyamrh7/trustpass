"use client";

// ---------------------------------------------------------------------------
// APP STORE — application state (users, providers, bookings) shared via React context.
// ---------------------------------------------------------------------------

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  AssetType,
  CATALOG,
  PLATFORM_COMMISSION,
  PROVIDERS,
  Provider,
  ServiceKind,
  VAT_RATE,
} from "./data";

export type Role = "receiver" | "provider";

export type User = { role: Role; name: string; phone: string; email: string; area: string; providerId?: string };

export type Asset = { type: AssetType; brand: string; model: string; regNo: string };

export type BookingStatus = "requested" | "accepted" | "in_progress" | "reported" | "paid" | "completed";

export const STATUS_FLOW: { key: BookingStatus; label: string; who: string; desc: string }[] = [
  { key: "requested", label: "Requested", who: "Receiver", desc: "Receiver chose a provider and wrote a note describing the problem." },
  { key: "accepted", label: "Accepted", who: "Provider", desc: "Provider accepted the job and is travelling to the receiver's location." },
  { key: "in_progress", label: "Work in progress", who: "Provider", desc: "Provider is at the location doing the repair / wash / maintenance." },
  { key: "reported", label: "Report & fixed price", who: "Receiver + Platform", desc: "Receiver enters what was repaired and which parts were replaced. Platform calculates the fixed price." },
  { key: "paid", label: "Paid online", who: "Receiver", desc: "Receiver pays the platform online (bKash / Nagad / Card). Money is held safely." },
  { key: "completed", label: "Provider paid", who: "Platform", desc: "Platform releases payment to the provider and the record is saved in the Digital Service Passport." },
];

export type LineItem = { catalogId: string; qty: number };

export type Booking = {
  id: string;
  providerId: string;
  receiverName: string;
  receiverPhone: string;
  area: string;
  asset: Asset;
  service: ServiceKind;
  note: string;
  date: string;
  status: BookingStatus;
  items: LineItem[];
  createdAt: string;
  payMethod?: string;
  txnId?: string;
  paidAt?: string;
  payoutAt?: string;
  rating?: number;
};

export function computeBill(b: Pick<Booking, "items" | "providerId">, providers: Provider[]) {
  const provider = providers.find((p) => p.id === b.providerId);
  let labour = 0;
  let parts = 0;
  for (const li of b.items) {
    const c = CATALOG.find((x) => x.id === li.catalogId);
    if (!c) continue;
    if (c.kind === "labour") labour += c.price * li.qty;
    else parts += c.price * li.qty;
  }
  const visit = provider?.visitCharge ?? 0;
  const subtotal = labour + parts + visit;
  const vat = Math.round(subtotal * VAT_RATE);
  const total = subtotal + vat;
  const commission = Math.round(subtotal * PLATFORM_COMMISSION);
  const payout = subtotal - commission;
  return { labour, parts, visit, subtotal, vat, total, commission, payout };
}

const SEED_BOOKINGS: Booking[] = [
  {
    id: "TP-10231",
    providerId: "p1",
    receiverName: "Tanvir Ahmed",
    receiverPhone: "+880 1712-345678",
    area: "Dhanmondi",
    asset: { type: "Car", brand: "Toyota", model: "Axio 2016", regNo: "DHAKA METRO-GA 12-3456" },
    service: "Maintenance",
    note: "Regular 5,000 km service. Engine oil and filter change.",
    date: "2026-06-14",
    status: "completed",
    items: [
      { catalogId: "l2", qty: 1 },
      { catalogId: "pt1", qty: 1 },
      { catalogId: "pt3", qty: 1 },
    ],
    createdAt: "2026-06-14T10:00:00Z",
    payMethod: "bKash",
    txnId: "BKX8823ZQ1",
    paidAt: "2026-06-14T13:00:00Z",
    payoutAt: "2026-06-14T13:05:00Z",
    rating: 5,
  },
  {
    id: "TP-10577",
    providerId: "p7",
    receiverName: "Tanvir Ahmed",
    receiverPhone: "+880 1712-345678",
    area: "Dhanmondi",
    asset: { type: "Car", brand: "Toyota", model: "Axio 2016", regNo: "DHAKA METRO-GA 12-3456" },
    service: "Repair",
    note: "Brakes making a squeaking noise when stopping.",
    date: "2026-08-22",
    status: "completed",
    items: [
      { catalogId: "l1", qty: 1 },
      { catalogId: "l3", qty: 1 },
      { catalogId: "pt5", qty: 1 },
    ],
    createdAt: "2026-08-22T09:00:00Z",
    payMethod: "Nagad",
    txnId: "NGD55102AA",
    paidAt: "2026-08-22T12:30:00Z",
    payoutAt: "2026-08-22T12:31:00Z",
    rating: 5,
  },
  {
    id: "TP-10902",
    providerId: "p2",
    receiverName: "Tanvir Ahmed",
    receiverPhone: "+880 1712-345678",
    area: "Dhanmondi",
    asset: { type: "Air Conditioner", brand: "Gree", model: "1.5 Ton Split", regNo: "SN-GR-77812" },
    service: "Wash",
    note: "AC not cooling well, needs servicing before summer.",
    date: "2026-04-03",
    status: "completed",
    items: [
      { catalogId: "l7", qty: 1 },
      { catalogId: "pt10", qty: 1 },
    ],
    createdAt: "2026-04-03T08:00:00Z",
    payMethod: "Card",
    txnId: "CRD9911034",
    paidAt: "2026-04-03T11:00:00Z",
    payoutAt: "2026-04-03T11:02:00Z",
    rating: 4,
  },
];

const DEFAULT_USER: User = {
  role: "receiver",
  name: "Tanvir Ahmed",
  phone: "+880 1712-345678",
  email: "tanvir.ahmed@gmail.com",
  area: "Dhanmondi",
};

type State = { user: User; bookings: Booking[]; customProviders: Provider[] };

const INITIAL: State = { user: DEFAULT_USER, bookings: SEED_BOOKINGS, customProviders: [] };

type Ctx = State & {
  ready: boolean;
  providers: Provider[];
  setUser: (u: User) => void;
  addProvider: (p: Provider) => void;
  createBooking: (b: Omit<Booking, "id" | "status" | "items" | "createdAt">) => string;
  updateBooking: (id: string, patch: Partial<Booking>) => void;
  resetData: () => void;
};

const StoreContext = createContext<Ctx | null>(null);
const KEY = "trustpass-v2";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(INITIAL);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state, ready]);

  const setUser = useCallback((u: User) => setState((s) => ({ ...s, user: u })), []);
  const addProvider = useCallback(
    (p: Provider) => setState((s) => ({ ...s, customProviders: [...s.customProviders, p] })),
    []
  );
  const createBooking = useCallback<Ctx["createBooking"]>((b) => {
    const id = "TP-" + Math.floor(11000 + Math.random() * 88999);
    const booking: Booking = { ...b, id, status: "requested", items: [], createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, bookings: [booking, ...s.bookings] }));
    return id;
  }, []);
  const updateBooking = useCallback(
    (id: string, patch: Partial<Booking>) =>
      setState((s) => ({ ...s, bookings: s.bookings.map((b) => (b.id === id ? { ...b, ...patch } : b)) })),
    []
  );
  const resetData = useCallback(() => {
    setState(INITIAL);
    try {
      localStorage.removeItem(KEY);
    } catch {}
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      ready,
      providers: [...PROVIDERS, ...state.customProviders],
      setUser,
      addProvider,
      createBooking,
      updateBooking,
      resetData,
    }),
    [state, ready, setUser, addProvider, createBooking, updateBooking, resetData]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
