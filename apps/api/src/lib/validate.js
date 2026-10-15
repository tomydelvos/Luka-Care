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
