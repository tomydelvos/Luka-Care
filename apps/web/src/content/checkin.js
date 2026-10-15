// Catatan harian versi 2 (PRD tahap 2, F4 dan F5): pilihan isian, alasan penilaian, dan arti tiap level.
// Aturan pencocokannya ada di src/lib/checkin.js (assessCheckin). Konten medis: wajib ditinjau klinisi.
import { block } from "./meta";

const infection = { sources: ["iwii-2022", "medlineplus-wound", "nhs-forth-valley", "nice-ng141"], evidence: "A" };
const skinTone = { sources: ["wi-skintones-2023", "nice-ng141", "hee-cellulitis"], evidence: "K" };
const bed = { sources: ["gray-2006", "iwii-2022", "oxford-hypergranulation"], evidence: "K" };

/* ---------- Pilihan isian ---------- */

// Warna dasar luka (boleh lebih dari satu). Gambar dari tools/illustrations (npm run crops).
export const BED_COLOR_OPTIONS = block(
  {
    items: [
      { id: "merah_muda", label: "Merah muda", hint: "Kulit baru tumbuh dari tepi", swatch: "illustrations/warna/merah-muda.webp" },
      { id: "merah", label: "Merah segar", hint: "Dasar luka sedang terisi", swatch: "illustrations/warna/merah.webp" },
      { id: "keropeng", label: "Keropeng tipis", hint: "Darah kering merah tua sampai cokelat" },
      { id: "kuning", label: "Kuning menempel", hint: "Lengket di dasar luka", swatch: "illustrations/warna/kuning.webp" },
      { id: "hitam", label: "Hitam keras", hint: "Tebal, keras, dan kering", swatch: "illustrations/warna/hitam.webp" },
      { id: "merah_rapuh", label: "Merah pucat atau rapuh", hint: "Mudah berdarah, atau jaringan merah menonjol" },
    ],
    rule: "**Warna terburuk menentukan.** Luka yang masih punya bagian hitam atau kuning belum masuk tahap membaik, walaupun sebagian besar dasarnya sudah merah.",
  },
  bed
);

export const FLUID_OPTIONS_V2 = block(
  {
    items: [
      { id: "tidak", label: "Tidak ada" },
      { id: "bening_tipis", label: "Bening, sedikit" },
      { id: "kuning_tipis", label: "Kuning tipis", hint: "Masih wajar bila sedikit" },
      { id: "kental_keruh", label: "Kental atau keruh" },
      { id: "kehijauan", label: "Kehijauan" },
    ],
    note: "Sedikit cairan bening kekuningan masih wajar. Kuning menjadi tanda bahaya bila kental, keruh, banyak, berbau, atau muncul bersama nyeri dan bengkak yang bertambah.",
  },
  infection
);

// Kulit di sekitar luka dibanding sisi tubuh lainnya. Sengaja tidak bertumpu pada "kemerahan" saja.
export const SKIN_OPTIONS = block(
  {
    items: [
      { id: "lebih_hangat", label: "Lebih hangat" },
      { id: "tegang_mengilap", label: "Tegang atau mengilap" },
      { id: "keras", label: "Lebih keras" },
      { id: "lebih_gelap", label: "Lebih gelap, keunguan, atau merah" },
      { id: "garis_menjalar", label: "Ada garis menjalar dari luka" },
      { id: "menghitam", label: "Menghitam atau keabuan" },
      { id: "melepuh", label: "Melepuh" },
      { id: "mati_rasa", label: "Mati rasa" },
    ],
    hint: "Raba dengan punggung tangan dan bandingkan dengan bagian yang sama di sisi tubuh sebelahnya. Lihat di bawah cahaya alami.",
  },
  skinTone
);

export const SPREAD_OPTIONS = block(
  {
    items: [
      { id: "belum_ditandai", label: "Belum ditandai" },
      { id: "di_dalam_garis", label: "Masih di dalam garis" },
      { id: "melewati_garis", label: "Meluas melewati garis" },
    ],
    howTo: "Tandai batas area yang berubah dengan pulpen dan tulis tanggalnya. Yang dinilai adalah apakah area itu meluas, bukan warnanya.",
  },
  skinTone
);

export const FEVER_HINT = block({ text: "Suhu 37,7 °C atau lebih, menggigil, atau badan sangat lemas" }, infection);

// Ditanyakan hanya untuk luka bakar pada hari ke-2–3 (kedalaman bisa bertambah).
export const BURN_RECHECK = block(
  {
    question: "Dibanding kemarin, luka tampak lebih pucat, belang, atau nyerinya justru berkurang?",
    note: "Luka bakar bisa bertambah dalam selama 24–72 jam pertama. Nyeri yang berkurang adalah tanda bahaya, bukan tanda membaik.",
  },
  { sources: ["aafp-burns-2020", "pnpk-burns"], evidence: "B" }
);

/* ---------- Level penilaian ---------- */

export const LEVELS = {
  igd: block(
    { rank: 3, label: "Ke IGD sekarang", title: "Tanda ini perlu ditangani di IGD sekarang", tone: "alert" },
    { sources: ["medlineplus-wound", "iwii-2022", "kemenkes-119"], evidence: "A" }
  ),
  hari_ini: block(
    { rank: 2, label: "Periksakan hari ini", title: "Tanda ini perlu diperiksakan hari ini", tone: "alert" },
    infection
  ),
  beberapa_hari: block(
    { rank: 1, label: "Periksakan dalam beberapa hari", title: "Periksakan ke puskesmas atau klinik dalam beberapa hari", tone: "caution" },
    { sources: ["medlineplus-wound", "healthdirect-chronic", "oxford-hypergranulation"], evidence: "I" }
  ),
  pantau: block(
    { rank: 0, label: "Lanjutkan pantau", title: "Belum ada tanda yang perlu diperiksakan", tone: "pine" },
    { sources: ["medlineplus-wound"], evidence: "A" }
  ),
};

/* ---------- Alasan (Lampiran B) ---------- */
// Kalimat selalu menyebut tanda yang dicatat, bukan diagnosis.

export const REASONS = {
  demamInfeksi: block(
    { id: "demam-infeksi", level: "igd", text: "Demam, menggigil, atau badan sangat lemas bersama tanda di sekitar luka" },
    { ...infection, sources: ["iwii-2022", "medlineplus-wound", "hee-cellulitis"] }
  ),
  kulitBahaya: block(
    { id: "kulit-bahaya", level: "igd", text: "Kulit di sekitar luka menghitam, keabuan, melepuh, atau mati rasa" },
    { ...infection, sources: ["iwii-2022", "nhs-forth-valley"] }
  ),
  meluasDemam: block(
    { id: "meluas-demam", level: "igd", text: "Perubahan kulit meluas melewati garis pulpen disertai demam" },
    { ...infection, sources: ["iwii-2022", "nice-ng141", "hee-cellulitis"] }
  ),
  meluas: block(
    { id: "meluas", level: "hari_ini", text: "Perubahan kulit meluas melewati garis pulpen" },
    { ...infection, sources: ["nice-ng141", "hee-cellulitis", "iwii-2022"] }
  ),
  garisMenjalar: block({ id: "garis-menjalar", level: "hari_ini", text: "Ada garis yang menjalar menjauhi luka" }, infection),
  cairan: block({ id: "cairan", level: "hari_ini", text: "Cairan kental, keruh, atau kehijauan" }, { ...infection, sources: ["nhs-forth-valley", "medlineplus-wound"] }),
  bau: block({ id: "bau", level: "hari_ini", text: "Bau yang baru muncul dari luka" }, { ...infection, sources: ["nhs-forth-valley", "iwii-2022"] }),
  hangat: block(
    { id: "hangat", level: "hari_ini", text: "Kulit lebih hangat dan tegang atau keras, dengan nyeri yang bertambah" },
    { ...skinTone, evidence: "K" }
  ),
  nyeriNaik: block(
    { id: "nyeri-naik", level: "hari_ini", text: "Nyeri naik 3 poin atau lebih dibanding catatan sebelumnya" },
    { sources: ["medlineplus-wound"], evidence: "I" }
  ),
  demam: block(
    { id: "demam", level: "hari_ini", text: "Demam, menggigil, atau badan sangat lemas" },
    { sources: ["medlineplus-wound", "iwii-2022"], evidence: "I" }
  ),
  bakarMemburuk: block(
    { id: "bakar-memburuk", level: "hari_ini", text: "Luka bakar tampak lebih pucat atau belang, atau nyerinya justru berkurang" },
    { sources: ["aafp-burns-2020", "pnpk-burns"], evidence: "B" }
  ),
  hitamBaru: block({ id: "hitam-baru", level: "beberapa_hari", text: "Bagian hitam baru muncul di dasar luka" }, { ...bed, evidence: "I" }),
  kuningBerulang: block(
    { id: "kuning-berulang", level: "beberapa_hari", text: "Lapisan kuning menempel terus muncul kembali" },
    { ...bed, evidence: "I" }
  ),
  dasarRapuh: block(
    { id: "dasar-rapuh", level: "beberapa_hari", text: "Dasar luka merah pucat atau gelap dan mudah berdarah, atau jaringan merah menonjol" },
    { ...bed, evidence: "I" }
  ),
  lewatBatas: block(
    { id: "lewat-batas", level: "beberapa_hari", text: "Sudah lewat batas periksa dan catatan terakhir belum menunjukkan luka menutup" },
    { sources: ["healthlinkbc-scrape", "cleveland-abrasion", "papini-2004"], evidence: "I" }
  ),
  empatMinggu: block(
    { id: "empat-minggu", level: "beberapa_hari", text: "Luka masih terbuka setelah 4 minggu dan perlu perawatan profesional" },
    { sources: ["healthdirect-chronic"], evidence: "F" }
  ),
};
