# LukaCare — konteks untuk Claude Code

LukaCare adalah web app pendamping perawatan luka ringan untuk pengguna Indonesia: panduan pertolongan pertama langkah demi langkah, catatan pemulihan harian dengan foto, dan belanja perlengkapan P3K. Domain: lukacare.com. Baca `README.md` untuk struktur folder, rute, environment, dan kontrak API.

## Perintah

```bash
cd apps/web
npm install
npm run dev              # http://localhost:3001, butuh API lokal di :8787 (lihat di bawah)
npm run lint             # ESLint
npm test                 # Vitest (konten, assessDetails, checkinWarnings)
npm run build:staging    # pakai .env.staging; output ke apps/web/dist
npm run build:production # gagal selama konten medis masih draft (gerbang di vite.config.js)
npm run deploy:staging   # wrangler → staging.lukacare.com
```

Di Mac tanpa Terminal: klik kanan `jalankan-lukacare.command` di root repo → Open. Skrip mengecek Node.js ≥ 20, menyiapkan dan menyalakan API lokal (port 8787), lalu web (`npm run dev -- --open`).

API (`apps/api`, lihat `apps/api/README.md`):

```bash
cd apps/api
npm ci
cp .dev.vars.example .dev.vars
npm run db:migrate:local
npm run db:seed:local    # akun demo: demo@lukacare.test / lukacare123
npm run dev              # http://localhost:8787
npm test                 # Vitest di runtime Workers (D1 + R2 lokal)
```

Web dan API sama-sama punya test Vitest; web juga punya ESLint. `npm run build` memakai mode production, jadi ikut tertahan gerbang konten; untuk mengecek build sehari-hari pakai `npm run build:staging`. Kalau menambahkan tooling, tambahkan juga script-nya di `package.json` dan perbarui bagian ini.

## Status saat ini

- Frontend React 19 + Vite 7 + Tailwind CSS v4 di `apps/web`, semua halaman sudah ada (lihat tabel rute di README).
- Development memakai API lokal (`VITE_USE_MOCK_API=false` di `.env.development`); staging dan production masih mock (`true`) sampai API di-deploy. Di mode mock, luka dan akun disimpan di `localStorage` (prefix `lukacare:`). Keranjang selalu di `localStorage`.
- Di mode API: sesi yang ditolak server (401) otomatis dihapus dan pengguna diminta masuk lagi (`SESSION_EXPIRED_EVENT` di `services/http.js`); unduh/hapus data memakai `services/accountService.js` (`GET /me/export`, `DELETE /me`); tombol data contoh hanya ada di mode mock.
- Akun baru wajib verifikasi email dengan kode 6 digit (`POST /auth/verify`, form `VerifyEmailForm` di `pages/Auth.jsx`). Belum ada penyedia email: di dev lokal kode tampil di layar (`DEV_EXPOSE_CODES=true`). Akun demo lokal `demo@lukacare.test` / `lukacare123` dibuat oleh `npm run db:seed:local` (dijalankan otomatis oleh `jalankan-lukacare.command`).
- Checkout masih demo, tanpa pembayaran sungguhan.
- Menyimpan luka untuk dipantau butuh akun: di langkah 6 `/panduan`, pengguna yang belum masuk diminta daftar atau masuk lewat `Sheet` (form dari `pages/Auth.jsx`), lalu luka langsung disimpan. Langkah 1–5 tetap tanpa login (aturan produk no. 4).
- Galeri foto di `/pantau/:id` (`src/components/PhotoGallery.jsx`) dibatasi `MAX_GALLERY_PHOTOS` = 3 per luka, terpisah dari foto catatan harian.
- Katalog produk di `src/data/products.js` masih contoh dengan nama generik.
- Backend `apps/api` (Hono di Cloudflare Worker + D1 + R2) sudah ada dan teruji, tapi belum di-deploy. Kontraknya sama dengan `src/services/woundService.js` dan `authService.js`; ubah keduanya bersamaan. Batas galeri (`MAX_GALLERY_PHOTOS`) didefinisikan di frontend dan di `apps/api/src/routes/wounds.js`.
- **Tahap 2 berjalan:** `docs/prd-tahap-2.md` (v1.2). Isinya memasukkan buku panduan dan hasil riset ke web. M1 (fondasi konten) dan M2 (pustaka luka) selesai; berikutnya M3 (catatan harian v2, aturan penilaian v2, batas periksa). Kerjakan berurutan sampai M5; perubahan model data dikerjakan di frontend dan `apps/api` bersamaan.

## Konten dan riset

- `docs/buku-panduan/buku-panduan-perawatan-luka-luar.md`: buku panduan 10 jenis luka (Bagian A rawat di rumah, Bagian B perlu tenaga kesehatan, Bagian C warna luka dan waktu pulih), tabel tanda bahaya, kotak P3K, dan sumber. Ini salinan dari doc Claude tempat klinisi memberi komentar.
- `docs/riset/waktu-penyembuhan-luka-berdasarkan-warna.md`: laporan riset lengkap; `docs/riset/catatan/` berisi catatan mentah per topik. Bagian "Sumber berselisih" dan "Celah bukti" wajib dibaca sebelum menulis angka apa pun.
- `apps/web/public/illustrations/`: 16 ilustrasi PNG (2x); `kecil/` (WebP tampak atas untuk kartu), `potongan/` (panel tampak atas dan penampang tiap luka untuk ponsel), `warna/` (swatch warna dasar luka dan tanda bahaya untuk catatan harian v2). Kodenya di `tools/illustrations/` (lihat README di sana; `npm run thumbs` dan `npm run crops` untuk WebP). Ubah gambar lewat kode, jangan edit PNG langsung.
- `src/content/`: semua konten medis (PRD F1). Satu file per jenis luka di `wounds/`, plus `redFlags.js`, `assessment.js` (aturan `assessDetails`), `checkin.js`, `caseStories.js` (10 contoh kasus dari buku), `library.js` (isi Bab 1–10 dan Bagian C untuk `/pustaka`, disalin kata per kata dari buku; per bab berupa `nodes` berurutan yang dirender `components/LibraryNodes.jsx`), `chapterMeta.js` (sumber per bab), `options.js`, dan `sources.js` (33 rujukan buku). Setiap blok dibungkus `block(fields, { sources, evidence })` dari `meta.js` dan berstatus `draft` sampai ditinjau. Komponen mengimpor dari `src/content` (index), tidak ada teks medis di komponen. Jika buku berubah, ubah juga file di sini.
- Status tinjauan: isi `review: { status: "reviewed", reviewedBy, reviewedAt }` per blok setelah klinisi menyetujui; label `I` juga butuh `inferenceApproved: true`. `src/content/review.js` mengumpulkan semua blok untuk test dan gerbang build. Di staging (atau `VITE_SHOW_REVIEW=true`) blok draft diberi pita "Belum ditinjau klinisi" (`components/ContentMeta.jsx`), dan tombol "Sumber" membuka rujukan per bagian; daftar lengkap di `/sumber`.
- `src/data/`: hanya data non-medis (`products.js`, `contact.js`).
- `src/data/contact.js`: profile kontak di footer langkah 4 (`ContactProfile`). Nilainya masih contoh; isi data asli sebelum rilis dan jangan tampilkan nomor yang belum aktif.
- Temuan riset yang mengikat desain: warna dasar luka = tahap, lapisan kulit = lama pulih; tidak ada angka hari per warna; waktu ditampilkan sebagai batas periksa; kemerahan tidak boleh jadi satu-satunya tanda bahaya karena sering tidak terlihat di kulit sawo matang.

## Aturan produk (jangan dilanggar tanpa diskusi)

1. **Tanda bahaya selalu di awal panduan.** Langkah pertama `/panduan` adalah checklist `RED_FLAGS`. Jika ada yang dipilih, panduan dan rekomendasi produk berhenti dan diganti `EscalationView` (119 / faskes).
2. **Panduan perawatan dan produk dipisah.** Langkah perawatan di `src/content/wounds/` tidak boleh menyebut merek atau mengarahkan ke produk tertentu. Produk muncul sesudahnya sebagai kategori pendukung.
3. **Bukan diagnosis.** Jangan menulis kalimat seperti "luka Anda adalah X" atau "gunakan obat Y". Pakai "berdasarkan informasi yang Anda masukkan…". Catatan harian hanya dicocokkan dengan tanda bahaya umum (`src/lib/checkin.js`).
4. **Pertolongan pertama tanpa login.** Akun hanya untuk menyimpan riwayat ke server.
5. **Marketplace hanya alat kesehatan dan perlengkapan perawatan**, bukan obat resep.
6. **Data kesehatan = data pribadi spesifik (UU PDP).** Pertahankan persetujuan eksplisit saat daftar, fitur unduh data, dan hapus data. Foto luka nanti di R2 privat dengan presigned URL.
7. **Konten medis** (semua file di `src/content/`) wajib ditinjau dokter atau perawat sebelum production. Ubah isinya dengan hati-hati dan tandai di PR.

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
- [x] Tahap 2 M1: konten di `src/content/` dengan sumber dan status tinjauan, halaman `/sumber`, gerbang build production, potongan ilustrasi
- [x] Tahap 2 M2: pustaka `/pustaka` (10 bab + Bagian C), "Pustaka" di navigasi utama, kartu jenis luka bergambar dan penampang kulit di langkah perawatan, tautan bab dari beranda, panduan, layar rujukan, dan detail luka
- [x] ESLint dan test Vitest untuk konten, `assessDetails`, dan `checkinWarnings`
- [ ] Test alur panduan dengan Testing Library
- [x] `apps/api`: Worker + D1 (`users`, `wounds`, `wound_examinations`, `wound_photos`) + R2
- [x] Sambungkan frontend ke API (development) dan alur simpan luka tanpa login (minta daftar di langkah 6)
- [ ] Sambungkan penyedia email untuk kode verifikasi (`deliver()` di `apps/api/src/lib/verification.js`)
- [ ] Deploy API ke staging/production, lalu set `VITE_USE_MOCK_API=false` di `.env.staging` dan `.env.production`
- [ ] Ganti katalog contoh dengan data mitra apotek, integrasi pembayaran
- [ ] Pengingat harian (Web Push) untuk catat kondisi luka
- [ ] GitHub Actions: deploy staging otomatis dari `main`

## Riwayat

`docs/catatan-prd-awal.txt` berisi catatan diskusi PRD awal (nama fitur, alur Wound Care Guide, arsitektur Cloudflare, rencana domain). Beberapa poin di sana sudah diperbarui:
- Stack frontend sekarang React, bukan Angular.
- `localhost:3001` adalah development lokal; staging adalah `staging.lukacare.com`.
- Kategori luka dipisah menjadi jenis (lecet, sayatan, luka bakar ringan, lepuh) dan kondisi (berdarah, basah, kering).
