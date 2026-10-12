import { LuTrash2 } from "react-icons/lu";
import { Button, PageHeader, QtyStepper } from "../components/ui";
import { ProductArt } from "../components/art";
import { CATEGORY_BY_ID } from "../data/products";
import { formatRupiah } from "../lib/format";
import { useCart } from "../store/AppProviders";

export default function Cart() {
  const cart = useCart();

  if (!cart.lines.length) {
    return (
      <div>
        <PageHeader title="Keranjang" />
        <div className="rounded-[1.75rem] border border-dashed border-line px-6 py-12 text-center">
          <p className="text-lg font-bold">Keranjang masih kosong</p>
          <p className="mx-auto mt-1 max-w-sm text-[15px] text-muted">Tambahkan kasa, plester, atau perlengkapan P3K yang Anda butuhkan.</p>
          <Button to="/belanja" className="mt-5">
            Mulai belanja
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Keranjang" lead={`${cart.count} barang`} />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <ul className="divide-y divide-line rounded-[1.5rem] border border-line bg-surface px-4 sm:px-5">
          {cart.lines.map(({ product, qty }) => (
            <li key={product.id} className="flex gap-4 py-4">
              <ProductArt category={product.category} art={CATEGORY_BY_ID[product.category].art} className="w-20 shrink-0 rounded-2xl" />
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="text-[15px] font-semibold leading-snug">{product.name}</p>
                <p className="text-sm text-muted">{product.unit}</p>
                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                  <QtyStepper size="sm" value={qty} onChange={(v) => cart.setQty(product.id, v)} label={product.name} />
                  <span className="tabular font-extrabold">{formatRupiah(product.price * qty)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => cart.setQty(product.id, 0)}
                className="grid h-9 w-9 shrink-0 place-items-center self-start rounded-full text-muted hover:bg-sunken hover:text-alert"
                aria-label={`Hapus ${product.name}`}
              >
                <LuTrash2 size={18} />
              </button>
            </li>
          ))}
        </ul>

        <aside className="self-start rounded-[1.5rem] border border-line bg-surface p-5 lg:sticky lg:top-10">
          <h2 className="text-[17px] font-extrabold">Ringkasan</h2>
          <dl className="mt-4 space-y-2 text-[15px]">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="tabular font-semibold">{formatRupiah(cart.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Ongkos kirim</dt>
              <dd className="text-muted">Dihitung saat checkout</dd>
            </div>
          </dl>
          <Button to="/checkout" block size="lg" className="mt-5">
            Lanjut ke checkout
          </Button>
          <Button to="/belanja" variant="ghost" block className="mt-2">
            Tambah barang lain
          </Button>
        </aside>
      </div>
    </div>
  );
}
