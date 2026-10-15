import { block } from "../meta";
import { changeDaily, coverStep, washHands } from "./common";

const meta = { sources: ["nhs-cuts", "mayo-cuts", "healthlinkbc-scrape"], evidence: "A" };

const STEPS = {
  tekan: block(
    {
      id: "tekan",
      title: "Hentikan darah",
      body: "Tekan perlahan dengan kasa atau kain bersih sampai darah berhenti. Pada lecet biasanya hanya butuh beberapa menit.",
      timer: 300,
    },
    meta
  ),
  bilas: block(
    {
      id: "bilas",
      title: "Bilas dengan air mengalir",
      body: "Bilas hingga pasir dan kotoran terangkat. Bersihkan kulit di sekitarnya dengan sabun, tetapi usahakan sabun tidak masuk ke luka.",
      tip: "Tidak ada air keran bersih? Air minum kemasan atau air matang yang sudah dingin juga bisa dipakai.",
    },
    meta
  ),
  angkatKotoran: block(
    {
      id: "angkat-kotoran",
      title: "Angkat sisa kotoran",
      body: "Kerikil atau serpihan kecil yang masih menempel bisa diangkat dengan pinset yang sudah dibersihkan alkohol.",
      tip: "Kotoran tertanam dan sulit diangkat? Periksakan ke faskes agar dibersihkan dengan benar.",
    },
    meta
  ),
  keringkan: block(
    {
      id: "keringkan",
      title: "Keringkan sekitar luka",
      body: "Tepuk-tepuk kulit di sekitar luka dengan kasa bersih. Jangan digosok.",
    },
    meta
  ),
  lembap: block(
    {
      id: "lembap",
      title: "Jaga luka tetap lembap",
      body: "Oleskan lapisan tipis petroleum jelly atau salep luka sesuai aturan pakai. Luka yang lembap dan tertutup umumnya pulih lebih nyaman daripada dibiarkan kering terbuka.",
      optional: true,
    },
    { sources: ["mayo-cuts", "healthlinkbc-scrape"], evidence: "A" }
  ),
};

export const lecet = {
  id: "lecet",
  name: "Lecet atau baret",
  examples: "Jatuh dari motor atau sepeda, tergores aspal, lutut terseret",
  defaultTitle: (area) => `Lecet di ${area}`,
  blocks: STEPS,
  steps: (details) => [
    washHands,
    ...(details.condition === "berdarah" ? [STEPS.tekan] : []),
    STEPS.bilas,
    STEPS.angkatKotoran,
    STEPS.keringkan,
    STEPS.lembap,
    coverStep(details),
    changeDaily,
  ],
  avoid: block(
    {
      items: [
        "Menggosok luka dengan kasar",
        "Meniup luka atau menyentuhnya dengan tangan kotor",
        "Mengelupas keropeng yang terbentuk",
      ],
    },
    meta
  ),
  productCategories: ["pembersih", "kasa", "plester", "pelembap", "dressing"],
};
