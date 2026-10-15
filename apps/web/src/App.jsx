import { Suspense, lazy } from "react";
import { RouterProvider, Routes, useRouter } from "./lib/router";
import { ROUTER_MODE } from "./config/env";
import { AppProviders } from "./store/AppProviders";
import { AppShell } from "./components/AppShell";
import Home from "./pages/Home";
import Guide from "./pages/Guide";
import Monitor from "./pages/Monitor";
import WoundDetail from "./pages/WoundDetail";
import Emergency from "./pages/Emergency";
import { Login, Register } from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Halaman yang tidak dibutuhkan saat menangani luka dimuat terpisah agar beranda, panduan,
// darurat, dan pantau terbuka lebih cepat di ponsel.
const Shop = lazy(() => import("./pages/Shop"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Account = lazy(() => import("./pages/Account"));
const Sources = lazy(() => import("./pages/Sources"));
const Library = lazy(() => import("./pages/Library"));
const LibraryChapter = lazy(() => import("./pages/LibraryChapter"));
const WoundColors = lazy(() => import("./pages/WoundColors"));

const ROUTES = [
  { path: "/", render: () => <Home /> },
  { path: "/panduan", render: () => <Guide /> },
  { path: "/pantau", render: () => <Monitor /> },
  { path: "/pantau/:id", render: ({ id }) => <WoundDetail id={id} /> },
  { path: "/belanja", render: () => <Shop /> },
  { path: "/keranjang", render: () => <Cart /> },
  { path: "/checkout", render: () => <Checkout /> },
  { path: "/darurat", render: () => <Emergency /> },
  { path: "/masuk", render: () => <Login /> },
  { path: "/daftar", render: () => <Register /> },
  { path: "/akun", render: () => <Account /> },
  { path: "/sumber", render: () => <Sources /> },
  { path: "/pustaka", render: () => <Library /> },
  { path: "/pustaka/warna-luka", render: () => <WoundColors /> },
  { path: "/pustaka/:jenis", render: ({ jenis }) => <LibraryChapter slug={jenis} /> },
];

// Panduan dibuka dalam mode fokus: tanpa navigasi bawah agar pengguna
// tidak terdistraksi saat sedang menangani luka.
const FOCUS_ROUTES = ["/panduan"];

function Screen() {
  const { pathname } = useRouter();
  return (
    <AppShell focus={FOCUS_ROUTES.includes(pathname)}>
      <Suspense fallback={<p className="py-10 text-center text-muted">Memuat…</p>}>
        <Routes routes={ROUTES} fallback={<NotFound />} />
      </Suspense>
    </AppShell>
  );
}

export default function App() {
  return (
    <RouterProvider mode={ROUTER_MODE}>
      <AppProviders>
        <Screen />
      </AppProviders>
    </RouterProvider>
  );
}
