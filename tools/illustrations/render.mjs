// Merender ilustrasi buku panduan dan aplikasi LukaCare ke PNG.
//
//   cd tools/illustrations
//   npm install
//   npx playwright install chromium   # sekali saja
//   npm run render                    # semua gambar
//   npm run render -- luka-lecet      # hanya yang namanya cocok
//
// Hasil ditulis ke apps/web/public/illustrations/ (2x, untuk layar retina dan cetak).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";
import * as F from "./src/figures.mjs";
import * as F2 from "./src/figures2.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, "../../apps/web/public/illustrations");
fs.mkdirSync(out, { recursive: true });

const font = (file) => fs.readFileSync(path.join(here, "fonts", file)).toString("base64");
const regular = font("InstrumentSans-Regular.ttf");
const bold = font("InstrumentSans-Bold.ttf");

// Nama file → fungsi penggambar. Urutan mengikuti buku panduan.
const FIGURES = [
  ["buku-sampul", F.sampul],
  ["peta-kedalaman-luka", F.petaKedalaman],
  ["luka-lecet", F.lecet],
  ["luka-sayatan", F.sayatan],
  ["luka-bakar-ringan", F.bakarRingan],
  ["derajat-luka-bakar", F.derajatBakar],
  ["luka-lepuh", F.lepuh],
  ["luka-robek", F.robek],
  ["luka-tusuk", F.tusuk],
  ["luka-benda-tertancap", F.tertancap],
  ["luka-gigitan-cakaran", F.gigitan],
  ["luka-bakar-berat", F.bakarBerat],
  ["luka-terinfeksi", F.infeksi],
  ["kotak-p3k", F.p3k],
  ["warna-dasar-luka", F2.warnaDasar],
  ["waktu-pulih-lapisan", F2.waktuLapisan],
];

const only = process.argv.slice(2);
const list = FIGURES.filter(([name]) => !only.length || only.some((o) => name.includes(o)));
if (!list.length) {
  console.error(`Tidak ada gambar yang cocok dengan: ${only.join(", ")}`);
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2 });
for (const [name, draw] of list) {
  await page.setContent(`<!doctype html><html><head><style>
    @font-face { font-family: "Instrument Sans"; font-weight: 400; src: url(data:font/ttf;base64,${regular}) format("truetype"); }
    @font-face { font-family: "Instrument Sans"; font-weight: 600 700; src: url(data:font/ttf;base64,${bold}) format("truetype"); }
    html, body { margin: 0; background: #F5F7F4; }
    svg { display: block; }
  </style></head><body>${draw()}</body></html>`);
  // Ukuran kotak label (pill) dihitung setelah font termuat.
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const g of document.querySelectorAll(".pill")) {
      const box = g.querySelector("text").getBBox();
      const rect = g.querySelector("rect");
      rect.setAttribute("x", box.x - 10);
      rect.setAttribute("y", box.y - 6);
      rect.setAttribute("width", box.width + 20);
      rect.setAttribute("height", box.height + 12);
    }
  });
  const png = await (await page.$("svg")).screenshot({ type: "png" });
  const file = path.join(out, `${name}.png`);
  await sharp(png).png({ compressionLevel: 9, palette: true, quality: 92, effort: 8 }).toFile(file);
  console.log(`${name}.png  ${(fs.statSync(file).size / 1024).toFixed(0)} KB`);
}
await browser.close();
