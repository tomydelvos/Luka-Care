// Satu-satunya tempat membaca variabel environment Vite.
const env = import.meta.env ?? {};

export const APP_ENV = env.VITE_APP_ENV || "development";
export const API_URL = (env.VITE_API_URL || "http://localhost:8787").replace(/\/$/, "");
export const USE_MOCK_API = String(env.VITE_USE_MOCK_API ?? "true") !== "false";
// Akun demo dibuat oleh `npm run db:seed:local` di apps/api; hanya ditampilkan saat dev lokal ke API.
export const DEMO_ACCOUNT = Boolean(env.DEV) && !USE_MOCK_API ? { email: "demo@lukacare.test", password: "lukacare123" } : null;
export const ROUTER_MODE = ["hash", "memory"].includes(env.VITE_ROUTER_MODE) ? env.VITE_ROUTER_MODE : "history";

// Awalan untuk file di `public/` (gambar ilustrasi). Vite mengisinya dari opsi `base`, default "/".
const BASE_URL = env.BASE_URL || "/";
export const assetUrl = (file) => `${BASE_URL.replace(/\/?$/, "/")}${String(file).replace(/^\//, "")}`;

export const EMERGENCY_NUMBERS = [
  { number: "119", label: "Ambulans & gawat darurat medis", note: "Layanan PSC Kementerian Kesehatan" },
  { number: "112", label: "Layanan darurat umum", note: "Terhubung ke layanan darurat di kota Anda" },
];

export const NEAREST_FACILITY_URL = "https://www.google.com/maps/search/puskesmas+atau+IGD+terdekat";
