import { useMemo, useState } from "react";
import { LuSearch, LuX, LuShoppingCart } from "react-icons/lu";
import { useRouter, Link } from "../lib/router";
import { Button, PageHeader } from "../components/ui";
import { ProductCard, ProductSheet } from "../components/shop";
import { CATEGORIES, PRODUCTS } from "../data/products";
import { WOUND_GUIDES } from "../data/woundGuides";
import { formatRupiah } from "../lib/format";
import { useCart } from "../store/AppProviders";
import { cx } from "../lib/cx";

export default function Shop() {
  const { query, navigate } = useRouter();
  const cart = useCart();
  const forType = WOUND_GUIDES[query.get("untuk")] ? query.get("untuk") : null;
  const [category, setCategory] = useState(query.get("kategori") || "semua");
  const [search, setSearch] = useState("");
  const [openProduct, setOpenProduct] = useState(null);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        (category === "semua" || p.category === category) &&
        (!forType || p.forTypes.includes(forType)) &&
        (!q || `${p.name} ${p.description} ${p.unit}`.toLowerCase().includes(q))
    );
  }, [category, search, forType]);

  return (
    <div>
      <PageHeader
        title="Belanja perlengkapan"
        lead="Perlengkapan perawatan luka dan P3K untuk rumah, kantor, dan kendaraan."
        action={
          <div className="hidden lg:block">
            <Button to="/keranjang" variant="secondary">
              <LuShoppingCart size={18} aria-hidden="true" />
              <span className="tabular">Keranjang ({cart.count})</span>
            </Button>
          </div>
        }
      />

      <div className="relative">
        <LuSearch size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari kasa, plester, NaCl…"
          aria-label="Cari produk"
          className="h-12 w-full rounded-full border border-line bg-surface pl-12 pr-4 text-[15px] placeholder:text-muted/80 focus:border-pine focus:outline-none focus:ring-3 focus:ring-pine/20"
        />
      </div>

      {forType && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-pine-soft px-4 py-3">
          <p className="text-[15px] text-pine-strong">
            Disaring untuk perawatan <span className="font-bold">{WOUND_GUIDES[forType].name.toLowerCase()}</span>
          </p>
          <button
            type="button"
            onClick={() => navigate("/belanja", { replace: true })}
            className="grid h-8 w-8 place-items-center rounded-full text-pine-strong hover:bg-surface/60"
            aria-label="Hapus saringan"
          >
            <LuX size={18} />
          </button>
        </div>
      )}

      <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Kategori">
        {[{ id: "semua", name: "Semua" }, ...CATEGORIES].map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={category === c.id}
            onClick={() => setCategory(c.id)}
            className={cx(
              "h-10 shrink-0 rounded-full border px-4 text-[15px] font-semibold transition-colors",
              category === c.id ? "border-ink bg-ink text-canvas" : "border-line bg-surface text-ink-soft hover:border-muted"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      {visible.length ? (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} onOpen={setOpenProduct} />
          ))}
        </div>
      ) : (
        <div className="mt-10 text-center">
          <p className="text-[15px] text-muted">Tidak ada produk yang cocok dengan “{search}”.</p>
          <Button
            variant="ghost"
            className="mt-2"
            onClick={() => {
              setSearch("");
              setCategory("semua");
            }}
          >
            Tampilkan semua produk
          </Button>
        </div>
      )}

      <p className="mt-10 text-[13px] text-muted">
        Data produk masih contoh. Hanya alat kesehatan dan perlengkapan perawatan; obat yang memerlukan resep tidak dijual di sini.
      </p>

      {cart.count > 0 && (
        <div className="fixed inset-x-0 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-20 px-4 lg:hidden">
          <Link
            to="/keranjang"
            className="mx-auto flex h-14 max-w-3xl items-center justify-between rounded-full bg-ink pl-5 pr-2 text-canvas shadow-xl"
          >
            <span className="tabular text-[15px] font-semibold">
              {cart.count} barang, {formatRupiah(cart.subtotal)}
            </span>
            <span className="rounded-full bg-plaster px-4 py-2 text-[15px] font-bold text-[#12312c]">Lihat keranjang</span>
          </Link>
        </div>
      )}

      <ProductSheet product={openProduct} onClose={() => setOpenProduct(null)} />
    </div>
  );
}
