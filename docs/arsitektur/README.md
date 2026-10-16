# Diagram arsitektur

`arsitektur-lukacare.html` menggambarkan alur LukaCare dari browser ke Cloudflare Worker (`lukacare-web`, `lukacare-api`), D1, dan R2, termasuk mode contoh di `localStorage`. Buka file HTML-nya langsung di browser; tombol SRC di tiap kotak membuka baris kode sumbernya di GitHub.

- Sumber diagram: `arsitektur-lukacare.archify.json` (dibuat dengan [archify](https://github.com/tt-a1i/archify)).
- Kode yang digambarkan: commit `8b6cc7f` (`meta.repository.revision`). Jika arsitektur berubah, perbarui JSON, ganti `revision` ke commit terbaru, lalu render ulang.
- Isi diagram berbahasa Indonesia; tombol bawaan viewer (Export, Path, Lens, Legend) tetap berbahasa Inggris karena archify belum punya katalog Bahasa Indonesia.

Render ulang dari root repo (butuh Chrome atau Chromium untuk uji tampilan):

```bash
node <path-archify>/bin/archify.mjs finalize architecture \
  docs/arsitektur/arsitektur-lukacare.archify.json \
  docs/arsitektur/arsitektur-lukacare.html \
  --repo-root . --quality showcase --json
```

File `*.finalize.json`, `*.delivery.json`, dan `*.browser-check.json` yang ikut terbuat adalah bukti pemeriksaan lokal dan tidak perlu di-commit.
