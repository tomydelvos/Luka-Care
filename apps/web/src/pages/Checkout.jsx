import { useState } from "react";
import { LuCircleCheck, LuArrowLeft } from "react-icons/lu";
import { Link } from "../lib/router";
import { Banner, Button, Field, PageHeader } from "../components/ui";
import { formatRupiah } from "../lib/format";
import { useAuth, useCart } from "../store/AppProviders";
import { cx } from "../lib/cx";

const DELIVERY = [
  { id: "reguler", label: "Reguler", note: "2–3 hari", price: 10000 },
  { id: "instan", label: "Instan", note: "Hari ini, area tertentu", price: 25000 },
];
const PAYMENT = [
  { id: "ewallet", label: "E-wallet", note: "GoPay, OVO, DANA, ShopeePay" },
  { id: "va", label: "Transfer bank", note: "Virtual account" },
  { id: "cod", label: "Bayar di tempat", note: "Tunai saat barang tiba" },
];

function RadioCards({ legend, options, value, onChange, render }) {
  return (
    <fieldset>
      <legend className="text-[15px] font-bold">{legend}</legend>
      <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <label
            key={o.id}
            className={cx(
              "flex cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 bg-surface p-4 transition-colors",
              value === o.id ? "border-pine" : "border-line hover:border-muted"
            )}
          >
            <input type="radio" name={legend} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} className="sr-only" />
            <span>
              <span className="block text-[15px] font-semibold">{o.label}</span>
              <span className="block text-sm text-muted">{o.note}</span>
            </span>
            {render?.(o)}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function Checkout() {
  const cart = useCart();
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name ?? "", phone: "", address: "", city: "", postal: "" });
  const [delivery, setDelivery] = useState("reguler");
  const [payment, setPayment] = useState("ewallet");
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const shipping = DELIVERY.find((d) => d.id === delivery).price;
  const total = cart.subtotal + shipping;

  if (order) {
    return (
      <div className="mx-auto max-w-lg py-6 text-center">
        <LuCircleCheck size={56} className="mx-auto text-mint" aria-hidden="true" />
        <h1 className="mt-4 text-[1.75rem] font-extrabold">Pesanan dibuat</h1>
        <p className="tabular mt-2 text-[15px] text-muted">
          Nomor pesanan {order.id}, total {formatRupiah(order.total)}.
        </p>
        <Banner tone="caution" className="mt-6 text-left">
          Mode demo: belum ada pembayaran atau pengiriman sungguhan. Integrasi pembayaran dan mitra apotek akan menyusul.
        </Banner>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button to="/">Ke beranda</Button>
          <Button to="/belanja" variant="secondary">
            Belanja lagi
          </Button>
        </div>
      </div>
    );
  }

  if (!cart.lines.length) {
    return (
      <div className="py-10 text-center">
        <p className="text-lg font-bold">Keranjang kosong</p>
        <Button to="/belanja" className="mt-4">
          Mulai belanja
        </Button>
      </div>
    );
  }

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = "Isi nama penerima.";
    if (!/^(\+62|62|0)8\d{7,11}$/.test(form.phone.replace(/[\s-]/g, ""))) next.phone = "Gunakan nomor HP aktif, misalnya 0812 3456 7890.";
    if (form.address.trim().length < 10) next.address = "Tulis alamat lengkap: jalan, nomor, RT/RW, kelurahan.";
    if (!form.city.trim()) next.city = "Isi kota atau kabupaten.";
    if (!/^\d{5}$/.test(form.postal)) next.postal = "Kode pos terdiri dari 5 angka.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setOrder({ id: `LC-${Date.now().toString().slice(-8)}`, total });
    cart.clear();
    window.scrollTo({ top: 0 });
  };

  return (
    <div>
      <Link to="/keranjang" className="mb-5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-pine">
        <LuArrowLeft size={18} aria-hidden="true" />
        Keranjang
      </Link>
      <PageHeader title="Checkout" />
      <form onSubmit={submit} noValidate className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <section className="space-y-4" aria-labelledby="alamat">
            <h2 id="alamat" className="text-lg font-extrabold">
              Alamat pengiriman
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nama penerima" value={form.name} onChange={set("name")} error={errors.name} autoComplete="name" />
              <Field label="Nomor HP" type="tel" inputMode="tel" value={form.phone} onChange={set("phone")} error={errors.phone} autoComplete="tel" placeholder="08xx xxxx xxxx" />
            </div>
            <Field as="textarea" label="Alamat lengkap" value={form.address} onChange={set("address")} error={errors.address} autoComplete="street-address" />
            <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
              <Field label="Kota atau kabupaten" value={form.city} onChange={set("city")} error={errors.city} autoComplete="address-level2" />
              <Field label="Kode pos" inputMode="numeric" maxLength={5} value={form.postal} onChange={set("postal")} error={errors.postal} autoComplete="postal-code" />
            </div>
          </section>
          <RadioCards
            legend="Pengiriman"
            options={DELIVERY}
            value={delivery}
            onChange={setDelivery}
            render={(o) => <span className="tabular text-[15px] font-semibold">{formatRupiah(o.price)}</span>}
          />
          <RadioCards legend="Pembayaran" options={PAYMENT} value={payment} onChange={setPayment} />
        </div>

        <aside className="self-start rounded-[1.5rem] border border-line bg-surface p-5 lg:sticky lg:top-10">
          <h2 className="text-[17px] font-extrabold">Ringkasan pesanan</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {cart.lines.map(({ product, qty }) => (
              <li key={product.id} className="flex justify-between gap-3">
                <span className="text-ink-soft">
                  {qty} × {product.name}
                </span>
                <span className="tabular shrink-0">{formatRupiah(product.price * qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-line pt-4 text-[15px]">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="tabular">{formatRupiah(cart.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Ongkos kirim</dt>
              <dd className="tabular">{formatRupiah(shipping)}</dd>
            </div>
            <div className="flex justify-between text-lg font-extrabold">
              <dt>Total</dt>
              <dd className="tabular">{formatRupiah(total)}</dd>
            </div>
          </dl>
          <Button type="submit" block size="lg" className="mt-5">
            Buat pesanan
          </Button>
          <p className="mt-3 text-center text-[13px] text-muted">Mode demo, tidak ada tagihan sungguhan.</p>
        </aside>
      </form>
    </div>
  );
}
