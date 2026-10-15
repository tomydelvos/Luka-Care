// Teks medis di catatan harian: ambang demam dan tanda yang perlu diperiksakan.
// Aturan pencocokannya ada di src/lib/checkin.js.
import { block } from "./meta";

const meta = { sources: ["kemenkes-infeksi", "medlineplus-wound"], evidence: "A" };

export const FEVER_HINT = block({ text: "Suhu tubuh 38°C atau lebih" }, meta);

export const CHECKIN_WARNINGS = {
  redness: block({ text: "Kemerahan makin melebar" }, meta),
  pus: block({ text: "Keluar cairan keruh atau nanah" }, meta),
  fever: block({ text: "Demam" }, meta),
  swellingPain: block({ text: "Bengkak disertai nyeri yang bertambah" }, meta),
  painJump: block({ text: "Nyeri naik tajam dibanding catatan sebelumnya" }, { ...meta, evidence: "I" }),
};
