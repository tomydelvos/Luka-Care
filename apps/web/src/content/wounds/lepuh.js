import { block } from "../meta";

const meta = { sources: ["nhs-blisters", "harvard-blisters"], evidence: "A" };

const STEPS = {
  janganPecah: block(
    {
      id: "jangan-pecah",
      title: "Jangan dipecahkan",
      body: "Kulit lepuh adalah pelindung alami. Lepuh kecil biasanya mengempis sendiri dalam beberapa hari.",
    },
    meta
  ),
  bersihkan: block(
    {
      id: "bersihkan",
      title: "Bersihkan area sekitar",
      body: "Cuci dengan sabun lembut dan air, lalu keringkan dengan menepuk perlahan.",
    },
    meta
  ),
  lindungi: block(
    {
      id: "lindungi",
      title: "Lindungi dari gesekan",
      body: "Tempel plester lepuh hidrokoloid atau plester berbantalan di atas lepuh.",
    },
    meta
  ),
  gantiAlas: block(
    {
      id: "ganti-alas",
      title: "Hilangkan penyebabnya",
      body: "Ganti alas kaki yang menggesek, pakai kaus kaki, dan istirahatkan area tersebut.",
    },
    meta
  ),
  jikaPecah: block(
    {
      id: "jika-pecah",
      title: "Jika lepuh pecah sendiri",
      body: "Jangan kelupas kulit yang tersisa. Bilas dengan air bersih, lalu tutup dengan plester.",
      optional: true,
    },
    meta
  ),
};

export const lepuh = {
  id: "lepuh",
  name: "Lepuh karena gesekan",
  examples: "Sepatu baru, sandal, atau gesekan saat olahraga",
  defaultTitle: (area) => `Lepuh di ${area}`,
  blocks: STEPS,
  steps: () => [STEPS.janganPecah, STEPS.bersihkan, STEPS.lindungi, STEPS.gantiAlas, STEPS.jikaPecah],
  avoid: block(
    { items: ["Menusuk lepuh dengan jarum", "Mengelupas kulit lepuh", "Terus memakai alas kaki yang sama"] },
    meta
  ),
  productCategories: ["dressing", "plester", "pembersih"],
};
