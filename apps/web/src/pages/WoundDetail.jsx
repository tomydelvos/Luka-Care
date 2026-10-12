import { useState } from "react";
import { LuArrowLeft, LuNotebookPen, LuCircleCheck, LuTrash2, LuChevronDown } from "react-icons/lu";
import { Link, useRouter } from "../lib/router";
import { Badge, Banner, Button, Sheet } from "../components/ui";
import { WoundArt } from "../components/art";
import { CheckInSheet, PainChart } from "../components/monitor";
import { PhotoGallery } from "../components/PhotoGallery";
import { ProductRow, ProductSheet } from "../components/shop";
import { woundStatus } from "../components/WoundRow";
import { WOUND_GUIDES, MONITOR_SIGNS } from "../data/woundGuides";
import { AREA_OPTIONS, FLUID_OPTIONS, REDNESS_OPTIONS, labelOf } from "../data/options";
import { PRODUCTS } from "../data/products";
import { latestWarnings, checkinWarnings } from "../lib/checkin";
import { dayNumber, formatDate, formatShortDate, formatTime, isToday, relativeDay } from "../lib/format";
import { useToast, useWounds } from "../store/AppProviders";

function Panel({ title, children, id }) {
  return (
    <section aria-labelledby={id} className="rounded-[1.5rem] border border-line bg-surface p-5">
      <h2 id={id} className="text-[17px] font-extrabold">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function PhotoCompare({ wound }) {
  const withPhoto = wound.checkins.filter((c) => c.photo);
  if (!withPhoto.length) {
    return <p className="text-[15px] text-muted">Belum ada foto. Tambahkan foto saat mencatat kondisi agar perubahan luka terlihat dari hari ke hari.</p>;
  }
  const first = withPhoto[0];
  const last = withPhoto[withPhoto.length - 1];
  const pair = withPhoto.length > 1 ? [first, last] : [first];
  return (
    <div className={pair.length > 1 ? "grid grid-cols-2 gap-3" : ""}>
      {pair.map((c, i) => (
        <figure key={c.id}>
          <img src={c.photo} alt={`Foto luka ${formatDate(c.at)}`} className="aspect-[4/3] w-full rounded-2xl object-cover" />
          <figcaption className="tabular mt-1.5 text-sm">
            <span className="font-semibold">{pair.length > 1 ? (i === 0 ? "Awal" : "Terbaru") : "Foto"}</span>
            <span className="text-muted">, hari ke-{dayNumber(wound.createdAt, new Date(c.at))}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function CheckinItem({ checkin, previous, wound }) {
  const warnings = checkinWarnings(checkin, previous);
  const facts = [
    `Kemerahan: ${labelOf(REDNESS_OPTIONS, checkin.redness).toLowerCase()}`,
    `Cairan: ${labelOf(FLUID_OPTIONS, checkin.fluid).toLowerCase()}`,
    checkin.swelling && "Bengkak atau panas",
    checkin.fever && "Demam",
    checkin.dressingChanged && "Penutup diganti",
  ].filter(Boolean);
  return (
    <li className="flex gap-4 py-4">
      {checkin.photo ? (
        <img src={checkin.photo} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
      ) : (
        <span className="tabular grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-sunken text-center text-xs font-semibold leading-tight text-muted">
          Hari
          <br />
          <span className="text-lg font-extrabold text-ink">{dayNumber(wound.createdAt, new Date(checkin.at))}</span>
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <p className="font-bold">
            {relativeDay(checkin.at)}
            <span className="tabular font-normal text-muted">, {formatShortDate(checkin.at)} {formatTime(checkin.at)}</span>
          </p>
          <p className="tabular text-sm font-semibold">Nyeri {checkin.pain}/10</p>
        </div>
        <p className="mt-1 text-sm text-muted">{facts.join(". ")}.</p>
        {checkin.note && <p className="mt-1.5 text-[15px] text-ink-soft">{checkin.note}</p>}
        {warnings.length > 0 && (
          <Badge tone="alert" className="mt-2">
            {warnings[0]}
          </Badge>
        )}
      </div>
    </li>
  );
}

export default function WoundDetail({ id }) {
  const { getById, update, remove, loading } = useWounds();
  const { navigate } = useRouter();
  const toast = useToast();
  const [checkinOpen, setCheckinOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [openProduct, setOpenProduct] = useState(null);
  const wound = getById(id);

  if (loading) return <p className="text-muted">Memuat…</p>;
  if (!wound) {
    return (
      <div className="py-10 text-center">
        <h1 className="text-2xl font-extrabold">Catatan luka tidak ditemukan</h1>
        <p className="mt-2 text-muted">Mungkin sudah dihapus, atau tersimpan di perangkat lain.</p>
        <Button to="/pantau" className="mt-6">
          Kembali ke daftar luka
        </Button>
      </div>
    );
  }

  const guide = WOUND_GUIDES[wound.type];
  const status = woundStatus(wound);
  const warnings = latestWarnings(wound);
  const checkedToday = wound.checkins.some((c) => isToday(c.at));
  const history = [...wound.checkins].reverse();
  const supplies = PRODUCTS.filter((p) => p.forTypes.includes(wound.type) && p.category !== "p3k").slice(0, 3);
  const active = wound.status === "dipantau";

  return (
    <div>
      <Link to="/pantau" className="mb-5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-pine">
        <LuArrowLeft size={18} aria-hidden="true" />
        Pantau luka
      </Link>

      <header className="flex items-start gap-4">
        <WoundArt type={wound.type} size={60} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <h1 className="text-[1.65rem] font-extrabold sm:text-[2rem]">{wound.title}</h1>
          <p className="mt-1 text-[15px] text-muted">
            {guide.name}, {labelOf(AREA_OPTIONS, wound.area).toLowerCase()}
          </p>
          <p className="tabular text-[15px] text-muted">
            Mulai {formatDate(wound.createdAt)}
            {active ? `, hari ke-${dayNumber(wound.createdAt)}` : ""}
          </p>
          <Badge tone={status.tone} className="mt-2">
            {status.label}
          </Badge>
        </div>
      </header>

      {active && warnings.length > 0 && (
        <Banner
          tone="alert"
          className="mt-6"
          title="Catatan terakhir menunjukkan tanda yang perlu diperiksakan"
          action={
            <Button to="/darurat" variant="danger" size="sm">
              Lihat nomor darurat dan faskes
            </Button>
          }
        >
          <ul className="list-disc space-y-0.5 pl-5">
            {warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
          <p className="mt-2">Periksakan ke puskesmas, klinik, atau IGD hari ini.</p>
        </Banner>
      )}

      {active && (
        <div className="mt-6 flex flex-col gap-3 rounded-[1.5rem] bg-pine-soft p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <p className="font-bold text-pine-strong">{checkedToday ? "Kondisi hari ini sudah dicatat" : "Kondisi hari ini belum dicatat"}</p>
            <p className="text-sm text-ink-soft">Catat sekali sehari, sebaiknya saat mengganti penutup luka.</p>
          </div>
          <Button onClick={() => setCheckinOpen(true)} variant={checkedToday ? "secondary" : "primary"} size="lg">
            <LuNotebookPen size={18} aria-hidden="true" />
            {checkedToday ? "Catat lagi" : "Catat kondisi hari ini"}
          </Button>
        </div>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Perubahan luka" id="perubahan">
          <PhotoCompare wound={wound} />
        </Panel>
        <Panel title="Tingkat nyeri" id="nyeri">
          {wound.checkins.length > 1 ? (
            <PainChart checkins={wound.checkins} />
          ) : (
            <p className="text-[15px] text-muted">Grafik muncul setelah ada dua catatan atau lebih.</p>
          )}
        </Panel>
      </div>

      <div className="mt-4">
        <PhotoGallery wound={wound} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Perawatan harian" id="perawatan">
          <div className="divide-y divide-line">
            {guide.steps(wound).map((s, i) => (
              <details key={s.id} className="group py-2.5">
                <summary className="flex cursor-pointer list-none items-center gap-3 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
                  <span className="tabular grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sunken text-xs font-bold">{i + 1}</span>
                  <span className="flex-1">{s.title}</span>
                  <LuChevronDown size={18} className="text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="mt-2 pl-9 text-[15px] text-ink-soft">{s.body}</p>
              </details>
            ))}
          </div>
        </Panel>
        <Panel title="Periksakan jika muncul" id="tanda">
          <ul className="space-y-2">
            {MONITOR_SIGNS.map((s) => (
              <li key={s} className="flex gap-3 text-[15px] text-ink-soft">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-alert" aria-hidden="true" />
                {s}
              </li>
            ))}
            <li className="flex gap-3 text-[15px] text-ink-soft">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-alert" aria-hidden="true" />
              Luka tidak membaik setelah beberapa hari
            </li>
          </ul>
        </Panel>
      </div>

      {active && supplies.length > 0 && (
        <div className="mt-4">
          <Panel title="Stok perlengkapan" id="stok">
            <div className="-my-1 divide-y divide-line">
              {supplies.map((p) => (
                <ProductRow key={p.id} product={p} onOpen={setOpenProduct} />
              ))}
            </div>
          </Panel>
        </div>
      )}

      <section aria-labelledby="riwayat" className="mt-8">
        <h2 id="riwayat" className="text-lg font-extrabold">
          Riwayat catatan
        </h2>
        <ul className="mt-2 divide-y divide-line">
          {history.map((c) => {
            const idx = wound.checkins.indexOf(c);
            return <CheckinItem key={c.id} checkin={c} previous={wound.checkins[idx - 1]} wound={wound} />;
          })}
        </ul>
      </section>

      <div className="mt-8 flex flex-col gap-2 border-t border-line pt-6 sm:flex-row">
        {active ? (
          <Button
            variant="secondary"
            onClick={async () => {
              await update(wound.id, { status: "sembuh", healedAt: new Date().toISOString() });
              toast("Ditandai pulih. Semoga cepat pulih sepenuhnya.");
            }}
          >
            <LuCircleCheck size={18} aria-hidden="true" />
            Tandai sudah pulih
          </Button>
        ) : (
          <Button variant="secondary" onClick={() => update(wound.id, { status: "dipantau", healedAt: null })}>
            Pantau lagi
          </Button>
        )}
        <Button variant="danger-ghost" onClick={() => setConfirmDelete(true)}>
          <LuTrash2 size={18} aria-hidden="true" />
          Hapus catatan luka
        </Button>
      </div>

      <CheckInSheet wound={wound} open={checkinOpen} onClose={() => setCheckinOpen(false)} />
      <ProductSheet product={openProduct} onClose={() => setOpenProduct(null)} />
      <Sheet
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Hapus catatan luka ini?"
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
              Batal
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                await remove(wound.id);
                toast("Catatan luka dihapus");
                navigate("/pantau", { replace: true });
              }}
            >
              Hapus permanen
            </Button>
          </div>
        }
      >
        <p className="text-[15px] text-ink-soft">
          Semua foto dan {wound.checkins.length} catatan harian untuk “{wound.title}” akan dihapus dan tidak bisa dikembalikan.
        </p>
      </Sheet>
    </div>
  );
}
