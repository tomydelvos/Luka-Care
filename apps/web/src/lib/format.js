const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export const formatRupiah = (n) => rupiah.format(n).replace(/\u00a0/g, " ");

const dateFmt = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" });
const shortFmt = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" });
const timeFmt = new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" });

export const formatDate = (iso) => dateFmt.format(new Date(iso));
export const formatShortDate = (iso) => shortFmt.format(new Date(iso));
export const formatTime = (iso) => timeFmt.format(new Date(iso)).replace(".", ":");

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

export function dayNumber(startIso, now = new Date()) {
  const diff = startOfDay(now) - startOfDay(startIso);
  return Math.floor(diff / 86400000) + 1;
}

export function isToday(iso, now = new Date()) {
  return startOfDay(iso).getTime() === startOfDay(now).getTime();
}

export function relativeDay(iso, now = new Date()) {
  const n = dayNumber(iso, now) - 1;
  if (n === 0) return "Hari ini";
  if (n === 1) return "Kemarin";
  return `${n} hari lalu`;
}

export function greeting(now = new Date()) {
  const h = now.getHours();
  if (h < 11) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  if (h < 18) return "Selamat sore";
  return "Selamat malam";
}

export function formatDuration(totalSeconds) {
  const s = Math.max(0, Math.ceil(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export const uid = (prefix = "id") =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
