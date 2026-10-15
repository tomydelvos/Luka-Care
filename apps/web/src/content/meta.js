// Metadata tiap blok konten medis (PRD tahap 2, F1).
//
// Setiap blok (langkah, larangan, tanda bahaya, contoh kasus, angka waktu) membawa:
// - sourceIds : id rujukan di sources.js
// - evidence  : asal data, lihat EVIDENCE
// - review    : { status: "draft" | "reviewed", reviewedBy, reviewedAt, inferenceApproved? }
//
// Build production gagal selama masih ada blok yang belum disetujui (lihat review.js).

export const EVIDENCE = {
  A: { label: "Luka akut", detail: "Data luka akut non-bakar: lecet, sayatan, lepuh gesekan." },
  B: { label: "Luka bakar", detail: "Berdasarkan data luka bakar." },
  K: { label: "Luka kronis", detail: "Data luka kronis seperti ulkus tekan atau ulkus kaki." },
  F: { label: "Fase penyembuhan", detail: "Waktu fase penyembuhan umum, tidak khusus satu jenis luka." },
  I: { label: "Inferensi", detail: "Disimpulkan tim, tidak dinyatakan langsung oleh sumber. Wajib disetujui klinisi." },
};

export const DRAFT = Object.freeze({ status: "draft" });

// Tempelkan metadata ke sebuah blok. `fields` tetap utuh agar komponen bisa memakainya seperti biasa.
export const block = (fields, { sources, evidence, review = DRAFT }) => ({
  ...fields,
  sourceIds: sources,
  evidence,
  review,
});

export const isBlock = (value) => Boolean(value && typeof value === "object" && "review" in value && "sourceIds" in value);

// Blok boleh tampil di production bila sudah ditinjau, dan label I sudah disetujui klinisi.
export function isApproved(b) {
  const r = b?.review;
  if (!r || r.status !== "reviewed" || !r.reviewedBy || !r.reviewedAt) return false;
  return b.evidence !== "I" || r.inferenceApproved === true;
}
