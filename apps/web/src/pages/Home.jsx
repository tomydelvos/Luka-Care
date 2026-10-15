import { useState } from "react";
import { Link } from "../lib/router";
import { Button, SectionTitle } from "../components/ui";
import { WoundArt } from "../components/art";
import { WoundRow } from "../components/WoundRow";
import { ProductCard, ProductSheet } from "../components/shop";
import { Disclaimer } from "../components/AppShell";
import { WOUND_TYPE_LIST } from "../content";
import { RED_FLAGS } from "../content";
import { PRODUCTS } from "../data/products";
import { greeting } from "../lib/format";
import { useAuth, useWounds } from "../store/AppProviders";

const KEY_FLAGS = ["perdarahan", "dalam", "gigitan", "infeksi"].map((id) => RED_FLAGS.find((f) => f.id === id));

function PlasterHero() {
  return (
    <section aria-labelledby="hero-judul" className="plaster-stick plaster-wing rounded-[2.25rem] p-2.5 shadow-[0_18px_40px_-24px_rgba(120,72,30,0.55)] sm:rounded-[3rem] sm:p-3">
      <div className="plaster-pad mx-5 rounded-[1.4rem] px-5 py-7 sm:mx-14 sm:rounded-[2rem] sm:px-10 sm:py-11">
        <h1 id="hero-judul" className="max-w-md text-[2.15rem] font-extrabold leading-[1.05] tracking-[-0.035em] text-ink sm:text-[3.25rem]">
          Ada luka barusan?
        </h1>
        <p className="mt-3 max-w-md text-[16px] text-ink-soft sm:text-[17px]">
          Jawab beberapa pertanyaan singkat, lalu ikuti langkah perawatannya satu per satu.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Button to="/panduan" size="lg">
            Mulai panduan
          </Button>
          <span className="text-sm text-ink-soft">Tanpa akun, sekitar 2 menit</span>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { user } = useAuth();
  const { wounds } = useWounds();
  const [openProduct, setOpenProduct] = useState(null);
  const active = wounds.filter((w) => w.status === "dipantau");
  const starters = PRODUCTS.filter((p) => p.starter);

  return (
    <div>
      <p className="mb-4 text-[15px] font-semibold text-muted">
        {greeting()}
        {user ? `, ${user.name.split(" ")[0]}` : ""}
      </p>

      <PlasterHero />

      <nav aria-label="Langsung ke jenis luka" className="mt-5">
        <p className="mb-2.5 text-sm font-semibold text-muted">Sudah tahu jenis lukanya?</p>
        <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {WOUND_TYPE_LIST.map((g) => (
            <li key={g.id} className="shrink-0">
              <Link
                to={`/panduan?jenis=${g.id}`}
                className="flex items-center gap-2.5 rounded-full border border-line bg-surface py-1.5 pl-1.5 pr-4 text-[15px] font-semibold hover:border-muted"
              >
                <WoundArt type={g.id} size={34} />
                {g.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
        <div className="space-y-10">
          <section aria-labelledby="dipantau">
            <SectionTitle
              id="dipantau"
              action={
                active.length > 0 && (
                  <Link to="/pantau" className="text-sm font-semibold text-pine">
                    Lihat semua
                  </Link>
                )
              }
            >
              Sedang dipantau
            </SectionTitle>
            {active.length ? (
              <div className="divide-y divide-line rounded-[1.5rem] border border-line bg-surface px-4">
                {active.slice(0, 3).map((w) => (
                  <WoundRow key={w.id} wound={w} />
                ))}
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-line px-5 py-6">
                <p className="text-[15px] text-ink-soft">
                  Belum ada luka yang dipantau. Setelah selesai panduan, simpan lukanya untuk mencatat foto dan kondisinya setiap hari.
                </p>
              </div>
            )}
          </section>

          <section aria-labelledby="p3k">
            <SectionTitle
              id="p3k"
              action={
                <Link to="/belanja" className="text-sm font-semibold text-pine">
                  Belanja
                </Link>
              }
            >
              Perlengkapan P3K dasar
            </SectionTitle>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
              {starters.map((p) => (
                <ProductCard key={p.id} product={p} onOpen={setOpenProduct} />
              ))}
            </div>
          </section>
        </div>

        <aside aria-labelledby="ke-dokter" className="self-start rounded-[1.75rem] bg-surface p-5 ring-1 ring-line sm:p-6">
          <h2 id="ke-dokter" className="text-lg font-extrabold">
            Kapan harus ke dokter
          </h2>
          <p className="mt-1 text-sm text-muted">Jangan rawat sendiri jika ada salah satu tanda ini.</p>
          <ul className="mt-4 space-y-4">
            {KEY_FLAGS.map((f) => (
              <li key={f.id} className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-alert" aria-hidden="true" />
                <span>
                  <span className="block text-[15px] font-bold">{f.title}</span>
                  <span className="block text-sm text-muted">{f.detail}</span>
                </span>
              </li>
            ))}
          </ul>
          <Button to="/darurat" variant="danger-soft" block className="mt-5">
            Lihat semua tanda dan nomor darurat
          </Button>
        </aside>
      </div>

      <Disclaimer className="mt-12 max-w-2xl" />
      <ProductSheet product={openProduct} onClose={() => setOpenProduct(null)} />
    </div>
  );
}
