import { useRef, useState } from "react";
import { LuCamera, LuTrash2, LuRefreshCw } from "react-icons/lu";
import { Button, ChoiceGroup, Field, MissingHint, Sheet, Toggle, Banner } from "./ui";
import { compressImage } from "../lib/image";
import { FLUID_OPTIONS, REDNESS_OPTIONS } from "../data/options";
import { checkinWarnings } from "../lib/checkin";
import { formatShortDate } from "../lib/format";
import { useToast, useWounds } from "../store/AppProviders";
import { USE_MOCK_API } from "../config/env";
import { cx } from "../lib/cx";

/* ---------- Foto ---------- */
export function PhotoPicker({ value, onChange }) {
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
      <p className="mt-0.5 text-sm text-muted">
        Opsional. Ambil dari jarak dan cahaya yang sama setiap hari agar mudah dibandingkan.
      </p>
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

/* ---------- Catat kondisi harian ---------- */
const EMPTY = {
  photo: null,
  pain: null,
  redness: "",
  fluid: "",
  swelling: false,
  fever: false,
  dressingChanged: true,
  note: "",
};

export function CheckInSheet({ wound, open, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { addCheckin } = useWounds();
  const toast = useToast();
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const ready = form.pain !== null && form.redness && form.fluid;
  const previous = wound.checkins[wound.checkins.length - 1];
  const preview = ready ? checkinWarnings(form, previous) : [];

  const close = () => {
    setForm(EMPTY);
    setError("");
    onClose();
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      await addCheckin(wound.id, form);
      toast(preview.length ? "Catatan disimpan. Ada tanda yang perlu diperiksakan." : "Catatan hari ini disimpan", preview.length ? "alert" : "default");
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
            items={[form.pain === null && "tingkat nyeri", !form.redness && "kemerahan", !form.fluid && "cairan dari luka"]}
          />
          <Button block size="lg" onClick={save} disabled={!ready || saving}>
            {saving ? "Menyimpan…" : "Simpan catatan"}
          </Button>
        </>
      }
    >
      <div className="space-y-6 pt-1">
        <PhotoPicker value={form.photo} onChange={(photo) => set({ photo })} />
        <PainScale value={form.pain} onChange={(pain) => set({ pain })} />
        <ChoiceGroup label="Kemerahan di sekitar luka" options={REDNESS_OPTIONS} value={form.redness} onChange={(redness) => set({ redness })} />
        <ChoiceGroup label="Cairan dari luka" options={FLUID_OPTIONS} value={form.fluid} onChange={(fluid) => set({ fluid })} />
        <div className="divide-y divide-line rounded-2xl border border-line px-4">
          <div className="py-3">
            <Toggle label="Bengkak atau terasa panas" checked={form.swelling} onChange={(swelling) => set({ swelling })} />
          </div>
          <div className="py-3">
            <Toggle label="Demam" description="Suhu tubuh 38°C atau lebih" checked={form.fever} onChange={(fever) => set({ fever })} />
          </div>
          <div className="py-3">
            <Toggle label="Penutup luka sudah diganti" checked={form.dressingChanged} onChange={(dressingChanged) => set({ dressingChanged })} />
          </div>
        </div>
        <Field as="textarea" label="Catatan" placeholder="Misalnya: keropeng mulai terbentuk, gatal di tepi luka" value={form.note} onChange={(e) => set({ note: e.target.value })} />
        {preview.length > 0 && (
          <Banner tone="alert" title="Tanda ini sebaiknya diperiksakan hari ini">
            <ul className="list-disc space-y-0.5 pl-5">
              {preview.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </Banner>
        )}
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
