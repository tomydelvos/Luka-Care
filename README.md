# LukaCare

Aplikasi web pendamping perawatan luka ringan: panduan pertolongan pertama langkah demi langkah, catatan pemulihan harian dengan foto, dan belanja perlengkapan P3K.

Frontend ada di `apps/web`, backend API (Cloudflare Worker + D1 + R2) di `apps/api`. Lihat `apps/api/README.md` untuk endpoint, test, dan deploy API.

```
lukacare/
├── apps/
│   ├── api/                  API Cloudflare Worker (Hono) + D1 + R2, test Vitest
│   └── web/                  Frontend React (Vite + Tailwind CSS v4)
│       ├── public/           favicon, illustrations/ (16 ilustrasi luka, kecil/ = WebP untuk kartu)
│       ├── src/
│       │   ├── config/       env.js — satu-satunya tempat membaca VITE_*
│       │   ├── data/         konten panduan luka, tanda bahaya, katalog produk
│       │   ├── lib/          router, storage, format, kompres foto
│       │   ├── services/     authService, woundService (mock ↔ API)
│       │   ├── store/        state global (auth, luka, keranjang, toast)
│       │   ├── components/   UI dasar, layout, ilustrasi, timer
│       │   └── pages/        Beranda, Panduan, Pantau, Belanja, Darurat, Akun
│       ├── .env.*            development / staging / production
│       ├── vite.config.js    dev server di port 3001
│       └── wrangler.jsonc    deploy ke Cloudflare (lukacare.com & staging)
├── docs/
│   ├── prd-tahap-2.md        PRD tahap 2: konten berbasis riset di web
│   ├── buku-panduan/         Buku Panduan Perawatan Luka Luar (markdown)
│   ├── riset/                laporan riset warna luka dan waktu pulih + catatan
│   └── catatan-prd-awal.txt  catatan diskusi PRD awal
├── tools/
│   └── illustrations/        kode penggambar ilustrasi luka (SVG → PNG)
├── CLAUDE.md                 konteks dan aturan kerja untuk Claude Code
└── README.md
```

## Menjalankan di lokal

Butuh Node.js 20 atau lebih baru. Mode development memakai API lokal (`VITE_USE_MOCK_API=false` di `apps/web/.env.development`), jadi jalankan API dan web.

**Di Mac:** klik kanan `jalankan-lukacare.command` di root repo lalu pilih **Open** (pertama kali) atau klik dua kali (selanjutnya). Skrip ini:
- memasang dependency;
- membuat `apps/api/.dev.vars` dengan secret acak;
- menjalankan migrasi D1 lokal;
- menyalakan API di http://localhost:8787, lalu web di http://localhost:3001, dan membuka browser.

Biarkan jendela Terminal-nya terbuka. Tekan Ctrl+C untuk berhenti, dan API ikut berhenti.

**Manual (OS apa pun), dua terminal:**

```bash
# Terminal 1: API
cd apps/api
npm ci
cp .dev.vars.example .dev.vars   # ganti FILE_SIGNING_SECRET dengan string acak
npm run db:migrate:local
npm run dev                      # http://localhost:8787

# Terminal 2: web
cd apps/web
npm install
npm run dev                      # http://localhost:3001
```

Data lokal (akun, luka, foto) tersimpan di `apps/api/.wrangler/`.

**Tanpa backend (mode demo):** jalankan `VITE_USE_MOCK_API=true npm run dev` di `apps/web`. Semua data disimpan di `localStorage`, dan di halaman **Pantau** ada tombol "Lihat dengan data contoh".

## Halaman

| Rute | Isi |
| --- | --- |
| `/` | Beranda: mulai panduan, luka yang dipantau, P3K dasar, tanda kapan ke dokter |
| `/panduan` | Alur 6 langkah: tanda bahaya → jenis luka → detail (dengan 10 contoh kasus kronologis) → perawatan (dengan timer, footer profile kontak) → perlengkapan → simpan untuk dipantau. Bisa langsung ke jenis tertentu dengan `?jenis=lecet\|sayatan\|bakar\|lepuh` |
| `/pantau`, `/pantau/:id` | Daftar luka, catatan harian (foto, skala nyeri 0–10, kemerahan, cairan, demam), grafik nyeri, perbandingan foto awal vs terbaru, galeri foto (maks. 3 per luka) |
| `/belanja`, `/keranjang`, `/checkout` | Katalog per kategori, filter `?untuk=<jenis luka>`, keranjang, checkout (mode demo) |
| `/darurat` | Nomor 119 dan 112, cari faskes terdekat, semua tanda bahaya beserta yang bisa dilakukan |
| `/masuk`, `/daftar`, `/akun` | Autentikasi, persetujuan data kesehatan, unduh/hapus data |

## Prinsip produk yang diterapkan

1. **Cek tanda bahaya dulu.** Panduan selalu dimulai dengan daftar kondisi yang tidak boleh dirawat sendiri. Jika ada yang dipilih, panduan dan rekomendasi produk berhenti dan diganti arahan ke 119 atau faskes.
2. **Panduan dan produk dipisah.** Langkah perawatan tidak menyebut merek. Produk muncul sesudahnya sebagai kategori pendukung.
3. **Tanpa login untuk pertolongan pertama.** Akun hanya dibutuhkan untuk menyimpan riwayat ke server.
4. **Bukan diagnosis.** Catatan harian hanya dicocokkan dengan tanda bahaya umum (kemerahan melebar, nanah, demam, nyeri naik tajam) lalu disarankan periksa.

> Konten di `src/data/woundGuides.js` dan `src/data/redFlags.js` adalah panduan pertolongan pertama umum. **Wajib ditinjau dokter atau perawat sebelum rilis production.**

## Environment

| Variabel | Development | Staging | Production |
| --- | --- | --- | --- |
| `VITE_APP_ENV` | development | staging | production |
| `VITE_API_URL` | http://localhost:8787 | https://api-staging.lukacare.com | https://api.lukacare.com |
| `VITE_USE_MOCK_API` | false (API lokal) | true → ubah ke `false` setelah API staging di-deploy | true → ubah ke `false` setelah API production di-deploy |
| `VITE_ROUTER_MODE` | history | history | history |

Semua `VITE_*` ikut ter-bundle ke browser. Jangan taruh secret di sini; secret milik Worker API disimpan dengan `wrangler secret put`.

## Kontrak API untuk backend

`src/services/woundService.js` dan `authService.js` punya dua implementasi dengan bentuk data yang sama: mock (localStorage) dan HTTP. Endpoint yang diharapkan dari Worker:

```
POST   /auth/register          { name, email, password, consent } → { token, user }
POST   /auth/login             { email, password }                → { token, user }
POST   /auth/logout

GET    /wounds
POST   /wounds
PATCH  /wounds/:id
DELETE /wounds/:id
POST   /wounds/:id/examinations      catatan harian → tabel wound_examinations
POST   /uploads/wound-photo          → { uploadUrl, photoUrl }  (presigned URL R2)
POST   /wounds/:id/photos            { src, at } → Wound   galeri foto, maks. 3 per luka
DELETE /wounds/:id/photos/:photoId   → Wound
```

Respons dibungkus `{ success: true, data: … }` atau `{ success: false, message: "…" }`. Foto dikompres di browser (maks. 720 px, JPEG) sebelum diunggah langsung ke R2, jadi binary foto tidak lewat Worker dan tidak masuk D1.

## Deploy ke Cloudflare

### Opsi A: Workers Static Assets (sudah dikonfigurasi)

```bash
cd apps/web
npx wrangler login
npm run deploy:staging       # → https://staging.lukacare.com
npm run deploy:production    # → https://lukacare.com
```

`wrangler.jsonc` memakai `not_found_handling: "single-page-application"` agar rute seperti `/pantau/abc` tidak 404 saat di-refresh. Zone `lukacare.com` harus sudah aktif di akun Cloudflare.

### Opsi B: Cloudflare Pages

Hubungkan repo GitHub, lalu isi:

- Root directory: `apps/web`
- Build command: `npm run build` (staging: `npm run build:staging`)
- Build output: `dist`

Pages otomatis memperlakukan proyek tanpa `404.html` sebagai SPA.

## Privasi data kesehatan

Foto dan catatan luka termasuk data kesehatan, yang dalam UU No. 27 Tahun 2022 (Pelindungan Data Pribadi) tergolong data pribadi yang bersifat spesifik. Yang sudah disiapkan di frontend: persetujuan eksplisit saat daftar, unduh data, dan hapus semua data. Yang perlu disiapkan di backend: bucket R2 privat dengan presigned URL berumur pendek, enkripsi, log akses, dan kebijakan retensi.

## Langkah berikutnya

- [ ] Tahap 2: konten berbasis riset di web (`docs/prd-tahap-2.md`)
- [ ] Review konten medis oleh tenaga kesehatan
- [x] `apps/api`: Worker + D1 (`users`, `wounds`, `wound_examinations`, `wound_photos`) + R2
- [x] Sambungkan frontend ke API (development memakai API lokal)
- [ ] Deploy API ke staging/production, lalu set `VITE_USE_MOCK_API=false` di `.env.staging` dan `.env.production`
- [ ] Ganti katalog contoh dengan data mitra apotek dan integrasi pembayaran
- [ ] Pengingat harian (Web Push) untuk catat kondisi luka
- [ ] GitHub Actions: deploy staging otomatis dari branch `main`
