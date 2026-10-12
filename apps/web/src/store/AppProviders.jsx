import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { authService } from "../services/authService";
import { woundService } from "../services/woundService";
import { sampleWounds } from "../services/sample";
import { readJSON, writeJSON, clearAll } from "../lib/storage";
import { PRODUCT_BY_ID } from "../data/products";

const AuthContext = createContext(null);
const WoundContext = createContext(null);
const CartContext = createContext(null);
const ToastContext = createContext(null);

/* ---------- Toast ---------- */
function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef();
  const show = useCallback((message, tone = "default") => {
    window.clearTimeout(timer.current);
    setToast({ message, tone, key: Date.now() });
    timer.current = window.setTimeout(() => setToast(null), 3200);
  }, []);
  return (
    <ToastContext.Provider value={show}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-50 flex justify-center px-4 lg:bottom-8">
        {toast && (
          <div
            key={toast.key}
            className={`toast-in pointer-events-auto max-w-sm rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg ${
              toast.tone === "alert" ? "bg-alert text-white" : "bg-ink text-canvas"
            }`}
          >
            {toast.message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

/* ---------- Auth ---------- */
function AuthProvider({ children }) {
  const [session, setSession] = useState(() => authService.current());
  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      async login(input) {
        const s = await authService.login(input);
        setSession(s);
        return s.user;
      },
      async register(input) {
        const s = await authService.register(input);
        setSession(s);
        return s.user;
      },
      async logout() {
        await authService.logout();
        setSession(null);
      },
    }),
    [session]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ---------- Wounds ---------- */
function WoundProvider({ children }) {
  const [wounds, setWounds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    woundService
      .list()
      .then((list) => alive && setWounds(list))
      .catch(() => alive && setWounds([]))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const value = useMemo(() => {
    const replace = (updated) => setWounds((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
    return {
      wounds,
      loading,
      getById: (id) => wounds.find((w) => w.id === id),
      async create(input, firstCheckin) {
        let wound = await woundService.create(input);
        setWounds((prev) => [wound, ...prev]);
        if (firstCheckin) {
          wound = await woundService.addCheckin(wound.id, firstCheckin);
          replace(wound);
        }
        return wound;
      },
      async addCheckin(id, input) {
        const updated = await woundService.addCheckin(id, input);
        replace(updated);
        return updated;
      },
      async addPhotos(id, sources) {
        const updated = await woundService.addPhotos(id, sources);
        replace(updated);
        return updated;
      },
      async removePhoto(id, photoId) {
        const updated = await woundService.removePhoto(id, photoId);
        replace(updated);
        return updated;
      },
      async update(id, patch) {
        const updated = await woundService.update(id, patch);
        replace(updated);
        return updated;
      },
      async remove(id) {
        await woundService.remove(id);
        setWounds((prev) => prev.filter((w) => w.id !== id));
      },
      async loadSample() {
        const list = [...sampleWounds(), ...wounds];
        await woundService.replaceAll(list);
        setWounds(list);
      },
    };
  }, [wounds, loading]);

  return <WoundContext.Provider value={value}>{children}</WoundContext.Provider>;
}

/* ---------- Cart ---------- */
function CartProvider({ children }) {
  const [items, setItems] = useState(() =>
    readJSON("cart", []).filter((i) => PRODUCT_BY_ID[i.productId])
  );
  useEffect(() => {
    writeJSON("cart", items);
  }, [items]);

  const value = useMemo(() => {
    const qtyOf = (productId) => items.find((i) => i.productId === productId)?.qty ?? 0;
    const setQty = (productId, qty) =>
      setItems((prev) => {
        if (qty <= 0) return prev.filter((i) => i.productId !== productId);
        if (prev.some((i) => i.productId === productId)) {
          return prev.map((i) => (i.productId === productId ? { ...i, qty: Math.min(qty, 99) } : i));
        }
        return [...prev, { productId, qty }];
      });
    const lines = items.map((i) => ({ ...i, product: PRODUCT_BY_ID[i.productId] }));
    return {
      lines,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.qty * l.product.price, 0),
      qtyOf,
      setQty,
      add: (productId, qty = 1) => setQty(productId, qtyOf(productId) + qty),
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function AppProviders({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <WoundProvider>
          <CartProvider>{children}</CartProvider>
        </WoundProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

const useCtx = (ctx, name) => {
  const value = useContext(ctx);
  if (value === null) throw new Error(`${name} dipakai di luar <AppProviders>`);
  return value;
};

export const useAuth = () => useCtx(AuthContext, "useAuth");
export const useWounds = () => useCtx(WoundContext, "useWounds");
export const useCart = () => useCtx(CartContext, "useCart");
export const useToast = () => useCtx(ToastContext, "useToast");

export function wipeLocalData() {
  clearAll();
  window.location.reload();
}
