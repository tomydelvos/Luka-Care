import { LuHouse, LuHeartPulse, LuClipboardList, LuShoppingBag, LuPhone, LuUserRound, LuShoppingCart } from "react-icons/lu";
import { Link, useRouter, isActivePath } from "../lib/router";
import { cx } from "../lib/cx";
import { Logo } from "./art";
import { useAuth, useCart, useWounds } from "../store/AppProviders";
import { isToday } from "../lib/format";
import { APP_ENV } from "../config/env";

const NAV = [
  { to: "/", label: "Beranda", icon: LuHouse },
  { to: "/panduan", label: "Panduan", icon: LuHeartPulse },
  { to: "/pantau", label: "Pantau", icon: LuClipboardList },
  { to: "/belanja", label: "Belanja", icon: LuShoppingBag },
];

function useNavBadges() {
  const { wounds } = useWounds();
  const { count } = useCart();
  const due = wounds.filter(
    (w) => w.status === "dipantau" && !w.checkins.some((c) => isToday(c.at))
  ).length;
  return { "/pantau": due, "/belanja": count };
}

function EnvBadge({ className }) {
  if (APP_ENV === "production") return null;
  return (
    <span className={cx("rounded-full bg-caution-soft px-2 py-0.5 text-xs font-bold capitalize text-caution", className)} title="Environment aktif">
      {APP_ENV}
    </span>
  );
}

function TopBar() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-canvas/90 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-3 px-4">
        <Link to="/" className="flex min-w-0 items-center gap-2" aria-label="LukaCare, ke beranda">
          <Logo />
          <EnvBadge className="hidden sm:inline" />
        </Link>
        <div className="flex shrink-0 items-center gap-1">
          <Link
            to="/darurat"
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-alert/40 bg-alert-soft px-3.5 text-sm font-bold text-alert"
          >
            <LuPhone size={16} aria-hidden="true" />
            Darurat
          </Link>
          <Link
            to={user ? "/akun" : "/masuk"}
            className="grid h-10 w-10 place-items-center rounded-full text-ink-soft hover:bg-sunken"
            aria-label={user ? "Akun saya" : "Masuk"}
          >
            <LuUserRound size={22} />
          </Link>
        </div>
      </div>
    </header>
  );
}

function BottomNav() {
  const { pathname } = useRouter();
  const badges = useNavBadges();
  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto grid max-w-3xl grid-cols-4">
        {NAV.map(({ to, label, icon: Icon }) => {
          const active = isActivePath(pathname, to);
          const badge = badges[to];
          return (
            <li key={to}>
              <Link
                to={to}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "flex h-16 flex-col items-center justify-center gap-1 text-xs font-semibold",
                  active ? "text-pine" : "text-muted"
                )}
              >
                <span className={cx("relative grid h-8 w-14 place-items-center rounded-full transition-colors", active && "bg-pine-soft")}>
                  <Icon size={22} aria-hidden="true" />
                  {badge > 0 && (
                    <span className="tabular absolute -right-0.5 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-plaster-deep px-1 text-[11px] font-bold text-white">
                      {badge}
                    </span>
                  )}
                </span>
                {label}
                {badge > 0 && <span className="sr-only">({badge})</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Sidebar() {
  const { pathname } = useRouter();
  const badges = useNavBadges();
  const { user } = useAuth();
  const { count } = useCart();
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-line bg-surface px-4 py-6 lg:flex">
      <Link to="/" className="flex items-center gap-2 px-2" aria-label="LukaCare, ke beranda">
        <Logo />
        <EnvBadge />
      </Link>
      <nav aria-label="Navigasi utama" className="mt-8">
        <ul className="space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = isActivePath(pathname, to);
            const badge = badges[to];
            return (
              <li key={to}>
                <Link
                  to={to}
                  aria-current={active ? "page" : undefined}
                  className={cx(
                    "flex h-11 items-center gap-3 rounded-full px-4 text-[15px] font-semibold transition-colors",
                    active ? "bg-pine-soft text-pine-strong" : "text-ink-soft hover:bg-sunken"
                  )}
                >
                  <Icon size={20} aria-hidden="true" />
                  <span className="flex-1">{label}</span>
                  {badge > 0 && (
                    <span className="tabular rounded-full bg-plaster-deep px-2 text-xs font-bold leading-5 text-white">{badge}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto space-y-3">
        <Link to="/darurat" className="block rounded-2xl border border-alert/30 bg-alert-soft p-4">
          <span className="flex items-center gap-2 font-bold text-alert">
            <LuPhone size={18} aria-hidden="true" />
            Darurat
          </span>
          <span className="mt-1 block text-sm text-ink-soft">Nomor 119 dan tanda kapan harus ke dokter</span>
        </Link>
        <div className="flex items-center gap-1 border-t border-line pt-3">
          <Link
            to={user ? "/akun" : "/masuk"}
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-full px-2 py-2 hover:bg-sunken"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sunken text-ink-soft">
              <LuUserRound size={18} />
            </span>
            <span className="truncate text-sm font-semibold">{user ? user.name : "Masuk atau daftar"}</span>
          </Link>
          <Link to="/keranjang" className="relative grid h-10 w-10 place-items-center rounded-full text-ink-soft hover:bg-sunken" aria-label={`Keranjang, ${count} barang`}>
            <LuShoppingCart size={20} />
            {count > 0 && (
              <span className="tabular absolute -right-0.5 top-0 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-plaster-deep px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </aside>
  );
}

export function AppShell({ children, focus = false }) {
  if (focus) {
    return <div className="min-h-dvh">{children}</div>;
  }
  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main id="konten" className="mx-auto w-full max-w-3xl flex-1 px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-6 sm:px-6 lg:max-w-5xl lg:px-10 lg:pb-16 lg:pt-10">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}

export function Disclaimer({ className }) {
  return (
    <p className={cx("text-[13px] leading-relaxed text-muted", className)}>
      LukaCare memberi panduan perawatan dasar untuk luka ringan, bukan diagnosis atau pengganti pemeriksaan tenaga kesehatan.
      Jika ragu, periksakan ke puskesmas, klinik, atau IGD terdekat.
    </p>
  );
}
