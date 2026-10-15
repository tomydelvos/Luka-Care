import { block } from "../meta";

const meta = { sources: ["nhs-burns", "pnpk-burns"], evidence: "B" };

const STEPS = {
  jauhkan: block(
    {
      id: "jauhkan",
      title: "Jauhkan dari sumber panas",
      body: "Matikan kompor atau jauhkan benda panas. Lepas cincin, jam, atau gelang di dekat luka sebelum membengkak. Jangan lepas kain yang menempel di kulit.",
    },
    meta
  ),
  dinginkan: block(
    {
      id: "dinginkan",
      title: "Dinginkan selama 20 menit",
      body: "Aliri dengan air mengalir bersuhu biasa. Jangan pakai es atau air es, karena bisa merusak kulit lebih jauh.",
      timer: 1200,
      tip: "Jaga bagian tubuh lain tetap hangat, terutama pada anak, agar tidak kedinginan.",
    },
    { sources: ["nhs-burns", "griffin-2020", "pnpk-burns"], evidence: "B" }
  ),
  janganOles: block(
    {
      id: "jangan-oles",
      title: "Jangan oles bahan dapur",
      body: "Pasta gigi, mentega, minyak, kecap, atau tepung justru menahan panas dan meningkatkan risiko infeksi.",
    },
    meta
  ),
  lepuh: block(
    {
      id: "lepuh",
      title: "Biarkan lepuh tetap utuh",
      body: "Jangan pecahkan lepuh. Kulitnya melindungi lapisan di bawahnya dari kuman.",
    },
    meta
  ),
  tutup: block(
    {
      id: "tutup",
      title: "Tutup dengan longgar",
      body: "Gunakan kasa steril non-lengket atau plastik wrap bersih. Jangan dililit terlalu kencang.",
    },
    meta
  ),
  nyeri: block(
    {
      id: "nyeri",
      title: "Redakan nyeri bila perlu",
      body: "Pereda nyeri yang dijual bebas dapat digunakan sesuai aturan pakai pada kemasan. Tanyakan apoteker jika ragu, terutama untuk anak.",
      optional: true,
    },
    meta
  ),
};

export const bakar = {
  id: "bakar",
  name: "Luka bakar ringan",
  examples: "Terkena panci, cipratan minyak goreng, setrika, atau air panas",
  defaultTitle: (area) => `Luka bakar di ${area}`,
  blocks: STEPS,
  steps: () => [STEPS.jauhkan, STEPS.dinginkan, STEPS.janganOles, STEPS.lepuh, STEPS.tutup, STEPS.nyeri],
  avoid: block(
    {
      items: ["Mengompres dengan es batu", "Mengoles pasta gigi, mentega, atau kecap", "Memecahkan lepuh"],
    },
    meta
  ),
  productCategories: ["bakar", "kasa", "plester"],
};
