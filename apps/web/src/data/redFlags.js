// Kondisi yang menghentikan panduan perawatan mandiri dan rekomendasi produk.
// level "darurat" → hubungi 119 sekarang
// level "segera"  → periksakan ke puskesmas/klinik/IGD hari ini
//
// Konten ini panduan pertolongan pertama umum. Wajib ditinjau tenaga
// kesehatan sebelum rilis production.

export const RED_FLAGS = [
  {
    id: "perdarahan",
    level: "darurat",
    title: "Darah tidak berhenti",
    detail: "Sudah ditekan 10 menit tetapi masih mengalir, atau darah memancar.",
    whileWaiting: [
      "Tekan kuat luka dengan kasa atau kain bersih. Jangan diangkat untuk mengintip.",
      "Jika kain sudah basah, tumpuk kain baru di atasnya tanpa melepas yang lama.",
      "Bila memungkinkan, angkat bagian yang terluka lebih tinggi dari jantung.",
    ],
  },
  {
    id: "pingsan",
    level: "darurat",
    title: "Lemas, pucat, pingsan, atau sesak",
    detail: "Kondisi umum korban memburuk setelah cedera.",
    whileWaiting: [
      "Baringkan korban di tempat aman dan longgarkan pakaian yang ketat.",
      "Jangan beri makan atau minum.",
      "Temani korban sampai bantuan datang.",
    ],
  },
  {
    id: "bakar-berat",
    level: "darurat",
    title: "Luka bakar luas, kimia, atau listrik",
    detail:
      "Lebih lebar dari telapak tangan korban, kulit tampak putih atau hangus, atau disebabkan bahan kimia atau listrik.",
    whileWaiting: [
      "Untuk luka bakar listrik, pastikan sumber listrik sudah mati sebelum menyentuh korban.",
      "Aliri luka dengan air mengalir bersuhu biasa. Untuk bahan kimia, bilas dengan air yang banyak.",
      "Tutup longgar dengan plastik wrap bersih atau kain bersih. Jangan oleskan apa pun.",
    ],
  },
  {
    id: "dalam",
    level: "segera",
    title: "Luka dalam atau menganga",
    detail: "Tepi luka terbuka lebar, atau terlihat lemak, otot, atau tulang.",
    whileWaiting: [
      "Tekan dengan kasa atau kain bersih untuk menahan perdarahan.",
      "Tutup luka dan segera ke IGD atau puskesmas. Luka seperti ini mungkin perlu dijahit, dan sebaiknya ditangani secepatnya.",
    ],
  },
  {
    id: "tertancap",
    level: "segera",
    title: "Ada benda tertancap",
    detail: "Pecahan kaca, kayu, logam, atau benda lain masih berada di dalam luka.",
    whileWaiting: [
      "Jangan cabut bendanya. Mencabut bisa memperparah perdarahan.",
      "Tekan di sekitar benda, bukan di atasnya.",
      "Ganjal benda dengan kasa atau kain agar tidak bergerak selama perjalanan.",
    ],
  },
  {
    id: "gigitan",
    level: "segera",
    title: "Gigitan atau cakaran hewan",
    detail: "Anjing, kucing, kera, kelelawar, hewan lain, atau gigitan manusia.",
    whileWaiting: [
      "Segera cuci luka dengan sabun dan air mengalir selama 15 menit.",
      "Pergi ke puskesmas atau rumah sakit hari ini. Petugas akan menilai perlu tidaknya vaksin anti rabies dan perawatan lain.",
    ],
  },
  {
    id: "tusuk",
    level: "segera",
    title: "Tertusuk benda kotor atau berkarat",
    detail: "Misalnya paku, kawat, duri, atau benda tajam yang kotor.",
    whileWaiting: [
      "Bilas luka dengan air bersih mengalir.",
      "Periksakan hari ini. Petugas akan mengecek kebutuhan suntik tetanus.",
    ],
  },
  {
    id: "mati-rasa",
    level: "segera",
    title: "Mati rasa atau sulit digerakkan",
    detail: "Area sekitar luka terasa baal atau kesemutan, atau jari dan sendi tidak bisa digerakkan normal.",
    whileWaiting: [
      "Jangan paksa menggerakkan bagian yang terluka.",
      "Tutup luka dengan kasa bersih dan segera periksakan.",
    ],
  },
  {
    id: "infeksi",
    level: "segera",
    title: "Tanda infeksi",
    detail: "Kemerahan makin melebar, bengkak, terasa panas, bernanah, berbau, atau disertai demam.",
    whileWaiting: [
      "Jangan memencet atau mengorek luka.",
      "Tutup dengan kasa bersih dan periksakan hari ini.",
    ],
  },
];

export const RED_FLAG_BY_ID = Object.fromEntries(RED_FLAGS.map((f) => [f.id, f]));

export const LEVEL_COPY = {
  darurat: {
    heading: "Hubungi 119 sekarang",
    lead: "Kondisi yang Anda pilih membutuhkan pertolongan medis segera. Jangan menunggu untuk merawat sendiri.",
  },
  segera: {
    heading: "Periksakan ke fasilitas kesehatan hari ini",
    lead: "Kondisi ini perlu dilihat langsung oleh tenaga kesehatan di puskesmas, klinik, atau IGD. Panduan perawatan mandiri dan rekomendasi produk kami hentikan dulu.",
  },
};

export function strongestLevel(ids) {
  return ids.some((id) => RED_FLAG_BY_ID[id]?.level === "darurat") ? "darurat" : "segera";
}
