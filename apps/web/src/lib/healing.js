// Rencana pemulihan satu luka: baris Lampiran A, batas periksa, batas 4 minggu, lihat ulang luka bakar,
// kelompok berisiko, dan fase penyembuhan hari ini (PRD tahap 2, F6). Fungsi murni; `now` bisa diisi untuk test.
import { FOUR_WEEKS, HEALING_PHASES, HEALING_ROWS as ROWS } from "../content/healing";
import { dayNumber } from "./format";

const ROW_BY_ID = Object.fromEntries(Object.values(ROWS).map((r) => [r.id, r]));

// Baris Lampiran A untuk luka ini. `wound.burn.degree` berasal dari estimateBurn (content/depth.js).
export function healingRowFor(wound) {
  if (wound.healing?.rowId && ROW_BY_ID[wound.healing.rowId]) return ROW_BY_ID[wound.healing.rowId];
  switch (wound.type) {
    case "lecet":
      return wound.size === "sedang" || wound.size === "besar" ? ROWS.lecetLebar : ROWS.lecetRingan;
    case "sayatan":
      return ROWS.sayatan;
    case "lepuh":
      return ROWS.lepuh;
    case "bakar":
      if (wound.burn?.degree === "d1") return ROWS.bakarDerajat1;
      if (wound.burn?.degree === "d2s") return ROWS.bakarDerajat2;
      return ROWS.bakarBelumDiketahui;
    default:
      return null;
  }
}

// Ringkasan yang disimpan bersama luka saat dibuat (Lampiran C: healing, contentVersion).
export const CONTENT_VERSION = "2026-10";
export function healingSnapshot(wound) {
  const row = healingRowFor(wound);
  return row ? { rowId: row.id, checkByDays: row.checkByDays, evidence: row.evidence } : null;
}

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const addDays = (d, n) => {
  const x = startOfDay(d);
  x.setDate(x.getDate() + n);
  return x;
};

export const isAtRisk = (wound) =>
  Boolean(wound.diabetes || wound.who === "lansia" || wound.risk?.perokok || wound.risk?.imunLemah);

export function healingPlan(wound, now = new Date()) {
  const row = healingRowFor(wound);
  const day = dayNumber(wound.createdAt, now);
  const checkBy = row ? addDays(wound.createdAt, row.checkByDays) : null;
  const fourWeeks = addDays(wound.createdAt, FOUR_WEEKS.days);
  const phases = HEALING_PHASES.items;
  const phase = [...phases].reverse().find((p) => day >= p.from && (p.to === null || day <= p.to)) ?? phases[0];
  return {
    row,
    day,
    checkBy,
    overdue: Boolean(checkBy && now >= checkBy),
    fourWeeks,
    fourWeeksPassed: now >= fourWeeks,
    recheckDue: Boolean(row?.recheckDays?.includes(day)),
    atRisk: isAtRisk(wound),
    phase,
  };
}
