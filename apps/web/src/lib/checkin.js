// Penilaian catatan harian versi 2 (PRD tahap 2, F5 dan Lampiran B).
// Bukan diagnosis: hanya mencocokkan isian dengan tanda umum yang perlu diperiksakan.
// Fungsi murni; teks dan sumber tiap alasan ada di src/content/checkin.js.
import { LEVELS, REASONS as R } from "../content/checkin";
import { healingPlan } from "./healing";

export const LEVEL_ORDER = ["pantau", "beberapa_hari", "hari_ini", "igd"];
const rank = (level) => LEVEL_ORDER.indexOf(level);
const topLevel = (reasons) => reasons.reduce((top, r) => (rank(r.level) > rank(top) ? r.level : top), "pantau");

const V1_FLUID = { tidak: "tidak", bening: "bening_tipis", nanah: "kental_keruh" };

// Catatan tahap 1 (tanpa `schema`) dibaca sebagai versi 2. Nilai lama tetap disimpan di `legacy`.
export function normalizeCheckin(c) {
  if (!c) return c;
  if (c.schema === 2) return { ...c, bedColors: c.bedColors ?? [], skin: c.skin ?? [] };
  return {
    ...c,
    schema: 2,
    bedColors: [],
    fluid: V1_FLUID[c.fluid] ?? "tidak",
    newOdor: false,
    skin: c.swelling ? ["lebih_hangat", "tegang_mengilap"] : [],
    spread: c.redness === "meluas" ? "melewati_garis" : "belum_ditandai",
    legacy: { redness: c.redness, fluid: c.fluid, swelling: Boolean(c.swelling) },
  };
}

const INFECTION_SKIN = ["lebih_hangat", "tegang_mengilap", "keras", "lebih_gelap", "garis_menjalar"];
const DANGER_SKIN = ["menghitam", "melepuh", "mati_rasa"];
const CLOSING = ["merah_muda", "keropeng"];

const result = (reasons) => ({ level: topLevel(reasons), reasons });

export function assessCheckin(wound, checkin, previous) {
  const c = normalizeCheckin(checkin);
  if (!c) return result([]);
  const p = normalizeCheckin(previous);
  const skin = new Set(c.skin);
  const bed = new Set(c.bedColors);
  const spread = c.spread === "melewati_garis";
  const badFluid = c.fluid === "kental_keruh" || c.fluid === "kehijauan";
  const painUp = p ? c.pain - p.pain : 0;
  const infectionSign = spread || badFluid || c.newOdor || INFECTION_SKIN.some((s) => skin.has(s));
  const out = [];

  if (c.fever && spread) out.push(R.meluasDemam);
  else if (c.fever && infectionSign) out.push(R.demamInfeksi);
  else if (c.fever) out.push(R.demam);
  if (DANGER_SKIN.some((s) => skin.has(s))) out.push(R.kulitBahaya);
  if (spread && !c.fever) out.push(R.meluas);
  if (skin.has("garis_menjalar")) out.push(R.garisMenjalar);
  if (badFluid) out.push(R.cairan);
  if (c.newOdor) out.push(R.bau);
  if (skin.has("lebih_hangat") && (skin.has("tegang_mengilap") || skin.has("keras")) && painUp > 0) out.push(R.hangat);
  if (painUp >= 3) out.push(R.nyeriNaik);
  if (wound?.type === "bakar" && c.burnWorse) out.push(R.bakarMemburuk);
  if (bed.has("hitam") && !p?.bedColors.includes("hitam")) out.push(R.hitamBaru);
  if (bed.has("kuning") && p?.bedColors.includes("kuning")) out.push(R.kuningBerulang);
  if (bed.has("merah_rapuh")) out.push(R.dasarRapuh);

  return result(out);
}

// Penilaian luka saat ini: catatan terakhir ditambah aturan waktu (batas periksa dan 4 minggu).
export function assessWound(wound, now = new Date()) {
  const list = wound?.checkins ?? [];
  const last = list[list.length - 1];
  const base = assessCheckin(wound, last, list[list.length - 2]);
  if (!wound || wound.status !== "dipantau") return { ...base, plan: null };
  const plan = healingPlan(wound, now);
  const reasons = [...base.reasons];
  const closing = Boolean(last) && base.level === "pantau" && normalizeCheckin(last).bedColors.length > 0 &&
    normalizeCheckin(last).bedColors.every((b) => CLOSING.includes(b));
  if (plan.fourWeeksPassed) reasons.push(R.empatMinggu);
  else if (plan.overdue && !closing) reasons.push(R.lewatBatas);
  return { ...result(reasons), plan };
}

export const levelInfo = (level) => LEVELS[level];
