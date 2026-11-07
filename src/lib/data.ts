// ---------------------------------------------------------------------------
// PLATFORM DATA — providers, service areas and the fixed price catalogue.
// ---------------------------------------------------------------------------

export type AssetType = "Car" | "Motorbike" | "Air Conditioner" | "Refrigerator" | "Washing Machine" | "Generator";
export type ServiceKind = "Repair" | "Wash" | "Maintenance";

export const ASSET_TYPES: AssetType[] = [
  "Car",
  "Motorbike",
  "Air Conditioner",
  "Refrigerator",
  "Washing Machine",
  "Generator",
];

export const SERVICE_KINDS: ServiceKind[] = ["Repair", "Wash", "Maintenance"];

export type Area = { name: string; lat: number; lng: number };

// Areas of Dhaka with approximate coordinates (used for near → far sorting)
export const AREAS: Area[] = [
  { name: "Dhanmondi", lat: 23.7465, lng: 90.376 },
  { name: "Gulshan", lat: 23.7925, lng: 90.4078 },
  { name: "Banani", lat: 23.7937, lng: 90.4066 },
  { name: "Mirpur", lat: 23.8223, lng: 90.3654 },
  { name: "Uttara", lat: 23.8759, lng: 90.3795 },
  { name: "Mohammadpur", lat: 23.7662, lng: 90.3589 },
  { name: "Bashundhara", lat: 23.8191, lng: 90.4526 },
  { name: "Motijheel", lat: 23.733, lng: 90.4172 },
  { name: "Farmgate", lat: 23.7561, lng: 90.3872 },
  { name: "Badda", lat: 23.7806, lng: 90.4265 },
];

export type Review = { by: string; rating: number; text: string; date: string };

export type Provider = {
  id: string;
  name: string;
  owner: string;
  phone: string;
  area: string;
  lat: number;
  lng: number;
  rating: number;
  jobs: number;
  years: number;
  verified: boolean;
  assets: AssetType[];
  services: ServiceKind[];
  visitCharge: number; // BDT
  bio: string;
  initials: string;
  color: string;
  reviews: Review[];
};

export const PROVIDERS: Provider[] = [
  {
    id: "p1",
    name: "Rahman Auto Care",
    owner: "Md. Habibur Rahman",
    phone: "+880 1711-234567",
    area: "Dhanmondi",
    lat: 23.7445,
    lng: 90.3742,
    rating: 4.9,
    jobs: 412,
    years: 11,
    verified: true,
    assets: ["Car", "Motorbike"],
    services: ["Repair", "Maintenance", "Wash"],
    visitCharge: 300,
    bio: "Certified mechanic team specialising in Toyota, Honda and Suzuki. Doorstep engine diagnosis, brake and suspension work.",
    initials: "RA",
    color: "bg-emerald-700",
    reviews: [
      { by: "Tanvir H.", rating: 5, text: "Explained every part he changed. Price matched the app exactly.", date: "2026-10-12" },
      { by: "Nusrat J.", rating: 5, text: "Came on time to my house, very professional.", date: "2026-09-28" },
    ],
  },
  {
    id: "p2",
    name: "CoolBreeze AC Service",
    owner: "Sajid Hossain",
    phone: "+880 1819-556677",
    area: "Mirpur",
    lat: 23.8201,
    lng: 90.3668,
    rating: 4.7,
    jobs: 286,
    years: 7,
    verified: true,
    assets: ["Air Conditioner", "Refrigerator"],
    services: ["Repair", "Maintenance", "Wash"],
    visitCharge: 250,
    bio: "AC gas refill, compressor repair, jet-wash servicing for split and window ACs. Fridge cooling problems fixed same day.",
    initials: "CB",
    color: "bg-sky-600",
    reviews: [
      { by: "Rafiq U.", rating: 5, text: "AC is cooling like new after the jet wash.", date: "2026-10-30" },
      { by: "Shamima A.", rating: 4, text: "Good work, arrived 20 minutes late.", date: "2026-10-02" },
    ],
  },
  {
    id: "p3",
    name: "Gulshan Car Spa",
    owner: "Arif Chowdhury",
    phone: "+880 1913-889900",
    area: "Gulshan",
    lat: 23.7941,
    lng: 90.4143,
    rating: 4.8,
    jobs: 530,
    years: 9,
    verified: true,
    assets: ["Car"],
    services: ["Wash", "Maintenance"],
    visitCharge: 400,
    bio: "Premium waterless doorstep car wash, interior detailing, ceramic coating and oil change.",
    initials: "GS",
    color: "bg-violet-600",
    reviews: [
      { by: "Farhan K.", rating: 5, text: "Interior detailing was excellent.", date: "2026-10-21" },
      { by: "Lamia S.", rating: 5, text: "Very transparent with chemicals used.", date: "2026-10-05" },
    ],
  },
  {
    id: "p4",
    name: "Uttara Bike Doctor",
    owner: "Kamal Uddin",
    phone: "+880 1552-112233",
    area: "Uttara",
    lat: 23.8735,
    lng: 90.3981,
    rating: 4.6,
    jobs: 198,
    years: 6,
    verified: true,
    assets: ["Motorbike"],
    services: ["Repair", "Maintenance", "Wash"],
    visitCharge: 200,
    bio: "Bajaj, Yamaha, Hero, Suzuki specialist. Chain sprocket, brake shoe, carburettor and engine tuning.",
    initials: "UB",
    color: "bg-amber-600",
    reviews: [{ by: "Sakib R.", rating: 5, text: "Fixed my Pulsar in 40 minutes.", date: "2026-10-18" }],
  },
  {
    id: "p5",
    name: "HomeFix Appliance Center",
    owner: "Nazmul Islam",
    phone: "+880 1611-445566",
    area: "Mohammadpur",
    lat: 23.7648,
    lng: 90.3571,
    rating: 4.5,
    jobs: 167,
    years: 5,
    verified: true,
    assets: ["Washing Machine", "Refrigerator", "Air Conditioner"],
    services: ["Repair", "Maintenance"],
    visitCharge: 250,
    bio: "Washing machine motor, drain pump and PCB repair. Refrigerator thermostat and gas charging.",
    initials: "HF",
    color: "bg-rose-600",
    reviews: [{ by: "Mitu D.", rating: 4, text: "Machine works perfectly now.", date: "2026-09-14" }],
  },
  {
    id: "p6",
    name: "PowerLine Generator Works",
    owner: "Jahangir Alam",
    phone: "+880 1715-778899",
    area: "Motijheel",
    lat: 23.7319,
    lng: 90.4195,
    rating: 4.4,
    jobs: 121,
    years: 14,
    verified: false,
    assets: ["Generator"],
    services: ["Repair", "Maintenance"],
    visitCharge: 500,
    bio: "Diesel and petrol generator servicing for homes, shops and offices. AVR and alternator rewinding.",
    initials: "PL",
    color: "bg-teal-700",
    reviews: [{ by: "Office Admin, Motijheel", rating: 4, text: "Reliable and experienced.", date: "2026-08-30" }],
  },
  {
    id: "p7",
    name: "Bashundhara Motors",
    owner: "Rezaul Karim",
    phone: "+880 1817-334455",
    area: "Bashundhara",
    lat: 23.8166,
    lng: 90.4489,
    rating: 4.7,
    jobs: 305,
    years: 8,
    verified: true,
    assets: ["Car", "Generator"],
    services: ["Repair", "Maintenance"],
    visitCharge: 350,
    bio: "Hybrid and petrol car specialists. Computer scanning, AC system, battery and electrical faults.",
    initials: "BM",
    color: "bg-emerald-900",
    reviews: [{ by: "Imran H.", rating: 5, text: "Scanned the car and showed me the error codes.", date: "2026-10-25" }],
  },
  {
    id: "p8",
    name: "Sparkle Wash Mirpur",
    owner: "Shahin Mia",
    phone: "+880 1915-667788",
    area: "Mirpur",
    lat: 23.8065,
    lng: 90.3687,
    rating: 4.3,
    jobs: 240,
    years: 4,
    verified: true,
    assets: ["Car", "Motorbike"],
    services: ["Wash"],
    visitCharge: 150,
    bio: "Affordable foam wash, polish and vacuum for cars and bikes at your parking spot.",
    initials: "SW",
    color: "bg-slate-600",
    reviews: [{ by: "Rubel A.", rating: 4, text: "Good value for money.", date: "2026-10-09" }],
  },
];

// ---------------------------------------------------------------------------
// FIXED PRICE CATALOGUE — the platform (not the mechanic) decides the price.
// This is the core of the "transparent pricing" idea.
// ---------------------------------------------------------------------------

export type CatalogItem = { id: string; name: string; price: number; kind: "labour" | "part"; assets: AssetType[] };

export const CATALOG: CatalogItem[] = [
  // Labour / work
  { id: "l1", name: "Full diagnosis / inspection", price: 500, kind: "labour", assets: ["Car", "Motorbike", "Generator"] },
  { id: "l2", name: "Engine oil change (labour)", price: 300, kind: "labour", assets: ["Car", "Motorbike", "Generator"] },
  { id: "l3", name: "Brake service", price: 800, kind: "labour", assets: ["Car", "Motorbike"] },
  { id: "l4", name: "Exterior foam wash", price: 600, kind: "labour", assets: ["Car", "Motorbike"] },
  { id: "l5", name: "Interior detailing", price: 1500, kind: "labour", assets: ["Car"] },
  { id: "l6", name: "Engine tuning", price: 1200, kind: "labour", assets: ["Car", "Motorbike", "Generator"] },
  { id: "l7", name: "AC jet wash servicing", price: 1000, kind: "labour", assets: ["Air Conditioner"] },
  { id: "l8", name: "Gas refill (labour)", price: 700, kind: "labour", assets: ["Air Conditioner", "Refrigerator", "Car"] },
  { id: "l9", name: "Compressor repair", price: 2500, kind: "labour", assets: ["Air Conditioner", "Refrigerator"] },
  { id: "l10", name: "Motor / pump repair", price: 1200, kind: "labour", assets: ["Washing Machine", "Generator"] },
  { id: "l11", name: "Electrical wiring fix", price: 600, kind: "labour", assets: ASSET_TYPES },
  { id: "l12", name: "PCB / control board repair", price: 1800, kind: "labour", assets: ["Washing Machine", "Air Conditioner", "Refrigerator"] },
  // Parts
  { id: "pt1", name: "Engine oil (4L, synthetic)", price: 3200, kind: "part", assets: ["Car", "Generator"] },
  { id: "pt2", name: "Engine oil (1L, bike)", price: 650, kind: "part", assets: ["Motorbike"] },
  { id: "pt3", name: "Oil filter", price: 450, kind: "part", assets: ["Car", "Motorbike", "Generator"] },
  { id: "pt4", name: "Air filter", price: 700, kind: "part", assets: ["Car", "Motorbike", "Generator"] },
  { id: "pt5", name: "Brake pad set", price: 2200, kind: "part", assets: ["Car"] },
  { id: "pt6", name: "Brake shoe (bike)", price: 550, kind: "part", assets: ["Motorbike"] },
  { id: "pt7", name: "Spark plug", price: 350, kind: "part", assets: ["Car", "Motorbike", "Generator"] },
  { id: "pt8", name: "Battery 12V", price: 7500, kind: "part", assets: ["Car", "Motorbike", "Generator"] },
  { id: "pt9", name: "Chain sprocket kit", price: 1900, kind: "part", assets: ["Motorbike"] },
  { id: "pt10", name: "R410 refrigerant gas", price: 1800, kind: "part", assets: ["Air Conditioner"] },
  { id: "pt11", name: "Capacitor", price: 600, kind: "part", assets: ["Air Conditioner", "Refrigerator", "Washing Machine"] },
  { id: "pt12", name: "Thermostat", price: 900, kind: "part", assets: ["Refrigerator", "Air Conditioner"] },
  { id: "pt13", name: "Drain pump", price: 1600, kind: "part", assets: ["Washing Machine"] },
  { id: "pt14", name: "AVR module", price: 2800, kind: "part", assets: ["Generator"] },
  { id: "pt15", name: "Wiper blade pair", price: 800, kind: "part", assets: ["Car"] },
];

// Business rules for pricing
export const PLATFORM_COMMISSION = 0.1; // 10% kept by Trust Pass
export const VAT_RATE = 0.05; // 5% VAT on service

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export const bdt = (n: number) => "৳ " + Math.round(n).toLocaleString("en-IN");
