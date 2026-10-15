// Perkiraan waktu pulih dan batas periksa (PRD tahap 2, F6 dan Lampiran A).
// Angka ditampilkan sebagai batas periksa, bukan janji tanggal sembuh. Konten medis: wajib ditinjau klinisi.
// Pemilihan baris dari data luka ada di src/lib/healing.js.
import { block } from "./meta";

const BURN_RECHECK_DAYS = [2, 3];

export const HEALING_ROWS = {
  lecetRingan: block(
    { id: "lecet-ringan", layer: "epidermis", label: "Lecet ringan", estimate: "Biasanya 3–7 hari", checkByDays: 7 },
    { sources: ["healthlinkbc-scrape", "cleveland-abrasion"], evidence: "A" }
  ),
  lecetLebar: block(
    { id: "lecet-lebar", layer: "dermis_atas", label: "Lecet lebar atau dalam", estimate: "Biasanya 1–2 minggu atau lebih", checkByDays: 14 },
    { sources: ["healthlinkbc-scrape"], evidence: "A" }
  ),
  sayatan: block(
    {
      id: "sayatan",
      layer: "dermis_atas",
      label: "Sayatan kecil bertepi rapat",
      estimate: "Permukaan menutup sekitar 48 jam; bagian dalam terus pulih sampai sekitar 3 minggu",
      checkByDays: 7,
    },
    { sources: ["aafp-laceration-2008", "statpearls-fase"], evidence: "I" }
  ),
  bakarDerajat1: block(
    {
      id: "bakar-derajat-1",
      layer: "epidermis",
      label: "Luka bakar derajat 1",
      estimate: "Sekitar 1 minggu (3–10 hari)",
      checkByDays: 10,
      recheckDays: BURN_RECHECK_DAYS,
    },
    { sources: ["pnpk-burns", "statpearls-burn-class"], evidence: "B" }
  ),
  bakarDerajat2: block(
    {
      id: "bakar-derajat-2",
      layer: "dermis_atas",
      label: "Luka bakar derajat 2 superfisial",
      estimate: "Biasanya paling lama 2 minggu, sampai sekitar 3 minggu",
      checkByDays: 14,
      recheckDays: BURN_RECHECK_DAYS,
    },
    { sources: ["pnpk-burns", "papini-2004", "chop-burn2"], evidence: "B" }
  ),
  // Tahap 1 belum menanyakan derajat luka bakar (pertanyaan kedalaman masuk M4).
  // Sampai saat itu dipakai batas periksa yang lebih awal di antara derajat 1 dan 2 superfisial.
  bakarBelumDiketahui: block(
    {
      id: "bakar-belum-diketahui",
      layer: "tidak_diketahui",
      label: "Luka bakar ringan",
      estimate: "Derajat 1 sekitar 1 minggu; derajat 2 superfisial biasanya paling lama 2 minggu, sampai sekitar 3 minggu",
      checkByDays: 10,
      recheckDays: BURN_RECHECK_DAYS,
      note: "Derajatnya belum dicatat, jadi batas periksa memakai yang lebih awal.",
    },
    { sources: ["pnpk-burns", "papini-2004"], evidence: "I" }
  ),
  lepuh: block(
    {
      id: "lepuh",
      layer: "bawah_epidermis",
      label: "Lepuh gesekan",
      estimate: "Beberapa hari sampai sekitar 1 minggu; 2 minggu atau lebih bila terus tergesek",
      checkByDays: 14,
    },
    { sources: ["nhs-blisters", "harvard-blisters"], evidence: "I" }
  ),
};

export const FOUR_WEEKS = block(
  { days: 28, text: "Luka apa pun yang masih terbuka setelah 4 minggu perlu perawatan profesional." },
  { sources: ["healthdirect-chronic"], evidence: "F" }
);

export const RISK_GROUP = block(
  {
    title: "Periksakan lebih awal",
    text: "Penderita diabetes, lansia, perokok, dan orang dengan gizi kurang atau daya tahan tubuh rendah sembuh lebih lambat. Periksakan lebih awal.",
  },
  { sources: ["medlineplus-wound", "statpearls-fase"], evidence: "F" }
);

export const EVIDENCE_NOTE = {
  B: "Berdasarkan data luka bakar",
};

// "Perjalanan luka yang sembuh normal" (Bagian C buku). Hari dihitung dari hari luka (hari ke-1 = hari kejadian).
export const HEALING_PHASES = block(
  {
    items: [
      { id: "beku", from: 1, to: 1, when: "Beberapa menit", text: "Darah membeku, lalu mengering menjadi keropeng pelindung" },
      {
        id: "radang",
        from: 1,
        to: 5,
        when: "Hari 0 sampai sekitar hari ke-5",
        text: "Sedikit bengkak, tepi luka merah atau lebih gelap, nyeri saat disentuh, keluar cairan bening. Rembesan lecet biasanya berhenti dalam 4 hari.",
      },
      {
        id: "tumbuh",
        from: 2,
        to: 21,
        when: "Hari ke-2–7 sampai sekitar 3 minggu",
        text: "Dasar luka merah berbintik, kulit baru tumbuh dari tepi, luka terasa gatal",
      },
      {
        id: "matang",
        from: 22,
        to: null,
        when: "3 minggu sampai 1–2 tahun",
        text: "Bekas luka berubah dari merah dan tebal menjadi pucat dan tipis. Kekuatannya hanya sekitar 80% kulit asli.",
      },
    ],
  },
  { sources: ["statpearls-fase", "medlineplus-wound", "kemenkes-fase"], evidence: "F" }
);
