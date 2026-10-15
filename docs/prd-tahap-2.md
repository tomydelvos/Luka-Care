# PRD Tahap 2: konten berbasis riset di web LukaCare

Versi 1.2, 15 Oktober 2026. Pemilik produk: tim LukaCare. Status: draf untuk ditinjau.

Perubahan versi 1.2: menyesuaikan PRD dengan backend `apps/api` yang sudah masuk `main` (bagian "Kondisi teknis saat ini", "Bukan cakupan", F4, F11, Lampiran C, rencana rilis, risiko, dan urutan kerja), dan memulihkan judul F3 yang hilang.

Perubahan versi 1.1: contoh kasus di langkah 3 panduan (F2a) dan profile kontak di langkah 4 (F12) sudah dikerjakan lebih dulu.

## Ringkasan

Tahap 2 memasukkan isi Buku Panduan Perawatan Luka Luar dan hasil riset waktu penyembuhan ke dalam web LukaCare. Hasilnya: pustaka 10 jenis luka bergambar, panduan dan catatan harian yang memakai warna dasar luka dan kedalaman lapisan kulit, perkiraan waktu pulih yang disajikan sebagai batas waktu periksa, dan cara menilai infeksi yang tetap bekerja di kulit sawo matang. Semua konten punya sumber dan harus lolos tinjauan klinisi sebelum rilis production.

Bahan utama:

- `docs/buku-panduan/buku-panduan-perawatan-luka-luar.md`: buku panduan (Bagian A, B, C, tanda bahaya, P3K, sumber)
- `docs/riset/waktu-penyembuhan-luka-berdasarkan-warna.md`: laporan riset lengkap, termasuk tabel perselisihan sumber dan celah bukti
- `apps/web/public/illustrations/`: 16 ilustrasi; kode penggambarnya di `tools/illustrations/`

## Latar belakang

Tahap 1 menghasilkan frontend dengan panduan 6 langkah untuk 4 jenis luka ringan, daftar tanda bahaya, catatan harian, dan belanja. Konten medisnya masih ringkas, belum bergambar, dan aturan peringatannya bergantung pada kata "kemerahan".

Riset tahap ini menemukan tiga hal yang mengubah desain produk:

1. **Tidak ada literatur yang memberi jumlah hari per warna luka.** Warna dasar luka (hitam, kuning, merah, merah muda) menunjukkan tahap penyembuhan; lapisan kulit yang rusak menentukan lamanya. Aplikasi harus memisahkan keduanya.
2. **Angka waktu pulih paling aman disajikan sebagai batas periksa**, bukan janji tanggal sembuh. Sebagian besar angka untuk dermis berasal dari penelitian luka bakar.
3. **Kemerahan sering tidak tampak di kulit gelap.** Dalam satu studi, kemerahan hanya tercatat pada 2,3% pasien berkulit paling gelap dibanding 13,4% pada kulit terang. Penilaian infeksi harus memakai rabaan, nyeri, bau, dan perluasan dari garis pulpen.

## Kondisi teknis saat ini

Tahap 2 dibangun di atas kondisi berikut (rincian di `CLAUDE.md` dan `apps/api/README.md`):

- **Backend sudah ada:** `apps/api` (Hono di Cloudflare Worker + D1 + R2) dengan tabel `users`, `sessions`, `email_verifications`, `wounds`, `wound_examinations`, dan `wound_photos`. API teruji (Vitest di runtime Workers), tetapi belum di-deploy.
- **Dua mode data:** development memakai API lokal (`VITE_USE_MOCK_API=false`). Staging dan production masih mock (`localStorage`) sampai API di-deploy. Setiap perubahan model data harus dikerjakan di keduanya: `src/services/woundService.js` (mock dan HTTP) dan `apps/api`.
- **Akun:** menyimpan luka untuk dipantau butuh akun. Akun baru wajib verifikasi email dengan kode 6 digit. Penyedia email belum disambungkan, jadi di dev lokal kode tampil di layar. Pertolongan pertama tetap tanpa login.
- **Foto:** foto luka disimpan di bucket R2 privat lewat URL bertanda tangan. Galeri dibatasi 3 foto per luka.
- **Data pribadi (UU PDP):** persetujuan eksplisit saat daftar, unduh data (`GET /me/export`), dan hapus akun (`DELETE /me`) sudah tersedia. Kolom data baru di tahap 2 harus ikut terbawa di ekspor dan terhapus saat akun dihapus.

## Tujuan

| Tujuan | Ukuran | Target awal |
| --- | --- | --- |
| Pengguna mengenali jenis dan kedalaman luka dengan benar | Uji pemahaman 5 soal pada uji kegunaan | 80% jawaban benar |
| Pengguna tahu kapan harus periksa | Peringatan "periksa hari ini" yang ditandai "sudah periksa" dalam 24 jam | Diukur sebagai garis dasar di 4 minggu pertama |
| Pemantauan berjalan | Median catatan harian per luka aktif dalam 7 hari pertama | 4 catatan |
| Konten dapat dipertanggungjawabkan | Blok konten production yang punya sumber dan status "ditinjau" | 100% |
| Ilustrasi tidak memperlambat halaman | LCP halaman pustaka di ponsel kelas menengah, 4G | ≤ 2,5 detik |

Target awal adalah hipotesis dan ditinjau ulang setelah 4 minggu data.

## Bukan cakupan tahap ini

- Klasifikasi warna atau kedalaman luka dari foto secara otomatis (AI). Risikonya tinggi dan belum ada alat tervalidasi untuk awam.
- Deploy API ke staging dan production, serta penyedia email untuk kode verifikasi. Keduanya pekerjaan terpisah dari tahap 2 (lihat "Langkah berikutnya" di `CLAUDE.md`). Selama belum di-deploy, rilis staging tahap 2 berjalan di mode mock, sedangkan development memakai API lokal.
- Telekonsultasi dengan tenaga kesehatan.
- Pembayaran sungguhan di marketplace.
- Bab rabies yang lengkap dengan jadwal vaksin. Butuh sumber Kemenkes tersendiri (lihat pertanyaan terbuka).

## Prinsip yang tidak boleh dilanggar

Semua aturan produk di `CLAUDE.md` tetap berlaku. Tahap 2 menambahkan:

1. **Tidak menjanjikan tanggal sembuh.** Tampilkan rentang perkiraan dan tanggal batas periksa ("Jika belum membaik pada Kamis, 23 Okt, periksakan").
2. **Warna tidak pernah menjadi satu-satunya penanda bahaya.** Setiap pertanyaan tentang kemerahan disertai pertanyaan rabaan (lebih hangat dibanding sisi lain), bentuk kulit (tegang, mengilap, keras), nyeri, bau, dan perluasan dari garis pulpen.
3. **Warna terburuk menentukan tahap.** Jika ada bagian hitam atau kuning, luka belum berada di tahap membaik, walau sebagian besar dasarnya merah.
4. **Hijau, nanah, dan bau adalah tanda bahaya, bukan tahap.** Pisahkan dari empat warna tahap di semua tampilan.
5. **Setiap angka punya asal.** Konten menyimpan label asal data: `A` luka akut, `B` luka bakar, `K` luka kronis, `F` fase penyembuhan umum, `I` inferensi. Label `B` ditampilkan ke pengguna sebagai "berdasarkan data luka bakar"; label `I` tidak boleh rilis ke production tanpa persetujuan klinisi.
6. **Ilustrasi, bukan foto klinis**, untuk semua konten edukasi.

## Pengguna dan skenario

- **Rizki, 22, pengemudi ojek daring.** Baru jatuh, lutut lecet. Ia butuh langkah cepat, lalu ingin tahu kapan lukanya sembuh dan kapan harus khawatir.
- **Ibu Sari, 45, mengurus keluarga.** Menyimpan catatan luka bakar anaknya. Ia ragu apakah lapisan kuning di luka itu nanah.
- **Pak Hendra, 60, penderita diabetes.** Lecet di kaki. Ia perlu diarahkan periksa lebih awal tanpa dibuat panik.

## Fitur

Prioritas: **Wajib** untuk rilis tahap 2, **Sebaiknya** bila waktu cukup, **Bisa** untuk tahap berikutnya.

### F1. Model konten terstruktur dengan sumber (Wajib)

Pindahkan konten dari konstanta JS yang tersebar (`woundGuides.js`, `redFlags.js`, `options.js`) ke satu struktur konten yang punya sumber, label bukti, dan status tinjauan.

- Lokasi: `apps/web/src/content/` (modul JS atau JSON), satu file per jenis luka ditambah `sources.js`, `healing.js`, `colors.js`, `redFlags.js`.
- Setiap blok konten (langkah, ciri, larangan, contoh kasus, angka waktu) membawa `sourceIds`, `evidence` (`A`/`B`/`K`/`F`/`I`), dan `review` (`draft` | `reviewed`, `reviewedBy`, `reviewedAt`).
- `sources.js` berisi semua rujukan dari bagian Sumber di buku: `id`, `title`, `publisher`, `year`, `url`.
- Build production gagal jika ada blok berstatus `draft` atau berlabel `I` tanpa persetujuan. Staging menampilkan pita "Belum ditinjau klinisi" pada blok seperti itu.

Kriteria penerimaan:

- Semua teks medis di aplikasi berasal dari `src/content/`; tidak ada teks medis tersisa di komponen.
- Pemeriksaan otomatis (skrip atau test) memastikan setiap `sourceIds` merujuk ke sumber yang ada.
- `npm run build` dengan `VITE_APP_ENV=production` gagal bila masih ada konten `draft`.

### F2. Pustaka luka (Wajib)

Halaman baru `/pustaka` dan `/pustaka/:jenis` untuk 10 jenis luka di buku, ditambah halaman `/pustaka/warna-luka` untuk Bagian C.

- Daftar dikelompokkan seperti buku: Bagian A (bisa dirawat di rumah) dan Bagian B (perlu tenaga kesehatan), masing-masing dengan ilustrasi kecil.
- Halaman per jenis memuat: ilustrasi tampak atas dan penampang, ciri-ciri, penyebab umum, langkah perawatan atau pertolongan pertama, hal yang dihindari, perlengkapan, perkiraan waktu pulih, kapan periksa, contoh kasus, dan sumber.
- Bab luka bakar menampilkan tabel derajat dari PNPK Kemenkes 2019 dan gambar perbandingan derajat.
- Tautan masuk: beranda, langkah "Jenis luka" di panduan ("Belum yakin? Lihat pustaka"), layar rujukan (`EscalationView`), dan detail luka di Pantau.
- Navigasi: tambahkan "Pustaka" ke navigasi utama (bawah di ponsel, samping di desktop) atau gabungkan dengan "Panduan" sebagai tab. Putuskan lewat uji kegunaan.

Kriteria penerimaan:

- Ke-10 jenis luka tampil lengkap sesuai buku, termasuk contoh kasus.
- Ilustrasi punya teks alternatif dari buku.
- Halaman bisa dibuka langsung lewat URL dan tetap tampil saat di-refresh.

### F2a. Contoh kasus untuk dibaca di panduan (sudah dikerjakan)

Langkah 3 panduan ("Detail luka") kini menampilkan bagian "Contoh kasus untuk dibaca": 10 kasus dari buku, satu per bab.

- Data: `src/data/caseStories.js`. Komponen: `src/components/CaseStories.jsx`, dipakai ulang di `/pustaka` nanti.
- Urutan: kasus dengan kelompok yang sama dengan jenis luka pilihan pengguna tampil paling depan dan ditandai "Mirip luka Anda", lalu sisanya urut bab.
- Filter per kelompok: Lecet, Sayatan & tusuk, Luka bakar, Lepuh, Gigitan hewan.
- Kartu memuat gambar kecil tampak atas, jenis luka, tingkat penanganan (rawat di rumah atau perlu tenaga kesehatan), linimasa ringkas, dan hasil akhir. Kartu bisa digeser dan punya tombol sebelumnya/berikutnya.
- Detail kasus (sheet): ilustrasi lengkap, kronologi bertahap dari menit pertama sampai pulih atau dirujuk, dan "Yang bisa dipelajari". Jenis peristiwa diberi warna: kejadian, pertolongan, pantau, tenaga kesehatan, waspada, tanda bahaya, pulih. Merah hanya untuk tanda bahaya.
- Bagian ini ditaruh di bawah formulir dengan catatan "Sedang menangani luka? Lanjutkan dulu ke langkah perawatan", agar tidak menghambat pertolongan pertama.
- Gambar kecil WebP (4–12 KB) dibuat dengan `npm run thumbs` di `tools/illustrations` dan disimpan di `public/illustrations/kecil/`.

Sisa pekerjaan: pindahkan isi `caseStories.js` ke `src/content/` saat F1, beri `sourceIds` dan status tinjauan per kasus, dan masukkan ke daftar tinjauan F10.

### F3. Panduan yang memakai kedalaman dan ilustrasi (Wajib)

Perbarui alur `/panduan`:

- **Jenis luka:** kartu memakai ilustrasi tampak atas dari `public/illustrations/`.
- **Detail luka:** tambahkan pertanyaan kedalaman yang bisa dijawab awam, dengan gambar contoh:
  - Lecet atau sayatan: "Dasar luka tampak putih, atau ada butiran kuning seperti lemak?" Ya → rujukan Bab 5.
  - Luka bakar: "Ada lepuh?", "Warna dasarnya?" (merah tanpa lepuh / merah muda pucat basah / merah muda gelap / belang, merah tua bercak, atau pucat / putih seperti lilin / hitam hangus), "Masih terasa nyeri?", dan "Seluas berapa telapak tangan korban (termasuk jari)?". Hasilnya diperkirakan dengan tabel PNPK di Lampiran A.
- **Langkah perawatan:** sesuaikan teks dan timer dengan buku (air mengalir 20 menit untuk luka bakar, tekan 5–10 menit untuk sayatan). Tampilkan ilustrasi penampang di atas daftar langkah.
- **Layar rujukan (`EscalationView`):** untuk 6 jenis luka Bagian B, tampilkan ilustrasi dan langkah pertolongan pertama dari bab terkait sambil menuju fasilitas kesehatan.
- **Simpan untuk dipantau:** simpan lapisan perkiraan (`depthLayer`) dan hasil penilaian luka bakar bersama data luka, di mode mock maupun API (`POST /wounds`). Alur daftar, verifikasi email, lalu simpan di langkah 6 tetap seperti sekarang.

Kriteria penerimaan:

- Luka bakar dengan dasar putih, hitam, belang, atau tidak nyeri selalu berakhir di layar rujukan, berapa pun luasnya.
- Luka bakar melepuh yang lebih luas dari satu telapak tangan pada anak selalu diarahkan periksa.
- Lecet dengan dasar putih atau lemak terlihat selalu diarahkan ke Bab 5.

### F4. Catatan harian versi 2 (Wajib)

Ganti formulir "Catat kondisi hari ini" (`CheckInSheet` di `src/components/monitor.jsx`).

| Pertanyaan | Pilihan | Catatan |
| --- | --- | --- |
| Foto luka | Opsional | Tetap seperti tahap 1. Tambahkan tips: cahaya alami, jarak sama, garis pulpen ikut terfoto |
| Warna dasar luka (boleh lebih dari satu) | Merah muda, merah, keropeng tipis, kuning menempel, hitam keras | Setiap pilihan bergambar dari `warna-dasar-luka.png` (dipotong per warna). Tampilkan aturan "warna terburuk menentukan" |
| Cairan | Tidak ada; bening tipis; kuning tipis; kental atau keruh; kehijauan | Jelaskan bahwa kuning tipis masih wajar |
| Bau baru | Ya / tidak | |
| Kulit di sekitar luka dibanding sisi tubuh lainnya | Lebih hangat; tegang atau mengilap; lebih keras; warna lebih gelap, keunguan, atau merah | Boleh lebih dari satu. Tanpa kata "kemerahan" saja |
| Garis pulpen | Belum ditandai; masih di dalam garis; meluas melewati garis | Saat "belum ditandai", tampilkan cara menandai |
| Nyeri | 0–10 | Tetap |
| Demam (≥ 37,7 °C) atau badan sangat lemas | Ya / tidak | |
| Penutup diganti | Ya / tidak | Tetap |

Migrasi data tahap 1: `redness: "meluas"` menjadi `spread: "melewati_garis"`; `fluid: "nanah"` menjadi `fluid: "kental_keruh"`; `fluid: "bening"` menjadi `fluid: "bening_tipis"`. Catatan lama tetap terbaca. Migrasi dijalankan di dua tempat:

- **Perangkat (mode mock):** saat data `localStorage` dibaca.
- **Server (mode API):** migrasi D1 bernomor baru di `apps/api/migrations/` untuk tabel `wound_examinations`. API tetap menerima catatan versi 1 dari klien lama sampai semua klien memakai versi 2.

Kriteria penerimaan:

- Formulir bisa diisi dalam ≤ 60 detik oleh peserta uji kegunaan.
- Tidak ada pertanyaan bahaya yang hanya bertumpu pada warna merah.
- Catatan tahap 1 yang sudah tersimpan tetap tampil benar setelah pembaruan, baik dari `localStorage` maupun dari API.
- Test API (`apps/api`, `npm test`) mencakup penyimpanan catatan versi 2, penolakan nilai di luar pilihan, dan pembacaan catatan versi 1.

### F5. Aturan penilaian versi 2 (Wajib)

Ganti `src/lib/checkin.js` dengan fungsi murni `assessCheckin(wound, checkin, previous)` yang mengembalikan `{ level, reasons[] }`. Level: `igd`, `hari_ini`, `beberapa_hari`, `pantau`. Aturan lengkap ada di Lampiran B.

- Setiap alasan membawa teks untuk pengguna dan `sourceIds`.
- Level tertinggi menentukan tampilan: banner di detail luka, lencana di daftar luka, dan toast setelah menyimpan.
- Level `igd` menampilkan tombol telepon 119 dan tautan faskes terdekat.

Kriteria penerimaan:

- Test unit (Vitest) untuk setiap baris di Lampiran B, termasuk kombinasi yang menaikkan level.
- Tidak ada aturan yang memberi diagnosis ("Anda terkena infeksi"); kalimat selalu berbentuk "tanda ini perlu diperiksakan hari ini".

### F6. Perkiraan waktu pulih dan batas periksa (Wajib)

Di detail luka (`/pantau/:id`), tampilkan:

- **Perkiraan pulih**: rentang dari Lampiran A sesuai jenis dan lapisan, misalnya "Biasanya 3–7 hari".
- **Batas periksa**: tanggal konkret dari tanggal luka ditambah batas di Lampiran A, misalnya "Jika belum membaik pada Kamis, 23 Okt, periksakan". Setelah tanggal itu lewat tanpa catatan membaik, naikkan level ke `beberapa_hari`.
- **Batas 4 minggu** untuk semua luka: luka yang masih terbuka setelah 28 hari diarahkan ke perawatan profesional.
- **Luka bakar**: pengingat untuk melihat ulang pada hari ke-2–3, karena kedalaman bisa bertambah.
- **Kelompok berisiko** (diabetes, lansia, perokok, gizi kurang, daya tahan tubuh rendah): tampilkan "Periksakan lebih awal" tanpa angka sampai klinisi menetapkan ambangnya.
- Linimasa fase penyembuhan normal (Bagian C buku) dengan posisi hari ini.
- Label asal data: "berdasarkan data luka bakar" untuk angka berlabel `B`.

Kriteria penerimaan:

- Tidak ada teks "sembuh pada tanggal ...".
- Tanggal batas periksa dihitung dari zona waktu perangkat dan ditampilkan dalam format Indonesia.
- Luka di Bagian B tidak menampilkan perkiraan waktu pulih mandiri, hanya arahan ke tenaga kesehatan.

### F7. Perawatan bekas luka setelah pulih (Sebaiknya)

Setelah pengguna menekan "Tandai sudah pulih":

- Kartu perawatan bekas luka: tabir surya SPF 30 atau lebih setiap hari, bekas luka matang dalam 6–12 bulan dan bisa membaik sampai sekitar 2 tahun, noda cokelat lebih sering di kulit gelap dan bisa bertahan berbulan-bulan sampai bertahun-tahun.
- Catatan bulanan opsional berisi foto bekas luka dan pertanyaan "makin tebal atau meninggi?". Jawaban ya → saran periksa.

### F8. Halaman sumber dan label bukti (Wajib)

- Halaman `/sumber` berisi semua rujukan dari `sources.js`, dikelompokkan per topik.
- Setiap halaman pustaka dan panel perawatan punya tautan "Sumber" yang membuka daftar rujukan untuk blok itu.
- Penafian di semua halaman konten: panduan perawatan dasar, bukan diagnosis.

### F9. Ilustrasi di aplikasi (Wajib untuk dasar, Sebaiknya untuk varian kulit)

- Pakai PNG di `public/illustrations/` dengan `loading="lazy"`, `width`/`height` eksplisit, dan teks alternatif. Tambahkan WebP sebagai format utama dengan PNG sebagai cadangan.
- Untuk layar ponsel, buat potongan terpisah "tampak atas" dan "penampang" dari tiap gambar bab lewat `tools/illustrations` (ilustrasi lebar 1200 px terlalu kecil bila dipaksa ke 360 px).
- Potong `warna-dasar-luka` menjadi swatch per warna untuk F4.
- **Sebaiknya:** varian warna kulit lebih gelap untuk semua tampak atas, dengan pilihan "Tampilkan pada kulit lebih gelap" di halaman pustaka.

### F10. Tinjauan klinisi dan tata kelola konten (Wajib)

- Daftar tinjauan untuk dokter atau perawat, minimal mencakup:
  - semua angka waktu dan ambang di Lampiran A dan B;
  - cara awam membedakan keropeng normal dari jaringan mati hitam (belum ada sumber);
  - gejala tetanus di Bab 6 (belum ada sumber);
  - ambang periksa untuk kelompok berisiko;
  - ambang luka bakar untuk awam (PNPK memakai ambang rumah sakit);
  - kronologi dan "Yang bisa dipelajari" pada 10 contoh kasus (F2a).
- Status tinjauan disimpan per blok konten (F1). Perubahan konten setelah tinjauan mengembalikan status ke `draft`.
- Doc "Buku Panduan Perawatan Luka Luar" di Claude tetap menjadi tempat komentar klinisi sampai konten pindah ke repo; setelah itu repo menjadi sumber utama dan doc diperbarui dari repo.

### F11. Pengingat (Bisa)

Pengingat catatan harian, pengingat lihat ulang luka bakar pada hari ke-2–3, dan pengingat batas periksa, lewat Web Push. Di iOS, Web Push hanya bekerja setelah web dipasang sebagai PWA, jadi fitur ini butuh manifest dan service worker. Pengiriman push juga butuh API yang sudah di-deploy, untuk menyimpan langganan push per akun dan mengirim pengingat terjadwal (Cron Trigger di Worker).

### F12. Profile kontak di langkah perawatan (sudah dikerjakan)

Footer halaman langkah 4 panduan ("Perawatan") menampilkan profile kontak LukaCare: nama, peran, keterangan singkat, email, WhatsApp, Instagram, situs, jam layanan, dan peninjau konten.

- Data: `src/data/contact.js`. Komponen: `src/components/ContactProfile.jsx`. Kolom bernilai `null` tidak ditampilkan.
- Profile kontak dipisah tegas dari jalur darurat: di bawahnya selalu ada "Bukan layanan darurat" dan tombol "Telepon 119".
- Nilai saat ini masih contoh (`halo@lukacare.com`, jam layanan). **Wajib diganti data asli sebelum rilis**; jangan tampilkan nomor yang belum aktif.
- Setelah F10, isi `reviewer` agar nama klinisi peninjau tampil sebagai tanda kepercayaan.

## Lampiran A. Waktu pulih dan batas periksa per jenis luka

| Jenis dan kondisi | Lapisan | Perkiraan pulih | Batas periksa | Asal |
| --- | --- | --- | --- | --- |
| Lecet ringan (merah muda, basah, kecil) | Epidermis | 3–7 hari | 7 hari | A |
| Lecet lebar atau dalam | Dermis atas | 1–2 minggu atau lebih | 14 hari | A |
| Lecet dengan dasar putih atau lemak terlihat | Lemak | Tidak untuk dirawat sendiri | Segera (Bab 5) | A |
| Sayatan kecil bertepi rapat | Dermis | Permukaan menutup ±48 jam; bagian dalam pulih sampai ±3 minggu | 7 hari tanpa perbaikan | A, F; batas 7 hari = I |
| Luka bakar derajat 1 (merah, tanpa lepuh) | Epidermis | ±7 hari (3–10 hari) | 10 hari; lihat ulang hari ke-2–3 | B |
| Luka bakar derajat 2 superfisial, kecil | Dermis atas | Biasanya ≤14 hari, sampai ±3 minggu | 14 hari (Papini: rujuk bila belum sembuh ±10 hari); lihat ulang hari ke-2–3 | B |
| Luka bakar merah muda gelap, belang, pucat, putih, atau hitam | Dermis tengah sampai otot | Tidak untuk dirawat sendiri | Segera | B |
| Lepuh gesekan | Di bawah epidermis | Beberapa hari sampai ±1 minggu; ≥ 2 minggu bila terus tergesek | 14 hari | A; batas = I |
| Semua luka | — | — | 28 hari masih terbuka → perawatan profesional | F |
| Kelompok berisiko | — | Lebih lambat, belum terkuantifikasi | "Periksakan lebih awal", angka menunggu klinisi | F |

Rincian sumber per angka ada di laporan riset, bagian "Tabel publik" dan "Sumber berselisih".

## Lampiran B. Aturan penilaian catatan harian

| Pemicu | Level |
| --- | --- |
| Demam ≥ 37,7 °C, menggigil, atau badan sangat lemas, bersama tanda infeksi apa pun | `igd` |
| Kulit di sekitar luka menghitam, keabuan, melepuh, atau mati rasa | `igd` |
| Perubahan kulit meluas melewati garis pulpen | `hari_ini` (`igd` bila disertai demam) |
| Garis yang menjalar menjauhi luka | `hari_ini` |
| Cairan kental, keruh, atau kehijauan | `hari_ini` |
| Bau yang baru muncul | `hari_ini` |
| Lebih hangat dibanding sisi lain, ditambah tegang/keras, ditambah nyeri naik | `hari_ini` |
| Nyeri naik ≥ 3 poin dari catatan sebelumnya | `hari_ini` (aturan tahap 1, perlu konfirmasi klinisi) |
| Luka bakar pada hari ke-2–3 tampak lebih pucat, belang, atau nyeri justru berkurang | `hari_ini` |
| Bagian hitam baru muncul di dasar luka | `beberapa_hari` |
| Lapisan kuning menempel yang terus muncul kembali | `beberapa_hari` |
| Dasar merah pucat, merah gelap rapuh yang mudah berdarah, atau jaringan merah yang menonjol | `beberapa_hari` |
| Batas periksa (Lampiran A) lewat tanpa tanda membaik | `beberapa_hari` |
| Luka masih terbuka setelah 28 hari | `beberapa_hari`, dengan teks "perlu perawatan profesional" |
| Tidak ada pemicu | `pantau` |

Sumber per aturan: MedlinePlus, IWII 2022, NHS Forth Valley, NICE NG141, Wounds International 2023, AAFP 2020, Oxford Health 2023, healthdirect. Rinciannya di laporan riset, bagian "Batas waktu periksa".

## Lampiran C. Perubahan data

```js
// Wound (tambahan)
{
  depthLayer: "epidermis" | "dermis_atas" | "dermis_dalam" | "lemak" | "otot" | "tidak_diketahui",
  burn: { blister, baseColor, painful, palms, area } | null,
  risk: { diabetes, lansia, perokok, imunLemah },
  healing: { minDays, maxDays, checkByDays, evidence },  // dihitung saat simpan, dari content/healing.js
  contentVersion: "2026-10",                             // versi konten yang dipakai saat penilaian
}

// Checkin (versi 2)
{
  schema: 2,
  photo, pain, dressingChanged, note,
  bedColors: ["merah_muda" | "merah" | "keropeng" | "kuning" | "hitam"],
  fluid: "tidak" | "bening_tipis" | "kuning_tipis" | "kental_keruh" | "kehijauan",
  newOdor: boolean,
  skin: ["lebih_hangat" | "tegang_mengilap" | "keras" | "lebih_gelap"],
  spread: "belum_ditandai" | "di_dalam_garis" | "melewati_garis",
  fever: boolean,
  assessment: { level, reasons },  // hasil assessCheckin saat disimpan
}
```

Kontrak API (`POST /wounds` dan `POST /wounds/:id/examinations`, lihat `apps/api/README.md`) ikut memakai bentuk ini. Perubahan yang dibutuhkan di `apps/api`:

- Migrasi D1 baru: kolom tambahan di `wounds` (`depth_layer`, `burn`, `risk`, `healing`, `content_version`) dan `wound_examinations` (`schema`, `bed_colors`, `new_odor`, `skin`, `spread`, `assessment`). Kolom berisi daftar atau objek disimpan sebagai JSON teks.
- Validasi nilai pilihan di `src/lib/validate.js`, disamakan dengan konstanta di frontend.
- Pembentukan respons di `src/lib/wounds.js`, termasuk ekspor `GET /me/export`.
- `assessment` dan `healing` dihitung di klien saat simpan dan disimpan apa adanya. Server tidak menilai ulang, jadi aturan Lampiran B cukup ada di satu tempat (`src/lib/checkin.js`).

## Rencana rilis

| Tahap | Isi | Ukuran |
| --- | --- | --- |
| M1. Fondasi konten | F1, F8, potongan ilustrasi F9, test sumber | Sedang |
| M2. Pustaka | F2, ilustrasi di panduan (F3 bagian kartu dan langkah) | Sedang |
| M3. Pemantauan | F4, F5, F6, migrasi data di `localStorage` dan D1, perubahan `apps/api` (Lampiran C) | Besar |
| M4. Luka bakar dan rujukan | Penilaian luka bakar dan pertanyaan kedalaman (F3), `EscalationView` bergambar | Sedang |
| M5. Tinjauan dan rilis | F10, uji kegunaan 5–8 peserta berkulit sawo matang, perbaikan, rilis staging lalu production. Rilis production dengan akun butuh API yang sudah di-deploy dan penyedia email | Sedang |
| Berikutnya | F7, varian warna kulit (F9), F11 | — |

Uji kegunaan di M5 mencakup soal: membedakan kuning tipis dari nanah, aturan warna terburuk, cara menandai garis pulpen, dan arti batas periksa.

## Risiko

| Risiko | Mitigasi |
| --- | --- |
| Pengguna menunda periksa karena merasa "masih dalam rentang waktu pulih" | Batas periksa selalu tampil bersama tanda bahaya; tanda bahaya mengalahkan rentang waktu |
| Angka inferensi (label I) dianggap fakta | Build production menolak label I tanpa persetujuan klinisi |
| Infeksi terlewat di kulit gelap | Pertanyaan rabaan dan garis pulpen wajib di formulir; uji kegunaan dengan peserta berkulit sawo matang |
| Ilustrasi terlalu kecil di ponsel | Potongan per panel dan swatch warna (F9) |
| Tinjauan klinisi lambat dan menahan rilis | Mulai tinjauan di M1 secara paralel; rilis staging tetap berjalan dengan pita "Belum ditinjau" |
| Data tahap 1 rusak setelah perubahan skema | Migrasi bernomor versi di `localStorage` dan D1, dan test untuk data contoh tahap 1 di kedua tempat |
| Mock dan API tidak sama setelah perubahan model data | Ubah `woundService.js` (mock dan HTTP) dan `apps/api` di PR yang sama; uji alur simpan di kedua mode |

## Pertanyaan terbuka

1. Siapa klinisi peninjau (dokter umum, perawat luka, atau dokter spesialis bedah plastik untuk luka bakar), dan berapa lama siklus tinjauannya?
2. Ambang periksa lebih awal untuk kelompok berisiko: berapa hari?
3. Apakah bab rabies lengkap (jadwal vaksin anti rabies) masuk tahap 2? Perlu sumber Kemenkes khusus.
4. Pustaka jadi menu tersendiri atau tab di dalam Panduan?
5. Apakah varian ilustrasi kulit lebih gelap menjadi syarat rilis tahap 2?
6. Berapa lama foto dan catatan luka disimpan di server (R2 dan D1) setelah luka sembuh atau akun tidak aktif, sesuai UU PDP? Hapus akun sudah menghapus semuanya; yang belum ada adalah kebijakan retensi.
7. Data asli profile kontak: email, nomor WhatsApp, akun Instagram, jam layanan, dan siapa yang membalas pesan.

## Urutan kerja yang disarankan di Claude Code

1. Baca `CLAUDE.md`, PRD ini, dan buku panduan.
2. Mulai dari M1: buat `apps/web/src/content/`, pindahkan konten tahap 1, lalu tambahkan konten buku. Tambahkan ESLint dan Vitest bila belum ada.
3. Tulis test Lampiran B sebelum mengubah `src/lib/checkin.js`.
4. Kerjakan M2 sampai M4 secara berurutan; jalankan `npm run build` dan test di akhir setiap tahap.
5. Setiap perubahan model data (F3, F4, F6) dikerjakan bersamaan di `src/services/woundService.js` dan `apps/api` (migrasi D1, validasi, test). Jalankan `npm test` di `apps/api` dan coba alur simpan lewat `jalankan-lukacare.command` dengan akun demo `demo@lukacare.test`.
