import { RED_FLAG_BY_ID } from "./redFlags";

// Panduan perawatan dasar per jenis luka.
// Prinsip: panduan perawatan dan rekomendasi produk dipisah. Panduan tidak
// menyebut merek, dan tidak pernah menyimpulkan diagnosis.
//
// Wajib ditinjau tenaga kesehatan sebelum rilis production.

const washHands = {
  id: "cuci-tangan",
  title: "Cuci tangan",
  body: "Cuci tangan dengan sabun dan air mengalir sebelum menyentuh luka. Pakai sarung tangan sekali pakai jika ada.",
};

const changeDaily = {
  id: "ganti",
  title: "Ganti penutup setiap hari",
  body: "Ganti sekali sehari, atau lebih cepat jika basah atau kotor. Saat mengganti, perhatikan apakah kemerahan melebar, bengkak, atau bernanah.",
};

const coverStep = (details) => ({
  id: "tutup",
  title: "Tutup luka",
  body:
    details.condition === "basah"
      ? "Pakai kasa atau dressing yang menyerap cairan, lalu rekatkan dengan plester. Luka basah perlu penutup yang lebih sering diganti."
      : "Tutup dengan plester atau kasa non-lengket agar terlindung dari gesekan dan kotoran.",
});

export const WOUND_GUIDES = {
  lecet: {
    id: "lecet",
    name: "Lecet atau baret",
    examples: "Jatuh dari motor atau sepeda, tergores aspal, lutut terseret",
    defaultTitle: (area) => `Lecet di ${area}`,
    steps: (details) => [
      washHands,
      ...(details.condition === "berdarah"
        ? [
            {
              id: "tekan",
              title: "Hentikan darah",
              body: "Tekan perlahan dengan kasa atau kain bersih sampai darah berhenti. Pada lecet biasanya hanya butuh beberapa menit.",
              timer: 300,
            },
          ]
        : []),
      {
        id: "bilas",
        title: "Bilas dengan air mengalir",
        body: "Bilas hingga pasir dan kotoran terangkat. Bersihkan kulit di sekitarnya dengan sabun, tetapi usahakan sabun tidak masuk ke luka.",
        tip: "Tidak ada air keran bersih? Air minum kemasan atau air matang yang sudah dingin juga bisa dipakai.",
      },
      {
        id: "angkat-kotoran",
        title: "Angkat sisa kotoran",
        body: "Kerikil atau serpihan kecil yang masih menempel bisa diangkat dengan pinset yang sudah dibersihkan alkohol.",
        tip: "Kotoran tertanam dan sulit diangkat? Periksakan ke faskes agar dibersihkan dengan benar.",
      },
      {
        id: "keringkan",
        title: "Keringkan sekitar luka",
        body: "Tepuk-tepuk kulit di sekitar luka dengan kasa bersih. Jangan digosok.",
      },
      {
        id: "lembap",
        title: "Jaga luka tetap lembap",
        body: "Oleskan lapisan tipis petroleum jelly atau salep luka sesuai aturan pakai. Luka yang lembap dan tertutup umumnya pulih lebih nyaman daripada dibiarkan kering terbuka.",
        optional: true,
      },
      coverStep(details),
      changeDaily,
    ],
    avoid: [
      "Menggosok luka dengan kasar",
      "Meniup luka atau menyentuhnya dengan tangan kotor",
      "Mengelupas keropeng yang terbentuk",
    ],
    productCategories: ["pembersih", "kasa", "plester", "pelembap", "dressing"],
  },

  sayatan: {
    id: "sayatan",
    name: "Sayatan kecil",
    examples: "Teriris pisau dapur, tergores kertas atau kaleng",
    defaultTitle: (area) => `Sayatan di ${area}`,
    steps: (details) => [
      washHands,
      {
        id: "tekan",
        title: "Tekan selama 10 menit",
        body: "Tekan luka dengan kasa atau kain bersih secara terus-menerus. Jangan diangkat untuk mengintip. Bila bisa, angkat bagian yang luka lebih tinggi dari jantung.",
        timer: 600,
        check: { question: "Setelah 10 menit, darah masih mengalir?", escalateTo: "perdarahan" },
      },
      {
        id: "bilas",
        title: "Bilas dengan air mengalir",
        body: "Setelah darah berhenti, bilas luka dengan air bersih mengalir beberapa saat.",
      },
      {
        id: "cek-tepi",
        title: "Periksa tepi luka",
        body: "Sayatan kecil biasanya menutup rapat dengan sendirinya. Luka yang dalam atau tepinya terbuka lebar mungkin perlu dijahit.",
        check: { question: "Tepi luka terbuka lebar atau lukanya dalam?", escalateTo: "dalam" },
      },
      {
        id: "keringkan",
        title: "Keringkan sekitar luka",
        body: "Tepuk perlahan kulit di sekitar luka dengan kasa bersih.",
      },
      {
        ...coverStep(details),
        body: "Tutup dengan plester atau kasa steril. Untuk sayatan di jari, pilih plester yang lentur agar tidak mudah lepas.",
      },
      changeDaily,
    ],
    avoid: [
      "Mengangkat kasa berulang kali saat menekan",
      "Menuang alkohol langsung ke dalam luka",
      "Menutup luka yang masih berdarah deras",
    ],
    productCategories: ["kasa", "plester", "pembersih", "p3k"],
  },

  bakar: {
    id: "bakar",
    name: "Luka bakar ringan",
    examples: "Terkena panci, cipratan minyak goreng, setrika, atau air panas",
    defaultTitle: (area) => `Luka bakar di ${area}`,
    steps: () => [
      {
        id: "jauhkan",
        title: "Jauhkan dari sumber panas",
        body: "Matikan kompor atau jauhkan benda panas. Lepas cincin, jam, atau gelang di dekat luka sebelum membengkak. Jangan lepas kain yang menempel di kulit.",
      },
      {
        id: "dinginkan",
        title: "Dinginkan selama 20 menit",
        body: "Aliri dengan air mengalir bersuhu biasa. Jangan pakai es atau air es, karena bisa merusak kulit lebih jauh.",
        timer: 1200,
        tip: "Jaga bagian tubuh lain tetap hangat, terutama pada anak, agar tidak kedinginan.",
      },
      {
        id: "jangan-oles",
        title: "Jangan oles bahan dapur",
        body: "Pasta gigi, mentega, minyak, kecap, atau tepung justru menahan panas dan meningkatkan risiko infeksi.",
      },
      {
        id: "lepuh",
        title: "Biarkan lepuh tetap utuh",
        body: "Jangan pecahkan lepuh. Kulitnya melindungi lapisan di bawahnya dari kuman.",
      },
      {
        id: "tutup",
        title: "Tutup dengan longgar",
        body: "Gunakan kasa steril non-lengket atau plastik wrap bersih. Jangan dililit terlalu kencang.",
      },
      {
        id: "nyeri",
        title: "Redakan nyeri bila perlu",
        body: "Pereda nyeri yang dijual bebas dapat digunakan sesuai aturan pakai pada kemasan. Tanyakan apoteker jika ragu, terutama untuk anak.",
        optional: true,
      },
    ],
    avoid: [
      "Mengompres dengan es batu",
      "Mengoles pasta gigi, mentega, atau kecap",
      "Memecahkan lepuh",
    ],
    productCategories: ["bakar", "kasa", "plester"],
  },

  lepuh: {
    id: "lepuh",
    name: "Lepuh karena gesekan",
    examples: "Sepatu baru, sandal, atau gesekan saat olahraga",
    defaultTitle: (area) => `Lepuh di ${area}`,
    steps: () => [
      {
        id: "jangan-pecah",
        title: "Jangan dipecahkan",
        body: "Kulit lepuh adalah pelindung alami. Lepuh kecil biasanya mengempis sendiri dalam beberapa hari.",
      },
      {
        id: "bersihkan",
        title: "Bersihkan area sekitar",
        body: "Cuci dengan sabun lembut dan air, lalu keringkan dengan menepuk perlahan.",
      },
      {
        id: "lindungi",
        title: "Lindungi dari gesekan",
        body: "Tempel plester lepuh hidrokoloid atau plester berbantalan di atas lepuh.",
      },
      {
        id: "ganti-alas",
        title: "Hilangkan penyebabnya",
        body: "Ganti alas kaki yang menggesek, pakai kaus kaki, dan istirahatkan area tersebut.",
      },
      {
        id: "jika-pecah",
        title: "Jika lepuh pecah sendiri",
        body: "Jangan kelupas kulit yang tersisa. Bilas dengan air bersih, lalu tutup dengan plester.",
        optional: true,
      },
    ],
    avoid: ["Menusuk lepuh dengan jarum", "Mengelupas kulit lepuh", "Terus memakai alas kaki yang sama"],
    productCategories: ["dressing", "plester", "pembersih"],
  },
};

export const WOUND_TYPE_LIST = Object.values(WOUND_GUIDES);

const cool = "Aliri dengan air mengalir bersuhu biasa selama 20 menit.";
const looseCover = "Tutup longgar dengan kasa non-lengket atau plastik wrap bersih, lalu berangkat.";

// Menilai detail yang diisi pengguna.
// - escalations: alasan menghentikan perawatan mandiri (tampilan rujukan)
// - cautions: catatan tambahan, panduan tetap ditampilkan
export function assessDetails(type, details) {
  const escalations = [];
  const cautions = [];
  const { who, area, size, diabetes } = details;

  if (type === "bakar") {
    if (size === "besar") escalations.push(RED_FLAG_BY_ID["bakar-berat"]);
    if (area === "wajah" || area === "kelamin") {
      escalations.push({
        id: "bakar-sensitif",
        level: "segera",
        title: "Luka bakar di wajah atau area kelamin",
        detail: "Area ini sensitif dan perlu diperiksa tenaga kesehatan meskipun lukanya kecil.",
        whileWaiting: [cool, looseCover],
      });
    }
    if (who === "bayi") {
      escalations.push({
        id: "bakar-bayi",
        level: "segera",
        title: "Luka bakar pada bayi",
        detail: "Kulit bayi lebih tipis, sehingga luka bakar kecil pun bisa lebih dalam dari kelihatannya.",
        whileWaiting: [
          cool,
          "Jaga tubuh bayi tetap hangat selama mendinginkan luka.",
          looseCover,
        ],
      });
    }
    if (area === "tangan" || area === "kaki") {
      cautions.push("Luka bakar di tangan atau kaki yang melepuh sebaiknya diperiksakan, karena area ini sering bergerak dan mudah terinfeksi.");
    }
    if (who === "anak" || who === "lansia") {
      cautions.push("Pada anak dan lansia, periksakan jika luka melepuh atau nyeri tidak mereda.");
    }
  }

  if (diabetes && area === "kaki") {
    escalations.push({
      id: "diabetes-kaki",
      level: "segera",
      title: "Luka di kaki pada penderita diabetes",
      detail: "Luka kaki pada diabetes lebih mudah infeksi dan lambat sembuh. Sebaiknya diperiksa sejak awal, meskipun kecil.",
      whileWaiting: [
        "Bilas dengan air bersih mengalir dan tutup dengan kasa bersih.",
        "Kurangi menapak atau menekan bagian yang luka.",
      ],
    });
  } else if (diabetes) {
    cautions.push("Pada penderita diabetes, luka cenderung lebih lambat pulih. Catat kondisinya setiap hari dan periksakan bila tidak membaik.");
  }

  if (size === "besar" && type !== "bakar") {
    cautions.push("Luka yang lebih lebar dari telapak tangan sebaiknya diperiksa tenaga kesehatan, terutama jika kotor atau sulit dibersihkan.");
  }
  if (type === "sayatan" && area === "wajah") {
    cautions.push("Sayatan di wajah sebaiknya diperiksakan. Jika perlu dijahit, hasilnya lebih rapi bila ditangani lebih awal.");
  }
  if (area === "wajah" && type === "lecet") {
    cautions.push("Hati-hati membersihkan luka di dekat mata. Jangan biarkan sabun atau salep masuk ke mata.");
  }

  return { escalations, cautions };
}

export const MONITOR_SIGNS = [
  "Kemerahan makin melebar dari tepi luka",
  "Bengkak atau terasa panas",
  "Keluar nanah atau cairan keruh berbau",
  "Nyeri bertambah, bukan berkurang",
  "Demam",
];
