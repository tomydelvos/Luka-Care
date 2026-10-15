# Ilustrasi LukaCare

Semua ilustrasi luka di buku panduan dan aplikasi digambar dengan kode di folder ini, lalu dirender menjadi PNG di `apps/web/public/illustrations/`. Gambar ini sengaja berupa ilustrasi, bukan foto klinis.

```bash
cd tools/illustrations
npm install
npx playwright install chromium   # sekali saja
npm run render                    # semua gambar
npm run render -- luka-lecet      # hanya gambar yang namanya cocok
npm run thumbs                    # gambar kecil WebP untuk kartu contoh kasus
npm run crops                     # potongan WebP untuk ponsel dan swatch warna
```

| File | Isi |
| --- | --- |
| `src/lib.mjs` | Palet warna, kulit tampak atas, penampang kulit berlapis, label, pita kedalaman |
| `src/figures.mjs` | Sampul, peta kedalaman, 10 jenis luka, derajat luka bakar, kotak P3K |
| `src/figures2.mjs` | Warna dasar luka dan grafik waktu pulih per lapisan (Bagian C) |
| `render.mjs` | Daftar nama file → fungsi penggambar, dan proses render |
| `thumbs.mjs` | Memotong panel tampak atas tiap ilustrasi luka menjadi WebP kecil di `public/illustrations/kecil/` (kartu contoh kasus) |
| `crops.mjs` | Memotong panel "Tampak atas" dan "Penampang kulit" tiap ilustrasi luka ke `potongan/`, dan swatch warna dasar luka serta tanda bahaya ke `warna/` |
| `fonts/` | Instrument Sans (lisensi SIL OFL, lihat `InstrumentSans-OFL.txt`) |

Aturan yang dipakai:

- Penampang kulit memakai koordinat tetap di `S` (`lib.mjs`): permukaan y=200, epidermis sampai 224, dermis sampai 340, lemak sampai 470, otot sampai 560. Kedalaman luka di tiap gambar mengikuti tabel kedalaman di buku.
- Warna kulit default sawo matang (`C.skin`). Varian kulit lebih gelap dipakai di gambar warna dasar luka; tahap 2 menambah varian untuk semua gambar (lihat `docs/prd-tahap-2.md`).
- Garis kaki hijau berarti umumnya bisa dirawat di rumah, merah berarti perlu tenaga kesehatan.
- Teks label ditulis dalam Bahasa Indonesia, kalimat pendek, huruf kapital hanya di awal.
