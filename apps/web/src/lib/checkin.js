// Membaca catatan harian dan mengembalikan tanda yang perlu diperiksakan.
// Bukan diagnosis: hanya mencocokkan isian dengan daftar tanda bahaya umum.
export function checkinWarnings(checkin, previous) {
  if (!checkin) return [];
  const out = [];
  if (checkin.redness === "meluas") out.push("Kemerahan makin melebar");
  if (checkin.fluid === "nanah") out.push("Keluar cairan keruh atau nanah");
  if (checkin.fever) out.push("Demam");
  if (checkin.swelling && previous && checkin.pain > previous.pain) out.push("Bengkak disertai nyeri yang bertambah");
  if (previous && checkin.pain - previous.pain >= 3) out.push("Nyeri naik tajam dibanding catatan sebelumnya");
  return out;
}

export function latestWarnings(wound) {
  const list = wound?.checkins ?? [];
  if (!list.length) return [];
  return checkinWarnings(list[list.length - 1], list[list.length - 2]);
}
