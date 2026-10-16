// Penilaian detail luka di langkah 3 panduan.
// - escalations: alasan menghentikan perawatan mandiri (tampilan rujukan)
// - cautions: catatan tambahan, panduan tetap ditampilkan
// Bukan diagnosis: hanya mencocokkan isian pengguna dengan aturan umum.
import { block } from "./meta";
import { RED_FLAG_BY_ID } from "./redFlags";
import { estimateBurn } from "./depth";

const cool = "Aliri dengan air mengalir bersuhu biasa selama 20 menit.";
const looseCover = "Tutup longgar dengan kasa non-lengket atau plastik wrap bersih, lalu berangkat.";
const burnMeta = { sources: ["nhs-burns", "pnpk-burns"], evidence: "B" };

export const ESCALATIONS = {
  bakarSensitif: block(
    {
      id: "bakar-sensitif",
      level: "segera",
      title: "Luka bakar di wajah atau area kelamin",
      detail: "Area ini sensitif dan perlu diperiksa tenaga kesehatan meskipun lukanya kecil.",
      whileWaiting: [cool, looseCover],
    },
    burnMeta
  ),
  bakarBayi: block(
    {
      id: "bakar-bayi",
      level: "segera",
      title: "Luka bakar pada bayi",
      detail: "Kulit bayi lebih tipis, sehingga luka bakar kecil pun bisa lebih dalam dari kelihatannya.",
      whileWaiting: [cool, "Jaga tubuh bayi tetap hangat selama mendinginkan luka.", looseCover],
    },
    burnMeta
  ),
  bakarDalam: block(
    {
      id: "bakar-dalam",
      level: "segera",
      title: "Luka bakar yang mungkin dalam",
      detail:
        "Berdasarkan jawaban Anda, kulit mungkin rusak sampai lapisan dalam: dasarnya merah muda gelap atau belang, atau tidak terasa nyeri. Luka seperti ini perlu ditangani tenaga kesehatan, berapa pun luasnya.",
      whileWaiting: [cool, looseCover],
    },
    { sources: ["pnpk-burns", "statpearls-burn", "aafp-burns-2020"], evidence: "B" }
  ),
  diabetesKaki: block(
    {
      id: "diabetes-kaki",
      level: "segera",
      title: "Luka di kaki pada penderita diabetes",
      detail: "Luka kaki pada diabetes lebih mudah infeksi dan lambat sembuh. Sebaiknya diperiksa sejak awal, meskipun kecil.",
      whileWaiting: [
        "Bilas dengan air bersih mengalir dan tutup dengan kasa bersih.",
        "Kurangi menapak atau menekan bagian yang luka.",
      ],
    },
    { sources: ["medlineplus-wound"], evidence: "A" }
  ),
};

export const CAUTIONS = {
  bakarTanganKaki: block(
    {
      id: "bakar-tangan-kaki",
      text: "Luka bakar di tangan atau kaki yang melepuh sebaiknya diperiksakan, karena area ini sering bergerak dan mudah terinfeksi.",
    },
    burnMeta
  ),
  bakarAnakLansia: block(
    { id: "bakar-anak-lansia", text: "Pada anak dan lansia, periksakan jika luka melepuh atau nyeri tidak mereda." },
    burnMeta
  ),
  bakarBelumYakin: block(
    {
      id: "bakar-belum-yakin",
      text: "Warna dasar belum diketahui. Lihat lagi pada hari ke-2–3, karena luka bakar bisa bertambah dalam. Jika bagian tengahnya putih, belang, atau tidak terasa nyeri, periksakan.",
    },
    { sources: ["pnpk-burns", "aafp-burns-2020", "hyland-2013"], evidence: "B" }
  ),
  diabetes: block(
    {
      id: "diabetes",
      text: "Pada penderita diabetes, luka cenderung lebih lambat pulih. Catat kondisinya setiap hari dan periksakan bila tidak membaik.",
    },
    { sources: ["medlineplus-wound"], evidence: "A" }
  ),
  besar: block(
    {
      id: "besar",
      text: "Luka yang lebih lebar dari telapak tangan sebaiknya diperiksa tenaga kesehatan, terutama jika kotor atau sulit dibersihkan.",
    },
    { sources: ["nhs-cuts"], evidence: "A" }
  ),
  sayatanWajah: block(
    {
      id: "sayatan-wajah",
      text: "Sayatan di wajah sebaiknya diperiksakan. Jika perlu dijahit, hasilnya lebih rapi bila ditangani lebih awal.",
    },
    { sources: ["aafp-laceration-2008"], evidence: "A" }
  ),
  lecetWajah: block(
    {
      id: "lecet-wajah",
      text: "Hati-hati membersihkan luka di dekat mata. Jangan biarkan sabun atau salep masuk ke mata.",
    },
    { sources: ["mayo-cuts"], evidence: "A" }
  ),
};

export function assessDetails(type, details) {
  const escalations = [];
  const cautions = [];
  const { who, area, size, diabetes, deep, burn } = details;

  // Lecet atau sayatan dengan dasar putih atau lemak terlihat: rujukan Bab 5 (luka dalam).
  if ((type === "lecet" || type === "sayatan") && deep === "ya") escalations.push(RED_FLAG_BY_ID.dalam);

  if (type === "bakar") {
    const estimate = estimateBurn(burn);
    // Putih atau hangus sama dengan tanda bahaya luka bakar berat; luas lebih dari telapak tangan juga.
    const severe = size === "besar" || burn?.baseColor === "putih" || burn?.baseColor === "hitam";
    if (severe) escalations.push(RED_FLAG_BY_ID["bakar-berat"]);
    else if (estimate.deep) escalations.push(ESCALATIONS.bakarDalam);
    if (burn?.baseColor === "tidak_yakin" && !estimate.deep) cautions.push(CAUTIONS.bakarBelumYakin);
    if (area === "wajah" || area === "kelamin") escalations.push(ESCALATIONS.bakarSensitif);
    if (who === "bayi") escalations.push(ESCALATIONS.bakarBayi);
    if (area === "tangan" || area === "kaki") cautions.push(CAUTIONS.bakarTanganKaki);
    if (who === "anak" || who === "lansia") cautions.push(CAUTIONS.bakarAnakLansia);
  }

  if (diabetes && area === "kaki") escalations.push(ESCALATIONS.diabetesKaki);
  else if (diabetes) cautions.push(CAUTIONS.diabetes);

  if (size === "besar" && type !== "bakar") cautions.push(CAUTIONS.besar);
  if (type === "sayatan" && area === "wajah") cautions.push(CAUTIONS.sayatanWajah);
  if (area === "wajah" && type === "lecet") cautions.push(CAUTIONS.lecetWajah);

  return { escalations, cautions };
}
