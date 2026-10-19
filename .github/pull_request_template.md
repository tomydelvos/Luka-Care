## Ringkasan

<!-- Apa yang diubah dan kenapa? Satu PR untuk satu tujuan. -->

## Jenis perubahan

- [ ] ✨ Fitur baru
- [ ] 🐛 Perbaikan bug
- [ ] ♻️ Refactor
- [ ] 💄 Tampilan / UX
- [ ] 📝 Dokumentasi
- [ ] 🔧 Konfigurasi / tooling

## Bagian yang tersentuh

- [ ] `apps/web`
- [ ] `apps/api` (kontrak di `services/*` ikut diubah bila perlu)
- [ ] **Konten medis** (`apps/web/src/content/`) — wajib ditinjau klinisi sebelum production (aturan produk no. 7)
- [ ] Migrasi database D1

## Screenshot / video

<!-- Wajib untuk perubahan tampilan. Cek juga mode gelap dan layar ponsel. -->

## Cara mengetes

1.
2.

## Checklist

- [ ] CI hijau (lint, test, build staging, test API)
- [ ] Jika konten medis berubah: sudah menjalankan `npm run review:list`
- [ ] Tidak ada `console.log` sisa debug atau data rahasia
- [ ] Copy memakai sapaan "Anda" dan tidak berbentuk diagnosis (aturan produk no. 3)
- [ ] Warna memakai token (`--lc-*`, `on-*`), bukan hex atau `text-white`
- [ ] Sudah self-review di tab "Files changed"
