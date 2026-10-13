/**
 * Contoh kasus untuk dibaca pengguna di langkah 3 panduan (dan nanti di /pustaka).
 *
 * Sumber: contoh kasus di "Buku Panduan Perawatan Luka Luar"
 * (docs/buku-panduan/buku-panduan-perawatan-luka-luar.md), Bab 1–10.
 * Semua tokoh adalah ilustrasi, bukan pasien nyata.
 *
 * KONTEN MEDIS: wajib ditinjau dokter atau perawat sebelum production
 * (PRD tahap 2, F10). Jika isi buku berubah, ubah juga file ini.
 *
 * Bentuk data:
 * - group     : kelompok untuk filter; sama dengan id jenis luka di WOUND_GUIDES
 *               (lecet, sayatan, bakar, lepuh) agar bisa dicocokkan dengan pilihan pengguna.
 *               "gigitan" tidak punya panduan rawat sendiri.
 * - care      : "rumah" (umumnya bisa dirawat di rumah) atau "nakes" (perlu tenaga kesehatan).
 * - timeline  : urut waktu. kind menentukan warna dan ikon:
 *               kejadian | aksi | pantau | faskes | waspada | bahaya | pulih
 */

export const CASE_GROUPS = [
  { id: "lecet", label: "Lecet" },
  { id: "sayatan", label: "Sayatan & tusuk" },
  { id: "bakar", label: "Luka bakar" },
  { id: "lepuh", label: "Lepuh" },
  { id: "gigitan", label: "Gigitan hewan" },
];

export const CARE_LEVELS = {
  rumah: { label: "Rawat di rumah", tone: "mint" },
  nakes: { label: "Perlu tenaga kesehatan", tone: "caution" },
};

export const CASE_STORIES = [
  {
    id: "rizki-lecet",
    chapter: 1,
    group: "lecet",
    woundLabel: "Lecet",
    care: "rumah",
    person: { name: "Rizki", age: 22, role: "Pengemudi ojek daring" },
    image: "illustrations/luka-lecet.png",
    thumb: "illustrations/kecil/luka-lecet.webp",
    headline: "Tergelincir di tikungan berpasir",
    situation: "Lutut kirinya lecet kira-kira 4 × 3 cm, penuh pasir, dan darah keluar berupa bintik-bintik.",
    timeline: [
      { at: "Menit ke-0", kind: "kejadian", title: "Jatuh dari motor", text: "Lutut kiri lecet sekitar 4 × 3 cm, penuh pasir. Darah keluar berupa bintik-bintik." },
      { at: "Menit ke-1", kind: "aksi", title: "Cek tanda bahaya dulu", text: "Darah tidak mengalir, tidak ada benda tertancap, dan lutut masih bisa ditekuk." },
      { at: "Di lokasi", kind: "aksi", title: "Bilas seadanya", text: "Lutut dibilas air minum kemasan." },
      { at: "Sampai di rumah", kind: "aksi", title: "Bilas ulang dan tutup", text: "Dibilas lagi di bawah keran, kerikil diangkat dengan pinset. Luka diolesi tipis petroleum jelly lalu ditutup kasa non-lengket." },
      { at: "Setiap malam", kind: "aksi", title: "Ganti penutup", text: "Kasa non-lengket diganti sekali sehari." },
      { at: "Hari ke-3", kind: "pantau", title: "Tanda membaik", text: "Nyeri turun dari 5 menjadi 2. Kemerahan tidak melebar." },
      { at: "Hari ke-10", kind: "pulih", title: "Tertutup kulit baru", text: "Luka sudah tertutup kulit baru." },
    ],
    outcome: "Pulih di rumah pada hari ke-10",
    lessons: [
      "Bilas dengan air mengalir sampai pasir dan kerikil terangkat. Air bersih sudah cukup, tidak perlu alkohol atau iodin di dalam luka.",
      "Petroleum jelly tipis menjaga luka tetap lembap dan tidak lengket ke penutup.",
      "Catat nyeri dan lebar kemerahan setiap hari. Nyeri yang turun dan kemerahan yang tidak melebar adalah tanda yang baik.",
    ],
  },
  {
    id: "maya-terinfeksi",
    chapter: 10,
    group: "lecet",
    woundLabel: "Lecet yang terinfeksi",
    care: "nakes",
    person: { name: "Maya", age: 19, role: "Mahasiswi" },
    image: "illustrations/luka-terinfeksi.png",
    thumb: "illustrations/kecil/luka-terinfeksi.webp",
    headline: "Lecet yang hanya dilap tisu",
    situation: "Maya jatuh dari sepeda dan sikunya lecet. Karena terburu-buru, lukanya hanya dilap tisu dan tidak dibilas.",
    timeline: [
      { at: "Hari ke-1", kind: "kejadian", title: "Jatuh dari sepeda", text: "Siku lecet berpasir. Hanya dilap tisu, tidak dibilas." },
      { at: "Hari ke-3, pagi", kind: "waspada", title: "Kemerahan melebar", text: "Kemerahan melebar 2 cm dari tepi luka dan nyeri naik dari 2 ke 6. Batas kemerahan ditandai dengan pulpen." },
      { at: "Hari ke-3, malam", kind: "bahaya", title: "Tanda infeksi", text: "Kemerahan melewati tanda pulpen, keluar nanah kuning, dan suhu tubuh 38,2 °C." },
      { at: "Malam itu juga", kind: "faskes", title: "Ke klinik", text: "Luka dibersihkan dan dokter memberi obat." },
    ],
    outcome: "Ditangani di klinik pada hari ke-3",
    lessons: [
      "Membilas luka sampai bersih pada hari pertama adalah cara utama mencegah infeksi.",
      "Tandai batas kemerahan dengan pulpen. Jika melewati garis, nyeri naik, keluar nanah, atau demam, periksakan hari itu juga.",
      "Di kulit sawo matang kemerahan sering sulit terlihat. Perhatikan juga rasa panas, bengkak, dan nyeri yang bertambah.",
      "Jangan minum antibiotik sisa atau membelinya tanpa resep.",
    ],
  },
  {
    id: "sari-sayatan",
    chapter: 2,
    group: "sayatan",
    woundLabel: "Sayatan kecil",
    care: "rumah",
    person: { name: "Bu Sari", age: 45, role: "Ibu rumah tangga" },
    image: "illustrations/luka-sayatan.png",
    thumb: "illustrations/kecil/luka-sayatan.webp",
    headline: "Teriris pisau saat memotong bawang",
    situation: "Ujung jari telunjuknya tergores sepanjang 1,5 cm. Darah menetes cukup banyak.",
    timeline: [
      { at: "Menit ke-0", kind: "kejadian", title: "Pisau tergelincir", text: "Ujung telunjuk tergores sepanjang 1,5 cm. Darah menetes cukup banyak." },
      { at: "10 menit pertama", kind: "aksi", title: "Tekan dan angkat", text: "Jari ditekan dengan kain bersih dan tangan diangkat di atas kepala. Darah berhenti." },
      { at: "Setelah darah berhenti", kind: "aksi", title: "Bilas dan periksa", text: "Luka dibilas air keran. Tepinya rapat, jari bisa ditekuk, dan rasa sentuhnya normal." },
      { at: "Setiap sore", kind: "aksi", title: "Ganti plester", text: "Jari ditutup plester lentur khusus jari, diganti setelah memasak." },
      { at: "Hari ke-4", kind: "pulih", title: "Luka menutup", text: "Luka sudah menutup dan plester tidak dipakai lagi." },
    ],
    outcome: "Pulih di rumah pada hari ke-4",
    lessons: [
      "Tekan terus selama 10 menit. Jangan mengangkat kain berulang kali untuk mengintip.",
      "Setelah darah berhenti, periksa tiga hal: tepi luka rapat, jari bisa ditekuk, dan rasa sentuh normal.",
      "Periksakan jika darah tidak berhenti setelah ditekan 10 menit atau tepi luka menganga.",
    ],
  },
  {
    id: "kevin-robek",
    chapter: 5,
    group: "sayatan",
    woundLabel: "Luka robek",
    care: "nakes",
    person: { name: "Kevin", age: 6, role: null },
    image: "illustrations/luka-robek.png",
    thumb: "illustrations/kecil/luka-robek.webp",
    headline: "Dahi terbentur ujung meja kaca",
    situation: "Kevin terjatuh saat berlari di ruang tamu. Lukanya 3 cm, menganga, dan berdarah banyak.",
    timeline: [
      { at: "Menit ke-0", kind: "kejadian", title: "Terbentur meja", text: "Dahi robek 3 cm, menganga, dan berdarah banyak." },
      { at: "Menit pertama", kind: "aksi", title: "Tekan sambil dipangku", text: "Ibunya menekan luka dengan handuk bersih sambil memangku Kevin dalam posisi duduk." },
      { at: "Setelah darah berkurang", kind: "aksi", title: "Tutup sementara", text: "Luka ditutup kasa dan direkatkan plester." },
      { at: "Menit ke-40", kind: "faskes", title: "Tiba di IGD", text: "Luka dibersihkan dan dijahit." },
      { at: "Sesuai jadwal dokter", kind: "pulih", title: "Lepas jahitan", text: "Jahitan dilepas di puskesmas. Untuk wajah biasanya 3–5 hari setelah dijahit." },
    ],
    outcome: "Dijahit di IGD, 40 menit setelah kejadian",
    lessons: [
      "Luka yang menganga perlu dijahit. Datang secepatnya; luka yang bersih umumnya masih bisa dijahit sampai sekitar 12 jam setelah kejadian.",
      "Jangan menaburi luka dengan bubuk kopi, abu, atau ramuan, dan jangan menarik tepinya dengan plester untuk menjahit sendiri.",
      "Jangan menunda sampai besok.",
    ],
  },
  {
    id: "joko-tusuk",
    chapter: 6,
    group: "sayatan",
    woundLabel: "Luka tusuk",
    care: "nakes",
    person: { name: "Pak Joko", age: 52, role: null },
    image: "illustrations/luka-tusuk.png",
    thumb: "illustrations/kecil/luka-tusuk.webp",
    headline: "Menginjak paku berkarat",
    situation: "Saat membersihkan rumah setelah banjir, telapak kakinya tertusuk paku berkarat sekitar 1 cm.",
    timeline: [
      { at: "Menit ke-0", kind: "kejadian", title: "Tertusuk paku", text: "Telapak kaki tertusuk paku berkarat sekitar 1 cm. Paku ikut tercabut saat kaki diangkat." },
      { at: "Menit pertama", kind: "aksi", title: "Bilas dan tutup", text: "Luka dibilas air mengalir dan ditutup kasa." },
      { at: "Sore itu", kind: "faskes", title: "Ke puskesmas", text: "Ia tidak ingat kapan terakhir disuntik tetanus, jadi petugas memberinya suntikan tetanus." },
      { at: "Hari-hari berikutnya", kind: "pantau", title: "Pantau di rumah", text: "Ia diminta kembali jika telapak kakinya bengkak, terasa panas, atau bernanah." },
    ],
    outcome: "Suntik tetanus di puskesmas pada hari yang sama",
    lessons: [
      "Luka tusuk kecil tetap perlu diperiksakan, terutama dari benda berkarat atau kotor. Jangan menunda karena lukanya tampak kecil.",
      "Ingat kapan terakhir suntik tetanus. Kalau lupa, sampaikan saja ke petugas.",
      "Selama beberapa hari, perhatikan bengkak, rasa panas, dan nanah.",
    ],
  },
  {
    id: "rina-tertancap",
    chapter: 7,
    group: "sayatan",
    woundLabel: "Benda tertancap",
    care: "nakes",
    person: { name: "Rina", age: 28, role: null },
    image: "illustrations/luka-benda-tertancap.png",
    thumb: "illustrations/kecil/luka-benda-tertancap.webp",
    headline: "Serpihan gelas menancap di telapak kaki",
    situation: "Rina menginjak pecahan gelas di dapur. Serpihan sepanjang sekitar 2 cm menancap di telapak kakinya.",
    timeline: [
      { at: "Menit ke-0", kind: "kejadian", title: "Menginjak pecahan gelas", text: "Serpihan sekitar 2 cm menancap di telapak kaki." },
      { at: "Menit pertama", kind: "aksi", title: "Tidak dicabut", text: "Suaminya tidak mencabut serpihan dan menekan di kedua sisinya dengan kain bersih." },
      { at: "Sebelum berangkat", kind: "aksi", title: "Ganjal dan balut", text: "Dua gulungan kasa diletakkan di kiri dan kanan serpihan, lalu dibalut perban gulung." },
      { at: "Perjalanan", kind: "faskes", title: "Berangkat ke IGD", text: "Mereka berangkat dengan taksi daring." },
      { at: "Di IGD", kind: "pulih", title: "Serpihan dikeluarkan", text: "Dokter mengeluarkan serpihan dan memastikan tidak ada sisa kaca di dalam luka." },
    ],
    outcome: "Serpihan dikeluarkan dokter di IGD",
    lessons: [
      "Jangan mencabut benda yang tertancap. Biarkan tenaga kesehatan yang mengeluarkannya.",
      "Tekan di sekitar benda, bukan di atasnya, lalu ganjal dengan gulungan kasa di kedua sisi.",
      "Jangan mengorek luka untuk mencari serpihan.",
    ],
  },
  {
    id: "dewi-bakar",
    chapter: 3,
    group: "bakar",
    woundLabel: "Luka bakar ringan",
    care: "rumah",
    person: { name: "Dewi", age: 30, role: "Pedagang gorengan" },
    image: "illustrations/luka-bakar-ringan.png",
    thumb: "illustrations/kecil/luka-bakar-ringan.webp",
    headline: "Terpercik minyak panas",
    situation: "Punggung tangan kirinya merah selebar dua jari dan muncul dua lepuh kecil seukuran biji jagung.",
    timeline: [
      { at: "Detik pertama", kind: "kejadian", title: "Terpercik minyak", text: "Punggung tangan kiri merah selebar dua jari, dengan dua lepuh kecil seukuran biji jagung." },
      { at: "20 menit pertama", kind: "aksi", title: "Dinginkan dengan air mengalir", text: "Cincin dilepas, lalu tangan dialiri air keran selama 20 menit dengan timer di ponsel." },
      { at: "Setelah didinginkan", kind: "aksi", title: "Tutup, tanpa pasta gigi", text: "Tetangganya menyarankan mengoles pasta gigi, tetapi Dewi menutup luka dengan plastik wrap saja." },
      { at: "Selama berjualan", kind: "aksi", title: "Lindungi lepuh", text: "Lepuh dibiarkan utuh dan dilindungi kasa non-lengket." },
      { at: "Hari ke-3", kind: "pantau", title: "Nyeri hilang", text: "Nyerinya hilang." },
      { at: "Minggu ke-2 sampai 3", kind: "pulih", title: "Kulit pulih", text: "Kulit pulih tanpa bekas." },
    ],
    outcome: "Pulih tanpa bekas dalam 2–3 minggu",
    lessons: [
      "Dinginkan dengan air mengalir selama 20 menit. Pakai timer, karena 20 menit terasa lama.",
      "Jangan pakai es, pasta gigi, mentega, minyak, atau kecap.",
      "Biarkan lepuh utuh. Lihat lagi luka pada hari ke-2–3: bagian yang putih atau tidak terasa nyeri berarti lebih dalam dan perlu diperiksakan.",
    ],
  },
  {
    id: "hendra-bakar-berat",
    chapter: 9,
    group: "bakar",
    woundLabel: "Luka bakar berat",
    care: "nakes",
    person: { name: "Pak Hendra", age: 40, role: null },
    image: "illustrations/luka-bakar-berat.png",
    thumb: "illustrations/kecil/luka-bakar-berat.webp",
    headline: "Tersiram air mendidih",
    situation: "Panci besar berisi air mendidih tumpah. Paha dan perutnya merah, banyak lepuh, sebagian kulit tampak putih, dan luasnya lebih dari dua telapak tangannya.",
    timeline: [
      { at: "Menit ke-0", kind: "kejadian", title: "Panci tumpah", text: "Paha dan perut merah, banyak lepuh, sebagian kulit tampak putih. Luasnya lebih dari dua telapak tangannya." },
      { at: "Menit pertama", kind: "bahaya", title: "Telepon 119", text: "Keluarga langsung menelepon 119." },
      { at: "20 menit pertama", kind: "aksi", title: "Dinginkan", text: "Luka diguyur air keran bersuhu biasa. Celana yang tidak menempel digunting dan dilepas." },
      { at: "Sambil menunggu", kind: "aksi", title: "Tutup dan hangatkan", text: "Luka ditutup longgar dengan plastik wrap, dan Pak Hendra diselimuti agar tidak kedinginan." },
      { at: "Di rumah sakit", kind: "faskes", title: "Dirawat", text: "Ia dirawat di bangsal luka bakar." },
    ],
    outcome: "Dirawat di bangsal luka bakar",
    lessons: [
      "Luka bakar yang luas atau ada bagian kulit yang putih perlu ditangani rumah sakit. Telepon 119.",
      "Dinginkan dengan air bersuhu biasa, bukan es, lalu jaga tubuh tetap hangat.",
      "Jangan menarik kain yang menempel di kulit dan jangan memecahkan lepuh.",
    ],
  },
  {
    id: "andi-lepuh",
    chapter: 4,
    group: "lepuh",
    woundLabel: "Lepuh karena gesekan",
    care: "rumah",
    person: { name: "Andi", age: 35, role: "Karyawan kantor" },
    image: "illustrations/luka-lepuh.png",
    thumb: "illustrations/kecil/luka-lepuh.webp",
    headline: "Jalan sehat dengan sepatu baru",
    situation: "Setelah jalan sehat 5 km dengan sepatu baru, tumit kanannya melepuh sebesar koin Rp1.000.",
    timeline: [
      { at: "Hari ke-0", kind: "kejadian", title: "Jalan sehat 5 km", text: "Andi memakai sepatu baru." },
      { at: "Malamnya", kind: "pantau", title: "Tumit melepuh", text: "Tumit kanan melepuh sebesar koin Rp1.000." },
      { at: "Malam itu juga", kind: "aksi", title: "Lindungi, jangan dipecahkan", text: "Lepuh tidak dipecahkan. Tumit dicuci, dikeringkan, lalu ditutup plester hidrokoloid." },
      { at: "Hari ke-1 sampai 5", kind: "aksi", title: "Hentikan gesekan", text: "Andi memakai sepatu lama yang longgar dengan kaus kaki." },
      { at: "Hari ke-5", kind: "pulih", title: "Kulit kering", text: "Plester lepas sendiri dan kulit di bawahnya sudah kering." },
    ],
    outcome: "Pulih di rumah pada hari ke-5",
    lessons: [
      "Jangan menusuk lepuh dengan jarum atau mengelupas kulitnya.",
      "Hentikan gesekannya: ganti alas kaki sampai lepuh pulih.",
      "Penderita diabetes sebaiknya memeriksakan lepuh di kaki.",
    ],
  },
  {
    id: "rudi-gigitan",
    chapter: 8,
    group: "gigitan",
    woundLabel: "Gigitan anjing",
    care: "nakes",
    person: { name: "Rudi", age: 12, role: "Pelajar SD" },
    image: "illustrations/luka-gigitan-cakaran.png",
    thumb: "illustrations/kecil/luka-gigitan-cakaran.webp",
    headline: "Digigit anjing liar sepulang sekolah",
    situation: "Ada empat bekas gigi kecil di betisnya yang sedikit berdarah.",
    timeline: [
      { at: "Menit ke-0", kind: "kejadian", title: "Digigit anjing liar", text: "Empat bekas gigi kecil di betis, sedikit berdarah." },
      { at: "15 menit pertama", kind: "aksi", title: "Cuci dengan sabun", text: "Ibunya mencuci betis Rudi dengan sabun di bawah air keran selama 15 menit, lalu mengoleskan povidon iodin." },
      { at: "Sore itu", kind: "faskes", title: "Ke puskesmas", text: "Petugas mencuci ulang luka dan memberi vaksin anti rabies sesuai jadwal." },
      { at: "Hari yang sama", kind: "aksi", title: "Lapor ketua RT", text: "Ketua RT dilapori agar anjing tersebut ditangkap dan dipantau." },
      { at: "Hari-hari berikutnya", kind: "pantau", title: "Vaksin lanjutan", text: "Dosis berikutnya mengikuti jadwal dari puskesmas." },
    ],
    outcome: "Vaksin anti rabies di puskesmas pada hari yang sama",
    lessons: [
      "Cuci luka gigitan dengan sabun dan air mengalir selama 15 menit, secepatnya.",
      "Gigitan kecil pun perlu ke puskesmas hari itu juga. Kemenkes mencatat sebagian besar kematian akibat rabies terjadi karena pasien terlambat datang.",
      "Laporkan hewannya agar bisa ditangkap dan diamati.",
    ],
  },
];

export const CASE_BY_ID = Object.fromEntries(CASE_STORIES.map((c) => [c.id, c]));

/**
 * Urutan tampil. Tanpa filter ("semua"): kesepuluh kasus, dimulai dari kelompok yang sama
 * dengan jenis luka pengguna, lalu sisanya mengikuti urutan bab di buku.
 * Dengan filter kelompok: hanya kasus kelompok itu, urut bab.
 */
export function casesFor(woundType, group = "semua") {
  const byChapter = [...CASE_STORIES].sort((a, b) => a.chapter - b.chapter);
  if (group !== "semua") return byChapter.filter((c) => c.group === group);
  const mine = byChapter.filter((c) => c.group === woundType);
  const rest = byChapter.filter((c) => c.group !== woundType);
  return [...mine, ...rest];
}
