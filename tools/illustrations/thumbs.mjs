// Membuat gambar kecil (WebP) dari panel "Tampak atas" tiap ilustrasi luka.
// Dipakai kartu contoh kasus di aplikasi. Jalankan setelah `npm run render`.
//
//   npm run thumbs
//
// Semua ilustrasi luka memakai tata letak yang sama (lebar 2400 × 1380 px):
// panel tampak atas ada di kiri, jadi satu kotak potong berlaku untuk semuanya.
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(here, "../../apps/web/public/illustrations");
const OUT = path.join(SRC, "kecil");

const NAMES = [
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

// Bagian tengah panel tampak atas, tanpa sebagian besar label.
const CROP = { left: 200, top: 325, width: 880, height: 590 };
const SIZE = { width: 640, height: 429 };

const only = process.argv[2];
await mkdir(OUT, { recursive: true });
for (const name of NAMES) {
  if (only && !name.includes(only)) continue;
  const file = path.join(OUT, `${name}.webp`);
  const info = await sharp(path.join(SRC, `${name}.png`))
    .extract(CROP)
    .resize(SIZE.width, SIZE.height)
    .webp({ quality: 78, effort: 6 })
    .toFile(file);
  console.log(`${name}.webp  ${(info.size / 1024).toFixed(1)} KB`);
}
