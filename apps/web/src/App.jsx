import { RouterProvider, Routes, useRouter } from "./lib/router";
import { ROUTER_MODE } from "./config/env";
import { AppProviders } from "./store/AppProviders";
import { AppShell } from "./components/AppShell";
import Home from "./pages/Home";
import Guide from "./pages/Guide";
import Monitor from "./pages/Monitor";
import WoundDetail from "./pages/WoundDetail";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Emergency from "./pages/Emergency";
import { Login, Register } from "./pages/Auth";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";

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
];

// Panduan dibuka dalam mode fokus: tanpa navigasi bawah agar pengguna
// tidak terdistraksi saat sedang menangani luka.
const FOCUS_ROUTES = ["/panduan"];

function Screen() {
  const { pathname } = useRouter();
  return (
    <AppShell focus={FOCUS_ROUTES.includes(pathname)}>
      <Routes routes={ROUTES} fallback={<NotFound />} />
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
