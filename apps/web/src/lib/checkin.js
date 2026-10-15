import { CHECKIN_WARNINGS as W } from "../content/checkin";

// Membaca catatan harian dan mengembalikan tanda yang perlu diperiksakan.
// Bukan diagnosis: hanya mencocokkan isian dengan daftar tanda bahaya umum.
export function checkinWarnings(checkin, previous) {
  if (!checkin) return [];
  const out = [];
  if (checkin.redness === "meluas") out.push(W.redness.text);
  if (checkin.fluid === "nanah") out.push(W.pus.text);
  if (checkin.fever) out.push(W.fever.text);
  if (checkin.swelling && previous && checkin.pain > previous.pain) out.push(W.swellingPain.text);
  if (previous && checkin.pain - previous.pain >= 3) out.push(W.painJump.text);
  return out;
}

export function latestWarnings(wound) {
  const list = wound?.checkins ?? [];
  if (!list.length) return [];
  return checkinWarnings(list[list.length - 1], list[list.length - 2]);
}
