// Potongan ilustrasi untuk layar ponsel (PRD tahap 2, F9). Jalankan setelah `npm run render`.
//
//   npm run crops
//
// - potongan/<nama>-atas.webp      : panel "Tampak atas" tiap ilustrasi luka
// - potongan/<nama>-penampang.webp : panel "Penampang kulit" beserta label lapisan
// - warna/<warna>.webp             : swatch per warna dasar luka dan tanda bahaya (untuk catatan harian v2)
//
// Semua ilustrasi luka memakai tata letak yang sama (2400 × 1380 px), begitu pula
// warna-dasar-luka.png (kotak di koordinat tetap, lihat src/figures2.mjs), jadi kotak potongnya tetap.
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(here, "../../apps/web/public/illustrations");

const WOUNDS = [
  "luka-lecet",
  "luka-sayatan",
  "luka-bakar-ringan",
  "luka-lepuh",
  "luka-robek",
  "luka-tusuk",
  "luka-benda-tertancap",
  "luka-gigitan-cakaran",
  "luka-bakar-berat",
  "luka-terinfeksi",
];

const PANELS = {
  atas: { box: { left: 120, top: 140, width: 1040, height: 1000 }, width: 720 },
  penampang: { box: { left: 1230, top: 180, width: 1110, height: 950 }, width: 760 },
};

// Kotak warna di warna-dasar-luka.png: x = (60 + i × 275) × 2, y = 74 × 2, ukuran 255 × 170 (×2).
const STAGES = ["hitam", "kuning", "merah", "merah-muda"].map((name, i) => [
  name,
  { left: 120 + i * 550, top: 148, width: 510, height: 340 },
]);
// Baris "Bukan tahap, tetapi tanda bahaya": kotak 300 × 300 px, berjarak 732 px.
const DANGERS = ["tanda-cairan-hijau", "tanda-kemerahan-meluas", "tanda-kulit-gelap"].map((name, i) => [
  name,
  { left: 120 + i * 732, top: 1004, width: 300, height: 300 },
]);

const only = process.argv[2];
const save = async (input, box, width, file) => {
  const info = await sharp(input).extract(box).resize({ width }).webp({ quality: 80, effort: 6 }).toFile(file);
  console.log(`${path.relative(SRC, file)}  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(1)} KB`);
};

await mkdir(path.join(SRC, "potongan"), { recursive: true });
await mkdir(path.join(SRC, "warna"), { recursive: true });

for (const name of WOUNDS) {
  if (only && !name.includes(only)) continue;
  for (const [panel, { box, width }] of Object.entries(PANELS)) {
    await save(path.join(SRC, `${name}.png`), box, width, path.join(SRC, "potongan", `${name}-${panel}.webp`));
  }
}
// Perbandingan derajat luka bakar, utuh, sebagai gambar contoh di pertanyaan luka bakar panduan (M4).
if (!only || "derajat".includes(only)) {
  const info = await sharp(path.join(SRC, "derajat-luka-bakar.png")).resize({ width: 1200 }).webp({ quality: 80, effort: 6 }).toFile(path.join(SRC, "potongan", "derajat-luka-bakar.webp"));
  console.log(`potongan/derajat-luka-bakar.webp  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(1)} KB`);
}
if (!only || "warna".includes(only)) {
  for (const [name, box] of [...STAGES, ...DANGERS]) {
    await save(path.join(SRC, "warna-dasar-luka.png"), box, 360, path.join(SRC, "warna", `${name}.webp`));
  }
}
