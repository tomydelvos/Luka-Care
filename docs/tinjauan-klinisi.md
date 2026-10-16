# Daftar tinjauan klinisi LukaCare

<!-- Dibuat otomatis dari apps/web/src/content. Jangan edit file ini; jalankan `npm run review:list` di apps/web. -->

Dokumen ini berisi semua teks medis yang tampil di aplikasi LukaCare, untuk ditinjau dokter atau perawat sebelum rilis (PRD tahap 2, F10). Aplikasi tidak akan bisa dirilis ke production selama masih ada blok yang belum disetujui.

**Status:** 0 dari 210 blok disetujui. 11 blok berlabel I (inferensi tim) butuh persetujuan khusus.

## Cara meninjau

1. Baca setiap blok. Teks dalam kutipan adalah teks yang dilihat pengguna, apa adanya.
2. Beri salah satu keputusan per blok: **setuju**, **setuju dengan perubahan** (tulis teks penggantinya), atau **tolak** (tulis alasannya). Sebutkan kode blok, misalnya `redFlags.0 (perdarahan)`.
3. Untuk blok berlabel **I**, nyatakan secara khusus bahwa inferensinya boleh dipakai.
4. Tim memasukkan keputusan ke kode (`review: { status: "reviewed", reviewedBy, reviewedAt }`). Teks yang diubah setelah disetujui kembali ke status draft dan perlu ditinjau lagi.

Label asal data: **A** luka akut, **B** luka bakar, **K** luka kronis, **F** fase penyembuhan, **I** inferensi. Rujukan lengkap ada di halaman `/sumber` aplikasi dan `apps/web/src/content/sources.js`.

Yang tidak perlu ditinjau di sini: aplikasi tidak menganalisis foto luka secara otomatis. Penilaian catatan harian hanya mencocokkan jawaban pengguna dengan aturan di bagian "Catatan harian".

## Keputusan yang perlu diambil

1. **Semua angka waktu dan ambang** di Lampiran A dan B PRD (`docs/prd-tahap-2.md`). Angkanya juga ada di bagian "Waktu pulih dan batas periksa" dan "Catatan harian" di bawah.
2. **Ambang periksa untuk kelompok berisiko** (diabetes, lansia, perokok, daya tahan tubuh rendah). Saat ini hanya "Periksakan lebih awal" tanpa angka. Berapa hari?
3. **Ambang luka bakar untuk awam.** PNPK memakai ambang rumah sakit. Aplikasi merujuk semua luka bakar lebih dari 1 telapak tangan korban, dan semua dasar merah muda gelap, belang, putih, hitam, atau tidak nyeri. Apakah sudah tepat?
4. **Perkiraan derajat luka bakar dari jawaban awam** (`depth.js`): lepuh dengan warna "merah" dibaca derajat 2 superfisial; pilihan "Tidak yakin" memakai batas periksa 10 hari dan pengingat lihat ulang hari ke-2–3.
5. **Membedakan keropeng normal dari jaringan mati hitam** untuk awam. Belum ada sumber. Pilihan "Hitam keras" di catatan harian dinilai `beberapa_hari` bila baru muncul.
6. **Gejala tetanus di Bab 6** (kaku rahang, kejang otot). Belum ada sumber terverifikasi.
7. **Demam tanpa tanda lain** dinilai "periksa hari ini" (label I). Ambang demam 37,7 °C mengikuti laporan riset (tahap 1 memakai 38 °C).
8. **Nyeri naik 3 poin atau lebih** dari catatan sebelumnya dinilai "periksa hari ini" (aturan tahap 1).
9. **Lewat batas periksa tanpa tanda membaik**: luka dianggap membaik bila catatan terakhir hanya merah muda atau keropeng.
10. **Kronologi dan "Yang bisa dipelajari"** pada 10 contoh kasus.
11. **Siapa peninjau** (dokter umum, perawat luka, atau dokter spesialis bedah plastik untuk luka bakar) dan nama yang boleh ditampilkan di profile kontak.

Rincian keputusan implementasi ada di PRD, bagian "Catatan implementasi M3" dan "Catatan implementasi M4".

## Tanda bahaya di awal panduan

- [ ] `redFlags.0 (perdarahan)`
  Label A (Luka akut) · Sumber: Cuts and grazes (NHS)

  > **Level: Hubungi 119**
  >
  > Darah tidak berhenti
  >
  > Sudah ditekan 10 menit tetapi masih mengalir, atau darah memancar.
  >
  > Tekan kuat luka dengan kasa atau kain bersih. Jangan diangkat untuk mengintip.
  >
  > Jika kain sudah basah, tumpuk kain baru di atasnya tanpa melepas yang lama.
  >
  > Bila memungkinkan, angkat bagian yang terluka lebih tinggi dari jantung.

- [ ] `redFlags.1 (pingsan)`
  Label A (Luka akut) · Sumber: Hubungi 119 saat darurat kesehatan (Kementerian Kesehatan RI)

  > **Level: Hubungi 119**
  >
  > Lemas, pucat, pingsan, atau sesak
  >
  > Kondisi umum korban memburuk setelah cedera.
  >
  > Baringkan korban di tempat aman dan longgarkan pakaian yang ketat.
  >
  > Jangan beri makan atau minum.
  >
  > Temani korban sampai bantuan datang.

- [ ] `redFlags.2 (bakar-berat)`
  Label B (Luka bakar) · Sumber: Burns and scalds: treatment (NHS); PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019)

  > **Level: Hubungi 119**
  >
  > Luka bakar luas, kimia, atau listrik
  >
  > Lebih lebar dari telapak tangan korban, kulit tampak putih atau hangus, atau disebabkan bahan kimia atau listrik.
  >
  > Untuk luka bakar listrik, pastikan sumber listrik sudah mati sebelum menyentuh korban.
  >
  > Aliri luka dengan air mengalir bersuhu biasa. Untuk bahan kimia, bilas dengan air yang banyak.
  >
  > Tutup longgar dengan plastik wrap bersih atau kain bersih. Jangan oleskan apa pun.

- [ ] `redFlags.3 (dalam)`
  Label A (Luka akut) · Sumber: Cuts and grazes (NHS); Wounds, cuts and grazes (healthdirect Australia); Penjahitan luka robek kulit (Forsch, American Family Physician, 2008)

  > **Level: Periksakan ke faskes hari ini**
  >
  > Luka dalam atau menganga
  >
  > Tepi luka terbuka lebar, atau terlihat lemak, otot, atau tulang.
  >
  > Tekan dengan kasa atau kain bersih untuk menahan perdarahan.
  >
  > Tutup luka dan segera ke IGD atau puskesmas. Luka seperti ini mungkin perlu dijahit, dan sebaiknya ditangani secepatnya.

- [ ] `redFlags.4 (tertancap)`
  Label A (Luka akut) · Sumber: Cuts and grazes (NHS)

  > **Level: Periksakan ke faskes hari ini**
  >
  > Ada benda tertancap
  >
  > Pecahan kaca, kayu, logam, atau benda lain masih berada di dalam luka.
  >
  > Jangan cabut bendanya. Mencabut bisa memperparah perdarahan.
  >
  > Tekan di sekitar benda, bukan di atasnya.
  >
  > Ganjal benda dengan kasa atau kain agar tidak bergerak selama perjalanan.

- [ ] `redFlags.5 (gigitan)`
  Label A (Luka akut) · Sumber: Segera ke faskes jika digigit anjing (Kementerian Kesehatan RI, 2023); Rabies prevention (WHO Rabies Bulletin Europe)

  > **Level: Periksakan ke faskes hari ini**
  >
  > Gigitan atau cakaran hewan
  >
  > Anjing, kucing, kera, kelelawar, hewan lain, atau gigitan manusia.
  >
  > Segera cuci luka dengan sabun dan air mengalir selama 15 menit.
  >
  > Pergi ke puskesmas atau rumah sakit hari ini. Petugas akan menilai perlu tidaknya vaksin anti rabies dan perawatan lain.

- [ ] `redFlags.6 (tusuk)`
  Label A (Luka akut) · Sumber: Cuts and scrapes: first aid (Mayo Clinic)

  > **Level: Periksakan ke faskes hari ini**
  >
  > Tertusuk benda kotor atau berkarat
  >
  > Misalnya paku, kawat, duri, atau benda tajam yang kotor.
  >
  > Bilas luka dengan air bersih mengalir.
  >
  > Periksakan hari ini. Petugas akan mengecek kebutuhan suntik tetanus.

- [ ] `redFlags.7 (mati-rasa)`
  Label A (Luka akut) · Sumber: Wounds, cuts and grazes (healthdirect Australia)

  > **Level: Periksakan ke faskes hari ini**
  >
  > Mati rasa atau sulit digerakkan
  >
  > Area sekitar luka terasa baal atau kesemutan, atau jari dan sendi tidak bisa digerakkan normal.
  >
  > Jangan paksa menggerakkan bagian yang terluka.
  >
  > Tutup luka dengan kasa bersih dan segera periksakan.

- [ ] `redFlags.8 (infeksi)`
  Label A (Luka akut) · Sumber: Tanda-tanda infeksi pada luka (Kementerian Kesehatan RI, 2022); Penyembuhan dan perawatan luka (MedlinePlus); Selulitis dan erisipelas, NG141 (NICE)

  > **Level: Periksakan ke faskes hari ini**
  >
  > Tanda infeksi
  >
  > Kemerahan makin melebar, bengkak, terasa panas, bernanah, berbau, atau disertai demam.
  >
  > Jangan memencet atau mengorek luka.
  >
  > Tutup dengan kasa bersih dan periksakan hari ini.

## Teks layar rujukan

- [ ] `levelCopy.darurat`
  Label A (Luka akut) · Sumber: Hubungi 119 saat darurat kesehatan (Kementerian Kesehatan RI); Cuts and grazes (NHS)

  > Hubungi 119 sekarang
  >
  > Kondisi yang Anda pilih membutuhkan pertolongan medis segera. Jangan menunggu untuk merawat sendiri.

- [ ] `levelCopy.segera`
  Label A (Luka akut) · Sumber: Hubungi 119 saat darurat kesehatan (Kementerian Kesehatan RI); Cuts and grazes (NHS)

  > Periksakan ke fasilitas kesehatan hari ini
  >
  > Kondisi ini perlu dilihat langsung oleh tenaga kesehatan di puskesmas, klinik, atau IGD. Panduan perawatan mandiri dan rekomendasi produk kami hentikan dulu.

## Teks halaman darurat

- [ ] `emergencyLead`
  Label A (Luka akut) · Sumber: Hubungi 119 saat darurat kesehatan (Kementerian Kesehatan RI); Cuts and grazes (NHS)

  > Jika nyawa terancam atau perdarahan tidak berhenti, jangan menunggu. Telepon sekarang.

## Rujukan dari detail luka

- [ ] `escalations.bakarSensitif (bakar-sensitif)`
  Label B (Luka bakar) · Sumber: Burns and scalds: treatment (NHS); PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019)

  > **Level: Periksakan ke faskes hari ini**
  >
  > Luka bakar di wajah atau area kelamin
  >
  > Area ini sensitif dan perlu diperiksa tenaga kesehatan meskipun lukanya kecil.
  >
  > Aliri dengan air mengalir bersuhu biasa selama 20 menit.
  >
  > Tutup longgar dengan kasa non-lengket atau plastik wrap bersih, lalu berangkat.

- [ ] `escalations.bakarBayi (bakar-bayi)`
  Label B (Luka bakar) · Sumber: Burns and scalds: treatment (NHS); PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019)

  > **Level: Periksakan ke faskes hari ini**
  >
  > Luka bakar pada bayi
  >
  > Kulit bayi lebih tipis, sehingga luka bakar kecil pun bisa lebih dalam dari kelihatannya.
  >
  > Aliri dengan air mengalir bersuhu biasa selama 20 menit.
  >
  > Jaga tubuh bayi tetap hangat selama mendinginkan luka.
  >
  > Tutup longgar dengan kasa non-lengket atau plastik wrap bersih, lalu berangkat.

- [ ] `escalations.bakarDalam (bakar-dalam)`
  Label B (Luka bakar) · Sumber: PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019); Klasifikasi luka bakar (StatPearls); Penanganan luka bakar (American Family Physician, 2020)

  > **Level: Periksakan ke faskes hari ini**
  >
  > Luka bakar yang mungkin dalam
  >
  > Berdasarkan jawaban Anda, kulit mungkin rusak sampai lapisan dalam: dasarnya merah muda gelap atau belang, atau tidak terasa nyeri. Luka seperti ini perlu ditangani tenaga kesehatan, berapa pun luasnya.
  >
  > Aliri dengan air mengalir bersuhu biasa selama 20 menit.
  >
  > Tutup longgar dengan kasa non-lengket atau plastik wrap bersih, lalu berangkat.

- [ ] `escalations.diabetesKaki (diabetes-kaki)`
  Label A (Luka akut) · Sumber: Penyembuhan dan perawatan luka (MedlinePlus)

  > **Level: Periksakan ke faskes hari ini**
  >
  > Luka di kaki pada penderita diabetes
  >
  > Luka kaki pada diabetes lebih mudah infeksi dan lambat sembuh. Sebaiknya diperiksa sejak awal, meskipun kecil.
  >
  > Bilas dengan air bersih mengalir dan tutup dengan kasa bersih.
  >
  > Kurangi menapak atau menekan bagian yang luka.

## Catatan tambahan di langkah perawatan

- [ ] `cautions.bakarTanganKaki (bakar-tangan-kaki)`
  Label B (Luka bakar) · Sumber: Burns and scalds: treatment (NHS); PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019)

  > Luka bakar di tangan atau kaki yang melepuh sebaiknya diperiksakan, karena area ini sering bergerak dan mudah terinfeksi.

- [ ] `cautions.bakarAnakLansia (bakar-anak-lansia)`
  Label B (Luka bakar) · Sumber: Burns and scalds: treatment (NHS); PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019)

  > Pada anak dan lansia, periksakan jika luka melepuh atau nyeri tidak mereda.

- [ ] `cautions.bakarBelumYakin (bakar-belum-yakin)`
  Label B (Luka bakar) · Sumber: PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019); Penanganan luka bakar (American Family Physician, 2020); Luka bakar knalpot pada anak (Hyland dkk., Medical Journal of Australia, 2013)

  > Warna dasar belum diketahui. Lihat lagi pada hari ke-2–3, karena luka bakar bisa bertambah dalam. Jika bagian tengahnya putih, belang, atau tidak terasa nyeri, periksakan.

- [ ] `cautions.diabetes (diabetes)`
  Label A (Luka akut) · Sumber: Penyembuhan dan perawatan luka (MedlinePlus)

  > Pada penderita diabetes, luka cenderung lebih lambat pulih. Catat kondisinya setiap hari dan periksakan bila tidak membaik.

- [ ] `cautions.besar (besar)`
  Label A (Luka akut) · Sumber: Cuts and grazes (NHS)

  > Luka yang lebih lebar dari telapak tangan sebaiknya diperiksa tenaga kesehatan, terutama jika kotor atau sulit dibersihkan.

- [ ] `cautions.sayatanWajah (sayatan-wajah)`
  Label A (Luka akut) · Sumber: Penjahitan luka robek kulit (Forsch, American Family Physician, 2008)

  > Sayatan di wajah sebaiknya diperiksakan. Jika perlu dijahit, hasilnya lebih rapi bila ditangani lebih awal.

- [ ] `cautions.lecetWajah (lecet-wajah)`
  Label A (Luka akut) · Sumber: Cuts and scrapes: first aid (Mayo Clinic)

  > Hati-hati membersihkan luka di dekat mata. Jangan biarkan sabun atau salep masuk ke mata.

## Pertanyaan kedalaman dan luka bakar (M4)

- [ ] `depth.DEPTH_QUESTION`
  Label A (Luka akut) · Sumber: Cara lecet sembuh (HealthLinkBC, 2022); Cuts and grazes (NHS); Wounds, cuts and grazes (healthdirect Australia)

  > Dasar luka tampak putih, atau ada butiran kuning seperti lemak?
  >
  > Lemak tampak seperti butiran kuning di dalam luka. Bandingkan dengan gambar luka robek di bawah ini.
  >
  > Gambar: Contoh luka robek tampak atas: tepi tidak rata dan terbuka, tampak lemak kuning, darah terus keluar.
  >
  > • Tidak, dasarnya merah atau merah muda
  >
  > • Ya, putih atau tampak lemak

- [ ] `depth.BURN_BASE_COLORS`
  Label B (Luka bakar) · Sumber: PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019); Klasifikasi luka bakar (StatPearls); Penanganan luka bakar (American Family Physician, 2020)

  > Warna dasarnya?
  >
  > Lihat bagian yang paling parah. Bila ada lepuh, lihat kulit di bawah atau di sekitar lepuh.
  >
  > Gambar: Perbandingan derajat luka bakar. Derajat 1: merah, kering, nyeri, tanpa lepuh, pulih 5 sampai 10 hari. Derajat 2: melepuh, basah, sangat nyeri, yang superfisial pulih sekitar 3 minggu. Derajat 3: putih atau hangus, kaku, bisa tidak nyeri, selalu ke rumah sakit.
  >
  > • Merah dan kering, tanpa lepuh — Memucat bila ditekan, mirip terbakar matahari _(perkiraan: Derajat 1; boleh dirawat di rumah bila kecil)_
  >
  > • Merah muda pucat dan basah — Biasanya di bawah lepuh, sangat nyeri _(perkiraan: Derajat 2 superfisial; boleh dirawat di rumah bila kecil)_
  >
  > • Merah muda gelap — Warna lambat kembali setelah ditekan _(perkiraan: Derajat 2 tengah; dirujuk)_
  >
  > • Belang, merah tua bercak, atau pucat — Lebih kering, nyeri berkurang _(perkiraan: Derajat 2 dalam; dirujuk)_
  >
  > • Putih seperti lilin — Atau seperti kulit samak, kaku _(perkiraan: Derajat 3; dirujuk)_
  >
  > • Hitam hangus _(perkiraan: Derajat 4; dirujuk)_
  >
  > • Tidak yakin _(perkiraan: derajat tidak ditebak; boleh dirawat di rumah bila kecil)_

- [ ] `depth.BURN_QUESTIONS.blister`
  Label B (Luka bakar) · Sumber: PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019); Klasifikasi luka bakar (StatPearls); Penanganan luka bakar (American Family Physician, 2020)

  > Ada lepuh?
  >
  > • Tidak ada
  >
  > • Ada lepuh

- [ ] `depth.BURN_QUESTIONS.painful`
  Label B (Luka bakar) · Sumber: PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019); Klasifikasi luka bakar (StatPearls); Penanganan luka bakar (American Family Physician, 2020)

  > Masih terasa nyeri?
  >
  > Luka bakar yang dalam bisa tidak terasa nyeri karena ujung saraf ikut rusak.
  >
  > • Ya, nyeri
  >
  > • Tidak terasa nyeri

- [ ] `depth.BURN_QUESTIONS.palms`
  Label B (Luka bakar) · Sumber: PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019); Burns and scalds: treatment (NHS)

  > Seluas berapa telapak tangan korban (termasuk jari)?
  >
  > Satu telapak tangan korban, termasuk jari, kira-kira sama dengan 1% luas tubuhnya.
  >
  > • Lebih kecil dari koin
  >
  > • Lebih kecil dari 1 telapak tangan
  >
  > • Lebih dari 1 telapak tangan

- [ ] `depth.BURN_DEGREES`
  Label B (Luka bakar) · Sumber: PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019); Klasifikasi luka bakar (StatPearls); Penanganan luka bakar (American Family Physician, 2020)

  > Derajat 1
  >
  > Derajat 2 superfisial
  >
  > Derajat 2 tengah
  >
  > Derajat 2 dalam
  >
  > Derajat 3
  >
  > Derajat 4
  >
  > Perkiraan dari jawaban Anda di panduan, bukan diagnosis.

- [ ] `depth.BLISTER_RULE` · **inferensi, butuh persetujuan khusus**
  Label I (Inferensi) · Sumber: PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019); Klasifikasi luka bakar (StatPearls)

  > Luka bakar yang melepuh dibaca setidaknya sebagai derajat 2 superfisial, walaupun warna dasarnya dipilih merah.

## Langkah perawatan umum

- [ ] `commonSteps.washHands (cuci-tangan)`
  Label A (Luka akut) · Sumber: Cuts and scrapes: first aid (Mayo Clinic); Cuts and grazes (NHS); Penyembuhan dan perawatan luka (MedlinePlus)

  > Cuci tangan
  >
  > Cuci tangan dengan sabun dan air mengalir sebelum menyentuh luka. Pakai sarung tangan sekali pakai jika ada.

- [ ] `commonSteps.changeDaily (ganti)`
  Label A (Luka akut) · Sumber: Cuts and scrapes: first aid (Mayo Clinic); Cuts and grazes (NHS); Penyembuhan dan perawatan luka (MedlinePlus)

  > Ganti penutup setiap hari
  >
  > Ganti sekali sehari, atau lebih cepat jika basah atau kotor. Saat mengganti, perhatikan apakah kemerahan melebar, bengkak, atau bernanah.

- [ ] `commonSteps.coverWet (tutup)`
  Label A (Luka akut) · Sumber: Cuts and scrapes: first aid (Mayo Clinic); Cuts and grazes (NHS); Penyembuhan dan perawatan luka (MedlinePlus)

  > Tutup luka
  >
  > Pakai kasa atau dressing yang menyerap cairan, lalu rekatkan dengan plester. Luka basah perlu penutup yang lebih sering diganti.

- [ ] `commonSteps.coverDry (tutup)`
  Label A (Luka akut) · Sumber: Cuts and scrapes: first aid (Mayo Clinic); Cuts and grazes (NHS); Penyembuhan dan perawatan luka (MedlinePlus)

  > Tutup luka
  >
  > Tutup dengan plester atau kasa non-lengket agar terlindung dari gesekan dan kotoran.

## Langkah perawatan per jenis luka

- [ ] `wounds.lecet.blocks.tekan (tekan)`
  Label A (Luka akut) · Sumber: Cuts and grazes (NHS); Cuts and scrapes: first aid (Mayo Clinic); Cara lecet sembuh (HealthLinkBC, 2022)

  > Hentikan darah
  >
  > Tekan perlahan dengan kasa atau kain bersih sampai darah berhenti. Pada lecet biasanya hanya butuh beberapa menit.
  >
  > Timer 5 menit

- [ ] `wounds.lecet.blocks.bilas (bilas)`
  Label A (Luka akut) · Sumber: Cuts and grazes (NHS); Cuts and scrapes: first aid (Mayo Clinic); Cara lecet sembuh (HealthLinkBC, 2022)

  > Bilas dengan air mengalir
  >
  > Bilas hingga pasir dan kotoran terangkat. Bersihkan kulit di sekitarnya dengan sabun, tetapi usahakan sabun tidak masuk ke luka.
  >
  > Tidak ada air keran bersih? Air minum kemasan atau air matang yang sudah dingin juga bisa dipakai.

- [ ] `wounds.lecet.blocks.angkatKotoran (angkat-kotoran)`
  Label A (Luka akut) · Sumber: Cuts and grazes (NHS); Cuts and scrapes: first aid (Mayo Clinic); Cara lecet sembuh (HealthLinkBC, 2022)

  > Angkat sisa kotoran
  >
  > Kerikil atau serpihan kecil yang masih menempel bisa diangkat dengan pinset yang sudah dibersihkan alkohol.
  >
  > Kotoran tertanam dan sulit diangkat? Periksakan ke faskes agar dibersihkan dengan benar.

- [ ] `wounds.lecet.blocks.keringkan (keringkan)`
  Label A (Luka akut) · Sumber: Cuts and grazes (NHS); Cuts and scrapes: first aid (Mayo Clinic); Cara lecet sembuh (HealthLinkBC, 2022)

  > Keringkan sekitar luka
  >
  > Tepuk-tepuk kulit di sekitar luka dengan kasa bersih. Jangan digosok.

- [ ] `wounds.lecet.blocks.lembap (lembap)`
  Label A (Luka akut) · Sumber: Cuts and scrapes: first aid (Mayo Clinic); Cara lecet sembuh (HealthLinkBC, 2022)

  > Jaga luka tetap lembap
  >
  > Oleskan lapisan tipis petroleum jelly atau salep luka sesuai aturan pakai. Luka yang lembap dan tertutup umumnya pulih lebih nyaman daripada dibiarkan kering terbuka.

- [ ] `wounds.lecet.avoid`
  Label A (Luka akut) · Sumber: Cuts and grazes (NHS); Cuts and scrapes: first aid (Mayo Clinic); Cara lecet sembuh (HealthLinkBC, 2022)

  > Menggosok luka dengan kasar
  >
  > Meniup luka atau menyentuhnya dengan tangan kotor
  >
  > Mengelupas keropeng yang terbentuk

- [ ] `wounds.sayatan.blocks.tekan (tekan)`
  Label A (Luka akut) · Sumber: Cuts and grazes (NHS); Cuts and scrapes: first aid (Mayo Clinic); Wounds, cuts and grazes (healthdirect Australia)

  > Tekan selama 5–10 menit
  >
  > Tekan dengan kasa atau kain bersih terus-menerus selama 5–10 menit tanpa diangkat. Bila bisa, angkat bagian yang luka lebih tinggi dari jantung.
  >
  > Timer berjalan 10 menit. Bila darah sudah berhenti lebih awal, Anda boleh lanjut ke langkah berikutnya.
  >
  > Timer 10 menit
  >
  > Setelah 10 menit, darah masih mengalir?

- [ ] `wounds.sayatan.blocks.bilas (bilas)`
  Label A (Luka akut) · Sumber: Cuts and grazes (NHS); Cuts and scrapes: first aid (Mayo Clinic); Wounds, cuts and grazes (healthdirect Australia)

  > Bilas dengan air mengalir
  >
  > Setelah darah berhenti, bilas luka dengan air bersih mengalir beberapa saat.

- [ ] `wounds.sayatan.blocks.cekTepi (cek-tepi)`
  Label A (Luka akut) · Sumber: Cuts and grazes (NHS); Wounds, cuts and grazes (healthdirect Australia); Penjahitan luka robek kulit (Forsch, American Family Physician, 2008)

  > Periksa tepi luka
  >
  > Sayatan kecil biasanya menutup rapat dengan sendirinya. Luka yang dalam, tepinya terbuka lebar, atau panjangnya lebih dari 5 cm mungkin perlu dijahit.
  >
  > Tepi luka terbuka lebar, lukanya dalam, atau lebih panjang dari 5 cm?

- [ ] `wounds.sayatan.blocks.keringkan (keringkan)`
  Label A (Luka akut) · Sumber: Cuts and grazes (NHS); Cuts and scrapes: first aid (Mayo Clinic); Wounds, cuts and grazes (healthdirect Australia)

  > Keringkan sekitar luka
  >
  > Tepuk perlahan kulit di sekitar luka dengan kasa bersih.

- [ ] `wounds.sayatan.blocks.tutup (tutup)`
  Label A (Luka akut) · Sumber: Cuts and grazes (NHS); Cuts and scrapes: first aid (Mayo Clinic); Wounds, cuts and grazes (healthdirect Australia)

  > Tutup luka
  >
  > Tutup dengan plester atau kasa steril. Untuk sayatan di jari, pilih plester yang lentur agar tidak mudah lepas.

- [ ] `wounds.sayatan.avoid`
  Label A (Luka akut) · Sumber: Cuts and grazes (NHS); Cuts and scrapes: first aid (Mayo Clinic); Wounds, cuts and grazes (healthdirect Australia)

  > Mengangkat kasa berulang kali saat menekan
  >
  > Menuang alkohol langsung ke dalam luka
  >
  > Menutup luka yang masih berdarah deras

- [ ] `wounds.bakar.blocks.jauhkan (jauhkan)`
  Label B (Luka bakar) · Sumber: Burns and scalds: treatment (NHS); PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019)

  > Jauhkan dari sumber panas
  >
  > Matikan kompor atau jauhkan benda panas. Lepas cincin, jam, atau gelang di dekat luka sebelum membengkak. Jangan lepas kain yang menempel di kulit.

- [ ] `wounds.bakar.blocks.dinginkan (dinginkan)`
  Label B (Luka bakar) · Sumber: Burns and scalds: treatment (NHS); Air mengalir mengurangi cangkok kulit (Griffin dkk., 2020); PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019)

  > Dinginkan selama 20 menit
  >
  > Alirkan air bersuhu biasa selama 20 menit, sebaiknya dalam 3 jam pertama. Jika tidak ada air mengalir, pakai air minum kemasan atau handuk basah. Jangan pakai es atau air es.
  >
  > Timer 20 menit
  >
  > Jaga bagian tubuh lain tetap hangat, terutama pada anak, agar tidak kedinginan.

- [ ] `wounds.bakar.blocks.janganOles (jangan-oles)`
  Label B (Luka bakar) · Sumber: Burns and scalds: treatment (NHS); PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019)

  > Jangan oles bahan dapur
  >
  > Pasta gigi, mentega, minyak, kecap, atau tepung justru menahan panas dan meningkatkan risiko infeksi.

- [ ] `wounds.bakar.blocks.lepuh (lepuh)`
  Label B (Luka bakar) · Sumber: Burns and scalds: treatment (NHS); PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019)

  > Biarkan lepuh tetap utuh
  >
  > Jangan pecahkan lepuh. Kulitnya melindungi lapisan di bawahnya dari kuman.

- [ ] `wounds.bakar.blocks.tutup (tutup)`
  Label B (Luka bakar) · Sumber: Burns and scalds: treatment (NHS); PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019)

  > Tutup dengan longgar
  >
  > Tutup longgar dengan plastik wrap bersih atau kasa non-lengket. Jangan dililit, dan jangan tempel plester lengket langsung di atas luka bakar.

- [ ] `wounds.bakar.blocks.nyeri (nyeri)`
  Label B (Luka bakar) · Sumber: Burns and scalds: treatment (NHS); PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019)

  > Redakan nyeri bila perlu
  >
  > Pereda nyeri yang dijual bebas dapat digunakan sesuai aturan pakai pada kemasan. Tanyakan apoteker jika ragu, terutama untuk anak.

- [ ] `wounds.bakar.avoid`
  Label B (Luka bakar) · Sumber: Burns and scalds: treatment (NHS); PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019)

  > Mengompres dengan es batu
  >
  > Mengoles pasta gigi, mentega, atau kecap
  >
  > Memecahkan lepuh

- [ ] `wounds.lepuh.blocks.janganPecah (jangan-pecah)`
  Label A (Luka akut) · Sumber: Blisters (NHS); Lepuh gesekan (Harvard Health, 2023)

  > Jangan dipecahkan
  >
  > Kulit lepuh adalah pelindung alami. Lepuh kecil biasanya mengempis sendiri dalam beberapa hari.

- [ ] `wounds.lepuh.blocks.bersihkan (bersihkan)`
  Label A (Luka akut) · Sumber: Blisters (NHS); Lepuh gesekan (Harvard Health, 2023)

  > Bersihkan area sekitar
  >
  > Cuci dengan sabun lembut dan air, lalu keringkan dengan menepuk perlahan.

- [ ] `wounds.lepuh.blocks.lindungi (lindungi)`
  Label A (Luka akut) · Sumber: Blisters (NHS); Lepuh gesekan (Harvard Health, 2023)

  > Lindungi dari gesekan
  >
  > Tempel plester lepuh hidrokoloid atau plester berbantalan di atas lepuh.

- [ ] `wounds.lepuh.blocks.gantiAlas (ganti-alas)`
  Label A (Luka akut) · Sumber: Blisters (NHS); Lepuh gesekan (Harvard Health, 2023)

  > Hilangkan penyebabnya
  >
  > Ganti alas kaki yang menggesek, pakai kaus kaki, dan istirahatkan area tersebut.

- [ ] `wounds.lepuh.blocks.jikaPecah (jika-pecah)`
  Label A (Luka akut) · Sumber: Blisters (NHS); Lepuh gesekan (Harvard Health, 2023)

  > Jika lepuh pecah sendiri
  >
  > Jangan kelupas kulit yang tersisa. Bilas dengan air bersih, lalu tutup dengan plester.

- [ ] `wounds.lepuh.avoid`
  Label A (Luka akut) · Sumber: Blisters (NHS); Lepuh gesekan (Harvard Health, 2023)

  > Menusuk lepuh dengan jarum
  >
  > Mengelupas kulit lepuh
  >
  > Terus memakai alas kaki yang sama

## Tanda yang dipantau

- [ ] `monitorSigns`
  Label A (Luka akut) · Sumber: Tanda-tanda infeksi pada luka (Kementerian Kesehatan RI, 2022); Penyembuhan dan perawatan luka (MedlinePlus)

  > Kemerahan makin melebar dari tepi luka
  >
  > Bengkak atau terasa panas
  >
  > Keluar nanah atau cairan keruh berbau
  >
  > Nyeri bertambah, bukan berkurang
  >
  > Demam

## Catatan harian dan aturan penilaian (Lampiran B)

- [ ] `checkin.BED_COLOR_OPTIONS`
  Label K (Luka kronis) · Sumber: Wound Healing Continuum (Gray dkk., Wounds UK, 2006); Infeksi luka dalam praktik klinis (International Wound Infection Institute, 2022); Hypergranulation pathway (Oxford Health NHS, 2023)

  > • Merah muda — Kulit baru tumbuh dari tepi
  >
  > • Merah segar — Dasar luka sedang terisi
  >
  > • Keropeng tipis — Darah kering merah tua sampai cokelat
  >
  > • Kuning menempel — Lengket di dasar luka
  >
  > • Hitam keras — Tebal, keras, dan kering
  >
  > • Merah pucat atau rapuh — Mudah berdarah, atau jaringan merah menonjol
  >
  > **Warna terburuk menentukan.** Luka yang masih punya bagian hitam atau kuning belum masuk tahap membaik, walaupun sebagian besar dasarnya sudah merah.

- [ ] `checkin.FLUID_OPTIONS_V2`
  Label A (Luka akut) · Sumber: Infeksi luka dalam praktik klinis (International Wound Infection Institute, 2022); Penyembuhan dan perawatan luka (MedlinePlus); Wound infection pathway (NHS Forth Valley, berbasis IWII 2022, 2026); Selulitis dan erisipelas, NG141 (NICE)

  > • Tidak ada
  >
  > • Bening, sedikit
  >
  > • Kuning tipis — Masih wajar bila sedikit
  >
  > • Kental atau keruh
  >
  > • Kehijauan
  >
  > Sedikit cairan bening kekuningan masih wajar. Kuning menjadi tanda bahaya bila kental, keruh, banyak, berbau, atau muncul bersama nyeri dan bengkak yang bertambah.

- [ ] `checkin.SKIN_OPTIONS`
  Label K (Luka kronis) · Sumber: Konsensus penilaian luka pada berbagai warna kulit (Wounds International, 2023); Selulitis dan erisipelas, NG141 (NICE); Cellulitis (Health Education England)

  > • Lebih hangat
  >
  > • Tegang atau mengilap
  >
  > • Lebih keras
  >
  > • Lebih gelap, keunguan, atau merah
  >
  > • Ada garis menjalar dari luka
  >
  > • Menghitam atau keabuan
  >
  > • Melepuh
  >
  > • Mati rasa
  >
  > Raba dengan punggung tangan dan bandingkan dengan bagian yang sama di sisi tubuh sebelahnya. Lihat di bawah cahaya alami.

- [ ] `checkin.SPREAD_OPTIONS`
  Label K (Luka kronis) · Sumber: Konsensus penilaian luka pada berbagai warna kulit (Wounds International, 2023); Selulitis dan erisipelas, NG141 (NICE); Cellulitis (Health Education England)

  > • Belum ditandai
  >
  > • Masih di dalam garis
  >
  > • Meluas melewati garis
  >
  > Tandai batas area yang berubah dengan pulpen dan tulis tanggalnya. Yang dinilai adalah apakah area itu meluas, bukan warnanya.

- [ ] `checkin.FEVER_HINT`
  Label A (Luka akut) · Sumber: Infeksi luka dalam praktik klinis (International Wound Infection Institute, 2022); Penyembuhan dan perawatan luka (MedlinePlus); Wound infection pathway (NHS Forth Valley, berbasis IWII 2022, 2026); Selulitis dan erisipelas, NG141 (NICE)

  > Suhu 37,7 °C atau lebih, menggigil, atau badan sangat lemas

- [ ] `checkin.BURN_RECHECK`
  Label B (Luka bakar) · Sumber: Penanganan luka bakar (American Family Physician, 2020); PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019)

  > Dibanding kemarin, luka tampak lebih pucat, belang, atau nyerinya justru berkurang?
  >
  > Luka bakar bisa bertambah dalam selama 24–72 jam pertama. Nyeri yang berkurang adalah tanda bahaya, bukan tanda membaik.

- [ ] `checkin.LEVELS.igd`
  Label A (Luka akut) · Sumber: Penyembuhan dan perawatan luka (MedlinePlus); Infeksi luka dalam praktik klinis (International Wound Infection Institute, 2022); Hubungi 119 saat darurat kesehatan (Kementerian Kesehatan RI)

  > Ke IGD sekarang
  >
  > Tanda ini perlu ditangani di IGD sekarang

- [ ] `checkin.LEVELS.hari_ini`
  Label A (Luka akut) · Sumber: Infeksi luka dalam praktik klinis (International Wound Infection Institute, 2022); Penyembuhan dan perawatan luka (MedlinePlus); Wound infection pathway (NHS Forth Valley, berbasis IWII 2022, 2026); Selulitis dan erisipelas, NG141 (NICE)

  > Periksakan hari ini
  >
  > Tanda ini perlu diperiksakan hari ini

- [ ] `checkin.LEVELS.beberapa_hari` · **inferensi, butuh persetujuan khusus**
  Label I (Inferensi) · Sumber: Penyembuhan dan perawatan luka (MedlinePlus); Luka kronis (healthdirect Australia); Hypergranulation pathway (Oxford Health NHS, 2023)

  > Periksakan dalam beberapa hari
  >
  > Periksakan ke puskesmas atau klinik dalam beberapa hari

- [ ] `checkin.LEVELS.pantau`
  Label A (Luka akut) · Sumber: Penyembuhan dan perawatan luka (MedlinePlus)

  > Lanjutkan pantau
  >
  > Belum ada tanda yang perlu diperiksakan

- [ ] `checkin.REASONS.demamInfeksi (demam-infeksi)`
  Label A (Luka akut) · Sumber: Infeksi luka dalam praktik klinis (International Wound Infection Institute, 2022); Penyembuhan dan perawatan luka (MedlinePlus); Cellulitis (Health Education England)

  > **Level: Ke IGD sekarang**
  >
  > Demam, menggigil, atau badan sangat lemas bersama tanda di sekitar luka

- [ ] `checkin.REASONS.kulitBahaya (kulit-bahaya)`
  Label A (Luka akut) · Sumber: Infeksi luka dalam praktik klinis (International Wound Infection Institute, 2022); Wound infection pathway (NHS Forth Valley, berbasis IWII 2022, 2026)

  > **Level: Ke IGD sekarang**
  >
  > Kulit di sekitar luka menghitam, keabuan, melepuh, atau mati rasa

- [ ] `checkin.REASONS.meluasDemam (meluas-demam)`
  Label A (Luka akut) · Sumber: Infeksi luka dalam praktik klinis (International Wound Infection Institute, 2022); Selulitis dan erisipelas, NG141 (NICE); Cellulitis (Health Education England)

  > **Level: Ke IGD sekarang**
  >
  > Perubahan kulit meluas melewati garis pulpen disertai demam

- [ ] `checkin.REASONS.meluas (meluas)`
  Label A (Luka akut) · Sumber: Selulitis dan erisipelas, NG141 (NICE); Cellulitis (Health Education England); Infeksi luka dalam praktik klinis (International Wound Infection Institute, 2022)

  > **Level: Periksakan hari ini**
  >
  > Perubahan kulit meluas melewati garis pulpen

- [ ] `checkin.REASONS.garisMenjalar (garis-menjalar)`
  Label A (Luka akut) · Sumber: Infeksi luka dalam praktik klinis (International Wound Infection Institute, 2022); Penyembuhan dan perawatan luka (MedlinePlus); Wound infection pathway (NHS Forth Valley, berbasis IWII 2022, 2026); Selulitis dan erisipelas, NG141 (NICE)

  > **Level: Periksakan hari ini**
  >
  > Ada garis yang menjalar menjauhi luka

- [ ] `checkin.REASONS.cairan (cairan)`
  Label A (Luka akut) · Sumber: Wound infection pathway (NHS Forth Valley, berbasis IWII 2022, 2026); Penyembuhan dan perawatan luka (MedlinePlus)

  > **Level: Periksakan hari ini**
  >
  > Cairan kental, keruh, atau kehijauan

- [ ] `checkin.REASONS.bau (bau)`
  Label A (Luka akut) · Sumber: Wound infection pathway (NHS Forth Valley, berbasis IWII 2022, 2026); Infeksi luka dalam praktik klinis (International Wound Infection Institute, 2022)

  > **Level: Periksakan hari ini**
  >
  > Bau yang baru muncul dari luka

- [ ] `checkin.REASONS.hangat (hangat)`
  Label K (Luka kronis) · Sumber: Konsensus penilaian luka pada berbagai warna kulit (Wounds International, 2023); Selulitis dan erisipelas, NG141 (NICE); Cellulitis (Health Education England)

  > **Level: Periksakan hari ini**
  >
  > Kulit lebih hangat dan tegang atau keras, dengan nyeri yang bertambah

- [ ] `checkin.REASONS.nyeriNaik (nyeri-naik)` · **inferensi, butuh persetujuan khusus**
  Label I (Inferensi) · Sumber: Penyembuhan dan perawatan luka (MedlinePlus)

  > **Level: Periksakan hari ini**
  >
  > Nyeri naik 3 poin atau lebih dibanding catatan sebelumnya

- [ ] `checkin.REASONS.demam (demam)` · **inferensi, butuh persetujuan khusus**
  Label I (Inferensi) · Sumber: Penyembuhan dan perawatan luka (MedlinePlus); Infeksi luka dalam praktik klinis (International Wound Infection Institute, 2022)

  > **Level: Periksakan hari ini**
  >
  > Demam, menggigil, atau badan sangat lemas

- [ ] `checkin.REASONS.bakarMemburuk (bakar-memburuk)`
  Label B (Luka bakar) · Sumber: Penanganan luka bakar (American Family Physician, 2020); PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019)

  > **Level: Periksakan hari ini**
  >
  > Luka bakar tampak lebih pucat atau belang, atau nyerinya justru berkurang

- [ ] `checkin.REASONS.hitamBaru (hitam-baru)` · **inferensi, butuh persetujuan khusus**
  Label I (Inferensi) · Sumber: Wound Healing Continuum (Gray dkk., Wounds UK, 2006); Infeksi luka dalam praktik klinis (International Wound Infection Institute, 2022); Hypergranulation pathway (Oxford Health NHS, 2023)

  > **Level: Periksakan dalam beberapa hari**
  >
  > Bagian hitam baru muncul di dasar luka

- [ ] `checkin.REASONS.kuningBerulang (kuning-berulang)` · **inferensi, butuh persetujuan khusus**
  Label I (Inferensi) · Sumber: Wound Healing Continuum (Gray dkk., Wounds UK, 2006); Infeksi luka dalam praktik klinis (International Wound Infection Institute, 2022); Hypergranulation pathway (Oxford Health NHS, 2023)

  > **Level: Periksakan dalam beberapa hari**
  >
  > Lapisan kuning menempel terus muncul kembali

- [ ] `checkin.REASONS.dasarRapuh (dasar-rapuh)` · **inferensi, butuh persetujuan khusus**
  Label I (Inferensi) · Sumber: Wound Healing Continuum (Gray dkk., Wounds UK, 2006); Infeksi luka dalam praktik klinis (International Wound Infection Institute, 2022); Hypergranulation pathway (Oxford Health NHS, 2023)

  > **Level: Periksakan dalam beberapa hari**
  >
  > Dasar luka merah pucat atau gelap dan mudah berdarah, atau jaringan merah menonjol

- [ ] `checkin.REASONS.lewatBatas (lewat-batas)` · **inferensi, butuh persetujuan khusus**
  Label I (Inferensi) · Sumber: Cara lecet sembuh (HealthLinkBC, 2022); Abrasi (Cleveland Clinic, 2023); Luka bakar dengan berbagai kedalaman (Papini, BMJ, 2004)

  > **Level: Periksakan dalam beberapa hari**
  >
  > Sudah lewat batas periksa dan catatan terakhir belum menunjukkan luka menutup

- [ ] `checkin.REASONS.empatMinggu (empat-minggu)`
  Label F (Fase penyembuhan) · Sumber: Luka kronis (healthdirect Australia)

  > **Level: Periksakan dalam beberapa hari**
  >
  > Luka masih terbuka setelah 4 minggu dan perlu perawatan profesional

- [ ] `checkin.PHOTO_HELP`
  Label K (Luka kronis) · Sumber: Konsensus penilaian luka pada berbagai warna kulit (Wounds International, 2023)

  > Bandingkan foto hari ini dengan foto sebelumnya, lalu pilih jawaban yang paling sesuai dengan yang Anda lihat langsung.
  >
  > Lihat di bawah cahaya alami, bukan lampu kuning.
  >
  > LukaCare tidak membaca foto Anda. Penilaian hanya memakai jawaban yang Anda pilih.

- [ ] `checkin.DANGER_REFERENCES.cairan`
  Label A (Luka akut) · Sumber: Infeksi luka dalam praktik klinis (International Wound Infection Institute, 2022); Penyembuhan dan perawatan luka (MedlinePlus); Wound infection pathway (NHS Forth Valley, berbasis IWII 2022, 2026); Selulitis dan erisipelas, NG141 (NICE)

  > Gambar: Contoh cairan hijau atau keruh di dasar luka
  >
  > Hijau, keruh, nanah kental, atau bau yang baru muncul: periksakan hari ini, dan ke IGD bila disertai demam, menggigil, atau lemas berat.

- [ ] `checkin.DANGER_REFERENCES.meluas`
  Label K (Luka kronis) · Sumber: Konsensus penilaian luka pada berbagai warna kulit (Wounds International, 2023); Selulitis dan erisipelas, NG141 (NICE); Cellulitis (Health Education England)

  > Gambar: Contoh kemerahan yang meluas melewati garis pulpen
  >
  > Kemerahan, keunguan, cokelat gelap, atau keabuan yang meluas melewati garis pulpen, garis yang menjalar dari luka, atau kulit yang mengeras: periksakan hari ini, dan ke IGD bila demam.

- [ ] `checkin.DANGER_REFERENCES.kulitGelap`
  Label K (Luka kronis) · Sumber: Konsensus penilaian luka pada berbagai warna kulit (Wounds International, 2023); Selulitis dan erisipelas, NG141 (NICE); Cellulitis (Health Education England)

  > Gambar: Contoh peradangan keunguan pada kulit sawo matang gelap
  >
  > Perhatikan warna yang lebih gelap, keunguan, atau keabuan dibanding kulit sekitarnya.

## Waktu pulih dan batas periksa (Lampiran A)

- [ ] `healing.HEALING_ROWS.lecetRingan (lecet-ringan)`
  Label A (Luka akut) · Sumber: Cara lecet sembuh (HealthLinkBC, 2022); Abrasi (Cleveland Clinic, 2023)

  > Lecet ringan
  >
  > Biasanya 3–7 hari
  >
  > Batas periksa 7 hari

- [ ] `healing.HEALING_ROWS.lecetLebar (lecet-lebar)`
  Label A (Luka akut) · Sumber: Cara lecet sembuh (HealthLinkBC, 2022)

  > Lecet lebar atau dalam
  >
  > Biasanya 1–2 minggu atau lebih
  >
  > Batas periksa 14 hari

- [ ] `healing.HEALING_ROWS.sayatan (sayatan)` · **inferensi, butuh persetujuan khusus**
  Label I (Inferensi) · Sumber: Penjahitan luka robek kulit (Forsch, American Family Physician, 2008); Fase penyembuhan luka (StatPearls, 2023)

  > Sayatan kecil bertepi rapat
  >
  > Permukaan menutup sekitar 48 jam; bagian dalam terus pulih sampai sekitar 3 minggu
  >
  > Batas periksa 7 hari

- [ ] `healing.HEALING_ROWS.bakarDerajat1 (bakar-derajat-1)`
  Label B (Luka bakar) · Sumber: PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019); Burn classification (StatPearls)

  > Luka bakar derajat 1
  >
  > Sekitar 1 minggu (3–10 hari)
  >
  > Batas periksa 10 hari
  >
  > Lihat ulang hari ke-2–3

- [ ] `healing.HEALING_ROWS.bakarDerajat2 (bakar-derajat-2)`
  Label B (Luka bakar) · Sumber: PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019); Luka bakar dengan berbagai kedalaman (Papini, BMJ, 2004); Second-degree burns (Children's Hospital of Philadelphia)

  > Luka bakar derajat 2 superfisial
  >
  > Biasanya paling lama 2 minggu, sampai sekitar 3 minggu
  >
  > Batas periksa 14 hari
  >
  > Lihat ulang hari ke-2–3

- [ ] `healing.HEALING_ROWS.bakarBelumDiketahui (bakar-belum-diketahui)` · **inferensi, butuh persetujuan khusus**
  Label I (Inferensi) · Sumber: PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019); Luka bakar dengan berbagai kedalaman (Papini, BMJ, 2004)

  > Luka bakar ringan
  >
  > Derajat 1 sekitar 1 minggu; derajat 2 superfisial biasanya paling lama 2 minggu, sampai sekitar 3 minggu
  >
  > Batas periksa 10 hari
  >
  > Lihat ulang hari ke-2–3
  >
  > Derajatnya belum dicatat, jadi batas periksa memakai yang lebih awal.

- [ ] `healing.HEALING_ROWS.lepuh (lepuh)` · **inferensi, butuh persetujuan khusus**
  Label I (Inferensi) · Sumber: Blisters (NHS); Lepuh gesekan (Harvard Health, 2023)

  > Lepuh gesekan
  >
  > Beberapa hari sampai sekitar 1 minggu; 2 minggu atau lebih bila terus tergesek
  >
  > Batas periksa 14 hari

- [ ] `healing.FOUR_WEEKS`
  Label F (Fase penyembuhan) · Sumber: Luka kronis (healthdirect Australia)

  > 28 hari
  >
  > Luka apa pun yang masih terbuka setelah 4 minggu perlu perawatan profesional.

- [ ] `healing.RISK_GROUP`
  Label F (Fase penyembuhan) · Sumber: Penyembuhan dan perawatan luka (MedlinePlus); Fase penyembuhan luka (StatPearls, 2023)

  > Periksakan lebih awal
  >
  > Penderita diabetes, lansia, perokok, dan orang dengan gizi kurang atau daya tahan tubuh rendah sembuh lebih lambat. Periksakan lebih awal.

- [ ] `healing.HEALING_PHASES`
  Label F (Fase penyembuhan) · Sumber: Fase penyembuhan luka (StatPearls, 2023); Penyembuhan dan perawatan luka (MedlinePlus); Jenis dan fase penyembuhan luka (Kementerian Kesehatan RI, 2022)

  > Mulai hari ke-1
  >
  > Sampai hari ke-1
  >
  > Beberapa menit
  >
  > Darah membeku, lalu mengering menjadi keropeng pelindung
  >
  > Mulai hari ke-1
  >
  > Sampai hari ke-5
  >
  > Hari 0 sampai sekitar hari ke-5
  >
  > Sedikit bengkak, tepi luka merah atau lebih gelap, nyeri saat disentuh, keluar cairan bening. Rembesan lecet biasanya berhenti dalam 4 hari.
  >
  > Mulai hari ke-2
  >
  > Sampai hari ke-21
  >
  > Hari ke-2–7 sampai sekitar 3 minggu
  >
  > Dasar luka merah berbintik, kulit baru tumbuh dari tepi, luka terasa gatal
  >
  > Mulai hari ke-22
  >
  > 3 minggu sampai 1–2 tahun
  >
  > Bekas luka berubah dari merah dan tebal menjadi pucat dan tipis. Kekuatannya hanya sekitar 80% kulit asli.

## Contoh kasus

- [ ] `caseStories.0 (rizki-lecet)`
  Label A (Luka akut) · Sumber: Cuts and grazes (NHS); Cuts and scrapes: first aid (Mayo Clinic); Cara lecet sembuh (HealthLinkBC, 2022)

  > lecet
  >
  > Lecet
  >
  > rumah
  >
  > Rizki
  >
  > Pengemudi ojek daring
  >
  > illustrations/luka-lecet.png
  >
  > illustrations/kecil/luka-lecet.webp
  >
  > Tergelincir di tikungan berpasir
  >
  > Lutut kirinya lecet kira-kira 4 × 3 cm, penuh pasir, dan darah keluar berupa bintik-bintik.
  >
  > Menit ke-0
  >
  > Jatuh dari motor
  >
  > Lutut kiri lecet sekitar 4 × 3 cm, penuh pasir. Darah keluar berupa bintik-bintik.
  >
  > Menit ke-1
  >
  > Cek tanda bahaya dulu
  >
  > Darah tidak mengalir, tidak ada benda tertancap, dan lutut masih bisa ditekuk.
  >
  > Di lokasi
  >
  > Bilas seadanya
  >
  > Lutut dibilas air minum kemasan.
  >
  > Sampai di rumah
  >
  > Bilas ulang dan tutup
  >
  > Dibilas lagi di bawah keran, kerikil diangkat dengan pinset. Luka diolesi tipis petroleum jelly lalu ditutup kasa non-lengket.
  >
  > Setiap malam
  >
  > Ganti penutup
  >
  > Kasa non-lengket diganti sekali sehari.
  >
  > Hari ke-3
  >
  > Tanda membaik
  >
  > Nyeri turun dari 5 menjadi 2. Kemerahan tidak melebar.
  >
  > Hari ke-10
  >
  > Tertutup kulit baru
  >
  > Luka sudah tertutup kulit baru.
  >
  > Pulih di rumah pada hari ke-10
  >
  > Bilas dengan air mengalir sampai pasir dan kerikil terangkat. Air bersih sudah cukup, tidak perlu alkohol atau iodin di dalam luka.
  >
  > Petroleum jelly tipis menjaga luka tetap lembap dan tidak lengket ke penutup.
  >
  > Catat nyeri dan lebar kemerahan setiap hari. Nyeri yang turun dan kemerahan yang tidak melebar adalah tanda yang baik.

- [ ] `caseStories.1 (maya-terinfeksi)`
  Label A (Luka akut) · Sumber: Tanda-tanda infeksi pada luka (Kementerian Kesehatan RI, 2022); Infeksi luka dalam praktik klinis (International Wound Infection Institute, 2022); Selulitis dan erisipelas, NG141 (NICE)

  > lecet
  >
  > Lecet yang terinfeksi
  >
  > nakes
  >
  > Maya
  >
  > Mahasiswi
  >
  > illustrations/luka-terinfeksi.png
  >
  > illustrations/kecil/luka-terinfeksi.webp
  >
  > Lecet yang hanya dilap tisu
  >
  > Maya jatuh dari sepeda dan sikunya lecet. Karena terburu-buru, lukanya hanya dilap tisu dan tidak dibilas.
  >
  > Hari ke-1
  >
  > Jatuh dari sepeda
  >
  > Siku lecet berpasir. Hanya dilap tisu, tidak dibilas.
  >
  > Hari ke-3, pagi
  >
  > Kemerahan melebar
  >
  > Kemerahan melebar 2 cm dari tepi luka dan nyeri naik dari 2 ke 6. Batas kemerahan ditandai dengan pulpen.
  >
  > Hari ke-3, malam
  >
  > Tanda infeksi
  >
  > Kemerahan melewati tanda pulpen, keluar nanah kuning, dan suhu tubuh 38,2 °C.
  >
  > Malam itu juga
  >
  > Ke klinik
  >
  > Luka dibersihkan dan dokter memberi obat.
  >
  > Ditangani di klinik pada hari ke-3
  >
  > Membilas luka sampai bersih pada hari pertama adalah cara utama mencegah infeksi.
  >
  > Tandai batas kemerahan dengan pulpen. Jika melewati garis, nyeri naik, keluar nanah, atau demam, periksakan hari itu juga.
  >
  > Di kulit sawo matang kemerahan sering sulit terlihat. Perhatikan juga rasa panas, bengkak, dan nyeri yang bertambah.
  >
  > Jangan minum antibiotik sisa atau membelinya tanpa resep.

- [ ] `caseStories.2 (sari-sayatan)`
  Label A (Luka akut) · Sumber: Cuts and grazes (NHS); Cuts and scrapes: first aid (Mayo Clinic); Wounds, cuts and grazes (healthdirect Australia)

  > sayatan
  >
  > Sayatan kecil
  >
  > rumah
  >
  > Bu Sari
  >
  > Ibu rumah tangga
  >
  > illustrations/luka-sayatan.png
  >
  > illustrations/kecil/luka-sayatan.webp
  >
  > Teriris pisau saat memotong bawang
  >
  > Ujung jari telunjuknya tergores sepanjang 1,5 cm. Darah menetes cukup banyak.
  >
  > Menit ke-0
  >
  > Pisau tergelincir
  >
  > Ujung telunjuk tergores sepanjang 1,5 cm. Darah menetes cukup banyak.
  >
  > 10 menit pertama
  >
  > Tekan dan angkat
  >
  > Jari ditekan dengan kain bersih dan tangan diangkat di atas kepala. Darah berhenti.
  >
  > Setelah darah berhenti
  >
  > Bilas dan periksa
  >
  > Luka dibilas air keran. Tepinya rapat, jari bisa ditekuk, dan rasa sentuhnya normal.
  >
  > Setiap sore
  >
  > Ganti plester
  >
  > Jari ditutup plester lentur khusus jari, diganti setelah memasak.
  >
  > Hari ke-4
  >
  > Luka menutup
  >
  > Luka sudah menutup dan plester tidak dipakai lagi.
  >
  > Pulih di rumah pada hari ke-4
  >
  > Tekan terus selama 10 menit. Jangan mengangkat kain berulang kali untuk mengintip.
  >
  > Setelah darah berhenti, periksa tiga hal: tepi luka rapat, jari bisa ditekuk, dan rasa sentuh normal.
  >
  > Periksakan jika darah tidak berhenti setelah ditekan 10 menit atau tepi luka menganga.

- [ ] `caseStories.3 (kevin-robek)`
  Label A (Luka akut) · Sumber: Wounds, cuts and grazes (healthdirect Australia); Penjahitan luka robek kulit (Forsch, American Family Physician, 2008)

  > sayatan
  >
  > Luka robek
  >
  > nakes
  >
  > Kevin
  >
  > illustrations/luka-robek.png
  >
  > illustrations/kecil/luka-robek.webp
  >
  > Dahi terbentur ujung meja kaca
  >
  > Kevin terjatuh saat berlari di ruang tamu. Lukanya 3 cm, menganga, dan berdarah banyak.
  >
  > Menit ke-0
  >
  > Terbentur meja
  >
  > Dahi robek 3 cm, menganga, dan berdarah banyak.
  >
  > Menit pertama
  >
  > Tekan sambil dipangku
  >
  > Ibunya menekan luka dengan handuk bersih sambil memangku Kevin dalam posisi duduk.
  >
  > Setelah darah berkurang
  >
  > Tutup sementara
  >
  > Luka ditutup kasa dan direkatkan plester.
  >
  > Menit ke-40
  >
  > Tiba di IGD
  >
  > Luka dibersihkan dan dijahit.
  >
  > Sesuai jadwal dokter
  >
  > Lepas jahitan
  >
  > Jahitan dilepas di puskesmas. Untuk wajah biasanya 3–5 hari setelah dijahit.
  >
  > Dijahit di IGD, 40 menit setelah kejadian
  >
  > Luka yang menganga perlu dijahit. Datang secepatnya; luka yang bersih umumnya masih bisa dijahit sampai sekitar 12 jam setelah kejadian.
  >
  > Jangan menaburi luka dengan bubuk kopi, abu, atau ramuan, dan jangan menarik tepinya dengan plester untuk menjahit sendiri.
  >
  > Jangan menunda sampai besok.

- [ ] `caseStories.4 (joko-tusuk)`
  Label A (Luka akut) · Sumber: Cuts and scrapes: first aid (Mayo Clinic); Wounds, cuts and grazes (healthdirect Australia)

  > sayatan
  >
  > Luka tusuk
  >
  > nakes
  >
  > Pak Joko
  >
  > illustrations/luka-tusuk.png
  >
  > illustrations/kecil/luka-tusuk.webp
  >
  > Menginjak paku berkarat
  >
  > Saat membersihkan rumah setelah banjir, telapak kakinya tertusuk paku berkarat sekitar 1 cm.
  >
  > Menit ke-0
  >
  > Tertusuk paku
  >
  > Telapak kaki tertusuk paku berkarat sekitar 1 cm. Paku ikut tercabut saat kaki diangkat.
  >
  > Menit pertama
  >
  > Bilas dan tutup
  >
  > Luka dibilas air mengalir dan ditutup kasa.
  >
  > Sore itu
  >
  > Ke puskesmas
  >
  > Ia tidak ingat kapan terakhir disuntik tetanus, jadi petugas memberinya suntikan tetanus.
  >
  > Hari-hari berikutnya
  >
  > Pantau di rumah
  >
  > Ia diminta kembali jika telapak kakinya bengkak, terasa panas, atau bernanah.
  >
  > Suntik tetanus di puskesmas pada hari yang sama
  >
  > Luka tusuk kecil tetap perlu diperiksakan, terutama dari benda berkarat atau kotor. Jangan menunda karena lukanya tampak kecil.
  >
  > Ingat kapan terakhir suntik tetanus. Kalau lupa, sampaikan saja ke petugas.
  >
  > Selama beberapa hari, perhatikan bengkak, rasa panas, dan nanah.

- [ ] `caseStories.5 (rina-tertancap)`
  Label A (Luka akut) · Sumber: Cuts and grazes (NHS)

  > sayatan
  >
  > Benda tertancap
  >
  > nakes
  >
  > Rina
  >
  > illustrations/luka-benda-tertancap.png
  >
  > illustrations/kecil/luka-benda-tertancap.webp
  >
  > Serpihan gelas menancap di telapak kaki
  >
  > Rina menginjak pecahan gelas di dapur. Serpihan sepanjang sekitar 2 cm menancap di telapak kakinya.
  >
  > Menit ke-0
  >
  > Menginjak pecahan gelas
  >
  > Serpihan sekitar 2 cm menancap di telapak kaki.
  >
  > Menit pertama
  >
  > Tidak dicabut
  >
  > Suaminya tidak mencabut serpihan dan menekan di kedua sisinya dengan kain bersih.
  >
  > Sebelum berangkat
  >
  > Ganjal dan balut
  >
  > Dua gulungan kasa diletakkan di kiri dan kanan serpihan, lalu dibalut perban gulung.
  >
  > Perjalanan
  >
  > Berangkat ke IGD
  >
  > Mereka berangkat dengan taksi daring.
  >
  > Di IGD
  >
  > Serpihan dikeluarkan
  >
  > Dokter mengeluarkan serpihan dan memastikan tidak ada sisa kaca di dalam luka.
  >
  > Serpihan dikeluarkan dokter di IGD
  >
  > Jangan mencabut benda yang tertancap. Biarkan tenaga kesehatan yang mengeluarkannya.
  >
  > Tekan di sekitar benda, bukan di atasnya, lalu ganjal dengan gulungan kasa di kedua sisi.
  >
  > Jangan mengorek luka untuk mencari serpihan.

- [ ] `caseStories.6 (dewi-bakar)`
  Label B (Luka bakar) · Sumber: Burns and scalds: treatment (NHS); Air mengalir mengurangi cangkok kulit (Griffin dkk., 2020); PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019); Second-degree burns (Children's Hospital of Philadelphia)

  > bakar
  >
  > Luka bakar ringan
  >
  > rumah
  >
  > Dewi
  >
  > Pedagang gorengan
  >
  > illustrations/luka-bakar-ringan.png
  >
  > illustrations/kecil/luka-bakar-ringan.webp
  >
  > Terpercik minyak panas
  >
  > Punggung tangan kirinya merah selebar dua jari dan muncul dua lepuh kecil seukuran biji jagung.
  >
  > Detik pertama
  >
  > Terpercik minyak
  >
  > Punggung tangan kiri merah selebar dua jari, dengan dua lepuh kecil seukuran biji jagung.
  >
  > 20 menit pertama
  >
  > Dinginkan dengan air mengalir
  >
  > Cincin dilepas, lalu tangan dialiri air keran selama 20 menit dengan timer di ponsel.
  >
  > Setelah didinginkan
  >
  > Tutup, tanpa pasta gigi
  >
  > Tetangganya menyarankan mengoles pasta gigi, tetapi Dewi menutup luka dengan plastik wrap saja.
  >
  > Selama berjualan
  >
  > Lindungi lepuh
  >
  > Lepuh dibiarkan utuh dan dilindungi kasa non-lengket.
  >
  > Hari ke-3
  >
  > Nyeri hilang
  >
  > Nyerinya hilang.
  >
  > Minggu ke-2 sampai 3
  >
  > Kulit pulih
  >
  > Kulit pulih tanpa bekas.
  >
  > Pulih tanpa bekas dalam 2–3 minggu
  >
  > Dinginkan dengan air mengalir selama 20 menit. Pakai timer, karena 20 menit terasa lama.
  >
  > Jangan pakai es, pasta gigi, mentega, minyak, atau kecap.
  >
  > Biarkan lepuh utuh. Lihat lagi luka pada hari ke-2–3: bagian yang putih atau tidak terasa nyeri berarti lebih dalam dan perlu diperiksakan.

- [ ] `caseStories.7 (hendra-bakar-berat)`
  Label B (Luka bakar) · Sumber: Burns and scalds: treatment (NHS); PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019); Penanganan luka bakar (American Family Physician, 2020)

  > bakar
  >
  > Luka bakar berat
  >
  > nakes
  >
  > Pak Hendra
  >
  > illustrations/luka-bakar-berat.png
  >
  > illustrations/kecil/luka-bakar-berat.webp
  >
  > Tersiram air mendidih
  >
  > Panci besar berisi air mendidih tumpah. Paha dan perutnya merah, banyak lepuh, sebagian kulit tampak putih, dan luasnya lebih dari dua telapak tangannya.
  >
  > Menit ke-0
  >
  > Panci tumpah
  >
  > Paha dan perut merah, banyak lepuh, sebagian kulit tampak putih. Luasnya lebih dari dua telapak tangannya.
  >
  > Menit pertama
  >
  > Telepon 119
  >
  > Keluarga langsung menelepon 119.
  >
  > 20 menit pertama
  >
  > Dinginkan
  >
  > Luka diguyur air keran bersuhu biasa. Celana yang tidak menempel digunting dan dilepas.
  >
  > Sambil menunggu
  >
  > Tutup dan hangatkan
  >
  > Luka ditutup longgar dengan plastik wrap, dan Pak Hendra diselimuti agar tidak kedinginan.
  >
  > Di rumah sakit
  >
  > Dirawat
  >
  > Ia dirawat di bangsal luka bakar.
  >
  > Dirawat di bangsal luka bakar
  >
  > Luka bakar yang luas atau ada bagian kulit yang putih perlu ditangani rumah sakit. Telepon 119.
  >
  > Dinginkan dengan air bersuhu biasa, bukan es, lalu jaga tubuh tetap hangat.
  >
  > Jangan menarik kain yang menempel di kulit dan jangan memecahkan lepuh.

- [ ] `caseStories.8 (andi-lepuh)`
  Label A (Luka akut) · Sumber: Blisters (NHS); Lepuh gesekan (Harvard Health, 2023)

  > lepuh
  >
  > Lepuh karena gesekan
  >
  > rumah
  >
  > Andi
  >
  > Karyawan kantor
  >
  > illustrations/luka-lepuh.png
  >
  > illustrations/kecil/luka-lepuh.webp
  >
  > Jalan sehat dengan sepatu baru
  >
  > Setelah jalan sehat 5 km dengan sepatu baru, tumit kanannya melepuh sebesar koin Rp1.000.
  >
  > Hari ke-0
  >
  > Jalan sehat 5 km
  >
  > Andi memakai sepatu baru.
  >
  > Malamnya
  >
  > Tumit melepuh
  >
  > Tumit kanan melepuh sebesar koin Rp1.000.
  >
  > Malam itu juga
  >
  > Lindungi, jangan dipecahkan
  >
  > Lepuh tidak dipecahkan. Tumit dicuci, dikeringkan, lalu ditutup plester hidrokoloid.
  >
  > Hari ke-1 sampai 5
  >
  > Hentikan gesekan
  >
  > Andi memakai sepatu lama yang longgar dengan kaus kaki.
  >
  > Hari ke-5
  >
  > Kulit kering
  >
  > Plester lepas sendiri dan kulit di bawahnya sudah kering.
  >
  > Pulih di rumah pada hari ke-5
  >
  > Jangan menusuk lepuh dengan jarum atau mengelupas kulitnya.
  >
  > Hentikan gesekannya: ganti alas kaki sampai lepuh pulih.
  >
  > Penderita diabetes sebaiknya memeriksakan lepuh di kaki.

- [ ] `caseStories.9 (rudi-gigitan)`
  Label A (Luka akut) · Sumber: Segera ke faskes jika digigit anjing (Kementerian Kesehatan RI, 2023); Rabies prevention (WHO Rabies Bulletin Europe)

  > gigitan
  >
  > Gigitan anjing
  >
  > nakes
  >
  > Rudi
  >
  > Pelajar SD
  >
  > illustrations/luka-gigitan-cakaran.png
  >
  > illustrations/kecil/luka-gigitan-cakaran.webp
  >
  > Digigit anjing liar sepulang sekolah
  >
  > Ada empat bekas gigi kecil di betisnya yang sedikit berdarah.
  >
  > Menit ke-0
  >
  > Digigit anjing liar
  >
  > Empat bekas gigi kecil di betis, sedikit berdarah.
  >
  > 15 menit pertama
  >
  > Cuci dengan sabun
  >
  > Ibunya mencuci betis Rudi dengan sabun di bawah air keran selama 15 menit, lalu mengoleskan povidon iodin.
  >
  > Sore itu
  >
  > Ke puskesmas
  >
  > Petugas mencuci ulang luka dan memberi vaksin anti rabies sesuai jadwal.
  >
  > Hari yang sama
  >
  > Lapor ketua RT
  >
  > Ketua RT dilapori agar anjing tersebut ditangkap dan dipantau.
  >
  > Hari-hari berikutnya
  >
  > Vaksin lanjutan
  >
  > Dosis berikutnya mengikuti jadwal dari puskesmas.
  >
  > Vaksin anti rabies di puskesmas pada hari yang sama
  >
  > Cuci luka gigitan dengan sabun dan air mengalir selama 15 menit, secepatnya.
  >
  > Gigitan kecil pun perlu ke puskesmas hari itu juga. Kemenkes mencatat sebagian besar kematian akibat rabies terjadi karena pasien terlambat datang.
  >
  > Laporkan hewannya agar bisa ditangkap dan diamati.

## Pengantar pustaka

- [ ] `libraryIntro.0`
  Label F (Fase penyembuhan) · Sumber: Jenis dan fase penyembuhan luka (Kementerian Kesehatan RI, 2022); Fase penyembuhan luka (StatPearls, 2023)

  > Setiap bab memuat dua gambar berdampingan: **tampak atas** menunjukkan luka seperti yang terlihat di kulit, dan **penampang kulit** menunjukkan seberapa dalam luka masuk. Makin dalam lukanya, makin besar kemungkinan perlu tenaga kesehatan.

- [ ] `libraryIntro.1`
  Label F (Fase penyembuhan) · Sumber: Jenis dan fase penyembuhan luka (Kementerian Kesehatan RI, 2022); Fase penyembuhan luka (StatPearls, 2023)

  > Gambar: Lapisan kulit dan peta kedalaman tiap jenis luka. Lepuh, luka bakar derajat 1, lecet, luka bakar derajat 2, dan sayatan kecil berhenti di epidermis atau dermis. Luka bakar derajat 3 sampai batas lemak, gigitan dan luka robek masuk ke lemak, tusukan bisa sampai otot.

- [ ] `libraryIntro.2`
  Label F (Fase penyembuhan) · Sumber: Jenis dan fase penyembuhan luka (Kementerian Kesehatan RI, 2022); Fase penyembuhan luka (StatPearls, 2023)

  > Kulit terdiri dari epidermis (lapisan terluar yang tipis), dermis (berisi pembuluh darah, saraf, akar rambut, dan kelenjar keringat), lalu lapisan lemak. Otot berada di bawahnya. Garis hijau di tiap gambar bab menandai luka yang umumnya bisa dirawat di rumah, garis merah menandai luka yang perlu diperiksa.

## Pustaka: isi Bab 1–10

### Bab 1. Lecet

Label A (Luka akut) · Sumber: Cuts and grazes (NHS); Cuts and scrapes: first aid (Mayo Clinic); Cara lecet sembuh (HealthLinkBC, 2022)

- [ ] `chapters.0.lecet.0`

  > Lecet adalah luka gores dangkal yang mengikis lapisan kulit terluar. Umumnya bisa dirawat di rumah dan mulai membaik dalam beberapa hari.

- [ ] `chapters.0.lecet.1`

  > Gambar: Lecet tampak atas: area merah basah dengan goresan sejajar, bintik darah, dan kerikil. Penampang: luka dangkal sampai dermis bagian atas dengan kotoran menempel.

- [ ] `chapters.0.lecet.2`

  > Ciri-ciri
  >
  > Permukaan merah muda sampai merah dan basah, dengan goresan sejajar searah gesekan
  >
  > Darah keluar berupa bintik-bintik, tidak mengalir
  >
  > Sering ada pasir, kerikil, atau serpihan aspal yang menempel
  >
  > Perih, terutama saat terkena air

- [ ] `chapters.0.lecet.3`

  > Penyebab umum
  >
  > jatuh dari motor atau sepeda, terseret di aspal, jatuh saat berlari atau bermain.

- [ ] `chapters.0.lecet.4`

  > Langkah perawatan
  >
  > Cuci tangan dengan sabun. Pakai sarung tangan jika ada.
  >
  > Jika masih berdarah, tekan perlahan dengan kasa bersih sampai berhenti.
  >
  > Bilas dengan air mengalir sampai pasir dan kotoran terangkat. Bersihkan kulit di sekitarnya dengan sabun, usahakan sabun tidak masuk ke luka.
  >
  > Angkat kerikil kecil yang tersisa dengan pinset yang sudah dibersihkan alkohol.
  >
  > Tepuk kering kulit di sekitar luka. Jangan digosok.
  >
  > Oleskan tipis petroleum jelly agar luka tetap lembap dan tidak lengket ke penutup.
  >
  > Tutup dengan kasa non-lengket atau plester. Ganti sekali sehari, atau lebih cepat jika basah atau kotor.

- [ ] `chapters.0.lecet.5`

  > Hindari
  >
  > menggosok luka dengan kasar, meniup luka, mengelupas keropeng, dan menuang alkohol, hidrogen peroksida, atau iodin langsung ke dalam luka. Air mengalir sudah cukup untuk membersihkannya.

- [ ] `chapters.0.lecet.6`

  > Perlengkapan
  >
  > air bersih atau NaCl 0,9%, kasa steril, kasa non-lengket, plester, petroleum jelly, pinset.

- [ ] `chapters.0.lecet.7`

  > Waktu pulih
  >
  > lecet ringan 3–7 hari; lecet yang lebih lebar atau dalam 1–2 minggu atau lebih. Rembesan cairan biasanya berhenti dalam 4 hari.

- [ ] `chapters.0.lecet.8`

  > Periksakan jika
  >
  > kotoran tidak bisa diangkat semuanya, luka lebih lebar dari telapak tangan, dasar luka tampak putih atau butiran lemak terlihat, tidak membaik setelah sekitar 1 minggu, atau muncul tanda infeksi (Bab 10).

### Bab 2. Sayatan kecil

Label A (Luka akut) · Sumber: Cuts and grazes (NHS); Cuts and scrapes: first aid (Mayo Clinic); Wounds, cuts and grazes (healthdirect Australia)

- [ ] `chapters.1.sayatan.0`

  > Sayatan kecil adalah luka iris bertepi lurus akibat benda tajam. Jika tepinya rapat dan darah berhenti setelah ditekan, umumnya bisa dirawat di rumah.

- [ ] `chapters.1.sayatan.1`

  > Gambar: Sayatan tampak atas: garis lurus sempit dengan darah merembes. Penampang: celah sempit menembus epidermis sampai dermis.

- [ ] `chapters.1.sayatan.2`

  > Ciri-ciri
  >
  > Berbentuk garis lurus, tepinya rata dan saling menempel
  >
  > Darah mengalir atau merembes di sepanjang garis
  >
  > Panjang tetapi sempit, tanpa jaringan kuning (lemak) yang terlihat di dalamnya

- [ ] `chapters.1.sayatan.3`

  > Penyebab umum
  >
  > pisau dapur, cutter, kertas, tutup kaleng, pecahan kaca kecil.

- [ ] `chapters.1.sayatan.4`

  > Langkah perawatan
  >
  > Cuci tangan dengan sabun.
  >
  > Tekan dengan kasa atau kain bersih terus-menerus selama 5–10 menit tanpa diangkat. Bila bisa, angkat bagian yang luka lebih tinggi dari jantung.
  >
  > Setelah darah berhenti, bilas dengan air mengalir.
  >
  > Periksa tepinya. Jika tepi terbuka lebar, lukanya dalam, atau panjangnya lebih dari 5 cm, ikuti Bab 5.
  >
  > Keringkan kulit di sekitar luka, lalu tutup dengan plester atau kasa steril.
  >
  > Ganti penutup sekali sehari atau saat basah.

- [ ] `chapters.1.sayatan.5`

  > Hindari
  >
  > mengangkat kasa berulang kali untuk mengintip, menuang alkohol ke dalam luka, dan menutup luka yang masih berdarah deras.

- [ ] `chapters.1.sayatan.6`

  > Perlengkapan
  >
  > kasa steril, plester (plester lentur untuk jari), sarung tangan.

- [ ] `chapters.1.sayatan.7`

  > Waktu pulih
  >
  > permukaan sayatan yang rapat menutup dalam sekitar 48 jam, dan penutup biasanya boleh dilepas setelah beberapa hari. Bagian dalamnya terus pulih sampai sekitar 3 minggu.

- [ ] `chapters.1.sayatan.8`

  > Periksakan jika
  >
  > darah tidak berhenti setelah ditekan 10 menit, tepinya menganga, sayatannya dalam di wajah atau telapak tangan, jari mati rasa atau sulit digerakkan, atau benda penyebabnya kotor dan berkarat.

### Bab 3. Luka bakar ringan

Label B (Luka bakar) · Sumber: Burns and scalds: treatment (NHS); Air mengalir mengurangi cangkok kulit (Griffin dkk., 2020); PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019); Second-degree burns (Children's Hospital of Philadelphia)

- [ ] `chapters.2.luka-bakar-ringan.0`

  > Luka bakar ringan adalah luka bakar derajat 1, atau derajat 2 superfisial yang lebih kecil dari telapak tangan korban. Langkah terpenting: alirkan air bersuhu biasa selama 20 menit, sesegera mungkin.

- [ ] `chapters.2.luka-bakar-ringan.1`

  > Gambar: Luka bakar ringan tampak atas: area merah dengan beberapa lepuh berisi cairan bening. Penampang: kemerahan di epidermis dan dermis atas, dengan epidermis terangkat membentuk lepuh.

- [ ] `chapters.2.luka-bakar-ringan.2`

  > Gambar berikut membandingkan ketiga derajat luka bakar. Derajat 3, dan derajat 2 yang luas atau dalam, dibahas di Bab 9.

- [ ] `chapters.2.luka-bakar-ringan.3`

  > Gambar: Perbandingan derajat luka bakar. Derajat 1: merah, kering, nyeri, tanpa lepuh, pulih 5 sampai 10 hari. Derajat 2: melepuh, basah, sangat nyeri, yang superfisial pulih sekitar 3 minggu. Derajat 3: putih atau hangus, kaku, bisa tidak nyeri, selalu ke rumah sakit.

- [ ] `chapters.2.luka-bakar-ringan.4`

  > Ciri-ciri
  >
  > Derajat 1: merah, kering, dan nyeri, tanpa lepuh, mirip kulit terbakar matahari
  >
  > Derajat 2 superfisial: muncul lepuh berisi cairan bening, kulit tampak basah mengilap, dan sangat nyeri

- [ ] `chapters.2.luka-bakar-ringan.5`

  > Penyebab umum
  >
  > cipratan minyak goreng, panci atau setrika panas, air atau kuah mendidih, knalpot motor.

- [ ] `chapters.2.luka-bakar-ringan.6`

  > Langkah perawatan
  >
  > Jauhkan korban dari sumber panas.
  >
  > Lepas cincin, jam, gelang, atau pakaian di dekat luka sebelum membengkak. Kain yang menempel di kulit jangan ditarik.
  >
  > Alirkan air bersuhu biasa selama 20 menit, sebaiknya dalam 3 jam pertama. Jika tidak ada air mengalir, pakai air minum kemasan atau handuk basah.
  >
  > Tutup longgar dengan plastik wrap bersih atau kasa non-lengket. Jangan dililit.
  >
  > Untuk nyeri, minum parasetamol atau ibuprofen sesuai aturan pakai pada kemasan.
  >
  > Biarkan lepuh tetap utuh. Saat kulit mulai kering dan gatal, pakai pelembap yang disarankan apoteker.

- [ ] `chapters.2.luka-bakar-ringan.7`

  > Hindari
  >
  > es batu atau air es; pasta gigi, mentega, minyak, kecap, atau krim; plester lengket langsung di atas luka bakar; dan memecahkan lepuh.

- [ ] `chapters.2.luka-bakar-ringan.8`

  > Perlengkapan
  >
  > plastik wrap, kasa non-lengket, gel hidrogel luka bakar (dipakai setelah luka didinginkan), plester kertas.

- [ ] `chapters.2.luka-bakar-ringan.9`

  > Waktu pulih
  >
  > derajat 1 sekitar 1 minggu (3–10 hari) tanpa bekas; derajat 2 superfisial biasanya paling lama 2 minggu, sampai sekitar 3 minggu. Lihat lagi pada hari ke-2–3, karena luka bakar bisa bertambah dalam; nyeri yang justru berkurang adalah tanda bahaya.

- [ ] `chapters.2.luka-bakar-ringan.10`

  > Periksakan jika
  >
  > luka lebih lebar dari telapak tangan korban, berada di wajah, kelamin, bokong, atau sendi, terjadi pada bayi atau balita, akibat bahan kimia atau listrik, atau lepuhnya tampak terinfeksi. Luka bakar knalpot sering lebih dalam dari kelihatannya: jika bagian tengahnya putih atau tidak terasa nyeri, periksakan.

### Bab 4. Lepuh karena gesekan

Label A (Luka akut) · Sumber: Blisters (NHS); Lepuh gesekan (Harvard Health, 2023)

- [ ] `chapters.3.lepuh.0`

  > Lepuh gesekan adalah kantong cairan bening di bawah kulit akibat gesekan berulang. Jangan dipecahkan; biasanya pulih sendiri dalam sekitar seminggu.

- [ ] `chapters.3.lepuh.1`

  > Gambar: Lepuh tampak atas: gelembung berisi cairan bening dengan kemerahan tipis di tepinya. Penampang: cairan terkumpul di antara epidermis yang terangkat dan dermis.

- [ ] `chapters.3.lepuh.2`

  > Ciri-ciri
  >
  > Gelembung berisi cairan bening dengan kulit di atasnya masih utuh
  >
  > Kemerahan tipis di sekelilingnya
  >
  > Nyeri saat ditekan atau bergesekan

- [ ] `chapters.3.lepuh.3`

  > Penyebab umum
  >
  > sepatu atau sandal baru, berjalan jauh, olahraga, memegang alat seperti cangkul atau raket terlalu lama.

- [ ] `chapters.3.lepuh.4`

  > Langkah perawatan
  >
  > Biarkan lepuh utuh. Kulitnya melindungi lapisan di bawahnya dari kuman.
  >
  > Cuci perlahan dengan sabun dan air, lalu tepuk kering.
  >
  > Tutup dengan plester berbantalan atau plester hidrokoloid.
  >
  > Hindari sepatu atau alat penyebabnya sampai lepuh sembuh.
  >
  > Jika lepuh pecah sendiri: cuci tangan, biarkan cairannya keluar, jangan kelupas kulitnya, lalu tutup dengan plester.

- [ ] `chapters.3.lepuh.5`

  > Hindari
  >
  > menusuk lepuh dengan jarum, mengelupas kulit lepuh, dan terus memakai alas kaki yang sama.

- [ ] `chapters.3.lepuh.6`

  > Perlengkapan
  >
  > plester lepuh hidrokoloid, plester berbantalan, kaus kaki.

- [ ] `chapters.3.lepuh.7`

  > Waktu pulih
  >
  > biasanya kempis dalam beberapa hari dan pulih sekitar 1 minggu; bisa 2 minggu atau lebih bila terus tergesek.

- [ ] `chapters.3.lepuh.8`

  > Periksakan jika
  >
  > lepuh tampak terinfeksi (panas, bernanah kuning atau hijau, kemerahan melebar), sangat nyeri atau terus kambuh, muncul di kelopak mata, mulut, atau kelamin, muncul di banyak tempat tanpa sebab jelas, atau berasal dari luka bakar atau alergi. Penderita diabetes sebaiknya memeriksakan lepuh di kaki.

### Bab 5. Luka robek atau menganga

Label A (Luka akut) · Sumber: Wounds, cuts and grazes (healthdirect Australia); Penjahitan luka robek kulit (Forsch, American Family Physician, 2008)

- [ ] `chapters.4.luka-robek.0`

  > Luka robek bertepi tidak rata dan terbuka sehingga bagian dalamnya terlihat. Luka seperti ini perlu dijahit atau ditutup tenaga kesehatan, sebaiknya dalam 2 jam pertama.

- [ ] `chapters.4.luka-robek.1`

  > Gambar: Luka robek tampak atas: tepi tidak rata dan terbuka, tampak lemak kuning, darah terus keluar. Penampang: celah lebar menembus dermis sampai lapisan lemak.

- [ ] `chapters.4.luka-robek.2`

  > Ciri-ciri
  >
  > Tepi tidak rata dan tidak bisa menempel sendiri
  >
  > Tampak jaringan kuning (lemak) atau bagian yang lebih dalam
  >
  > Darah terus keluar dan sulit berhenti
  >
  > Sering lebih panjang dari 5 cm

- [ ] `chapters.4.luka-robek.3`

  > Penyebab umum
  >
  > terbentur ujung meja atau besi, jatuh di permukaan tajam, kecelakaan lalu lintas, tergores seng atau kaca besar.

- [ ] `chapters.4.luka-robek.4`

  > Pertolongan pertama
  >
  > Tekan kuat dengan kasa atau kain bersih. Jika kain tembus darah, tumpuk kain baru di atasnya tanpa mengangkat yang lama.
  >
  > Bila bisa, angkat bagian yang luka lebih tinggi dari jantung.
  >
  > Setelah darah terkendali, tutup dengan kasa dan balut tidak terlalu kencang.
  >
  > Berangkat ke IGD atau puskesmas. Jangan menyetir sendiri.

- [ ] `chapters.4.luka-robek.5`

  > Hindari
  >
  > menaburi luka dengan bubuk kopi, abu, atau ramuan; menarik tepi luka dengan plester untuk "menjahit sendiri"; dan menunda sampai besok.

- [ ] `chapters.4.luka-robek.6`

  > Waktu pulih
  >
  > datanglah secepatnya; luka yang bersih umumnya masih bisa dijahit sampai sekitar 12 jam setelah kejadian. Jahitan dilepas setelah 3–5 hari di wajah, 7–10 hari di kulit kepala dan lengan, 10–14 hari di badan, tungkai, tangan, dan kaki, serta 14–21 hari di telapak tangan dan telapak kaki. Bekas luka mencapai kekuatan terbaiknya dalam 11–14 minggu, sekitar 80% kulit asli.

### Bab 6. Luka tusuk

Label A (Luka akut) · Sumber: Cuts and scrapes: first aid (Mayo Clinic); Wounds, cuts and grazes (healthdirect Australia)

- [ ] `chapters.5.luka-tusuk.0`

  > Luka tusuk tampak kecil di permukaan, tetapi bisa masuk dalam dan membawa kotoran. Periksakan hari itu juga, terutama untuk menilai perlu tidaknya suntik tetanus.

- [ ] `chapters.5.luka-tusuk.1`

  > Gambar: Luka tusuk tampak atas: lubang kecil dengan sedikit darah, di dekatnya paku berkarat. Penampang: saluran sempit yang masuk sampai otot dengan kotoran di ujungnya.

- [ ] `chapters.5.luka-tusuk.2`

  > Ciri-ciri
  >
  > Lubang kecil dengan sedikit darah
  >
  > Nyeri terasa dalam, bukan di permukaan
  >
  > Penyebabnya benda runcing yang sering kotor

- [ ] `chapters.5.luka-tusuk.3`

  > Penyebab umum
  >
  > paku, kawat, duri, jarum, tusuk sate, serpihan kayu, terutama saat bersih-bersih setelah banjir atau di lokasi bangunan.

- [ ] `chapters.5.luka-tusuk.4`

  > Pertolongan pertama
  >
  > Jika benda masih tertancap, jangan dicabut dan ikuti Bab 7.
  >
  > Bilas dengan air bersih mengalir.
  >
  > Tutup dengan kasa bersih.
  >
  > Ke puskesmas hari ini. Suntik tetanus dianjurkan jika luka dalam atau kotor dan suntikan terakhir lebih dari 5 tahun lalu, atau tidak ingat kapan.

- [ ] `chapters.5.luka-tusuk.5`

  > Hindari
  >
  > menutup rapat luka tanpa dibersihkan, dan menunda karena lukanya "cuma kecil".

- [ ] `chapters.5.luka-tusuk.6`

  > Pantau
  >
  > tanda infeksi pada hari-hari berikutnya (Bab 10). Jika muncul kaku rahang atau kejang otot, segera ke IGD.

### Bab 7. Benda tertancap

Label A (Luka akut) · Sumber: Cuts and grazes (NHS)

- [ ] `chapters.6.benda-tertancap.0`

  > Jika benda masih tertancap di luka, jangan dicabut. Benda itu ikut menahan perdarahan, dan mencabutnya di rumah bisa memicu perdarahan hebat.

- [ ] `chapters.6.benda-tertancap.1`

  > Gambar: Benda tertancap tampak atas: pecahan kaca menancap dengan gulungan kasa di kedua sisinya. Penampang: kaca masuk sampai lapisan lemak, gulungan kasa menahan dari kiri dan kanan.

- [ ] `chapters.6.benda-tertancap.2`

  > Ciri-ciri
  >
  > pecahan kaca, kayu, logam, kail pancing, atau benda lain masih berada di dalam luka.

- [ ] `chapters.6.benda-tertancap.3`

  > Pertolongan pertama
  >
  > Jangan cabut atau goyangkan bendanya.
  >
  > Tekan kuat di kedua sisi benda, bukan di atasnya.
  >
  > Ganjal benda dengan gulungan kasa atau kain di kedua sisinya agar tidak bergerak, lalu balut di sekelilingnya.
  >
  > Telepon 119 atau ke IGD. Jangan menyetir sendiri.

- [ ] `chapters.6.benda-tertancap.4`

  > Hindari
  >
  > mencabut benda, menekan langsung di atasnya, dan mengorek luka untuk mencari serpihan.

### Bab 8. Gigitan dan cakaran hewan

Label A (Luka akut) · Sumber: Segera ke faskes jika digigit anjing (Kementerian Kesehatan RI, 2023); Rabies prevention (WHO Rabies Bulletin Europe)

- [ ] `chapters.7.gigitan-hewan.0`

  > Gigitan atau cakaran hewan berisiko rabies dan infeksi, sekecil apa pun lukanya. Cuci 15 menit dengan sabun di bawah air mengalir, lalu ke puskesmas atau rumah sakit hari itu juga.

- [ ] `chapters.7.gigitan-hewan.1`

  > Gambar: Gigitan tampak atas: bekas gigi membentuk lengkungan dengan memar, dan cakaran berupa garis-garis sejajar. Penampang: beberapa tusukan sempit dengan kedalaman berbeda, kuman dari air liur ikut masuk.

- [ ] `chapters.7.gigitan-hewan.2`

  > Ciri-ciri
  >
  > Bekas gigi berpasangan yang membentuk lengkungan, kadang disertai robekan atau memar
  >
  > Cakaran berupa garis-garis tipis yang sejajar
  >
  > Lukanya bisa kecil atau bahkan tidak berdarah, tetapi tetap berisiko

- [ ] `chapters.7.gigitan-hewan.3`

  > Hewan yang perlu diwaspadai
  >
  > anjing, kucing, dan kera. Menurut Kementerian Kesehatan, 95% kasus rabies pada manusia berasal dari gigitan anjing. Gigitan manusia juga perlu diperiksakan.

- [ ] `chapters.7.gigitan-hewan.4`

  > Pertolongan pertama
  >
  > Cuci luka dengan sabun atau detergen di bawah air mengalir selama 15 menit.
  >
  > Keringkan, lalu oleskan antiseptik seperti povidon iodin.
  >
  > Tutup longgar dengan kasa. Jangan dijahit atau ditutup rapat.
  >
  > Ke puskesmas atau rumah sakit hari ini. Petugas akan mencuci ulang luka dan menilai kebutuhan vaksin anti rabies (VAR).
  >
  > Catat hewan yang menggigit: milik siapa, sudah divaksin atau belum, lalu laporkan agar hewan itu dipantau.

- [ ] `chapters.7.gigitan-hewan.5`

  > Hindari
  >
  > menunda karena lukanya kecil atau tidak berdarah, dan mengandalkan ramuan. Kemenkes mencatat sebagian besar kematian akibat rabies terjadi karena pasien terlambat datang ke fasilitas kesehatan.

### Bab 9. Luka bakar berat, kimia, dan listrik

Label B (Luka bakar) · Sumber: Burns and scalds: treatment (NHS); PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019); Penanganan luka bakar (American Family Physician, 2020)

- [ ] `chapters.8.luka-bakar-berat.0`

  > Luka bakar yang luas, dalam, atau disebabkan bahan kimia atau listrik harus ditangani di rumah sakit. Telepon 119, lalu dinginkan luka sambil menunggu.

- [ ] `chapters.8.luka-bakar-berat.1`

  > Gambar: Luka bakar berat tampak atas: bagian tengah putih, kaku, dan sebagian hangus, dikelilingi tepi merah yang melepuh. Penampang: seluruh lapisan kulit rusak sampai batas lemak.

- [ ] `chapters.8.luka-bakar-berat.2`

  > Ciri-ciri
  >
  > Lebih lebar dari telapak tangan korban
  >
  > Kulit putih, cokelat, atau hangus, kaku seperti kulit kering
  >
  > Bisa tidak terasa nyeri karena ujung saraf ikut rusak
  >
  > Mengenai wajah, tangan, kaki, kelamin, bokong, atau sendi
  >
  > Akibat bahan kimia (pembersih lantai, air aki, kapur), sengatan listrik, atau ledakan tabung gas

- [ ] `chapters.8.luka-bakar-berat.3`

  > Pertolongan pertama
  >
  > Amankan lokasi. Untuk sengatan listrik, matikan sumber listrik sebelum menyentuh korban.
  >
  > Telepon 119.
  >
  > Alirkan air bersuhu biasa selama 20 menit. Untuk bahan kimia, lepas pakaian yang terkena lalu bilas dengan air mengalir yang banyak.
  >
  > Lepas perhiasan dan pakaian di sekitar luka, kecuali yang menempel di kulit.
  >
  > Tutup longgar dengan plastik wrap atau kain bersih.
  >
  > Jaga korban tetap hangat, terutama anak-anak.

- [ ] `chapters.8.luka-bakar-berat.4`

  > Hindari
  >
  > es, mentega, atau pasta gigi; memecahkan lepuh; menarik kain yang menempel; dan menyetir sendiri ke rumah sakit. Luka bakar listrik bisa tampak kecil di kulit tetapi merusak jaringan di bawahnya, jadi selalu periksakan.

- [ ] `chapters.8.luka-bakar-berat.5`

  > Waktu pulih
  >
  > luka bakar derajat 2 dalam butuh lebih dari 3 minggu dan hampir pasti berparut. Derajat 3 tidak sembuh sendiri; butuh lebih dari 8 minggu dan operasi. Lihat tabel warna luka bakar di Bagian C.

### Bab 10. Luka terinfeksi

Label A (Luka akut) · Sumber: Tanda-tanda infeksi pada luka (Kementerian Kesehatan RI, 2022); Infeksi luka dalam praktik klinis (International Wound Infection Institute, 2022); Selulitis dan erisipelas, NG141 (NICE)

- [ ] `chapters.9.luka-terinfeksi.0`

  > Luka yang makin merah, bengkak, panas, nyeri, atau bernanah kemungkinan terinfeksi dan perlu diperiksa hari itu juga. Infeksi bisa muncul pada jenis luka apa pun di bab sebelumnya.

- [ ] `chapters.9.luka-terinfeksi.1`

  > Gambar: Luka terinfeksi tampak atas: luka dengan nanah kekuningan, dikelilingi kemerahan luas yang batasnya ditandai pulpen beserta jam. Penampang: kulit membengkak dengan kantong nanah di dermis.

- [ ] `chapters.9.luka-terinfeksi.2`

  > Ciri-ciri
  >
  > (bandingkan dengan hari sebelumnya)
  >
  > Kemerahan melebar dari tepi luka
  >
  > Bengkak dan terasa panas
  >
  > Keluar nanah kuning atau hijau, atau berbau tidak sedap
  >
  > Nyeri bertambah, bukan berkurang
  >
  > Demam atau badan terasa tidak enak
  >
  > Luka tidak membaik setelah sekitar 1 minggu

- [ ] `chapters.9.luka-terinfeksi.3`

  > Di kulit sawo matang, kemerahan bisa tampak keunguan, cokelat gelap, atau keabuan. Raba apakah kulit di sekitar luka lebih hangat dibanding bagian yang sama di sisi tubuh lainnya (Bagian C).

- [ ] `chapters.9.luka-terinfeksi.4`

  > Yang dilakukan
  >
  > Tandai batas kemerahan dengan pulpen, lalu tulis tanggal dan jamnya di sebelahnya.
  >
  > Jangan memencet atau mengorek luka.
  >
  > Tutup dengan kasa bersih dan periksakan ke puskesmas atau klinik hari ini.
  >
  > Ke IGD jika kemerahan melewati tanda pulpen dalam beberapa jam, muncul garis merah yang menjalar dari luka, demam tinggi, atau badan sangat lemas.

- [ ] `chapters.9.luka-terinfeksi.5`

  > Setelah berobat
  >
  > gejala harus mulai membaik dalam 2–3 hari pengobatan, walau belum tentu tuntas pada hari ke-5–7. Jika tidak membaik atau memburuk kapan pun, kembali periksa.

- [ ] `chapters.9.luka-terinfeksi.6`

  > Hindari
  >
  > minum antibiotik sisa atau membelinya tanpa resep, dan menaburi luka dengan bubuk atau ramuan.

- [ ] `chapters.9.luka-terinfeksi.7`

  > Perlu ekstra waspada
  >
  > penderita diabetes, lansia, bayi, dan orang dengan daya tahan tubuh rendah.

## Pustaka: Bagian C, warna dan kedalaman

- [ ] `woundColors.0.0`
  Label F (Fase penyembuhan) · Sumber: Wound Healing Continuum (Gray dkk., Wounds UK, 2006); Jenis dan fase penyembuhan luka (Kementerian Kesehatan RI, 2022)

  > Warna dasar luka menunjukkan tahap penyembuhan, sedangkan lapisan kulit yang rusak menentukan lamanya. Tidak ada pedoman klinis yang memberi jumlah hari untuk tiap warna, jadi bagian ini memberi perkiraan waktu per lapisan kulit dan batas kapan harus periksa, bukan janji tanggal sembuh.

- [ ] `woundColors.1.0`
  Label K (Luka kronis) · Sumber: Wound Healing Continuum (Gray dkk., Wounds UK, 2006); Infeksi luka dalam praktik klinis (International Wound Infection Institute, 2022); Penyembuhan dan perawatan luka (MedlinePlus)

  > Gambar: Empat warna tahap penyembuhan: hitam (jaringan mati, eskar), kuning (jaringan mati lunak, slough), merah (jaringan granulasi), merah muda (kulit baru). Di bawahnya tiga tanda bahaya: cairan hijau atau keruh, kemerahan meluas melewati garis pulpen, dan peradangan keunguan pada kulit sawo matang gelap.

- [ ] `woundColors.1.1`
  Label K (Luka kronis) · Sumber: Wound Healing Continuum (Gray dkk., Wounds UK, 2006); Infeksi luka dalam praktik klinis (International Wound Infection Institute, 2022); Penyembuhan dan perawatan luka (MedlinePlus)

  > Warna yang terlihat
  >
  > Artinya
  >
  > Yang dilakukan
  >
  > Merah muda mengilap dan tipis, tumbuh dari tepi luka
  >
  > Kulit baru sedang menutup luka. Tanda baik, tetapi masih rapuh.
  >
  > Tutup dengan perban bersih dan lapisan tipis petroleum jelly, ganti setiap hari. Jangan dikelupas.
  >
  > Merah segar dan lembap di dasar luka
  >
  > Jaringan granulasi: luka sedang terisi dari dasarnya. Artinya luka sudah melewati epidermis.
  >
  > Jaga tertutup dan lembap. Luka sedalam ini sebaiknya pernah dilihat tenaga kesehatan; periksa ulang bila tidak tampak mengecil setelah sekitar 2 minggu.
  >
  > Keropeng tipis merah tua sampai cokelat di atas lecet atau sayatan
  >
  > Darah kering yang melindungi luka. Normal.
  >
  > Jangan dicungkil. Keropeng lepas sendiri saat kulit di bawahnya menutup.
  >
  > Kuning, krem, atau cokelat muda yang lengket menempel di dasar luka
  >
  > Jaringan mati lunak (slough). Luka masih perlu dibersihkan, tetapi tidak otomatis infeksi.
  >
  > Ke puskesmas atau klinik. Membersihkan jaringan ini adalah tindakan tenaga kesehatan.
  >
  > Hitam atau cokelat tua yang tebal, keras, dan kering
  >
  > Jaringan mati (eskar). Penyembuhan di bagian itu belum mulai.
  >
  > Selalu periksakan. Jangan dikelupas sendiri.

- [ ] `woundColors.1.2`
  Label K (Luka kronis) · Sumber: Wound Healing Continuum (Gray dkk., Wounds UK, 2006); Infeksi luka dalam praktik klinis (International Wound Infection Institute, 2022); Penyembuhan dan perawatan luka (MedlinePlus)

  > Tiga aturan membaca warna:

- [ ] `woundColors.1.3`
  Label K (Luka kronis) · Sumber: Wound Healing Continuum (Gray dkk., Wounds UK, 2006); Infeksi luka dalam praktik klinis (International Wound Infection Institute, 2022); Penyembuhan dan perawatan luka (MedlinePlus)

  > **Warna terburuk menentukan.** Luka yang masih punya bagian hitam atau kuning belum masuk tahap membaik, walaupun sebagian besar dasarnya sudah merah.
  >
  > **Bedakan dasar luka dari kulit di sekitarnya.** Warna dasar luka menunjukkan tahap; warna kulit di sekitarnya menunjukkan peradangan atau infeksi.
  >
  > **Tidak semua kuning berbahaya.** Kulit baru pada lecet kadang tampak kekuningan, dan sedikit cairan bening kekuningan masih wajar. Kuning menjadi tanda bahaya bila kental, keruh, banyak, berbau, atau muncul bersama nyeri dan bengkak yang bertambah.

- [ ] `woundColors.1.4`
  Label K (Luka kronis) · Sumber: Wound Healing Continuum (Gray dkk., Wounds UK, 2006); Infeksi luka dalam praktik klinis (International Wound Infection Institute, 2022); Penyembuhan dan perawatan luka (MedlinePlus)

  > Warna yang menandakan bahaya, bukan tahap
  >
  > Hijau, keruh, nanah kental, atau bau yang baru muncul: periksakan hari ini, dan ke IGD bila disertai demam, menggigil, atau lemas berat.
  >
  > Kemerahan, keunguan, cokelat gelap, atau keabuan yang meluas melewati garis pulpen, garis yang menjalar dari luka, atau kulit yang mengeras: periksakan hari ini, dan ke IGD bila demam.
  >
  > Dasar luka yang merah pucat, merah gelap yang rapuh dan mudah berdarah, atau jaringan merah yang menonjol melewati permukaan kulit: periksakan dalam beberapa hari.
  >
  > Warna hijau-kekuningan pada kulit utuh di sekitar luka biasanya memar yang sedang memudar, bukan infeksi. Waspadai bila memar makin besar, keras, atau panas.

- [ ] `woundColors.2.0`
  Label B (Luka bakar) · Sumber: Cara lecet sembuh (HealthLinkBC, 2022); Fase penyembuhan luka (StatPearls, 2023); Klasifikasi luka bakar (StatPearls); Luka bakar dengan berbagai kedalaman (Papini, BMJ, 2004); Luka kronis (healthdirect Australia); Abrasi (Cleveland Clinic, 2023)

  > Makin dalam lapisan yang rusak, makin lama luka pulih: sekitar 3–7 hari untuk epidermis, 1–2 minggu untuk dermis atas, dan lebih dari 3 minggu untuk dermis dalam. Luka yang sampai ke lemak atau otot tidak punya angka yang andal dan perlu ditangani tenaga kesehatan.

- [ ] `woundColors.2.1`
  Label B (Luka bakar) · Sumber: Cara lecet sembuh (HealthLinkBC, 2022); Fase penyembuhan luka (StatPearls, 2023); Klasifikasi luka bakar (StatPearls); Luka bakar dengan berbagai kedalaman (Papini, BMJ, 2004); Luka kronis (healthdirect Australia); Abrasi (Cleveland Clinic, 2023)

  > Gambar: Grafik perkiraan waktu pulih menurut lapisan kulit. Epidermis 3 sampai 7 hari. Dermis atas 1 sampai 2 minggu, paling lama sekitar 3 minggu. Dermis dalam lebih dari 3 minggu. Lemak berminggu-minggu sampai berbulan-bulan bila tidak dijahit. Otot bergantung pada operasi.

- [ ] `woundColors.2.2`
  Label B (Luka bakar) · Sumber: Cara lecet sembuh (HealthLinkBC, 2022); Fase penyembuhan luka (StatPearls, 2023); Klasifikasi luka bakar (StatPearls); Luka bakar dengan berbagai kedalaman (Papini, BMJ, 2004); Luka kronis (healthdirect Australia); Abrasi (Cleveland Clinic, 2023)

  > Lapisan yang rusak
  >
  > Ciri yang terlihat
  >
  > Perkiraan waktu pulih
  >
  > Periksakan jika
  >
  > Epidermis
  >
  > Merah muda dan basah, atau merah tanpa lepuh
  >
  > 3–7 hari, tanpa bekas
  >
  > Belum membaik setelah 1 minggu
  >
  > Dermis atas
  >
  > Lepuh dengan dasar merah muda basah, lecet yang lebih lebar, sayatan bertepi rapat
  >
  > 1–2 minggu, paling lama sekitar 3 minggu
  >
  > Belum menutup setelah 2 minggu (luka bakar: 10–14 hari)
  >
  > Dermis dalam
  >
  > Belang, pucat, atau merah tua bercak; nyerinya justru berkurang
  >
  > Lebih dari 3 minggu, berisiko parut tebal
  >
  > Sejak awal
  >
  > Lemak
  >
  > Dasar luka putih atau tampak butiran lemak kuning, tepi menganga
  >
  > Berminggu-minggu sampai berbulan-bulan bila dibiarkan terbuka
  >
  > Sejak awal, dalam hitungan jam agar bisa dijahit
  >
  > Otot
  >
  > Luka sangat dalam, sering akibat tusukan atau benturan keras
  >
  > Bergantung pada operasi
  >
  > Langsung ke IGD

- [ ] `woundColors.2.3`
  Label B (Luka bakar) · Sumber: Cara lecet sembuh (HealthLinkBC, 2022); Fase penyembuhan luka (StatPearls, 2023); Klasifikasi luka bakar (StatPearls); Luka bakar dengan berbagai kedalaman (Papini, BMJ, 2004); Luka kronis (healthdirect Australia); Abrasi (Cleveland Clinic, 2023)

  > Angka untuk dermis sebagian besar berasal dari penelitian luka bakar, karena data untuk lecet dan sayatan dalam jarang tersedia. Gunakan angka ini sebagai batas waktu periksa, bukan janji tanggal sembuh.

- [ ] `woundColors.2.4`
  Label B (Luka bakar) · Sumber: Cara lecet sembuh (HealthLinkBC, 2022); Fase penyembuhan luka (StatPearls, 2023); Klasifikasi luka bakar (StatPearls); Luka bakar dengan berbagai kedalaman (Papini, BMJ, 2004); Luka kronis (healthdirect Australia); Abrasi (Cleveland Clinic, 2023)

  > Perjalanan luka yang sembuh normal
  >
  > Waktu sejak terluka
  >
  > Yang biasanya terlihat
  >
  > Beberapa menit
  >
  > Darah membeku, lalu mengering menjadi keropeng pelindung
  >
  > Hari 0 sampai sekitar hari ke-5
  >
  > Sedikit bengkak, tepi luka merah atau lebih gelap, nyeri saat disentuh, keluar cairan bening. Rembesan lecet biasanya berhenti dalam 4 hari.
  >
  > Hari ke-2–7 sampai sekitar 3 minggu
  >
  > Dasar luka merah berbintik, kulit baru tumbuh dari tepi, luka terasa gatal
  >
  > 3 minggu sampai 1–2 tahun
  >
  > Bekas luka berubah dari merah dan tebal menjadi pucat dan tipis. Kekuatannya hanya sekitar 80% kulit asli.

- [ ] `woundColors.2.5`
  Label B (Luka bakar) · Sumber: Cara lecet sembuh (HealthLinkBC, 2022); Fase penyembuhan luka (StatPearls, 2023); Klasifikasi luka bakar (StatPearls); Luka bakar dengan berbagai kedalaman (Papini, BMJ, 2004); Luka kronis (healthdirect Australia); Abrasi (Cleveland Clinic, 2023)

  > Kapan harus periksa walau tidak ada tanda bahaya
  >
  > Lecet tidak membaik setelah 1 minggu.
  >
  > Luka bakar belum menutup setelah 10–14 hari.
  >
  > Luka apa pun masih terbuka setelah 4 minggu.
  >
  > Penderita diabetes, lansia, perokok, dan orang dengan gizi kurang atau daya tahan tubuh rendah sembuh lebih lambat. Periksakan lebih awal.

- [ ] `woundColors.2.6`
  Label B (Luka bakar) · Sumber: Cara lecet sembuh (HealthLinkBC, 2022); Fase penyembuhan luka (StatPearls, 2023); Klasifikasi luka bakar (StatPearls); Luka bakar dengan berbagai kedalaman (Papini, BMJ, 2004); Luka kronis (healthdirect Australia); Abrasi (Cleveland Clinic, 2023)

  > Luka yang ditutup dan dijaga sedikit lembap, misalnya dengan petroleum jelly tipis dan perban yang diganti setiap hari, umumnya pulih lebih nyaman daripada luka yang dibiarkan kering. Jangan sampai terlalu basah, karena tepi luka bisa melunak.

- [ ] `woundColors.3.0`
  Label B (Luka bakar) · Sumber: PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019); Klasifikasi luka bakar (StatPearls); Penanganan luka bakar (American Family Physician, 2020); Second-degree burns (Children's Hospital of Philadelphia); Air mengalir mengurangi cangkok kulit (Griffin dkk., 2020); Luka bakar knalpot pada anak (Hyland dkk., Medical Journal of Australia, 2013)

  > Untuk luka bakar, Indonesia punya pedoman resmi yang menghubungkan warna, lapisan kulit, dan waktu sembuh: PNPK Tata Laksana Luka Bakar (Keputusan Menteri Kesehatan, 2019). Tabel ini merangkumnya bersama panduan internasional.

- [ ] `woundColors.3.1`
  Label B (Luka bakar) · Sumber: PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019); Klasifikasi luka bakar (StatPearls); Penanganan luka bakar (American Family Physician, 2020); Second-degree burns (Children's Hospital of Philadelphia); Air mengalir mengurangi cangkok kulit (Griffin dkk., 2020); Luka bakar knalpot pada anak (Hyland dkk., Medical Journal of Australia, 2013)

  > Tampilan
  >
  > Kedalaman
  >
  > Lapisan
  >
  > Perkiraan waktu pulih
  >
  > Tindakan
  >
  > Merah, kering, tanpa lepuh, nyeri; memucat bila ditekan
  >
  > Derajat 1 (epidermal)
  >
  > Epidermis
  >
  > Sekitar 1 minggu (3–10 hari), tanpa bekas
  >
  > Dinginkan; rawat di rumah bila kecil dan bukan di area khusus
  >
  > Lepuh dengan dasar merah muda pucat dan basah; sangat nyeri
  >
  > Derajat 2 superfisial
  >
  > Dermis atas
  >
  > Biasanya paling lama 2 minggu, sampai sekitar 3 minggu; sering meninggalkan beda warna
  >
  > Kecil: rawat di rumah atau puskesmas. Periksakan bila belum sembuh dalam 2 minggu
  >
  > Lepuh dengan dasar merah muda gelap; warna lambat kembali setelah ditekan
  >
  > Derajat 2 tengah
  >
  > Dermis tengah
  >
  > Biasanya sembuh, tetapi tidak selalu dengan sendirinya
  >
  > Periksakan ke tenaga kesehatan
  >
  > Merah tua bercak, belang, atau putih kekuningan; lebih kering; nyeri berkurang
  >
  > Derajat 2 dalam
  >
  > Dermis dalam
  >
  > Lebih dari 3 minggu, hampir pasti berparut
  >
  > Rumah sakit
  >
  > Putih seperti lilin atau kulit samak, kaku, tidak nyeri
  >
  > Derajat 3 (seluruh ketebalan)
  >
  > Seluruh dermis sampai lemak
  >
  > Tidak sembuh sendiri; lebih dari 8 minggu dan perlu operasi
  >
  > IGD atau rumah sakit
  >
  > Hitam hangus
  >
  > Derajat 4
  >
  > Lemak, otot, sampai tulang
  >
  > Tidak sembuh sendiri
  >
  > IGD

- [ ] `woundColors.3.2`
  Label B (Luka bakar) · Sumber: PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019); Klasifikasi luka bakar (StatPearls); Penanganan luka bakar (American Family Physician, 2020); Second-degree burns (Children's Hospital of Philadelphia); Air mengalir mengurangi cangkok kulit (Griffin dkk., 2020); Luka bakar knalpot pada anak (Hyland dkk., Medical Journal of Australia, 2013)

  > Yang perlu diingat:

- [ ] `woundColors.3.3`
  Label B (Luka bakar) · Sumber: PNPK Tata Laksana Luka Bakar 2019 (Kementerian Kesehatan RI, 2019); Klasifikasi luka bakar (StatPearls); Penanganan luka bakar (American Family Physician, 2020); Second-degree burns (Children's Hospital of Philadelphia); Air mengalir mengurangi cangkok kulit (Griffin dkk., 2020); Luka bakar knalpot pada anak (Hyland dkk., Medical Journal of Australia, 2013)

  > **Nyeri yang berkurang adalah tanda bahaya, bukan tanda membaik.** Luka bakar yang lebih dalam merusak ujung saraf, sehingga terasa kurang nyeri.
  >
  > **Kedalaman di hari pertama belum final.** Luka bakar bisa bertambah dalam selama 24–72 jam pertama. Lihat lagi pada hari ke-2–3; jika tampak lebih pucat, belang, atau kurang nyeri, periksakan hari itu juga.
  >
  > **Pertolongan pertama mengubah hasil.** Pada 2.495 anak, air mengalir selama 20 menit dalam 3 jam pertama berkaitan dengan peluang cangkok kulit yang lebih rendah. PNPK tidak menyebut lama pendinginan; angka 20 menit berasal dari panduan internasional.
  >
  > **Ukuran:** telapak tangan korban termasuk jari kira-kira sama dengan 1% luas tubuhnya.
  >
  > **Luka bakar knalpot** sering lebih dalam dari kelihatannya. Dalam satu seri di Australia, semua 41 anak yang dirawat inap karena luka bakar knalpot memerlukan cangkok kulit. Luka knalpot yang putih, abu-abu, atau tidak nyeri perlu diperiksakan meski kecil.

- [ ] `woundColors.4.0`
  Label K (Luka kronis) · Sumber: Konsensus penilaian luka pada berbagai warna kulit (Wounds International, 2023); Kemerahan luka menurut warna kulit (Johnson dkk., 2024); Selulitis dan erisipelas, NG141 (NICE); Hiperpigmentasi pascaradang pada kulit berwarna (Davis & Callender, 2010); Luka bakar pada kulit berwarna (Dermatology Times, 2025)

  > Di kulit sawo matang, peradangan sering tidak tampak merah, sehingga infeksi mudah terlewat. Dalam satu studi pada 350 luka kronis, kemerahan hanya tercatat pada 2,3% pasien berkulit paling gelap, dibanding 13,4% pada kulit paling terang, padahal jumlah kumannya serupa.

- [ ] `woundColors.4.1`
  Label K (Luka kronis) · Sumber: Konsensus penilaian luka pada berbagai warna kulit (Wounds International, 2023); Kemerahan luka menurut warna kulit (Johnson dkk., 2024); Selulitis dan erisipelas, NG141 (NICE); Hiperpigmentasi pascaradang pada kulit berwarna (Davis & Callender, 2010); Luka bakar pada kulit berwarna (Dermatology Times, 2025)

  > Cara menilai peradangan tanpa mengandalkan warna merah
  >
  > Raba kehangatan dengan punggung tangan dan bandingkan dengan bagian yang sama di sisi tubuh sebelahnya.
  >
  > Periksa apakah kulit di sekitar luka tegang, mengilap, atau lebih keras.
  >
  > Perhatikan warna yang lebih gelap, keunguan, atau keabuan dibanding kulit sekitarnya.
  >
  > Lihat di bawah cahaya alami, bukan lampu kuning.
  >
  > Perhatikan nyeri dan bau. Nyeri yang bertambah dan bau yang baru muncul berlaku sebagai tanda bahaya di semua warna kulit.
  >
  > Tandai batas area yang berubah dengan pulpen dan tulis tanggalnya. Yang dinilai adalah apakah area itu meluas, bukan warnanya.

- [ ] `woundColors.4.2`
  Label K (Luka kronis) · Sumber: Konsensus penilaian luka pada berbagai warna kulit (Wounds International, 2023); Kemerahan luka menurut warna kulit (Johnson dkk., 2024); Selulitis dan erisipelas, NG141 (NICE); Hiperpigmentasi pascaradang pada kulit berwarna (Davis & Callender, 2010); Luka bakar pada kulit berwarna (Dermatology Times, 2025)

  > Warna bekas luka setelah sembuh
  >
  > Kulit baru yang awalnya merah muda atau lebih terang lalu menggelap biasanya bukan infeksi, selama tidak hangat, bengkak, atau makin nyeri.
  >
  > Noda cokelat setelah luka (hiperpigmentasi pascaradang) lebih sering muncul pada kulit gelap dan bisa butuh berbulan-bulan sampai bertahun-tahun untuk memudar. Noda abu-kebiruan bisa menetap.
  >
  > Sinar matahari memperburuk noda. Pakai tabir surya SPF 30 atau lebih setiap hari dan tutup bekas luka dari matahari.
  >
  > Luka bakar pada kulit gelap juga berisiko meninggalkan bercak lebih terang serta parut tebal atau keloid. Periksakan bila parut terus menebal atau meninggi.
  >
  > Bekas luka umumnya matang dalam 6–12 bulan dan bisa terus membaik sampai sekitar 2 tahun.
