import { LuPlus, LuCheck } from "react-icons/lu";
import { ProductArt } from "./art";
import { Button, QtyStepper, Sheet, Badge } from "./ui";
import { CATEGORY_BY_ID } from "../data/products";
import { WOUND_GUIDES } from "../content";
import { formatRupiah } from "../lib/format";
import { useCart, useToast } from "../store/AppProviders";
import { cx } from "../lib/cx";

export function useAddToCart() {
  const cart = useCart();
  const toast = useToast();
  return (product, qty = 1) => {
    cart.add(product.id, qty);
    toast(`${product.name} masuk keranjang`);
  };
}

export function ProductCard({ product, onOpen }) {
  const cart = useCart();
  const add = useAddToCart();
  const qty = cart.qtyOf(product.id);
  const category = CATEGORY_BY_ID[product.category];
  return (
    <article className="flex flex-col">
      <button
        type="button"
        onClick={() => onOpen(product)}
        className="group text-left"
        aria-label={`Lihat detail ${product.name} ${product.unit}`}
      >
        <ProductArt category={product.category} art={category.art} className="rounded-2xl transition-[filter] group-hover:brightness-[0.97]" />
        <h3 className="mt-3 line-clamp-2 text-[15px] font-semibold leading-snug text-ink">{product.name}</h3>
        <p className="mt-0.5 text-sm text-muted">{product.unit}</p>
      </button>
      <div className="mt-auto flex items-center justify-between gap-2 pt-2.5">
        <span className="tabular whitespace-nowrap text-[15px] font-extrabold">{formatRupiah(product.price)}</span>
        {qty > 0 ? (
          <QtyStepper size="sm" value={qty} onChange={(v) => cart.setQty(product.id, v)} label={product.name} />
        ) : (
          <button
            type="button"
            onClick={() => add(product)}
            className="grid h-9 w-9 place-items-center rounded-full bg-pine text-on-pine hover:bg-pine-strong"
            aria-label={`Tambah ${product.name} ke keranjang`}
          >
            <LuPlus size={18} />
          </button>
        )}
      </div>
    </article>
  );
}

export function ProductSheet({ product, onClose }) {
  const cart = useCart();
  const add = useAddToCart();
  if (!product) return null;
  const category = CATEGORY_BY_ID[product.category];
  const qty = cart.qtyOf(product.id);
  return (
    <Sheet
      open={Boolean(product)}
      onClose={onClose}
      title={product.name}
      footer={
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted">{product.unit}</p>
            <p className="tabular text-xl font-extrabold">{formatRupiah(product.price)}</p>
          </div>
          {qty > 0 ? (
            <div className="flex items-center gap-3">
              <QtyStepper value={qty} onChange={(v) => cart.setQty(product.id, v)} label={product.name} />
              <Button to="/keranjang" variant="soft">
                Keranjang
              </Button>
            </div>
          ) : (
            <Button onClick={() => add(product)} size="lg">
              <LuPlus size={18} aria-hidden="true" />
              Tambah ke keranjang
            </Button>
          )}
        </div>
      }
    >
      <ProductArt category={product.category} art={category.art} className="mx-auto max-w-[220px] rounded-3xl" />
      <div className="mt-5 space-y-5 text-[15px]">
        <div>
          <Badge tone="pine">{category.name}</Badge>
          <p className="mt-2 text-ink-soft">{product.description}</p>
        </div>
        <div>
          <h3 className="font-bold">Cara pakai</h3>
          <p className="mt-1 text-ink-soft">{product.howTo}</p>
        </div>
        <div>
          <h3 className="font-bold">Mendukung perawatan</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {product.forTypes.map((t) => (
              <li key={t} className="rounded-full bg-sunken px-3 py-1 text-sm font-medium text-ink-soft">
                {WOUND_GUIDES[t].name}
              </li>
            ))}
          </ul>
        </div>
        <p className="rounded-2xl bg-sunken p-3 text-sm text-muted">
          Data produk masih contoh. Selalu baca aturan pakai pada kemasan dan tanyakan apoteker jika ragu.
        </p>
      </div>
    </Sheet>
  );
}

export function ProductRow({ product, onOpen }) {
  const cart = useCart();
  const add = useAddToCart();
  const inCart = cart.qtyOf(product.id) > 0;
  const category = CATEGORY_BY_ID[product.category];
  return (
    <div className="flex items-center gap-3 py-3">
      <button type="button" onClick={() => onOpen?.(product)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <ProductArt category={product.category} art={category.art} className="w-14 shrink-0 rounded-xl" />
        <span className="min-w-0">
          <span className="line-clamp-2 block text-[15px] font-semibold leading-snug">{product.name}</span>
          <span className="tabular block text-sm text-muted">
            {product.unit}, <span className="whitespace-nowrap">{formatRupiah(product.price)}</span>
          </span>
        </span>
      </button>
      <button
        type="button"
        onClick={() => !inCart && add(product)}
        className={cx(
          "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold",
          inCart ? "bg-mint-soft text-mint" : "bg-pine-soft text-pine-strong hover:brightness-95"
        )}
        aria-label={inCart ? `${product.name} sudah di keranjang` : `Tambah ${product.name}`}
      >
        {inCart ? <LuCheck size={16} aria-hidden="true" /> : <LuPlus size={16} aria-hidden="true" />}
        {inCart ? "Ada" : "Tambah"}
      </button>
    </div>
  );
}
