# Panduan uji kegunaan LukaCare (tahap 2, M5)

Dokumen ini untuk fasilitator dan pengamat. Isinya: tujuan, peserta, persiapan, 9 tugas, kuis pemahaman, lembar pengamat, dan cara membaca hasil. Satu sesi sekitar 45 menit per peserta.

## Tujuan

Uji ini menjawab pertanyaan dari PRD tahap 2 (`docs/prd-tahap-2.md`):

| Pertanyaan | Ukuran | Target |
| --- | --- | --- |
| Apakah pengguna mengenali jenis dan kedalaman luka dengan benar? | Kuis pemahaman 5 soal | 80% jawaban benar |
| Apakah catatan harian cukup cepat diisi? | Waktu tugas 6 | ≤ 60 detik |
| Apakah pengguna tahu kapan harus periksa? | Tugas 1, 4, 7, dan 8 berhasil tanpa bantuan | Semua peserta |
| Apakah tanda infeksi tetap dikenali di kulit sawo matang? | Tugas 6 dan 7: peserta memakai rabaan dan garis pulpen, bukan hanya warna merah | Semua peserta |
| "Pustaka" jadi menu tersendiri atau tab di Panduan? | Tugas 9: ke mana peserta mencari | Keputusan desain |

Yang diuji adalah aplikasinya, bukan pesertanya. Sampaikan ini di awal sesi.

## Peserta

- **Jumlah:** 5–8 orang, usia 18 tahun ke atas, **berkulit sawo matang sampai gelap**.
- **Campuran yang dicari:**
  - 2 orang tua dengan anak di bawah 12 tahun;
  - 1 lansia atau orang yang merawat lansia;
  - 1 orang dengan diabetes atau anggota keluarganya;
  - 1 pekerja lapangan yang sering terluka ringan, misalnya pengemudi ojek, pedagang gorengan, atau tukang;
  - sisanya pengguna ponsel Android biasa.
- **Bukan peserta:** tenaga kesehatan dan mahasiswa kesehatan (mereka sudah tahu jawabannya), tim LukaCare, dan orang yang sedang punya luka yang belum ditangani.
- Minimal separuh peserta memakai ponsel kelas menengah miliknya sendiri.

## Etika dan data pribadi

Data kesehatan adalah data pribadi spesifik (UU PDP), jadi uji ini **tidak memakai luka atau foto luka asli**.

- Minta persetujuan tertulis sebelum mulai: tujuan uji, apa yang direkam (layar dan suara saja, bukan wajah), lama penyimpanan rekaman, dan hak berhenti kapan saja tanpa alasan.
- Semua luka dalam tugas adalah skenario fiktif di kartu. Lewati unggah foto; foto bersifat opsional di aplikasi.
- Peserta memakai **email uji** yang disiapkan tim (misalnya `peserta1@uji.lukacare.test`), bukan email pribadinya.
- Bila peserta bercerita tentang luka asli yang sedang dialami, fasilitator **tidak memberi saran medis**. Sarankan periksa ke puskesmas atau klinik, lalu lanjutkan sesi.
- Setelah sesi, hapus akun uji (halaman Akun → "Hapus semua data") dan simpan rekaman di folder tim yang aksesnya terbatas. Hapus rekaman setelah ringkasan selesai.

## Persiapan

**Aplikasi.** Pakai `https://staging.lukacare.com` bila sudah di-deploy. Staging berjalan di mode contoh: data tersimpan di ponsel peserta, dan kode verifikasi email tampil di layar. Jika staging belum ada, jalankan LukaCare di laptop dengan `jalankan-lukacare.command` dan biarkan peserta memakai laptop dengan jendela browser selebar ponsel (catat ini di hasil).

**Sebelum setiap sesi:**

- [ ] Hapus data aplikasi di ponsel uji (halaman Akun → "Hapus semua data", atau hapus data situs di browser).
- [ ] Siapkan kartu skenario tugas 1–9 (cetak satu tugas per kartu).
- [ ] Siapkan pulpen untuk tugas 6.
- [ ] Siapkan stopwatch untuk tugas 6.
- [ ] Siapkan lembar pengamat dan lembar kuis.
- [ ] Nyalakan perekam layar dan suara bila peserta setuju.

**Peran:** satu fasilitator membacakan tugas dan menjawab pertanyaan teknis saja; satu pengamat mencatat. Jangan membantu kecuali peserta benar-benar buntu lebih dari 2 menit; catat bantuan itu.

## Alur sesi (45 menit)

| Waktu | Kegiatan |
| --- | --- |
| 5 menit | Pembukaan, persetujuan, minta peserta berpikir keras sambil memakai aplikasi |
| 30 menit | Tugas 1–9 |
| 5 menit | Kuis pemahaman |
| 5 menit | Wawancara penutup |

Kalimat pembuka: "Kami sedang menguji aplikasi, bukan menguji Anda. Tidak ada jawaban salah. Tolong ceritakan apa yang Anda pikirkan sambil memakai aplikasinya, termasuk saat bingung."

## Tugas

Bacakan skenario apa adanya. Jangan menyebut nama menu atau tombol.

### Tugas 1. Darah tidak berhenti

> Adik Anda teriris pisau cukup dalam. Darahnya sudah ditekan 10 menit tetapi masih mengalir. Buka LukaCare dan cari tahu apa yang harus dilakukan.

- **Berhasil bila:** peserta memilih "Darah tidak berhenti" di langkah pertama panduan dan sampai di layar "Hubungi 119 sekarang".
- **Amati:** apakah peserta membaca daftar tanda bahaya, atau langsung mencari jenis luka; berapa lama sampai melihat tombol telepon 119.

### Tugas 2. Lecet karena jatuh dari motor

> Anda jatuh dari motor. Lutut Anda lecet selebar koin, berpasir, dan masih berdarah sedikit. Dasar lukanya merah. Ikuti panduan sampai Anda tahu cara merawatnya.

- **Berhasil bila:** peserta menjawab tidak ada tanda bahaya, memilih lecet, menjawab "Tidak, dasarnya merah atau merah muda" pada pertanyaan dasar luka, dan sampai di langkah perawatan.
- **Amati:** apakah pertanyaan "butiran kuning seperti lemak" dipahami; apakah gambar contoh luka robek membantu atau membuat takut.

### Tugas 3. Cipratan minyak goreng

> Saat menggoreng, minyak panas memercik ke punggung tangan Anda. Kulitnya merah selebar dua jari, ada dua lepuh kecil, dasarnya merah muda pucat dan basah, dan terasa sangat nyeri. Cari tahu apa yang harus dilakukan.

- **Berhasil bila:** peserta menjawab keempat pertanyaan luka bakar (luas, lepuh, warna dasar, nyeri) dan sampai di langkah perawatan, lalu menyalakan timer 20 menit.
- **Amati:** apakah peserta memakai gambar perbandingan derajat; pilihan warna mana yang membuat ragu; apakah peserta paham "telapak tangan korban termasuk jari".

### Tugas 4. Luka bakar knalpot pada anak

> Betis anak Anda (8 tahun) menempel ke knalpot motor. Lukanya kecil, bagian tengahnya putih, dan anehnya anak Anda bilang tidak terlalu sakit. Cari tahu apa yang harus dilakukan.

- **Berhasil bila:** peserta sampai di layar rujukan ("Periksakan ke fasilitas kesehatan hari ini" atau "Hubungi 119 sekarang") dan bisa menyebut langkah yang dilakukan sambil berangkat.
- **Amati:** apakah peserta menganggap "tidak sakit" sebagai tanda baik; apakah ilustrasi dan langkah Bab 9 di layar rujukan dibaca.

### Tugas 5. Simpan luka untuk dipantau

> Lanjutkan dari luka cipratan minyak tadi. Anda ingin memantau luka ini setiap hari. Simpan lukanya.

Jika peserta sudah keluar dari panduan, minta ulangi tugas 3 dengan cepat.

- **Berhasil bila:** peserta membuat akun dengan email uji, memasukkan kode verifikasi, dan sampai di halaman detail luka.
- **Amati:** apakah persetujuan data kesehatan dibaca; di mana peserta mencari kode verifikasi; apakah ada yang ingin berhenti karena diminta membuat akun.

### Tugas 6. Catatan harian hari ke-3 (ukur waktu)

> Sekarang hari ketiga. Dasar luka Anda merah dengan sedikit lapisan kuning tipis di tepinya. Ada cairan kuning tipis sedikit di kasa. Tidak berbau. Kulit di sekitar luka terasa sedikit lebih hangat dibanding tangan satunya. Anda belum pernah menandai batas luka dengan pulpen. Nyeri 3 dari 10. Tidak demam. Catat kondisi hari ini.

Mulai stopwatch saat peserta menekan tombol untuk mencatat, berhenti saat catatan tersimpan. Berikan pulpen bila peserta mencarinya.

- **Berhasil bila:**
  - peserta memilih "Kuning tipis" untuk cairan, bukan "Kental atau keruh";
  - peserta memilih "Lebih hangat" untuk kulit sekitar;
  - peserta membaca cara menandai garis pulpen saat memilih "Belum ditandai";
  - catatan selesai dalam ≤ 60 detik.
- **Amati:** apakah aturan "warna terburuk menentukan" dibaca; apakah peserta mencoba menandai tangannya sendiri dengan pulpen.

### Tugas 7. Catatan harian hari ke-4

> Keesokan harinya, perubahan warna kulit di sekitar luka sudah melewati garis pulpen yang Anda buat kemarin. Badan Anda demam 38 °C. Catat kondisi hari ini, lalu katakan apa yang akan Anda lakukan.

- **Berhasil bila:** peserta memilih "Meluas melewati garis" dan demam, melihat arahan "Ke IGD sekarang", dan mengatakan akan ke IGD atau fasilitas kesehatan hari itu juga.
- **Amati:** apakah peserta menilai sendiri dari warna merah saja; apakah tombol telepon dan "Cari faskes terdekat" ditemukan.

### Tugas 8. Batas periksa

> Lihat halaman luka Anda. Menurut aplikasi, kapan Anda sebaiknya periksa ke tenaga kesehatan bila lukanya belum membaik?

- **Berhasil bila:** peserta menyebut tanggal batas periksa, dan menjelaskannya sebagai "periksa bila belum membaik", **bukan** "tanggal sembuh".
- **Amati:** apakah perkiraan pulih dibaca sebagai janji; apakah linimasa fase penyembuhan dipahami.

### Tugas 9. Mencari informasi tanpa panduan

> Kemarin tangan Anda dicakar kucing tetangga. Lukanya kecil dan sudah tidak berdarah. Anda ingin tahu apakah perlu ke puskesmas. Cari informasinya di LukaCare.

- **Berhasil bila:** peserta menemukan Bab 8 (gigitan dan cakaran hewan), lewat pustaka atau panduan, dan menyimpulkan perlu ke puskesmas hari itu.
- **Amati dan catat jalur pertama yang dicoba:** menu Pustaka, Panduan, tautan di beranda, atau halaman Darurat. Ini dasar keputusan menu Pustaka.

## Kuis pemahaman

Berikan setelah tugas selesai, tanpa membuka aplikasi. Bacakan atau berikan di kertas. Hitung jawaban benar.

1. **Cairan.** Di kasa ada sedikit cairan kuning tipis. Di luka lain ada cairan kental, keruh, dan kehijauan. Mana yang merupakan tanda bahaya?
   - Jawaban benar: yang kental, keruh, atau kehijauan. Kuning tipis sedikit masih wajar.
2. **Warna terburuk.** Sebagian besar dasar luka sudah merah, tetapi masih ada lapisan kuning yang menempel di satu sisi. Apakah luka ini sudah masuk tahap membaik?
   - Jawaban benar: belum. Warna terburuk yang menentukan.
3. **Garis pulpen.** Bagaimana cara tahu bahwa perubahan kulit di sekitar luka makin meluas?
   - Jawaban benar: tandai batasnya dengan pulpen (beserta tanggal dan jam), lalu bandingkan esok hari. Jawaban "lihat apakah makin merah" saja dihitung salah.
4. **Batas periksa.** Aplikasi menulis "Jika belum membaik pada Jumat, 30 Okt, periksakan." Apa artinya?
   - Jawaban benar: bila sampai tanggal itu luka belum membaik, periksa ke tenaga kesehatan. Bukan tanggal pasti sembuh.
5. **Kedalaman.** Lecet di siku tampak putih dan ada butiran kuning seperti lemak. Boleh dirawat sendiri di rumah?
   - Jawaban benar: tidak. Luka sudah dalam dan perlu ke fasilitas kesehatan secepatnya.

Target: rata-rata ≥ 80% benar (4 dari 5). Catat juga soal mana yang paling sering salah.

## Wawancara penutup

1. Bagian mana yang paling membingungkan?
2. Apakah ada kata yang tidak Anda pahami? (Catat kata persisnya.)
3. Apakah Anda percaya pada arahan aplikasi ini? Kenapa?
4. Di bagian mana Anda merasa takut atau khawatir?
5. Apakah Anda akan memakai aplikasi ini lagi saat ada yang terluka di rumah?

Minta juga nilai 1–5 untuk: "Aplikasi ini mudah dipakai" dan "Saya tahu kapan harus ke tenaga kesehatan".

## Lembar pengamat

Satu lembar per peserta. Salin tabel ini.

**Peserta:** P__  **Tanggal:** ____  **Perangkat:** ____  **Usia/kelompok:** ____

| Tugas | Hasil (berhasil / dengan bantuan / gagal) | Waktu | Kebingungan atau salah klik | Kutipan peserta |
| --- | --- | --- | --- | --- |
| 1. Darah tidak berhenti | | | | |
| 2. Lecet | | | | |
| 3. Cipratan minyak | | | | |
| 4. Knalpot pada anak | | | | |
| 5. Simpan luka | | | | |
| 6. Catatan hari ke-3 | | detik: | | |
| 7. Catatan hari ke-4 | | | | |
| 8. Batas periksa | | | | |
| 9. Cakaran kucing | | jalur pertama: | | |

**Kuis:** __ / 5 benar. Soal yang salah: ____

**Nilai:** mudah dipakai __ / 5, tahu kapan periksa __ / 5

## Membaca hasil

Setelah semua sesi, kumpulkan temuan dalam satu tabel dan beri tingkat keparahan:

| Tingkat | Arti | Contoh |
| --- | --- | --- |
| Kritis | Peserta mengambil keputusan yang bisa membahayakan | Tidak sampai ke layar rujukan di tugas 4 atau 7, atau menganggap batas periksa sebagai tanggal sembuh |
| Berat | Peserta gagal tanpa bantuan, tetapi tidak berbahaya | Tidak menemukan kode verifikasi |
| Ringan | Peserta ragu atau lambat, tetapi berhasil | Lama memilih warna dasar luka bakar |

- Temuan **kritis** wajib diperbaiki sebelum rilis production.
- Perubahan pada teks medis (`apps/web/src/content/`) mengembalikan blok itu ke status draft, sehingga perlu ditinjau klinisi lagi (`docs/tinjauan-klinisi.md`).
- Putuskan menu Pustaka dari tugas 9: bila sebagian besar peserta mencari lewat Panduan, pertimbangkan menjadikan Pustaka tab di Panduan; bila lewat menu, pertahankan sebagai menu tersendiri.
- Tulis ringkasan hasil di `docs/hasil-uji-kegunaan.md`: jumlah peserta, persentase kuis, waktu tugas 6, temuan per tingkat, dan keputusan yang diambil.
