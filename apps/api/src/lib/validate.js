import { HttpError } from "./http";

// Nilai yang sama dengan src/content/options.js dan src/content/wounds/ di frontend.
export const WOUND_TYPES = ["lecet", "sayatan", "bakar", "lepuh"];
export const WHO = ["dewasa", "anak", "bayi", "lansia"];
export const AREAS = ["tangan", "lengan", "lutut", "kaki", "badan", "wajah", "kelamin"];
export const CONDITIONS = ["berdarah", "basah", "kering"];
export const SIZES = ["kecil", "sedang", "besar"];
export const REDNESS = ["tidak", "sedikit", "meluas"];
export const FLUID = ["tidak", "bening", "nanah"];
export const STATUSES = ["dipantau", "sembuh"];

// Catatan harian versi 2 (apps/web/src/content/checkin.js).
export const FLUID_V2 = ["tidak", "bening_tipis", "kuning_tipis", "kental_keruh", "kehijauan"];
export const BED_COLORS = ["merah_muda", "merah", "keropeng", "kuning", "hitam", "merah_rapuh"];
export const SKIN = ["lebih_hangat", "tegang_mengilap", "keras", "lebih_gelap", "garis_menjalar", "menghitam", "melepuh", "mati_rasa"];
export const SPREAD = ["belum_ditandai", "di_dalam_garis", "melewati_garis"];
export const LEVELS = ["pantau", "beberapa_hari", "hari_ini", "igd"];
export const EVIDENCE = ["A", "B", "K", "F", "I"];

const bad = (message) => {
  throw new HttpError(422, message);
};

export function text(value, label, { min = 1, max = 60, optional = false } = {}) {
  if (value === undefined || value === null || value === "") {
    if (optional) return optional === true ? "" : optional;
    bad(`${label} wajib diisi.`);
  }
  if (typeof value !== "string") bad(`${label} harus berupa teks.`);
  const v = value.trim();
  if (v.length < min) bad(`${label} wajib diisi.`);
  if (v.length > max) bad(`${label} maksimal ${max} karakter.`);
  return v;
}

export function oneOf(value, list, label, { optional = false } = {}) {
  if ((value === undefined || value === null || value === "") && optional) return null;
  if (!list.includes(value)) bad(`${label} tidak dikenali. Pilih salah satu: ${list.join(", ")}.`);
  return value;
}

export function int(value, label, min, max) {
  if (!Number.isInteger(value) || value < min || value > max) bad(`${label} harus angka ${min} sampai ${max}.`);
  return value;
}

export const flag = (value) => (value ? 1 : 0);

// Daftar nilai unik dari pilihan yang dikenal (untuk isian "boleh lebih dari satu").
export function listOf(value, list, label) {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) bad(`${label} harus berupa daftar.`);
  for (const v of value) if (!list.includes(v)) bad(`${label} tidak dikenali: ${v}. Pilih dari: ${list.join(", ")}.`);
  return [...new Set(value)];
}

// Penilaian yang dihitung klien: hanya level dan id alasan yang disimpan, teksnya ada di konten frontend.
export function assessment(value) {
  if (value === undefined || value === null) return null;
  if (typeof value !== "object") bad("Penilaian harus berupa objek { level, reasons }.");
  const reasons = Array.isArray(value.reasons) ? value.reasons : [];
  if (reasons.length > 20 || reasons.some((r) => typeof r !== "string" || r.length > 40)) bad("Alasan penilaian tidak valid.");
  return { level: oneOf(value.level, LEVELS, "Level penilaian"), reasons };
}

export function healing(value) {
  if (value === undefined || value === null) return null;
  if (typeof value !== "object") bad("Rencana pemulihan harus berupa objek.");
  return {
    rowId: text(value.rowId, "Baris waktu pulih", { max: 40 }),
    checkByDays: int(value.checkByDays, "Batas periksa", 1, 60),
    evidence: oneOf(value.evidence, EVIDENCE, "Label asal data"),
  };
}

export function risk(value) {
  if (value === undefined || value === null) return null;
  if (typeof value !== "object") bad("Faktor risiko harus berupa objek.");
  return { perokok: Boolean(value.perokok), imunLemah: Boolean(value.imunLemah) };
}

export function email(value) {
  const v = text(value, "Email", { max: 254 }).toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(v)) bad("Format email belum benar, contoh: nama@email.com.");
  return v;
}

export function isoDate(value, label) {
  if (value === null) return null;
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) bad(`${label} harus tanggal ISO 8601.`);
  return new Date(value).toISOString();
}
