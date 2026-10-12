# LukaCare

Aplikasi web pendamping perawatan luka ringan: panduan pertolongan pertama langkah demi langkah, catatan pemulihan harian dengan foto, dan belanja perlengkapan P3K.

Repo ini baru berisi frontend (`apps/web`). Backend API (`apps/api`, Cloudflare Worker + D1 + R2) menyusul dengan kontrak data yang sudah disiapkan di `src/services`.

```
lukacare/
├── apps/
│   └── web/                  Frontend React (Vite + Tailwind CSS v4)
│       ├── public/           favicon
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
│   └── catatan-prd-awal.txt  catatan diskusi PRD awal
├── CLAUDE.md                 konteks dan aturan kerja untuk Claude Code
└── README.md
```

## Menjalankan di lokal

Butuh Node.js 20 atau lebih baru.

```bash
cd apps/web
npm install
npm run dev
```

Buka http://localhost:3001.

Di Mac, bisa juga klik kanan `jalankan-lukacare.command` di root repo lalu pilih **Open** (pertama kali) atau klik dua kali (selanjutnya). Skrip ini memasang dependency bila perlu, lalu membuka browser otomatis. Biarkan jendela Terminal-nya terbuka; tekan Ctrl+C untuk berhenti. Tanpa backend pun semua fitur jalan, karena `VITE_USE_MOCK_API=true` menyimpan data di `localStorage` browser. Di halaman **Pantau**, tombol "Lihat dengan data contoh" mengisi dua luka contoh untuk mencoba tampilan pemantauan.

## Halaman

| Rute | Isi |
| --- | --- |
| `/` | Beranda: mulai panduan, luka yang dipantau, P3K dasar, tanda kapan ke dokter |
| `/panduan` | Alur 6 langkah: tanda bahaya → jenis luka → detail → perawatan (dengan timer) → perlengkapan → simpan untuk dipantau. Bisa langsung ke jenis tertentu dengan `?jenis=lecet\|sayatan\|bakar\|lepuh` |
| `/pantau`, `/pantau/:id` | Daftar luka, catatan harian (foto, skala nyeri 0–10, kemerahan, cairan, demam), grafik nyeri, perbandingan foto awal vs terbaru |
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
| `VITE_USE_MOCK_API` | true | true | true → ubah ke `false` saat API siap |
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

- [ ] Review konten medis oleh tenaga kesehatan
- [ ] `apps/api`: Worker + D1 (`users`, `wounds`, `wound_examinations`, `wound_photos`) + R2
- [ ] Ganti katalog contoh dengan data mitra apotek dan integrasi pembayaran
- [ ] Pengingat harian (Web Push) untuk catat kondisi luka
- [ ] GitHub Actions: deploy staging otomatis dari branch `main`
