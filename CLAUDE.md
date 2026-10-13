# LukaCare — konteks untuk Claude Code

LukaCare adalah web app pendamping perawatan luka ringan untuk pengguna Indonesia: panduan pertolongan pertama langkah demi langkah, catatan pemulihan harian dengan foto, dan belanja perlengkapan P3K. Domain: lukacare.com. Baca `README.md` untuk struktur folder, rute, environment, dan kontrak API.

## Perintah

```bash
cd apps/web
npm install
npm run dev              # http://localhost:3001, butuh API lokal di :8787 (lihat di bawah)
npm run build            # output ke apps/web/dist
npm run build:staging    # pakai .env.staging
npm run deploy:staging   # wrangler → staging.lukacare.com
```

Di Mac tanpa Terminal: klik kanan `jalankan-lukacare.command` di root repo → Open. Skrip mengecek Node.js ≥ 20, menyiapkan dan menyalakan API lokal (port 8787), lalu web (`npm run dev -- --open`).

API (`apps/api`, lihat `apps/api/README.md`):

```bash
cd apps/api
npm ci
cp .dev.vars.example .dev.vars
npm run db:migrate:local
npm run dev              # http://localhost:8787
npm test                 # Vitest di runtime Workers (D1 + R2 lokal)
```

Frontend belum punya linter maupun test; API punya test Vitest. Kalau menambahkan tooling, tambahkan juga script-nya di `package.json` dan perbarui bagian ini.

## Status saat ini

- Frontend React 19 + Vite 7 + Tailwind CSS v4 di `apps/web`, semua halaman sudah ada (lihat tabel rute di README).
- Development memakai API lokal (`VITE_USE_MOCK_API=false` di `.env.development`); staging dan production masih mock (`true`) sampai API di-deploy. Di mode mock, luka dan akun disimpan di `localStorage` (prefix `lukacare:`). Keranjang selalu di `localStorage`.
- Di mode API: sesi yang ditolak server (401) otomatis dihapus dan pengguna diminta masuk lagi (`SESSION_EXPIRED_EVENT` di `services/http.js`); unduh/hapus data memakai `services/accountService.js` (`GET /me/export`, `DELETE /me`); tombol data contoh hanya ada di mode mock.
- Checkout masih demo, tanpa pembayaran sungguhan.
- Menyimpan luka untuk dipantau butuh akun: di langkah 6 `/panduan`, pengguna yang belum masuk diminta daftar atau masuk lewat `Sheet` (form dari `pages/Auth.jsx`), lalu luka langsung disimpan. Langkah 1–5 tetap tanpa login (aturan produk no. 4).
- Galeri foto di `/pantau/:id` (`src/components/PhotoGallery.jsx`) dibatasi `MAX_GALLERY_PHOTOS` = 3 per luka, terpisah dari foto catatan harian.
- Katalog produk di `src/data/products.js` masih contoh dengan nama generik.
- Backend `apps/api` (Hono di Cloudflare Worker + D1 + R2) sudah ada dan teruji, tapi belum di-deploy. Kontraknya sama dengan `src/services/woundService.js` dan `authService.js`; ubah keduanya bersamaan. Batas galeri (`MAX_GALLERY_PHOTOS`) didefinisikan di frontend dan di `apps/api/src/routes/wounds.js`.
- **Tahap 2 sedang direncanakan:** `docs/prd-tahap-2.md`. Isinya memasukkan buku panduan dan hasil riset ke web. Kerjakan berurutan M1 → M5 sesuai PRD.

## Konten dan riset

- `docs/buku-panduan/buku-panduan-perawatan-luka-luar.md`: buku panduan 10 jenis luka (Bagian A rawat di rumah, Bagian B perlu tenaga kesehatan, Bagian C warna luka dan waktu pulih), tabel tanda bahaya, kotak P3K, dan sumber. Ini salinan dari doc Claude tempat klinisi memberi komentar.
- `docs/riset/waktu-penyembuhan-luka-berdasarkan-warna.md`: laporan riset lengkap; `docs/riset/catatan/` berisi catatan mentah per topik. Bagian "Sumber berselisih" dan "Celah bukti" wajib dibaca sebelum menulis angka apa pun.
- `apps/web/public/illustrations/`: 16 ilustrasi PNG (2x) dan `kecil/` (WebP tampak atas untuk kartu). Kodenya di `tools/illustrations/` (lihat README di sana; `npm run thumbs` untuk WebP). Ubah gambar lewat kode, jangan edit PNG langsung.
- `src/data/caseStories.js`: 10 contoh kasus dari buku, tampil di langkah 3 panduan lewat `CaseStories`. Konten medis, ikut aturan tinjauan klinisi. Jika buku berubah, ubah juga file ini.
- `src/data/contact.js`: profile kontak di footer langkah 4 (`ContactProfile`). Nilainya masih contoh; isi data asli sebelum rilis dan jangan tampilkan nomor yang belum aktif.
- Temuan riset yang mengikat desain: warna dasar luka = tahap, lapisan kulit = lama pulih; tidak ada angka hari per warna; waktu ditampilkan sebagai batas periksa; kemerahan tidak boleh jadi satu-satunya tanda bahaya karena sering tidak terlihat di kulit sawo matang.

## Aturan produk (jangan dilanggar tanpa diskusi)

1. **Tanda bahaya selalu di awal panduan.** Langkah pertama `/panduan` adalah checklist `RED_FLAGS`. Jika ada yang dipilih, panduan dan rekomendasi produk berhenti dan diganti `EscalationView` (119 / faskes).
2. **Panduan perawatan dan produk dipisah.** Langkah perawatan di `woundGuides.js` tidak boleh menyebut merek atau mengarahkan ke produk tertentu. Produk muncul sesudahnya sebagai kategori pendukung.
3. **Bukan diagnosis.** Jangan menulis kalimat seperti "luka Anda adalah X" atau "gunakan obat Y". Pakai "berdasarkan informasi yang Anda masukkan…". Catatan harian hanya dicocokkan dengan tanda bahaya umum (`src/lib/checkin.js`).
4. **Pertolongan pertama tanpa login.** Akun hanya untuk menyimpan riwayat ke server.
5. **Marketplace hanya alat kesehatan dan perlengkapan perawatan**, bukan obat resep.
6. **Data kesehatan = data pribadi spesifik (UU PDP).** Pertahankan persetujuan eksplisit saat daftar, fitur unduh data, dan hapus data. Foto luka nanti di R2 privat dengan presigned URL.
7. **Konten medis** (`src/data/woundGuides.js`, `src/data/redFlags.js`) wajib ditinjau dokter atau perawat sebelum production. Ubah isinya dengan hati-hati dan tandai di PR.

## Arsitektur dan konvensi kode

- **Router**: modul kecil sendiri di `src/lib/router.jsx` (mode `history`, `hash`, `memory`), API mirip react-router (`Link`, `useRouter().navigate`, `Routes`). Boleh diganti react-router v7 bila perlu fitur lebih (loader, nested layout).
- **Data layer**: komponen tidak memanggil `fetch` langsung. Semua lewat `src/services/*`, yang memilih implementasi mock atau HTTP berdasarkan `USE_MOCK_API`. State global ada di `src/store/AppProviders.jsx` (`useAuth`, `useWounds`, `useCart`, `useToast`).
- **Env**: hanya dibaca di `src/config/env.js`. Jangan taruh secret di `VITE_*`.
- **Styling**: Tailwind v4 dengan token warna di `src/index.css` (`--lc-*`, dipetakan ke kelas seperti `bg-pine`, `text-muted`, `bg-alert-soft`). Selalu pakai token, jangan hex literal, agar mode gelap tetap benar. Teks dan ikon di atas warna solid memakai pasangan `on-*` (`text-on-pine`, `text-on-alert`, `text-on-mint`, `text-on-plaster`), bukan `text-white`: di mode gelap warna dasarnya terang sehingga teks putih tidak terbaca. Kontras minimal 4,5:1. Merah (`alert`) hanya untuk bahaya atau darurat.
- **Komponen UI** dasar ada di `src/components/ui.jsx` (`Button`, `ChoiceGroup`, `Field`, `Sheet`, `Banner`, `Badge`, `QtyStepper`, `Toggle`). Pakai ulang sebelum membuat yang baru.
- **Identitas visual**: motif plester (kelas `plaster-wing` dan `plaster-pad`) hanya dipakai di hero beranda dan logo. Font Plus Jakarta Sans dari Google Fonts.
- **Copy**: Bahasa Indonesia, sapaan "Anda", sentence case, kalimat aktif dan pendek. Tombol menyebut aksinya ("Simpan catatan", bukan "Submit"). Pesan error menjelaskan apa yang salah dan cara memperbaikinya.
- **Aksesibilitas**: target sentuh minimal 44px, fokus keyboard terlihat, `prefers-reduced-motion` dihormati, dialog (`Sheet`) menjebak fokus dan menutup dengan Escape.
- **Mobile-first**: navigasi bawah di mobile, sidebar di desktop (`lg:`). Halaman `/panduan` tampil dalam mode fokus tanpa navigasi utama.

## Langkah berikutnya

- [ ] Tahap 2 sesuai `docs/prd-tahap-2.md` (konten terstruktur, pustaka luka, catatan harian v2, batas periksa)
- [ ] Review konten medis oleh tenaga kesehatan (daftar tinjauan ada di PRD tahap 2, F10)
- [ ] Tambah ESLint dan beberapa test (Vitest + Testing Library) untuk `assessDetails`, `checkinWarnings`, dan alur panduan
- [x] `apps/api`: Worker + D1 (`users`, `wounds`, `wound_examinations`, `wound_photos`) + R2
- [x] Sambungkan frontend ke API (development) dan alur simpan luka tanpa login (minta daftar di langkah 6)
- [ ] Deploy API ke staging/production, lalu set `VITE_USE_MOCK_API=false` di `.env.staging` dan `.env.production`
- [ ] Ganti katalog contoh dengan data mitra apotek, integrasi pembayaran
- [ ] Pengingat harian (Web Push) untuk catat kondisi luka
- [ ] GitHub Actions: deploy staging otomatis dari `main`

## Riwayat

`docs/catatan-prd-awal.txt` berisi catatan diskusi PRD awal (nama fitur, alur Wound Care Guide, arsitektur Cloudflare, rencana domain). Beberapa poin di sana sudah diperbarui:
- Stack frontend sekarang React, bukan Angular.
- `localhost:3001` adalah development lokal; staging adalah `staging.lukacare.com`.
- Kategori luka dipisah menjadi jenis (lecet, sayatan, luka bakar ringan, lepuh) dan kondisi (berdarah, basah, kering).
