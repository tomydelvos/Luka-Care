import { useRef, useState } from "react";
import { LuCamera, LuTrash2, LuRefreshCw } from "react-icons/lu";
import { Button, ChoiceGroup, Field, MissingHint, MultiChoice, Sheet, Toggle, Banner } from "./ui";
import { compressImage } from "../lib/image";
import {
  BED_COLOR_OPTIONS,
  BURN_RECHECK,
  DANGER_REFERENCES,
  FEVER_HINT,
  FLUID_OPTIONS_V2,
  LEVELS,
  PHOTO_HELP,
  SKIN_OPTIONS,
  SPREAD_OPTIONS,
  labelOf,
} from "../content";
import { assessCheckin, normalizeCheckin } from "../lib/checkin";
import { ReviewRibbon } from "./ContentMeta";
import { healingPlan } from "../lib/healing";
import { LevelBanner } from "./LevelBanner";
import { RichText } from "./RichText";
import { dayNumber, formatShortDate } from "../lib/format";
import { useToast, useWounds } from "../store/AppProviders";
import { USE_MOCK_API, assetUrl } from "../config/env";
import { cx } from "../lib/cx";

/* ---------- Foto ---------- */
export function PhotoPicker({ value, onChange, hint = "Opsional. Ambil dari jarak dan cahaya yang sama setiap hari agar mudah dibandingkan." }) {
  const input = useRef(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      onChange(await compressImage(file));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <p className="text-[15px] font-bold">Foto luka</p>
      <p className="mt-0.5 text-sm text-muted">{hint}</p>
      <input ref={input} type="file" accept="image/*" className="sr-only" onChange={pick} tabIndex={-1} aria-hidden="true" />
      {value ? (
        <div className="mt-3 flex items-center gap-4">
          <img src={value} alt="Pratinjau foto luka" className="h-24 w-32 rounded-2xl object-cover" />
          <div className="flex flex-col gap-2">
            <Button size="sm" variant="secondary" onClick={() => input.current?.click()}>
              <LuRefreshCw size={15} aria-hidden="true" />
              Ganti foto
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onChange(null)}>
              <LuTrash2 size={15} aria-hidden="true" />
              Hapus
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={busy}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line bg-sunken/60 px-4 py-6 text-[15px] font-semibold text-ink-soft hover:border-muted"
        >
          <LuCamera size={20} aria-hidden="true" />
          {busy ? "Memproses foto…" : "Ambil atau pilih foto"}
        </button>
      )}
      {error && <p className="mt-2 text-sm text-alert">{error}</p>}
      <p className="mt-2 text-[13px] text-muted">
        {USE_MOCK_API
          ? "Foto hanya disimpan di perangkat ini dan tidak dikirim ke mana pun."
          : "Foto disimpan terenkripsi dan hanya bisa dilihat oleh Anda."}
      </p>
    </div>
  );
}

/* ---------- Skala nyeri ---------- */
export function PainScale({ value, onChange }) {
  return (
    <fieldset>
      <legend className="text-[15px] font-bold">Seberapa nyeri sekarang?</legend>
      <div className="mt-2.5 grid grid-cols-11 gap-1" role="radiogroup" aria-label="Skala nyeri 0 sampai 10">
        {Array.from({ length: 11 }, (_, n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`Nyeri ${n}`}
            onClick={() => onChange(n)}
            className={cx(
              "tabular h-11 rounded-xl border text-sm font-bold transition-colors",
              value === n ? "border-pine bg-pine text-on-pine" : "border-line bg-surface text-ink hover:border-muted"
            )}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[13px] text-muted">
        <span>Tidak nyeri</span>
        <span>Sangat nyeri</span>
      </div>
    </fieldset>
  );
}

/* ---------- Foto sebagai alat bantu mengisi (tidak dibaca otomatis) ---------- */
function ZoomablePhoto({ src, alt, label, onZoom }) {
  return (
    <figure className="min-w-0">
      {src ? (
        <button type="button" onClick={() => onZoom({ src, alt })} className="block w-full overflow-hidden rounded-2xl" aria-label={`Perbesar ${alt}`}>
          <img src={src} alt={alt} className="aspect-[4/3] w-full object-cover" />
        </button>
      ) : (
        <span className="grid aspect-[4/3] w-full place-items-center rounded-2xl border border-dashed border-line bg-sunken px-3 text-center text-sm text-muted">
          Belum ada foto hari ini
        </span>
      )}
      <figcaption className="tabular mt-1 text-[13px] text-muted">{label}</figcaption>
    </figure>
  );
}

function PhotoComparePanel({ wound, current }) {
  const [zoom, setZoom] = useState(null);
  const previous = [...wound.checkins].reverse().find((c) => c.photo);
  if (!previous && !current) return null;
  return (
    <section aria-labelledby="bandingkan-foto" className="rounded-2xl border border-line bg-surface p-4">
      <h3 id="bandingkan-foto" className="text-[15px] font-bold">
        Bandingkan foto
      </h3>
      <p className="mt-0.5 text-sm text-muted">{PHOTO_HELP.compare}</p>
      {zoom ? (
        <div className="mt-3">
          <img src={zoom.src} alt={zoom.alt} className="w-full rounded-2xl object-contain" />
          <Button variant="secondary" size="sm" className="mt-2" onClick={() => setZoom(null)}>
            Tutup gambar besar
          </Button>
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3">
          <ZoomablePhoto
            src={previous?.photo}
            alt={previous ? `foto luka ${formatShortDate(previous.at)}` : ""}
            label={previous ? `Sebelumnya, hari ke-${dayNumber(wound.createdAt, new Date(previous.at))}` : "Belum ada foto sebelumnya"}
            onZoom={setZoom}
          />
          <ZoomablePhoto src={current} alt="foto luka hari ini" label="Hari ini" onZoom={setZoom} />
        </div>
      )}
      <p className="mt-3 text-[13px] text-muted">
        {PHOTO_HELP.light} {PHOTO_HELP.disclaimer}
      </p>
    </section>
  );
}

// Gambar contoh tanda bahaya dari buku, di samping pertanyaan yang berkaitan.
function DangerReference({ item }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-sunken p-3">
      <img src={assetUrl(item.swatch)} alt={item.alt} width="360" height="360" loading="lazy" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
      <p className="text-sm text-ink-soft">
        {item.text} <ReviewRibbon blocks={item} />
      </p>
    </div>
  );
}

/* ---------- Catat kondisi harian (versi 2, PRD tahap 2 F4) ---------- */
const EMPTY = {
  photo: null,
  pain: null,
  bedColors: [],
  fluid: "",
  newOdor: false,
  skin: [],
  spread: "",
  fever: false,
  burnWorse: false,
  dressingChanged: true,
  note: "",
};

const items = (b) => b.items;

export function CheckInSheet({ wound, open, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { addCheckin } = useWounds();
  const toast = useToast();
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const plan = healingPlan(wound);
  const askBurn = wound.type === "bakar" && plan.recheckDue;
  const ready = form.pain !== null && form.bedColors.length > 0 && form.fluid && form.spread;
  const previous = wound.checkins[wound.checkins.length - 1];
  const previousBed = previous ? normalizeCheckin(previous).bedColors : [];
  const draft = { ...form, schema: 2, burnWorse: askBurn && form.burnWorse };
  const preview = ready ? assessCheckin(wound, draft, previous) : { level: "pantau", reasons: [] };

  const close = () => {
    setForm(EMPTY);
    setError("");
    onClose();
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      await addCheckin(wound.id, { ...draft, assessment: { level: preview.level, reasons: preview.reasons.map((r) => r.id) } });
      const urgent = preview.level === "igd" || preview.level === "hari_ini";
      toast(
        preview.level === "pantau" ? "Catatan hari ini disimpan" : `Catatan disimpan. ${LEVELS[preview.level].title}.`,
        urgent ? "alert" : "default"
      );
      close();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet
      open={open}
      onClose={close}
      title="Catat kondisi hari ini"
      footer={
        <>
          <MissingHint
            items={[
              !form.bedColors.length && "warna dasar luka",
              !form.fluid && "cairan",
              !form.spread && "garis pulpen",
              form.pain === null && "tingkat nyeri",
            ]}
          />
          <Button block size="lg" onClick={save} disabled={!ready || saving}>
            {saving ? "Menyimpan…" : "Simpan catatan"}
          </Button>
        </>
      }
    >
      <div className="space-y-7 pt-1">
        <PhotoPicker
          value={form.photo}
          onChange={(photo) => set({ photo })}
          hint="Opsional. Pakai cahaya alami dan jarak yang sama setiap hari, dan pastikan garis pulpen ikut terfoto."
        />
        <PhotoComparePanel wound={wound} current={form.photo} />
        <MultiChoice
          label="Warna dasar luka"
          hint={form.photo ? "Pilih warna yang paling mirip dengan dasar luka di foto dan yang Anda lihat langsung. Boleh lebih dari satu." : "Boleh pilih lebih dari satu."}
          options={items(BED_COLOR_OPTIONS)}
          value={form.bedColors}
          onChange={(bedColors) => set({ bedColors })}
        >
          <p className="text-sm text-muted">
            <RichText text={BED_COLOR_OPTIONS.rule} />
          </p>
          {previousBed.length > 0 && (
            <p className="text-sm text-muted">
              Catatan sebelumnya: {previousBed.map((id) => labelOf(BED_COLOR_OPTIONS.items, id).toLowerCase()).join(", ")}.
            </p>
          )}
        </MultiChoice>
        <div className="space-y-2">
          <ChoiceGroup label="Cairan dari luka" options={items(FLUID_OPTIONS_V2)} value={form.fluid} onChange={(fluid) => set({ fluid })} />
          <p className="text-sm text-muted">{FLUID_OPTIONS_V2.note}</p>
          <DangerReference item={DANGER_REFERENCES.cairan} />
        </div>
        <MultiChoice
          label="Kulit di sekitar luka, dibanding sisi tubuh lainnya"
          hint={SKIN_OPTIONS.hint}
          options={items(SKIN_OPTIONS)}
          value={form.skin}
          onChange={(skin) => set({ skin })}
        >
          <DangerReference item={DANGER_REFERENCES.kulitGelap} />
        </MultiChoice>
        <div className="space-y-2">
          <ChoiceGroup label="Garis pulpen di tepi luka" options={items(SPREAD_OPTIONS)} value={form.spread} onChange={(spread) => set({ spread })} />
          {form.spread === "belum_ditandai" && (
            <Banner tone="info" title="Cara menandai">
              {SPREAD_OPTIONS.howTo}
            </Banner>
          )}
          <DangerReference item={DANGER_REFERENCES.meluas} />
        </div>
        <PainScale value={form.pain} onChange={(pain) => set({ pain })} />
        <div className="divide-y divide-line rounded-2xl border border-line px-4">
          <div className="py-3">
            <Toggle label="Ada bau baru dari luka" checked={form.newOdor} onChange={(newOdor) => set({ newOdor })} />
          </div>
          <div className="py-3">
            <Toggle label="Demam atau badan sangat lemas" description={FEVER_HINT.text} checked={form.fever} onChange={(fever) => set({ fever })} />
          </div>
          {askBurn && (
            <div className="py-3">
              <Toggle label={BURN_RECHECK.question} description={BURN_RECHECK.note} checked={form.burnWorse} onChange={(burnWorse) => set({ burnWorse })} />
            </div>
          )}
          <div className="py-3">
            <Toggle label="Penutup luka sudah diganti" checked={form.dressingChanged} onChange={(dressingChanged) => set({ dressingChanged })} />
          </div>
        </div>
        <Field as="textarea" label="Catatan" placeholder="Misalnya: keropeng mulai terbentuk, gatal di tepi luka" value={form.note} onChange={(e) => set({ note: e.target.value })} />
        <LevelBanner assessment={preview} />
        {error && <Banner tone="alert">{error}</Banner>}
      </div>
    </Sheet>
  );
}

/* ---------- Grafik nyeri ---------- */
export function PainChart({ checkins }) {
  if (checkins.length < 2) return null;
  const W = 320;
  const H = 132;
  const pad = { l: 26, r: 12, t: 12, b: 26 };
  const x = (i) => pad.l + (i * (W - pad.l - pad.r)) / (checkins.length - 1);
  const y = (v) => pad.t + ((10 - v) * (H - pad.t - pad.b)) / 10;
  const points = checkins.map((c, i) => [x(i), y(c.pain)]);
  const path = points.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`).join(" ");
  const first = checkins[0];
  const last = checkins[checkins.length - 1];
  const trend = last.pain - first.pain;

  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Grafik nyeri dari ${first.pain} menjadi ${last.pain} dalam ${checkins.length} catatan`}>
        {[0, 5, 10].map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="var(--lc-line)" strokeDasharray={v === 0 ? "" : "3 4"} />
            <text x={pad.l - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill="var(--lc-muted)" className="tabular">
              {v}
            </text>
          </g>
        ))}
        <path d={path} fill="none" stroke="var(--lc-pine)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {points.map(([px, py], i) => (
          <circle key={checkins[i].id} cx={px} cy={py} r={i === points.length - 1 ? 5 : 3.5} fill={i === points.length - 1 ? "var(--lc-pine)" : "var(--lc-surface)"} stroke="var(--lc-pine)" strokeWidth="2" />
        ))}
        <text x={pad.l} y={H - 6} fontSize="11" fill="var(--lc-muted)">
          {formatShortDate(first.at)}
        </text>
        <text x={W - pad.r} y={H - 6} fontSize="11" fill="var(--lc-muted)" textAnchor="end">
          {formatShortDate(last.at)}
        </text>
      </svg>
      <figcaption className="mt-1 text-sm text-muted">
        {trend < 0
          ? `Nyeri turun ${Math.abs(trend)} poin sejak catatan pertama.`
          : trend > 0
            ? `Nyeri naik ${trend} poin sejak catatan pertama.`
            : "Nyeri belum berubah sejak catatan pertama."}
      </figcaption>
    </figure>
  );
}
