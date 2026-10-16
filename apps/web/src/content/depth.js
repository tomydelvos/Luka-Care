// Pertanyaan kedalaman di langkah 3 panduan (PRD tahap 2, F3, M4).
// - DEPTH_QUESTION: lecet dan sayatan, "dasar putih atau lemak terlihat?" → rujukan Bab 5
// - BURN_QUESTIONS: lepuh, warna dasar, nyeri, luas telapak tangan → perkiraan derajat dari tabel PNPK (Bagian C buku)
// Hasilnya perkiraan dari jawaban pengguna, bukan diagnosis. Disimpan sebagai `depthLayer` dan `burn` (Lampiran C).
import { block } from "./meta";

const burnMeta = { sources: ["pnpk-burns", "statpearls-burn", "aafp-burns-2020"], evidence: "B" };

export const DEPTH_QUESTION = block(
  {
    question: "Dasar luka tampak putih, atau ada butiran kuning seperti lemak?",
    hint: "Lemak tampak seperti butiran kuning di dalam luka. Bandingkan dengan gambar luka robek di bawah ini.",
    image: {
      src: "illustrations/potongan/luka-robek-atas.webp",
      alt: "Contoh luka robek tampak atas: tepi tidak rata dan terbuka, tampak lemak kuning, darah terus keluar.",
    },
    options: [
      { id: "tidak", label: "Tidak, dasarnya merah atau merah muda" },
      { id: "ya", label: "Ya, putih atau tampak lemak" },
    ],
  },
  { sources: ["healthlinkbc-scrape", "nhs-cuts", "healthdirect-wounds"], evidence: "A" }
);

// Warna dasar luka bakar, urut dari paling dangkal. `degree` dan `layer` mengikuti tabel PNPK di Bagian C buku.
// `selfCare: false` berarti tidak untuk dirawat sendiri (Lampiran A).
export const BURN_BASE_COLORS = block(
  {
    question: "Warna dasarnya?",
    hint: "Lihat bagian yang paling parah. Bila ada lepuh, lihat kulit di bawah atau di sekitar lepuh.",
    image: {
      src: "illustrations/potongan/derajat-luka-bakar.webp",
      alt: "Perbandingan derajat luka bakar. Derajat 1: merah, kering, nyeri, tanpa lepuh, pulih 5 sampai 10 hari. Derajat 2: melepuh, basah, sangat nyeri, yang superfisial pulih sekitar 3 minggu. Derajat 3: putih atau hangus, kaku, bisa tidak nyeri, selalu ke rumah sakit.",
    },
    options: [
      { id: "merah", label: "Merah dan kering, tanpa lepuh", description: "Memucat bila ditekan, mirip terbakar matahari", degree: "d1", layer: "epidermis", selfCare: true },
      { id: "merah_muda_pucat", label: "Merah muda pucat dan basah", description: "Biasanya di bawah lepuh, sangat nyeri", degree: "d2s", layer: "dermis_atas", selfCare: true },
      { id: "merah_muda_gelap", label: "Merah muda gelap", description: "Warna lambat kembali setelah ditekan", degree: "d2t", layer: "dermis_tengah", selfCare: false },
      { id: "belang", label: "Belang, merah tua bercak, atau pucat", description: "Lebih kering, nyeri berkurang", degree: "d2d", layer: "dermis_dalam", selfCare: false },
      { id: "putih", label: "Putih seperti lilin", description: "Atau seperti kulit samak, kaku", degree: "d3", layer: "lemak", selfCare: false },
      { id: "hitam", label: "Hitam hangus", degree: "d4", layer: "otot", selfCare: false },
      { id: "tidak_yakin", label: "Tidak yakin", degree: null, layer: "tidak_diketahui", selfCare: true },
    ],
  },
  burnMeta
);

export const BURN_QUESTIONS = {
  blister: block(
    {
      question: "Ada lepuh?",
      options: [
        { id: "tidak", label: "Tidak ada" },
        { id: "ya", label: "Ada lepuh" },
      ],
    },
    burnMeta
  ),
  baseColor: BURN_BASE_COLORS,
  painful: block(
    {
      question: "Masih terasa nyeri?",
      hint: "Luka bakar yang dalam bisa tidak terasa nyeri karena ujung saraf ikut rusak.",
      options: [
        { id: "ya", label: "Ya, nyeri" },
        { id: "tidak", label: "Tidak terasa nyeri" },
      ],
    },
    burnMeta
  ),
  palms: block(
    {
      question: "Seluas berapa telapak tangan korban (termasuk jari)?",
      hint: "Satu telapak tangan korban, termasuk jari, kira-kira sama dengan 1% luas tubuhnya.",
      // `size` diisi agar aturan luas yang sudah ada (SIZE_OPTIONS) tetap berlaku untuk luka bakar.
      options: [
        { id: "koin", label: "Lebih kecil dari koin", size: "kecil" },
        { id: "kurang_1", label: "Lebih kecil dari 1 telapak tangan", size: "sedang" },
        { id: "lebih_1", label: "Lebih dari 1 telapak tangan", size: "besar" },
      ],
    },
    { sources: ["pnpk-burns", "nhs-burns"], evidence: "B" }
  ),
};

// Nama perkiraan derajat untuk ditampilkan di detail luka.
export const BURN_DEGREES = block(
  {
    labels: {
      d1: "Derajat 1",
      d2s: "Derajat 2 superfisial",
      d2t: "Derajat 2 tengah",
      d2d: "Derajat 2 dalam",
      d3: "Derajat 3",
      d4: "Derajat 4",
    },
    note: "Perkiraan dari jawaban Anda di panduan, bukan diagnosis.",
  },
  burnMeta
);

// Lepuh berarti setidaknya derajat 2: jawaban "merah tanpa lepuh" yang disertai lepuh dibaca sebagai derajat 2 superfisial.
export const BLISTER_RULE = block(
  { text: "Luka bakar yang melepuh dibaca setidaknya sebagai derajat 2 superfisial, walaupun warna dasarnya dipilih merah." },
  { sources: ["pnpk-burns", "statpearls-burn"], evidence: "I" }
);

const COLOR_BY_ID = Object.fromEntries(BURN_BASE_COLORS.options.map((o) => [o.id, o]));
export const BURN_PALMS_BY_ID = Object.fromEntries(BURN_QUESTIONS.palms.options.map((o) => [o.id, o]));

// Perkiraan derajat dan lapisan dari jawaban luka bakar.
// `deep`: warna dasar yang tidak untuk dirawat sendiri, atau tidak nyeri (kriteria penerimaan F3).
export function estimateBurn(burn) {
  if (!burn?.baseColor) return { degree: null, layer: "tidak_diketahui", deep: burn?.painful === false };
  let color = COLOR_BY_ID[burn.baseColor];
  if (burn.blister && color.degree === "d1") color = COLOR_BY_ID.merah_muda_pucat;
  return { degree: color.degree, layer: color.layer, deep: !color.selfCare || burn.painful === false };
}

// Lapisan perkiraan untuk disimpan bersama luka (Lampiran A dan C).
export function depthLayerFor(type, details) {
  if ((type === "lecet" || type === "sayatan") && details.deep === "ya") return "lemak";
  switch (type) {
    case "lecet":
      return details.size === "kecil" ? "epidermis" : "dermis_atas";
    case "sayatan":
      return "dermis_atas";
    case "lepuh":
      return "epidermis";
    case "bakar":
      return estimateBurn(details.burn).layer;
    default:
      return "tidak_diketahui";
  }
}
