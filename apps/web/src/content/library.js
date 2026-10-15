// Pustaka luka (PRD tahap 2, F2): isi Bab 1–10 dan Bagian C buku panduan
// (docs/buku-panduan/buku-panduan-perawatan-luka-luar.md), disalin kata per kata.
// Dibuat dari buku sekali saja; mulai sekarang file ini sumber utama, ubah di sini lalu salin ke doc buku.
//
// Setiap bab berisi `nodes` berurutan: p (paragraf), img, section (label + text/items/rows), list, table, h.
// Teks boleh memuat **tebal** dan [tautan](url); dirender oleh components/RichText.jsx.
// Contoh kasus tiap bab ada di caseStories.js (dicocokkan lewat `number`).
import { block } from "./meta";
import { CHAPTER_META } from "./chapterMeta";

export const LIBRARY_PARTS = {
  A: {title: "Bagian A: luka yang bisa dirawat di rumah", lead: "Empat jenis luka ini umumnya pulih dengan perawatan mandiri, selama tidak ada tanda bahaya di tabel atas."},
  B: {title: "Bagian B: luka yang perlu ditangani tenaga kesehatan", lead: "Pada enam jenis luka ini, tugas Anda adalah pertolongan pertama sambil menuju fasilitas kesehatan. Jangan menunggu lukanya membaik sendiri."},
};
const introMeta = { sources: ["kemenkes-fase", "statpearls-fase"], evidence: "F" };

export const LIBRARY_INTRO = [
  block({
      type: "p",
      text: "Setiap bab memuat dua gambar berdampingan: **tampak atas** menunjukkan luka seperti yang terlihat di kulit, dan **penampang kulit** menunjukkan seberapa dalam luka masuk. Makin dalam lukanya, makin besar kemungkinan perlu tenaga kesehatan."
    }, introMeta),
  block({
      type: "img",
      src: "illustrations/peta-kedalaman-luka.png",
      alt: "Lapisan kulit dan peta kedalaman tiap jenis luka. Lepuh, luka bakar derajat 1, lecet, luka bakar derajat 2, dan sayatan kecil berhenti di epidermis atau dermis. Luka bakar derajat 3 sampai batas lemak, gigitan dan luka robek masuk ke lemak, tusukan bisa sampai otot."
    }, introMeta),
  block({
      type: "p",
      text: "Kulit terdiri dari epidermis (lapisan terluar yang tipis), dermis (berisi pembuluh darah, saraf, akar rambut, dan kelenjar keringat), lalu lapisan lemak. Otot berada di bawahnya. Garis hijau di tiap gambar bab menandai luka yang umumnya bisa dirawat di rumah, garis merah menandai luka yang perlu diperiksa."
    }, introMeta),
];
export const CHAPTERS = [
  {
    slug: "lecet", number: 1, part: "A", title: "Lecet", latin: "vulnus excoriatio", guideType: "lecet", illustration: "luka-lecet",
    nodes: [
      block({
        type: "p",
        text: "Lecet adalah luka gores dangkal yang mengikis lapisan kulit terluar. Umumnya bisa dirawat di rumah dan mulai membaik dalam beberapa hari."
      }, CHAPTER_META[1]),
      block({
        type: "img",
        src: "illustrations/luka-lecet.png",
        alt: "Lecet tampak atas: area merah basah dengan goresan sejajar, bintik darah, dan kerikil. Penampang: luka dangkal sampai dermis bagian atas dengan kotoran menempel."
      }, CHAPTER_META[1]),
      block({
        type: "section",
        label: "Ciri-ciri",
        items: [
          "Permukaan merah muda sampai merah dan basah, dengan goresan sejajar searah gesekan",
          "Darah keluar berupa bintik-bintik, tidak mengalir",
          "Sering ada pasir, kerikil, atau serpihan aspal yang menempel",
          "Perih, terutama saat terkena air"
        ],
        ordered: false
      }, CHAPTER_META[1]),
      block({
        type: "section",
        label: "Penyebab umum",
        text: "jatuh dari motor atau sepeda, terseret di aspal, jatuh saat berlari atau bermain."
      }, CHAPTER_META[1]),
      block({
        type: "section",
        label: "Langkah perawatan",
        items: [
          "Cuci tangan dengan sabun. Pakai sarung tangan jika ada.",
          "Jika masih berdarah, tekan perlahan dengan kasa bersih sampai berhenti.",
          "Bilas dengan air mengalir sampai pasir dan kotoran terangkat. Bersihkan kulit di sekitarnya dengan sabun, usahakan sabun tidak masuk ke luka.",
          "Angkat kerikil kecil yang tersisa dengan pinset yang sudah dibersihkan alkohol.",
          "Tepuk kering kulit di sekitar luka. Jangan digosok.",
          "Oleskan tipis petroleum jelly agar luka tetap lembap dan tidak lengket ke penutup.",
          "Tutup dengan kasa non-lengket atau plester. Ganti sekali sehari, atau lebih cepat jika basah atau kotor."
        ],
        ordered: true
      }, CHAPTER_META[1]),
      block({
        type: "section",
        label: "Hindari",
        text: "menggosok luka dengan kasar, meniup luka, mengelupas keropeng, dan menuang alkohol, hidrogen peroksida, atau iodin langsung ke dalam luka. Air mengalir sudah cukup untuk membersihkannya."
      }, CHAPTER_META[1]),
      block({
        type: "section",
        label: "Perlengkapan",
        text: "air bersih atau NaCl 0,9%, kasa steril, kasa non-lengket, plester, petroleum jelly, pinset."
      }, CHAPTER_META[1]),
      block({
        type: "section",
        label: "Waktu pulih",
        text: "lecet ringan 3–7 hari; lecet yang lebih lebar atau dalam 1–2 minggu atau lebih. Rembesan cairan biasanya berhenti dalam 4 hari."
      }, CHAPTER_META[1]),
      block({
        type: "section",
        label: "Periksakan jika",
        text: "kotoran tidak bisa diangkat semuanya, luka lebih lebar dari telapak tangan, dasar luka tampak putih atau butiran lemak terlihat, tidak membaik setelah sekitar 1 minggu, atau muncul tanda infeksi (Bab 10)."
      }, CHAPTER_META[1]),
    ],
  },
  {
    slug: "sayatan", number: 2, part: "A", title: "Sayatan kecil", latin: "vulnus scissum", guideType: "sayatan", illustration: "luka-sayatan",
    nodes: [
      block({
        type: "p",
        text: "Sayatan kecil adalah luka iris bertepi lurus akibat benda tajam. Jika tepinya rapat dan darah berhenti setelah ditekan, umumnya bisa dirawat di rumah."
      }, CHAPTER_META[2]),
      block({
        type: "img",
        src: "illustrations/luka-sayatan.png",
        alt: "Sayatan tampak atas: garis lurus sempit dengan darah merembes. Penampang: celah sempit menembus epidermis sampai dermis."
      }, CHAPTER_META[2]),
      block({
        type: "section",
        label: "Ciri-ciri",
        items: [
          "Berbentuk garis lurus, tepinya rata dan saling menempel",
          "Darah mengalir atau merembes di sepanjang garis",
          "Panjang tetapi sempit, tanpa jaringan kuning (lemak) yang terlihat di dalamnya"
        ],
        ordered: false
      }, CHAPTER_META[2]),
      block({
        type: "section",
        label: "Penyebab umum",
        text: "pisau dapur, cutter, kertas, tutup kaleng, pecahan kaca kecil."
      }, CHAPTER_META[2]),
      block({
        type: "section",
        label: "Langkah perawatan",
        items: [
          "Cuci tangan dengan sabun.",
          "Tekan dengan kasa atau kain bersih terus-menerus selama 5–10 menit tanpa diangkat. Bila bisa, angkat bagian yang luka lebih tinggi dari jantung.",
          "Setelah darah berhenti, bilas dengan air mengalir.",
          "Periksa tepinya. Jika tepi terbuka lebar, lukanya dalam, atau panjangnya lebih dari 5 cm, ikuti Bab 5.",
          "Keringkan kulit di sekitar luka, lalu tutup dengan plester atau kasa steril.",
          "Ganti penutup sekali sehari atau saat basah."
        ],
        ordered: true
      }, CHAPTER_META[2]),
      block({
        type: "section",
        label: "Hindari",
        text: "mengangkat kasa berulang kali untuk mengintip, menuang alkohol ke dalam luka, dan menutup luka yang masih berdarah deras."
      }, CHAPTER_META[2]),
      block({
        type: "section",
        label: "Perlengkapan",
        text: "kasa steril, plester (plester lentur untuk jari), sarung tangan."
      }, CHAPTER_META[2]),
      block({
        type: "section",
        label: "Waktu pulih",
        text: "permukaan sayatan yang rapat menutup dalam sekitar 48 jam, dan penutup biasanya boleh dilepas setelah beberapa hari. Bagian dalamnya terus pulih sampai sekitar 3 minggu."
      }, CHAPTER_META[2]),
      block({
        type: "section",
        label: "Periksakan jika",
        text: "darah tidak berhenti setelah ditekan 10 menit, tepinya menganga, sayatannya dalam di wajah atau telapak tangan, jari mati rasa atau sulit digerakkan, atau benda penyebabnya kotor dan berkarat."
      }, CHAPTER_META[2]),
    ],
  },
  {
    slug: "luka-bakar-ringan", number: 3, part: "A", title: "Luka bakar ringan", latin: "combustio derajat 1 dan 2 superfisial", guideType: "bakar", illustration: "luka-bakar-ringan",
    nodes: [
      block({
        type: "p",
        text: "Luka bakar ringan adalah luka bakar derajat 1, atau derajat 2 superfisial yang lebih kecil dari telapak tangan korban. Langkah terpenting: alirkan air bersuhu biasa selama 20 menit, sesegera mungkin."
      }, CHAPTER_META[3]),
      block({
        type: "img",
        src: "illustrations/luka-bakar-ringan.png",
        alt: "Luka bakar ringan tampak atas: area merah dengan beberapa lepuh berisi cairan bening. Penampang: kemerahan di epidermis dan dermis atas, dengan epidermis terangkat membentuk lepuh."
      }, CHAPTER_META[3]),
      block({
        type: "p",
        text: "Gambar berikut membandingkan ketiga derajat luka bakar. Derajat 3, dan derajat 2 yang luas atau dalam, dibahas di Bab 9."
      }, CHAPTER_META[3]),
      block({
        type: "img",
        src: "illustrations/derajat-luka-bakar.png",
        alt: "Perbandingan derajat luka bakar. Derajat 1: merah, kering, nyeri, tanpa lepuh, pulih 5 sampai 10 hari. Derajat 2: melepuh, basah, sangat nyeri, yang superfisial pulih sekitar 3 minggu. Derajat 3: putih atau hangus, kaku, bisa tidak nyeri, selalu ke rumah sakit."
      }, CHAPTER_META[3]),
      block({
        type: "section",
        label: "Ciri-ciri",
        items: [
          "Derajat 1: merah, kering, dan nyeri, tanpa lepuh, mirip kulit terbakar matahari",
          "Derajat 2 superfisial: muncul lepuh berisi cairan bening, kulit tampak basah mengilap, dan sangat nyeri"
        ],
        ordered: false
      }, CHAPTER_META[3]),
      block({
        type: "section",
        label: "Penyebab umum",
        text: "cipratan minyak goreng, panci atau setrika panas, air atau kuah mendidih, knalpot motor."
      }, CHAPTER_META[3]),
      block({
        type: "section",
        label: "Langkah perawatan",
        items: [
          "Jauhkan korban dari sumber panas.",
          "Lepas cincin, jam, gelang, atau pakaian di dekat luka sebelum membengkak. Kain yang menempel di kulit jangan ditarik.",
          "Alirkan air bersuhu biasa selama 20 menit, sebaiknya dalam 3 jam pertama. Jika tidak ada air mengalir, pakai air minum kemasan atau handuk basah.",
          "Tutup longgar dengan plastik wrap bersih atau kasa non-lengket. Jangan dililit.",
          "Untuk nyeri, minum parasetamol atau ibuprofen sesuai aturan pakai pada kemasan.",
          "Biarkan lepuh tetap utuh. Saat kulit mulai kering dan gatal, pakai pelembap yang disarankan apoteker."
        ],
        ordered: true
      }, CHAPTER_META[3]),
      block({
        type: "section",
        label: "Hindari",
        text: "es batu atau air es; pasta gigi, mentega, minyak, kecap, atau krim; plester lengket langsung di atas luka bakar; dan memecahkan lepuh."
      }, CHAPTER_META[3]),
      block({
        type: "section",
        label: "Perlengkapan",
        text: "plastik wrap, kasa non-lengket, gel hidrogel luka bakar (dipakai setelah luka didinginkan), plester kertas."
      }, CHAPTER_META[3]),
      block({
        type: "section",
        label: "Waktu pulih",
        text: "derajat 1 sekitar 1 minggu (3–10 hari) tanpa bekas; derajat 2 superfisial biasanya paling lama 2 minggu, sampai sekitar 3 minggu. Lihat lagi pada hari ke-2–3, karena luka bakar bisa bertambah dalam; nyeri yang justru berkurang adalah tanda bahaya."
      }, CHAPTER_META[3]),
      block({
        type: "section",
        label: "Periksakan jika",
        text: "luka lebih lebar dari telapak tangan korban, berada di wajah, kelamin, bokong, atau sendi, terjadi pada bayi atau balita, akibat bahan kimia atau listrik, atau lepuhnya tampak terinfeksi. Luka bakar knalpot sering lebih dalam dari kelihatannya: jika bagian tengahnya putih atau tidak terasa nyeri, periksakan."
      }, CHAPTER_META[3]),
    ],
  },
  {
    slug: "lepuh", number: 4, part: "A", title: "Lepuh karena gesekan", latin: "bula", guideType: "lepuh", illustration: "luka-lepuh",
    nodes: [
      block({
        type: "p",
        text: "Lepuh gesekan adalah kantong cairan bening di bawah kulit akibat gesekan berulang. Jangan dipecahkan; biasanya pulih sendiri dalam sekitar seminggu."
      }, CHAPTER_META[4]),
      block({
        type: "img",
        src: "illustrations/luka-lepuh.png",
        alt: "Lepuh tampak atas: gelembung berisi cairan bening dengan kemerahan tipis di tepinya. Penampang: cairan terkumpul di antara epidermis yang terangkat dan dermis."
      }, CHAPTER_META[4]),
      block({
        type: "section",
        label: "Ciri-ciri",
        items: [
          "Gelembung berisi cairan bening dengan kulit di atasnya masih utuh",
          "Kemerahan tipis di sekelilingnya",
          "Nyeri saat ditekan atau bergesekan"
        ],
        ordered: false
      }, CHAPTER_META[4]),
      block({
        type: "section",
        label: "Penyebab umum",
        text: "sepatu atau sandal baru, berjalan jauh, olahraga, memegang alat seperti cangkul atau raket terlalu lama."
      }, CHAPTER_META[4]),
      block({
        type: "section",
        label: "Langkah perawatan",
        items: [
          "Biarkan lepuh utuh. Kulitnya melindungi lapisan di bawahnya dari kuman.",
          "Cuci perlahan dengan sabun dan air, lalu tepuk kering.",
          "Tutup dengan plester berbantalan atau plester hidrokoloid.",
          "Hindari sepatu atau alat penyebabnya sampai lepuh sembuh.",
          "Jika lepuh pecah sendiri: cuci tangan, biarkan cairannya keluar, jangan kelupas kulitnya, lalu tutup dengan plester."
        ],
        ordered: true
      }, CHAPTER_META[4]),
      block({
        type: "section",
        label: "Hindari",
        text: "menusuk lepuh dengan jarum, mengelupas kulit lepuh, dan terus memakai alas kaki yang sama."
      }, CHAPTER_META[4]),
      block({
        type: "section",
        label: "Perlengkapan",
        text: "plester lepuh hidrokoloid, plester berbantalan, kaus kaki."
      }, CHAPTER_META[4]),
      block({
        type: "section",
        label: "Waktu pulih",
        text: "biasanya kempis dalam beberapa hari dan pulih sekitar 1 minggu; bisa 2 minggu atau lebih bila terus tergesek."
      }, CHAPTER_META[4]),
      block({
        type: "section",
        label: "Periksakan jika",
        text: "lepuh tampak terinfeksi (panas, bernanah kuning atau hijau, kemerahan melebar), sangat nyeri atau terus kambuh, muncul di kelopak mata, mulut, atau kelamin, muncul di banyak tempat tanpa sebab jelas, atau berasal dari luka bakar atau alergi. Penderita diabetes sebaiknya memeriksakan lepuh di kaki."
      }, CHAPTER_META[4]),
    ],
  },
  {
    slug: "luka-robek", number: 5, part: "B", title: "Luka robek atau menganga", latin: "vulnus laceratum", guideType: null, illustration: "luka-robek",
    nodes: [
      block({
        type: "p",
        text: "Luka robek bertepi tidak rata dan terbuka sehingga bagian dalamnya terlihat. Luka seperti ini perlu dijahit atau ditutup tenaga kesehatan, sebaiknya dalam 2 jam pertama."
      }, CHAPTER_META[5]),
      block({
        type: "img",
        src: "illustrations/luka-robek.png",
        alt: "Luka robek tampak atas: tepi tidak rata dan terbuka, tampak lemak kuning, darah terus keluar. Penampang: celah lebar menembus dermis sampai lapisan lemak."
      }, CHAPTER_META[5]),
      block({
        type: "section",
        label: "Ciri-ciri",
        items: [
          "Tepi tidak rata dan tidak bisa menempel sendiri",
          "Tampak jaringan kuning (lemak) atau bagian yang lebih dalam",
          "Darah terus keluar dan sulit berhenti",
          "Sering lebih panjang dari 5 cm"
        ],
        ordered: false
      }, CHAPTER_META[5]),
      block({
        type: "section",
        label: "Penyebab umum",
        text: "terbentur ujung meja atau besi, jatuh di permukaan tajam, kecelakaan lalu lintas, tergores seng atau kaca besar."
      }, CHAPTER_META[5]),
      block({
        type: "section",
        label: "Pertolongan pertama",
        items: [
          "Tekan kuat dengan kasa atau kain bersih. Jika kain tembus darah, tumpuk kain baru di atasnya tanpa mengangkat yang lama.",
          "Bila bisa, angkat bagian yang luka lebih tinggi dari jantung.",
          "Setelah darah terkendali, tutup dengan kasa dan balut tidak terlalu kencang.",
          "Berangkat ke IGD atau puskesmas. Jangan menyetir sendiri."
        ],
        ordered: true
      }, CHAPTER_META[5]),
      block({
        type: "section",
        label: "Hindari",
        text: "menaburi luka dengan bubuk kopi, abu, atau ramuan; menarik tepi luka dengan plester untuk \"menjahit sendiri\"; dan menunda sampai besok."
      }, CHAPTER_META[5]),
      block({
        type: "section",
        label: "Waktu pulih",
        text: "datanglah secepatnya; luka yang bersih umumnya masih bisa dijahit sampai sekitar 12 jam setelah kejadian. Jahitan dilepas setelah 3–5 hari di wajah, 7–10 hari di kulit kepala dan lengan, 10–14 hari di badan, tungkai, tangan, dan kaki, serta 14–21 hari di telapak tangan dan telapak kaki. Bekas luka mencapai kekuatan terbaiknya dalam 11–14 minggu, sekitar 80% kulit asli."
      }, CHAPTER_META[5]),
    ],
  },
  {
    slug: "luka-tusuk", number: 6, part: "B", title: "Luka tusuk", latin: "vulnus punctum", guideType: null, illustration: "luka-tusuk",
    nodes: [
      block({
        type: "p",
        text: "Luka tusuk tampak kecil di permukaan, tetapi bisa masuk dalam dan membawa kotoran. Periksakan hari itu juga, terutama untuk menilai perlu tidaknya suntik tetanus."
      }, CHAPTER_META[6]),
      block({
        type: "img",
        src: "illustrations/luka-tusuk.png",
        alt: "Luka tusuk tampak atas: lubang kecil dengan sedikit darah, di dekatnya paku berkarat. Penampang: saluran sempit yang masuk sampai otot dengan kotoran di ujungnya."
      }, CHAPTER_META[6]),
      block({
        type: "section",
        label: "Ciri-ciri",
        items: [
          "Lubang kecil dengan sedikit darah",
          "Nyeri terasa dalam, bukan di permukaan",
          "Penyebabnya benda runcing yang sering kotor"
        ],
        ordered: false
      }, CHAPTER_META[6]),
      block({
        type: "section",
        label: "Penyebab umum",
        text: "paku, kawat, duri, jarum, tusuk sate, serpihan kayu, terutama saat bersih-bersih setelah banjir atau di lokasi bangunan."
      }, CHAPTER_META[6]),
      block({
        type: "section",
        label: "Pertolongan pertama",
        items: [
          "Jika benda masih tertancap, jangan dicabut dan ikuti Bab 7.",
          "Bilas dengan air bersih mengalir.",
          "Tutup dengan kasa bersih.",
          "Ke puskesmas hari ini. Suntik tetanus dianjurkan jika luka dalam atau kotor dan suntikan terakhir lebih dari 5 tahun lalu, atau tidak ingat kapan."
        ],
        ordered: true
      }, CHAPTER_META[6]),
      block({
        type: "section",
        label: "Hindari",
        text: "menutup rapat luka tanpa dibersihkan, dan menunda karena lukanya \"cuma kecil\"."
      }, CHAPTER_META[6]),
      block({
        type: "section",
        label: "Pantau",
        text: "tanda infeksi pada hari-hari berikutnya (Bab 10). Jika muncul kaku rahang atau kejang otot, segera ke IGD."
      }, CHAPTER_META[6]),
    ],
  },
  {
    slug: "benda-tertancap", number: 7, part: "B", title: "Benda tertancap", latin: null, guideType: null, illustration: "luka-benda-tertancap",
    nodes: [
      block({
        type: "p",
        text: "Jika benda masih tertancap di luka, jangan dicabut. Benda itu ikut menahan perdarahan, dan mencabutnya di rumah bisa memicu perdarahan hebat."
      }, CHAPTER_META[7]),
      block({
        type: "img",
        src: "illustrations/luka-benda-tertancap.png",
        alt: "Benda tertancap tampak atas: pecahan kaca menancap dengan gulungan kasa di kedua sisinya. Penampang: kaca masuk sampai lapisan lemak, gulungan kasa menahan dari kiri dan kanan."
      }, CHAPTER_META[7]),
      block({
        type: "section",
        label: "Ciri-ciri",
        text: "pecahan kaca, kayu, logam, kail pancing, atau benda lain masih berada di dalam luka."
      }, CHAPTER_META[7]),
      block({
        type: "section",
        label: "Pertolongan pertama",
        items: [
          "Jangan cabut atau goyangkan bendanya.",
          "Tekan kuat di kedua sisi benda, bukan di atasnya.",
          "Ganjal benda dengan gulungan kasa atau kain di kedua sisinya agar tidak bergerak, lalu balut di sekelilingnya.",
          "Telepon 119 atau ke IGD. Jangan menyetir sendiri."
        ],
        ordered: true
      }, CHAPTER_META[7]),
      block({
        type: "section",
        label: "Hindari",
        text: "mencabut benda, menekan langsung di atasnya, dan mengorek luka untuk mencari serpihan."
      }, CHAPTER_META[7]),
    ],
  },
  {
    slug: "gigitan-hewan", number: 8, part: "B", title: "Gigitan dan cakaran hewan", latin: "vulnus morsum", guideType: null, illustration: "luka-gigitan-cakaran",
    nodes: [
      block({
        type: "p",
        text: "Gigitan atau cakaran hewan berisiko rabies dan infeksi, sekecil apa pun lukanya. Cuci 15 menit dengan sabun di bawah air mengalir, lalu ke puskesmas atau rumah sakit hari itu juga."
      }, CHAPTER_META[8]),
      block({
        type: "img",
        src: "illustrations/luka-gigitan-cakaran.png",
        alt: "Gigitan tampak atas: bekas gigi membentuk lengkungan dengan memar, dan cakaran berupa garis-garis sejajar. Penampang: beberapa tusukan sempit dengan kedalaman berbeda, kuman dari air liur ikut masuk."
      }, CHAPTER_META[8]),
      block({
        type: "section",
        label: "Ciri-ciri",
        items: [
          "Bekas gigi berpasangan yang membentuk lengkungan, kadang disertai robekan atau memar",
          "Cakaran berupa garis-garis tipis yang sejajar",
          "Lukanya bisa kecil atau bahkan tidak berdarah, tetapi tetap berisiko"
        ],
        ordered: false
      }, CHAPTER_META[8]),
      block({
        type: "section",
        label: "Hewan yang perlu diwaspadai",
        text: "anjing, kucing, dan kera. Menurut Kementerian Kesehatan, 95% kasus rabies pada manusia berasal dari gigitan anjing. Gigitan manusia juga perlu diperiksakan."
      }, CHAPTER_META[8]),
      block({
        type: "section",
        label: "Pertolongan pertama",
        items: [
          "Cuci luka dengan sabun atau detergen di bawah air mengalir selama 15 menit.",
          "Keringkan, lalu oleskan antiseptik seperti povidon iodin.",
          "Tutup longgar dengan kasa. Jangan dijahit atau ditutup rapat.",
          "Ke puskesmas atau rumah sakit hari ini. Petugas akan mencuci ulang luka dan menilai kebutuhan vaksin anti rabies (VAR).",
          "Catat hewan yang menggigit: milik siapa, sudah divaksin atau belum, lalu laporkan agar hewan itu dipantau."
        ],
        ordered: true
      }, CHAPTER_META[8]),
      block({
        type: "section",
        label: "Hindari",
        text: "menunda karena lukanya kecil atau tidak berdarah, dan mengandalkan ramuan. Kemenkes mencatat sebagian besar kematian akibat rabies terjadi karena pasien terlambat datang ke fasilitas kesehatan."
      }, CHAPTER_META[8]),
    ],
  },
  {
    slug: "luka-bakar-berat", number: 9, part: "B", title: "Luka bakar berat, kimia, dan listrik", latin: null, guideType: null, illustration: "luka-bakar-berat",
    nodes: [
      block({
        type: "p",
        text: "Luka bakar yang luas, dalam, atau disebabkan bahan kimia atau listrik harus ditangani di rumah sakit. Telepon 119, lalu dinginkan luka sambil menunggu."
      }, CHAPTER_META[9]),
      block({
        type: "img",
        src: "illustrations/luka-bakar-berat.png",
        alt: "Luka bakar berat tampak atas: bagian tengah putih, kaku, dan sebagian hangus, dikelilingi tepi merah yang melepuh. Penampang: seluruh lapisan kulit rusak sampai batas lemak."
      }, CHAPTER_META[9]),
      block({
        type: "section",
        label: "Ciri-ciri",
        items: [
          "Lebih lebar dari telapak tangan korban",
          "Kulit putih, cokelat, atau hangus, kaku seperti kulit kering",
          "Bisa tidak terasa nyeri karena ujung saraf ikut rusak",
          "Mengenai wajah, tangan, kaki, kelamin, bokong, atau sendi",
          "Akibat bahan kimia (pembersih lantai, air aki, kapur), sengatan listrik, atau ledakan tabung gas"
        ],
        ordered: false
      }, CHAPTER_META[9]),
      block({
        type: "section",
        label: "Pertolongan pertama",
        items: [
          "Amankan lokasi. Untuk sengatan listrik, matikan sumber listrik sebelum menyentuh korban.",
          "Telepon 119.",
          "Alirkan air bersuhu biasa selama 20 menit. Untuk bahan kimia, lepas pakaian yang terkena lalu bilas dengan air mengalir yang banyak.",
          "Lepas perhiasan dan pakaian di sekitar luka, kecuali yang menempel di kulit.",
          "Tutup longgar dengan plastik wrap atau kain bersih.",
          "Jaga korban tetap hangat, terutama anak-anak."
        ],
        ordered: true
      }, CHAPTER_META[9]),
      block({
        type: "section",
        label: "Hindari",
        text: "es, mentega, atau pasta gigi; memecahkan lepuh; menarik kain yang menempel; dan menyetir sendiri ke rumah sakit. Luka bakar listrik bisa tampak kecil di kulit tetapi merusak jaringan di bawahnya, jadi selalu periksakan."
      }, CHAPTER_META[9]),
      block({
        type: "section",
        label: "Waktu pulih",
        text: "luka bakar derajat 2 dalam butuh lebih dari 3 minggu dan hampir pasti berparut. Derajat 3 tidak sembuh sendiri; butuh lebih dari 8 minggu dan operasi. Lihat tabel warna luka bakar di Bagian C."
      }, CHAPTER_META[9]),
    ],
  },
  {
    slug: "luka-terinfeksi", number: 10, part: "B", title: "Luka terinfeksi", latin: null, guideType: null, illustration: "luka-terinfeksi",
    nodes: [
      block({
        type: "p",
        text: "Luka yang makin merah, bengkak, panas, nyeri, atau bernanah kemungkinan terinfeksi dan perlu diperiksa hari itu juga. Infeksi bisa muncul pada jenis luka apa pun di bab sebelumnya."
      }, CHAPTER_META[10]),
      block({
        type: "img",
        src: "illustrations/luka-terinfeksi.png",
        alt: "Luka terinfeksi tampak atas: luka dengan nanah kekuningan, dikelilingi kemerahan luas yang batasnya ditandai pulpen beserta jam. Penampang: kulit membengkak dengan kantong nanah di dermis."
      }, CHAPTER_META[10]),
      block({
        type: "section",
        label: "Ciri-ciri",
        text: "(bandingkan dengan hari sebelumnya)",
        items: [
          "Kemerahan melebar dari tepi luka",
          "Bengkak dan terasa panas",
          "Keluar nanah kuning atau hijau, atau berbau tidak sedap",
          "Nyeri bertambah, bukan berkurang",
          "Demam atau badan terasa tidak enak",
          "Luka tidak membaik setelah sekitar 1 minggu"
        ],
        ordered: false
      }, CHAPTER_META[10]),
      block({
        type: "p",
        text: "Di kulit sawo matang, kemerahan bisa tampak keunguan, cokelat gelap, atau keabuan. Raba apakah kulit di sekitar luka lebih hangat dibanding bagian yang sama di sisi tubuh lainnya (Bagian C)."
      }, CHAPTER_META[10]),
      block({
        type: "section",
        label: "Yang dilakukan",
        items: [
          "Tandai batas kemerahan dengan pulpen, lalu tulis tanggal dan jamnya di sebelahnya.",
          "Jangan memencet atau mengorek luka.",
          "Tutup dengan kasa bersih dan periksakan ke puskesmas atau klinik hari ini.",
          "Ke IGD jika kemerahan melewati tanda pulpen dalam beberapa jam, muncul garis merah yang menjalar dari luka, demam tinggi, atau badan sangat lemas."
        ],
        ordered: true
      }, CHAPTER_META[10]),
      block({
        type: "section",
        label: "Setelah berobat",
        text: "gejala harus mulai membaik dalam 2–3 hari pengobatan, walau belum tentu tuntas pada hari ke-5–7. Jika tidak membaik atau memburuk kapan pun, kembali periksa."
      }, CHAPTER_META[10]),
      block({
        type: "section",
        label: "Hindari",
        text: "minum antibiotik sisa atau membelinya tanpa resep, dan menaburi luka dengan bubuk atau ramuan."
      }, CHAPTER_META[10]),
      block({
        type: "section",
        label: "Perlu ekstra waspada",
        text: "penderita diabetes, lansia, bayi, dan orang dengan daya tahan tubuh rendah."
      }, CHAPTER_META[10]),
    ],
  },
];

export const CHAPTER_BY_SLUG = Object.fromEntries(CHAPTERS.map((c) => [c.slug, c]));

// Bagian C: memantau pemulihan lewat warna dan kedalaman (halaman /pustaka/warna-luka).
export const WOUND_COLORS = [
  {
    title: null,
    nodes: [
      block({
        type: "p",
        text: "Warna dasar luka menunjukkan tahap penyembuhan, sedangkan lapisan kulit yang rusak menentukan lamanya. Tidak ada pedoman klinis yang memberi jumlah hari untuk tiap warna, jadi bagian ini memberi perkiraan waktu per lapisan kulit dan batas kapan harus periksa, bukan janji tanggal sembuh."
      }, { sources: ["gray-2006", "kemenkes-fase"], evidence: "F" }),
    ],
  },
  {
    title: "Arti warna dasar luka",
    nodes: [
      block({
        type: "img",
        src: "illustrations/warna-dasar-luka.png",
        alt: "Empat warna tahap penyembuhan: hitam (jaringan mati, eskar), kuning (jaringan mati lunak, slough), merah (jaringan granulasi), merah muda (kulit baru). Di bawahnya tiga tanda bahaya: cairan hijau atau keruh, kemerahan meluas melewati garis pulpen, dan peradangan keunguan pada kulit sawo matang gelap."
      }, { sources: ["gray-2006", "iwii-2022", "medlineplus-wound"], evidence: "K" }),
      block({
        type: "table",
        head: [
          "Warna yang terlihat",
          "Artinya",
          "Yang dilakukan"
        ],
        rows: [
          [
            "Merah muda mengilap dan tipis, tumbuh dari tepi luka",
            "Kulit baru sedang menutup luka. Tanda baik, tetapi masih rapuh.",
            "Tutup dengan perban bersih dan lapisan tipis petroleum jelly, ganti setiap hari. Jangan dikelupas."
          ],
          [
            "Merah segar dan lembap di dasar luka",
            "Jaringan granulasi: luka sedang terisi dari dasarnya. Artinya luka sudah melewati epidermis.",
            "Jaga tertutup dan lembap. Luka sedalam ini sebaiknya pernah dilihat tenaga kesehatan; periksa ulang bila tidak tampak mengecil setelah sekitar 2 minggu."
          ],
          [
            "Keropeng tipis merah tua sampai cokelat di atas lecet atau sayatan",
            "Darah kering yang melindungi luka. Normal.",
            "Jangan dicungkil. Keropeng lepas sendiri saat kulit di bawahnya menutup."
          ],
          [
            "Kuning, krem, atau cokelat muda yang lengket menempel di dasar luka",
            "Jaringan mati lunak (slough). Luka masih perlu dibersihkan, tetapi tidak otomatis infeksi.",
            "Ke puskesmas atau klinik. Membersihkan jaringan ini adalah tindakan tenaga kesehatan."
          ],
          [
            "Hitam atau cokelat tua yang tebal, keras, dan kering",
            "Jaringan mati (eskar). Penyembuhan di bagian itu belum mulai.",
            "Selalu periksakan. Jangan dikelupas sendiri."
          ]
        ]
      }, { sources: ["gray-2006", "iwii-2022", "medlineplus-wound"], evidence: "K" }),
      block({
        type: "p",
        text: "Tiga aturan membaca warna:"
      }, { sources: ["gray-2006", "iwii-2022", "medlineplus-wound"], evidence: "K" }),
      block({
        type: "list",
        ordered: false,
        items: [
          "**Warna terburuk menentukan.** Luka yang masih punya bagian hitam atau kuning belum masuk tahap membaik, walaupun sebagian besar dasarnya sudah merah.",
          "**Bedakan dasar luka dari kulit di sekitarnya.** Warna dasar luka menunjukkan tahap; warna kulit di sekitarnya menunjukkan peradangan atau infeksi.",
          "**Tidak semua kuning berbahaya.** Kulit baru pada lecet kadang tampak kekuningan, dan sedikit cairan bening kekuningan masih wajar. Kuning menjadi tanda bahaya bila kental, keruh, banyak, berbau, atau muncul bersama nyeri dan bengkak yang bertambah."
        ]
      }, { sources: ["gray-2006", "iwii-2022", "medlineplus-wound"], evidence: "K" }),
      block({
        type: "section",
        label: "Warna yang menandakan bahaya, bukan tahap",
        items: [
          "Hijau, keruh, nanah kental, atau bau yang baru muncul: periksakan hari ini, dan ke IGD bila disertai demam, menggigil, atau lemas berat.",
          "Kemerahan, keunguan, cokelat gelap, atau keabuan yang meluas melewati garis pulpen, garis yang menjalar dari luka, atau kulit yang mengeras: periksakan hari ini, dan ke IGD bila demam.",
          "Dasar luka yang merah pucat, merah gelap yang rapuh dan mudah berdarah, atau jaringan merah yang menonjol melewati permukaan kulit: periksakan dalam beberapa hari.",
          "Warna hijau-kekuningan pada kulit utuh di sekitar luka biasanya memar yang sedang memudar, bukan infeksi. Waspadai bila memar makin besar, keras, atau panas."
        ],
        ordered: false
      }, { sources: ["gray-2006", "iwii-2022", "medlineplus-wound"], evidence: "K" }),
    ],
  },
  {
    title: "Perkiraan waktu pulih per lapisan kulit",
    nodes: [
      block({
        type: "p",
        text: "Makin dalam lapisan yang rusak, makin lama luka pulih: sekitar 3–7 hari untuk epidermis, 1–2 minggu untuk dermis atas, dan lebih dari 3 minggu untuk dermis dalam. Luka yang sampai ke lemak atau otot tidak punya angka yang andal dan perlu ditangani tenaga kesehatan."
      }, { sources: ["healthlinkbc-scrape", "statpearls-fase", "statpearls-burn", "papini-2004", "healthdirect-chronic", "cleveland-abrasion"], evidence: "B" }),
      block({
        type: "img",
        src: "illustrations/waktu-pulih-lapisan.png",
        alt: "Grafik perkiraan waktu pulih menurut lapisan kulit. Epidermis 3 sampai 7 hari. Dermis atas 1 sampai 2 minggu, paling lama sekitar 3 minggu. Dermis dalam lebih dari 3 minggu. Lemak berminggu-minggu sampai berbulan-bulan bila tidak dijahit. Otot bergantung pada operasi."
      }, { sources: ["healthlinkbc-scrape", "statpearls-fase", "statpearls-burn", "papini-2004", "healthdirect-chronic", "cleveland-abrasion"], evidence: "B" }),
      block({
        type: "table",
        head: [
          "Lapisan yang rusak",
          "Ciri yang terlihat",
          "Perkiraan waktu pulih",
          "Periksakan jika"
        ],
        rows: [
          [
            "Epidermis",
            "Merah muda dan basah, atau merah tanpa lepuh",
            "3–7 hari, tanpa bekas",
            "Belum membaik setelah 1 minggu"
          ],
          [
            "Dermis atas",
            "Lepuh dengan dasar merah muda basah, lecet yang lebih lebar, sayatan bertepi rapat",
            "1–2 minggu, paling lama sekitar 3 minggu",
            "Belum menutup setelah 2 minggu (luka bakar: 10–14 hari)"
          ],
          [
            "Dermis dalam",
            "Belang, pucat, atau merah tua bercak; nyerinya justru berkurang",
            "Lebih dari 3 minggu, berisiko parut tebal",
            "Sejak awal"
          ],
          [
            "Lemak",
            "Dasar luka putih atau tampak butiran lemak kuning, tepi menganga",
            "Berminggu-minggu sampai berbulan-bulan bila dibiarkan terbuka",
            "Sejak awal, dalam hitungan jam agar bisa dijahit"
          ],
          [
            "Otot",
            "Luka sangat dalam, sering akibat tusukan atau benturan keras",
            "Bergantung pada operasi",
            "Langsung ke IGD"
          ]
        ]
      }, { sources: ["healthlinkbc-scrape", "statpearls-fase", "statpearls-burn", "papini-2004", "healthdirect-chronic", "cleveland-abrasion"], evidence: "B" }),
      block({
        type: "p",
        text: "Angka untuk dermis sebagian besar berasal dari penelitian luka bakar, karena data untuk lecet dan sayatan dalam jarang tersedia. Gunakan angka ini sebagai batas waktu periksa, bukan janji tanggal sembuh."
      }, { sources: ["healthlinkbc-scrape", "statpearls-fase", "statpearls-burn", "papini-2004", "healthdirect-chronic", "cleveland-abrasion"], evidence: "B" }),
      block({
        type: "section",
        label: "Perjalanan luka yang sembuh normal",
        head: [
          "Waktu sejak terluka",
          "Yang biasanya terlihat"
        ],
        rows: [
          [
            "Beberapa menit",
            "Darah membeku, lalu mengering menjadi keropeng pelindung"
          ],
          [
            "Hari 0 sampai sekitar hari ke-5",
            "Sedikit bengkak, tepi luka merah atau lebih gelap, nyeri saat disentuh, keluar cairan bening. Rembesan lecet biasanya berhenti dalam 4 hari."
          ],
          [
            "Hari ke-2–7 sampai sekitar 3 minggu",
            "Dasar luka merah berbintik, kulit baru tumbuh dari tepi, luka terasa gatal"
          ],
          [
            "3 minggu sampai 1–2 tahun",
            "Bekas luka berubah dari merah dan tebal menjadi pucat dan tipis. Kekuatannya hanya sekitar 80% kulit asli."
          ]
        ]
      }, { sources: ["healthlinkbc-scrape", "statpearls-fase", "statpearls-burn", "papini-2004", "healthdirect-chronic", "cleveland-abrasion"], evidence: "B" }),
      block({
        type: "section",
        label: "Kapan harus periksa walau tidak ada tanda bahaya",
        items: [
          "Lecet tidak membaik setelah 1 minggu.",
          "Luka bakar belum menutup setelah 10–14 hari.",
          "Luka apa pun masih terbuka setelah 4 minggu.",
          "Penderita diabetes, lansia, perokok, dan orang dengan gizi kurang atau daya tahan tubuh rendah sembuh lebih lambat. Periksakan lebih awal."
        ],
        ordered: false
      }, { sources: ["healthlinkbc-scrape", "statpearls-fase", "statpearls-burn", "papini-2004", "healthdirect-chronic", "cleveland-abrasion"], evidence: "B" }),
      block({
        type: "p",
        text: "Luka yang ditutup dan dijaga sedikit lembap, misalnya dengan petroleum jelly tipis dan perban yang diganti setiap hari, umumnya pulih lebih nyaman daripada luka yang dibiarkan kering. Jangan sampai terlalu basah, karena tepi luka bisa melunak."
      }, { sources: ["healthlinkbc-scrape", "statpearls-fase", "statpearls-burn", "papini-2004", "healthdirect-chronic", "cleveland-abrasion"], evidence: "B" }),
    ],
  },
  {
    title: "Warna luka bakar dan waktu pulih",
    nodes: [
      block({
        type: "p",
        text: "Untuk luka bakar, Indonesia punya pedoman resmi yang menghubungkan warna, lapisan kulit, dan waktu sembuh: PNPK Tata Laksana Luka Bakar (Keputusan Menteri Kesehatan, 2019). Tabel ini merangkumnya bersama panduan internasional."
      }, { sources: ["pnpk-burns", "statpearls-burn", "aafp-burns-2020", "chop-burn2", "griffin-2020", "hyland-2013"], evidence: "B" }),
      block({
        type: "table",
        head: [
          "Tampilan",
          "Kedalaman",
          "Lapisan",
          "Perkiraan waktu pulih",
          "Tindakan"
        ],
        rows: [
          [
            "Merah, kering, tanpa lepuh, nyeri; memucat bila ditekan",
            "Derajat 1 (epidermal)",
            "Epidermis",
            "Sekitar 1 minggu (3–10 hari), tanpa bekas",
            "Dinginkan; rawat di rumah bila kecil dan bukan di area khusus"
          ],
          [
            "Lepuh dengan dasar merah muda pucat dan basah; sangat nyeri",
            "Derajat 2 superfisial",
            "Dermis atas",
            "Biasanya paling lama 2 minggu, sampai sekitar 3 minggu; sering meninggalkan beda warna",
            "Kecil: rawat di rumah atau puskesmas. Periksakan bila belum sembuh dalam 2 minggu"
          ],
          [
            "Lepuh dengan dasar merah muda gelap; warna lambat kembali setelah ditekan",
            "Derajat 2 tengah",
            "Dermis tengah",
            "Biasanya sembuh, tetapi tidak selalu dengan sendirinya",
            "Periksakan ke tenaga kesehatan"
          ],
          [
            "Merah tua bercak, belang, atau putih kekuningan; lebih kering; nyeri berkurang",
            "Derajat 2 dalam",
            "Dermis dalam",
            "Lebih dari 3 minggu, hampir pasti berparut",
            "Rumah sakit"
          ],
          [
            "Putih seperti lilin atau kulit samak, kaku, tidak nyeri",
            "Derajat 3 (seluruh ketebalan)",
            "Seluruh dermis sampai lemak",
            "Tidak sembuh sendiri; lebih dari 8 minggu dan perlu operasi",
            "IGD atau rumah sakit"
          ],
          [
            "Hitam hangus",
            "Derajat 4",
            "Lemak, otot, sampai tulang",
            "Tidak sembuh sendiri",
            "IGD"
          ]
        ]
      }, { sources: ["pnpk-burns", "statpearls-burn", "aafp-burns-2020", "chop-burn2", "griffin-2020", "hyland-2013"], evidence: "B" }),
      block({
        type: "p",
        text: "Yang perlu diingat:"
      }, { sources: ["pnpk-burns", "statpearls-burn", "aafp-burns-2020", "chop-burn2", "griffin-2020", "hyland-2013"], evidence: "B" }),
      block({
        type: "list",
        ordered: false,
        items: [
          "**Nyeri yang berkurang adalah tanda bahaya, bukan tanda membaik.** Luka bakar yang lebih dalam merusak ujung saraf, sehingga terasa kurang nyeri.",
          "**Kedalaman di hari pertama belum final.** Luka bakar bisa bertambah dalam selama 24–72 jam pertama. Lihat lagi pada hari ke-2–3; jika tampak lebih pucat, belang, atau kurang nyeri, periksakan hari itu juga.",
          "**Pertolongan pertama mengubah hasil.** Pada 2.495 anak, air mengalir selama 20 menit dalam 3 jam pertama berkaitan dengan peluang cangkok kulit yang lebih rendah. PNPK tidak menyebut lama pendinginan; angka 20 menit berasal dari panduan internasional.",
          "**Ukuran:** telapak tangan korban termasuk jari kira-kira sama dengan 1% luas tubuhnya.",
          "**Luka bakar knalpot** sering lebih dalam dari kelihatannya. Dalam satu seri di Australia, semua 41 anak yang dirawat inap karena luka bakar knalpot memerlukan cangkok kulit. Luka knalpot yang putih, abu-abu, atau tidak nyeri perlu diperiksakan meski kecil."
        ]
      }, { sources: ["pnpk-burns", "statpearls-burn", "aafp-burns-2020", "chop-burn2", "griffin-2020", "hyland-2013"], evidence: "B" }),
    ],
  },
  {
    title: "Di kulit sawo matang",
    nodes: [
      block({
        type: "p",
        text: "Di kulit sawo matang, peradangan sering tidak tampak merah, sehingga infeksi mudah terlewat. Dalam satu studi pada 350 luka kronis, kemerahan hanya tercatat pada 2,3% pasien berkulit paling gelap, dibanding 13,4% pada kulit paling terang, padahal jumlah kumannya serupa."
      }, { sources: ["wi-skintones-2023", "johnson-2024", "nice-ng141", "davis-2010", "dermtimes-2025"], evidence: "K" }),
      block({
        type: "section",
        label: "Cara menilai peradangan tanpa mengandalkan warna merah",
        items: [
          "Raba kehangatan dengan punggung tangan dan bandingkan dengan bagian yang sama di sisi tubuh sebelahnya.",
          "Periksa apakah kulit di sekitar luka tegang, mengilap, atau lebih keras.",
          "Perhatikan warna yang lebih gelap, keunguan, atau keabuan dibanding kulit sekitarnya.",
          "Lihat di bawah cahaya alami, bukan lampu kuning.",
          "Perhatikan nyeri dan bau. Nyeri yang bertambah dan bau yang baru muncul berlaku sebagai tanda bahaya di semua warna kulit.",
          "Tandai batas area yang berubah dengan pulpen dan tulis tanggalnya. Yang dinilai adalah apakah area itu meluas, bukan warnanya."
        ],
        ordered: false
      }, { sources: ["wi-skintones-2023", "johnson-2024", "nice-ng141", "davis-2010", "dermtimes-2025"], evidence: "K" }),
      block({
        type: "section",
        label: "Warna bekas luka setelah sembuh",
        items: [
          "Kulit baru yang awalnya merah muda atau lebih terang lalu menggelap biasanya bukan infeksi, selama tidak hangat, bengkak, atau makin nyeri.",
          "Noda cokelat setelah luka (hiperpigmentasi pascaradang) lebih sering muncul pada kulit gelap dan bisa butuh berbulan-bulan sampai bertahun-tahun untuk memudar. Noda abu-kebiruan bisa menetap.",
          "Sinar matahari memperburuk noda. Pakai tabir surya SPF 30 atau lebih setiap hari dan tutup bekas luka dari matahari.",
          "Luka bakar pada kulit gelap juga berisiko meninggalkan bercak lebih terang serta parut tebal atau keloid. Periksakan bila parut terus menebal atau meninggi.",
          "Bekas luka umumnya matang dalam 6–12 bulan dan bisa terus membaik sampai sekitar 2 tahun."
        ],
        ordered: false
      }, { sources: ["wi-skintones-2023", "johnson-2024", "nice-ng141", "davis-2010", "dermtimes-2025"], evidence: "K" }),
    ],
  },
];

// Bab pustaka untuk tiap jenis panduan (Bagian A) dan tiap alasan rujukan (Bagian B).
export const CHAPTER_FOR_GUIDE = Object.fromEntries(CHAPTERS.filter((c) => c.guideType).map((c) => [c.guideType, CHAPTER_BY_SLUG[c.slug]]));

export const CHAPTER_FOR_REASON = Object.fromEntries(
  Object.entries({
    perdarahan: "luka-robek",
    dalam: "luka-robek",
    tertancap: "benda-tertancap",
    gigitan: "gigitan-hewan",
    tusuk: "luka-tusuk",
    "bakar-berat": "luka-bakar-berat",
    "bakar-sensitif": "luka-bakar-berat",
    "bakar-bayi": "luka-bakar-ringan",
    infeksi: "luka-terinfeksi",
  }).map(([reason, slug]) => [reason, CHAPTER_BY_SLUG[slug]])
);

// Teks alternatif gambar bab ("… tampak atas: …. Penampang: …") dipisah per panel potongan.
export function chapterFigure(chapter) {
  const img = chapter.nodes.find((n) => n.type === "img" && n.src.endsWith(`${chapter.illustration}.png`));
  const [top, section] = img.alt.split(" Penampang: ");
  return { src: img.src, altTop: top, altSection: section ? `Penampang: ${section}` : null };
}
