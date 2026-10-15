import { block } from "../meta";

// Langkah yang dipakai lebih dari satu jenis luka.
const care = { sources: ["mayo-cuts", "nhs-cuts", "medlineplus-wound"], evidence: "A" };

export const washHands = block(
  {
    id: "cuci-tangan",
    title: "Cuci tangan",
    body: "Cuci tangan dengan sabun dan air mengalir sebelum menyentuh luka. Pakai sarung tangan sekali pakai jika ada.",
  },
  care
);

export const changeDaily = block(
  {
    id: "ganti",
    title: "Ganti penutup setiap hari",
    body: "Ganti sekali sehari, atau lebih cepat jika basah atau kotor. Saat mengganti, perhatikan apakah kemerahan melebar, bengkak, atau bernanah.",
  },
  care
);

export const coverWet = block(
  {
    id: "tutup",
    title: "Tutup luka",
    body: "Pakai kasa atau dressing yang menyerap cairan, lalu rekatkan dengan plester. Luka basah perlu penutup yang lebih sering diganti.",
  },
  care
);

export const coverDry = block(
  {
    id: "tutup",
    title: "Tutup luka",
    body: "Tutup dengan plester atau kasa non-lengket agar terlindung dari gesekan dan kotoran.",
  },
  care
);

export const coverStep = (details) => (details.condition === "basah" ? coverWet : coverDry);
