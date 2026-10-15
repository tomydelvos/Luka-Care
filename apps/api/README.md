# LukaCare API

Cloudflare Worker ([Hono](https://hono.dev)) + D1 + R2. Kontrak endpoint mengikuti `apps/web/src/services/*`, jadi frontend cukup diganti ke `VITE_USE_MOCK_API=false`.

## Menjalankan di lokal

```bash
cd apps/api
npm ci
cp .dev.vars.example .dev.vars   # isi FILE_SIGNING_SECRET, biarkan PUBLIC_API_URL=http://localhost:8787
npm run db:migrate:local
npm run db:seed:local            # akun demo terverifikasi: demo@lukacare.test / lukacare123
npm run dev                      # http://localhost:8787
```

D1 dan R2 disimulasikan oleh Wrangler (data di `.wrangler/`). Untuk mencoba frontend dengan API ini:

```bash
cd apps/web
VITE_USE_MOCK_API=false npm run dev   # http://localhost:3001 → http://localhost:8787
```

## Test

```bash
npm test
```

Test berjalan di runtime Workers (`@cloudflare/vitest-plugin`) dengan D1 dan R2 lokal: auth, verifikasi email, isolasi data antar pengguna, catatan harian, unggah foto, batas galeri 3 foto, ekspor dan hapus data.

## Endpoint

Semua respons berbentuk `{ success: true, data }` atau `{ success: false, message }`. Endpoint selain `/auth/*` dan `/health` butuh header `Authorization: Bearer <token>`.

| Metode | Path | Isi |
| --- | --- | --- |
| POST | `/auth/register` | `{ name, email, password, consent: true }` → `{ verification }`, kode dikirim ke email |
| POST | `/auth/login` | `{ email, password }` → `{ token, user }`, atau `{ verification }` (kode baru) bila email belum diverifikasi |
| POST | `/auth/verify` | `{ email, code }` → `{ token, user }` |
| POST | `/auth/resend` | `{ email }` → `{ verification }`, jeda 60 detik antar permintaan |
| POST | `/auth/logout` | Mencabut token sesi |
| GET | `/me` | Profil pengguna |
| GET | `/me/export` | Semua data pengguna (unduh data, UU PDP) |
| DELETE | `/me` | Hapus akun, luka, catatan, sesi, dan foto di R2 |
| GET / POST | `/wounds` | Daftar luka (dengan `checkins` dan `photos`) / buat luka |
| PATCH / DELETE | `/wounds/:id` | Ubah (judul, status, healedAt, …) / hapus beserta fotonya |
| POST | `/wounds/:id/examinations` | Catatan harian → `wound_examinations`. `schema: 2` memakai isian tahap 2 (`bedColors`, `fluid`, `newOdor`, `skin`, `spread`, `burnWorse`, `assessment`); tanpa `schema` memakai format tahap 1. Keduanya bisa bercampur di satu luka |
| POST | `/wounds/:id/photos` | Galeri `{ src }`, maksimal 3 → `wound_photos` |
| DELETE | `/wounds/:id/photos/:photoId` | Hapus foto galeri |
| POST | `/uploads/wound-photo` | `{ woundId, contentType: "image/jpeg" }` → `{ uploadUrl, photoUrl }` |

### Alur foto

1. Frontend mengompres foto ke JPEG, lalu `POST /uploads/wound-photo`.
2. Frontend `PUT` JPEG ke `uploadUrl` (berlaku 10 menit).
3. Frontend mengirim `photoUrl` (`r2:<key>`) sebagai `photo` di catatan harian atau `src` di galeri.
4. Worker memastikan foto milik luka itu, sudah terunggah, JPEG, dan maksimal 2 MB.
5. Saat data dibaca, foto dikirim sebagai URL bertanda tangan yang berlaku 1 jam. Bucket tetap privat.

Kalau `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, dan `R2_ACCOUNT_ID` terisi, URL itu adalah presigned URL R2, jadi binary foto tidak lewat Worker. Kalau kosong (dev lokal), Worker memakai URL bertanda tangan HMAC ke dirinya sendiri (`/uploads/direct/*`, `/files/*`).

## Deploy

Sekali per environment (contoh production; untuk staging tambahkan `-staging` dan `--env staging`):

```bash
npx wrangler d1 create lukacare                 # salin database_id ke wrangler.jsonc
npx wrangler r2 bucket create lukacare-photos
npx wrangler secret put FILE_SIGNING_SECRET     # string acak panjang
npm run db:migrate:production
npm run deploy:production                       # → https://api.lukacare.com
```

Supaya browser bisa unggah langsung ke R2 (direkomendasikan):

1. Buat API token R2 (Object Read & Write, khusus bucket ini).
2. `npx wrangler secret put R2_ACCESS_KEY_ID` dan `npx wrangler secret put R2_SECRET_ACCESS_KEY`.
3. Isi `R2_ACCOUNT_ID` di `wrangler.jsonc`.
4. Pasang CORS bucket untuk `PUT`/`GET` dari `https://lukacare.com` (dan `https://staging.lukacare.com`) dengan header `Content-Type`:
   `npx wrangler r2 bucket cors set lukacare-photos --file r2-cors.json`

## Verifikasi email

Akun baru baru mendapat token setelah memasukkan kode 6 digit (`src/lib/verification.js`). Kode disimpan sebagai hash, berlaku 15 menit, maksimal 5 kali salah, lalu harus minta kode baru. `verification` berisi `{ email, resendAt }`, ditambah `devCode` bila `DEV_EXPOSE_CODES=true` (hanya untuk dev lokal dan test).

Belum ada penyedia email: kode hanya ditulis ke log Worker (`deliver()`). Sebelum staging/production, sambungkan penyedia email (mis. Resend atau Cloudflare Email) di `deliver()` dan jangan set `DEV_EXPOSE_CODES`.

## Belum ada

- Pengiriman email kode verifikasi (lihat di atas).
- Rate limit login/daftar (bisa pakai Cloudflare Rate Limiting rules atau binding `ratelimit`).
- Reset kata sandi lewat email.
- Pembersihan foto yang sudah diunggah tapi tidak pernah dipakai (pasang lifecycle rule R2, misalnya hapus objek > 1 hari di prefix yang belum tercatat).

