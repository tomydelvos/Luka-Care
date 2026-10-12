# LukaCare — konteks untuk Claude Code

LukaCare adalah web app pendamping perawatan luka ringan untuk pengguna Indonesia: panduan pertolongan pertama langkah demi langkah, catatan pemulihan harian dengan foto, dan belanja perlengkapan P3K. Domain: lukacare.com. Baca `README.md` untuk struktur folder, rute, environment, dan kontrak API.

## Perintah

```bash
cd apps/web
npm install
npm run dev              # http://localhost:3001
npm run build            # output ke apps/web/dist
npm run build:staging    # pakai .env.staging
npm run deploy:staging   # wrangler → staging.lukacare.com
```

Di Mac tanpa Terminal: klik kanan `jalankan-lukacare.command` di root repo → Open. Skrip mengecek Node.js ≥ 20, menjalankan `npm install` sekali, lalu `npm run dev -- --open`.

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
- Semua data masih mock (`VITE_USE_MOCK_API=true`): luka, akun, dan keranjang disimpan di `localStorage` dengan prefix `lukacare:`.
- Checkout masih demo, tanpa pembayaran sungguhan.
- Katalog produk di `src/data/products.js` masih contoh dengan nama generik.
- Backend `apps/api` (Hono di Cloudflare Worker + D1 + R2) sudah ada dan teruji, tapi belum di-deploy dan frontend masih memakai mock. Kontraknya sama dengan `src/services/woundService.js` dan `authService.js`; ubah keduanya bersamaan. Batas galeri (`MAX_GALLERY_PHOTOS`) didefinisikan di frontend dan di `apps/api/src/routes/wounds.js`.

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
- **Styling**: Tailwind v4 dengan token warna di `src/index.css` (`--lc-*`, dipetakan ke kelas seperti `bg-pine`, `text-muted`, `bg-alert-soft`). Selalu pakai token, jangan hex literal, agar mode gelap tetap benar. Merah (`alert`) hanya untuk bahaya atau darurat.
- **Komponen UI** dasar ada di `src/components/ui.jsx` (`Button`, `ChoiceGroup`, `Field`, `Sheet`, `Banner`, `Badge`, `QtyStepper`, `Toggle`). Pakai ulang sebelum membuat yang baru.
- **Identitas visual**: motif plester (kelas `plaster-wing` dan `plaster-pad`) hanya dipakai di hero beranda dan logo. Font Plus Jakarta Sans dari Google Fonts.
- **Copy**: Bahasa Indonesia, sapaan "Anda", sentence case, kalimat aktif dan pendek. Tombol menyebut aksinya ("Simpan catatan", bukan "Submit"). Pesan error menjelaskan apa yang salah dan cara memperbaikinya.
- **Aksesibilitas**: target sentuh minimal 44px, fokus keyboard terlihat, `prefers-reduced-motion` dihormati, dialog (`Sheet`) menjebak fokus dan menutup dengan Escape.
- **Mobile-first**: navigasi bawah di mobile, sidebar di desktop (`lg:`). Halaman `/panduan` tampil dalam mode fokus tanpa navigasi utama.

## Langkah berikutnya

- [ ] Review konten medis oleh tenaga kesehatan
- [ ] Tambah ESLint dan beberapa test (Vitest + Testing Library) untuk `assessDetails`, `checkinWarnings`, dan alur panduan
- [x] `apps/api`: Worker + D1 (`users`, `wounds`, `wound_examinations`, `wound_photos`) + R2
- [ ] Sambungkan frontend ke API (`VITE_USE_MOCK_API=false`), tentukan alur simpan luka tanpa login, deploy API ke staging
- [ ] Ganti katalog contoh dengan data mitra apotek, integrasi pembayaran
- [ ] Pengingat harian (Web Push) untuk catat kondisi luka
- [ ] GitHub Actions: deploy staging otomatis dari `main`

## Riwayat

`docs/catatan-prd-awal.txt` berisi catatan diskusi PRD awal (nama fitur, alur Wound Care Guide, arsitektur Cloudflare, rencana domain). Beberapa poin di sana sudah diperbarui:
- Stack frontend sekarang React, bukan Angular.
- `localhost:3001` adalah development lokal; staging adalah `staging.lukacare.com`.
- Kategori luka dipisah menjadi jenis (lecet, sayatan, luka bakar ringan, lepuh) dan kondisi (berdarah, basah, kering).
