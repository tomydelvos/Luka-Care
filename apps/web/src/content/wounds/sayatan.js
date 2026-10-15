import { block } from "../meta";
import { changeDaily, washHands } from "./common";

const meta = { sources: ["nhs-cuts", "mayo-cuts", "healthdirect-wounds"], evidence: "A" };

const STEPS = {
  tekan: block(
    {
      id: "tekan",
      title: "Tekan selama 10 menit",
      body: "Tekan luka dengan kasa atau kain bersih secara terus-menerus. Jangan diangkat untuk mengintip. Bila bisa, angkat bagian yang luka lebih tinggi dari jantung.",
      timer: 600,
      check: { question: "Setelah 10 menit, darah masih mengalir?", escalateTo: "perdarahan" },
    },
    meta
  ),
  bilas: block(
    {
      id: "bilas",
      title: "Bilas dengan air mengalir",
      body: "Setelah darah berhenti, bilas luka dengan air bersih mengalir beberapa saat.",
    },
    meta
  ),
  cekTepi: block(
    {
      id: "cek-tepi",
      title: "Periksa tepi luka",
      body: "Sayatan kecil biasanya menutup rapat dengan sendirinya. Luka yang dalam atau tepinya terbuka lebar mungkin perlu dijahit.",
      check: { question: "Tepi luka terbuka lebar atau lukanya dalam?", escalateTo: "dalam" },
    },
    { sources: ["nhs-cuts", "healthdirect-wounds", "aafp-laceration-2008"], evidence: "A" }
  ),
  keringkan: block(
    {
      id: "keringkan",
      title: "Keringkan sekitar luka",
      body: "Tepuk perlahan kulit di sekitar luka dengan kasa bersih.",
    },
    meta
  ),
  tutup: block(
    {
      id: "tutup",
      title: "Tutup luka",
      body: "Tutup dengan plester atau kasa steril. Untuk sayatan di jari, pilih plester yang lentur agar tidak mudah lepas.",
    },
    meta
  ),
};

export const sayatan = {
  id: "sayatan",
  name: "Sayatan kecil",
  examples: "Teriris pisau dapur, tergores kertas atau kaleng",
  defaultTitle: (area) => `Sayatan di ${area}`,
  blocks: STEPS,
  steps: () => [washHands, STEPS.tekan, STEPS.bilas, STEPS.cekTepi, STEPS.keringkan, STEPS.tutup, changeDaily],
  avoid: block(
    {
      items: [
        "Mengangkat kasa berulang kali saat menekan",
        "Menuang alkohol langsung ke dalam luka",
        "Menutup luka yang masih berdarah deras",
      ],
    },
    meta
  ),
  productCategories: ["kasa", "plester", "pembersih", "p3k"],
};
