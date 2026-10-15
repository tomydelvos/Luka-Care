// Semua rujukan dari bagian "Sumber" di buku panduan
// (docs/buku-panduan/buku-panduan-perawatan-luka-luar.md). Tampil di halaman /sumber.
// `usedFor` menyalin keterangan di buku: bagian mana yang diambil dari sumber itu.

export const SOURCE_TOPICS = [
  { id: "pertolongan", label: "Pertolongan pertama luka" },
  { id: "bakar", label: "Luka bakar" },
  { id: "gigitan", label: "Gigitan hewan dan rabies" },
  { id: "penyembuhan", label: "Penyembuhan dan waktu pulih" },
  { id: "infeksi", label: "Infeksi dan kulit berwarna" },
  { id: "darurat", label: "Layanan darurat" },
];

export const SOURCES = [
  { id: "nhs-burns", topic: "bakar", title: "Burns and scalds: treatment", publisher: "NHS", year: null, url: "https://www.nhs.uk/conditions/burns-and-scalds/treatment/", usedFor: "air mengalir 20 menit, plastik wrap, kapan ke IGD" },
  { id: "nhs-cuts", topic: "pertolongan", title: "Cuts and grazes", publisher: "NHS", year: null, url: "https://www.nhs.uk/conditions/cuts-and-grazes/", usedFor: "menghentikan darah, luka lebih dari 5 cm, benda tertancap" },
  { id: "nhs-blisters", topic: "pertolongan", title: "Blisters", publisher: "NHS", year: null, url: "https://www.nhs.uk/conditions/blisters/", usedFor: "lepuh pulih sekitar seminggu, plester hidrokoloid" },
  { id: "mayo-cuts", topic: "pertolongan", title: "Cuts and scrapes: first aid", publisher: "Mayo Clinic", year: null, url: "https://www.mymlc.com/health-information/articles/c/cuts-and-scrapes-first-aid/", usedFor: "langkah perawatan, tetanus 5 tahun" },
  { id: "healthdirect-wounds", topic: "pertolongan", title: "Wounds, cuts and grazes", publisher: "healthdirect Australia", year: null, url: "https://www.healthdirect.gov.au/amp/article/wounds-cuts-and-grazes", usedFor: "luka dalam dilihat dalam 2 jam, luka tidak membaik setelah 5 hari" },
  { id: "chop-burn2", topic: "bakar", title: "Second-degree burns", publisher: "Children's Hospital of Philadelphia", year: null, url: "https://www.chop.edu/conditions-diseases/second-degree-burns-partial-thickness-burns", usedFor: "derajat 2 superfisial pulih sekitar 3 minggu" },
  { id: "statpearls-burn-class", topic: "bakar", title: "Burn classification", publisher: "StatPearls", year: null, url: "https://dev2.statpearls.com/articlelibrary/viewarticle/18714", usedFor: "derajat 1 pulih 5–10 hari" },
  { id: "kemenkes-rabies", topic: "gigitan", title: "Segera ke faskes jika digigit anjing", publisher: "Kementerian Kesehatan RI", year: 2023, url: "https://sehatnegeriku.kemkes.go.id/baca/rilismedia/20230602/3343156/hingga-april-2023-ada-11-kasus-kematian-karenarabies-segera-ke-faskes-jika-digigit-anjing", usedFor: "cuci 15 menit, VAR, 95% kasus dari anjing" },
  { id: "who-rabies", topic: "gigitan", title: "Rabies prevention", publisher: "WHO Rabies Bulletin Europe", year: null, url: "https://www.who-rabies-bulletin.org/site-page/rabies-prevention", usedFor: "cuci minimal 15 menit, luka gigitan tidak dijahit" },
  { id: "kemenkes-119", topic: "darurat", title: "Hubungi 119 saat darurat kesehatan", publisher: "Kementerian Kesehatan RI", year: null, url: "https://kemkes.go.id/id/terjadi-darurat-kesehatan-saat-mudik-hubungi-119", usedFor: "layanan PSC 119" },
  { id: "gnfi-112", topic: "darurat", title: "Daftar nomor telepon gawat darurat dan fungsi 112", publisher: "GNFI", year: 2025, url: "https://www.goodnewsfromindonesia.id/2025/03/03/daftar-nomor-telepon-gawat-darurat-di-indonesia-dan-fungsi-nomor-112", usedFor: "nomor darurat umum 112" },
  { id: "pnpk-burns", topic: "bakar", title: "PNPK Tata Laksana Luka Bakar 2019", publisher: "Kementerian Kesehatan RI", year: 2019, url: "https://keslan.kemkes.go.id/unduhan/fileunduhan_1610415947_843237.pdf", usedFor: "warna, kedalaman, dan waktu sembuh luka bakar; aturan telapak tangan 1%" },
  { id: "kemenkes-fase", topic: "penyembuhan", title: "Jenis dan fase penyembuhan luka", publisher: "Kementerian Kesehatan RI", year: 2022, url: "https://keslan.kemkes.go.id/view_artikel/1969/jenis-dan-fase-penyembuhan-luka", usedFor: "fase penyembuhan dan stadium kedalaman" },
  { id: "kemenkes-infeksi", topic: "infeksi", title: "Tanda-tanda infeksi pada luka", publisher: "Kementerian Kesehatan RI", year: 2022, url: "https://keslan.kemkes.go.id/view_artikel/1970/tanda-tanda-infeksi-pada-luka", usedFor: "tanda infeksi luka" },
  { id: "statpearls-fase", topic: "penyembuhan", title: "Fase penyembuhan luka", publisher: "StatPearls", year: 2023, url: "https://www.ncbi.nlm.nih.gov/books/NBK470443/", usedFor: "lama tiap fase, kekuatan parut 80%" },
  { id: "statpearls-burn", topic: "bakar", title: "Klasifikasi luka bakar", publisher: "StatPearls", year: null, url: "https://www.ncbi.nlm.nih.gov/books/NBK539773/", usedFor: "warna dan waktu pulih tiap derajat" },
  { id: "aafp-burns-2020", topic: "bakar", title: "Penanganan luka bakar", publisher: "American Family Physician", year: 2020, url: "https://www.aafp.org/afp/2020/0415/p463.html", usedFor: "penilaian ulang 24–72 jam, derajat 2 dalam lebih dari 3 minggu" },
  { id: "papini-2004", topic: "bakar", title: "Luka bakar dengan berbagai kedalaman", publisher: "Papini, BMJ", year: 2004, url: "https://www.bmj.com/content/329/7458/158.full", usedFor: "rujuk bila belum sembuh sekitar 10 hari" },
  { id: "aafp-laceration-2008", topic: "pertolongan", title: "Penjahitan luka robek kulit", publisher: "Forsch, American Family Physician", year: 2008, url: "https://www.aafp.org/afp/2008/1015/p945.html", usedFor: "waktu lepas jahitan, batas 12 jam" },
  { id: "healthlinkbc-scrape", topic: "penyembuhan", title: "Cara lecet sembuh", publisher: "HealthLinkBC", year: 2022, url: "https://www.healthlinkbc.ca/healthwise/how-scrape-heals", usedFor: "lecet 3–7 hari, lecet dalam tampak putih" },
  { id: "cleveland-abrasion", topic: "penyembuhan", title: "Abrasi", publisher: "Cleveland Clinic", year: 2023, url: "https://my.clevelandclinic.org/health/diseases/25079-abrasion", usedFor: "periksa bila tidak membaik setelah 1 minggu" },
  { id: "harvard-blisters", topic: "pertolongan", title: "Lepuh gesekan", publisher: "Harvard Health", year: 2023, url: "https://www.health.harvard.edu/a_to_z/friction-blisters-a-to-z", usedFor: "perawatan lepuh gesekan" },
  { id: "medlineplus-wound", topic: "penyembuhan", title: "Penyembuhan dan perawatan luka", publisher: "MedlinePlus", year: null, url: "https://medlineplus.gov/ency/patientinstructions/000741.htm", usedFor: "tampilan luka tiap fase, kapan menghubungi tenaga kesehatan" },
  { id: "healthdirect-chronic", topic: "penyembuhan", title: "Luka kronis", publisher: "healthdirect Australia", year: null, url: "https://www.healthdirect.gov.au/chronic-wounds", usedFor: "luka yang belum sembuh setelah 4 minggu" },
  { id: "nice-ng141", topic: "infeksi", title: "Selulitis dan erisipelas, NG141", publisher: "NICE", year: null, url: "https://www.nice.org.uk/guidance/ng141/chapter/Recommendations", usedFor: "tandai batas kemerahan, kemerahan sulit terlihat di kulit gelap" },
  { id: "gray-2006", topic: "penyembuhan", title: "Wound Healing Continuum", publisher: "Gray dkk., Wounds UK", year: 2006, url: "https://wounds-uk.com/wp-content/uploads/2023/02/content_9064.pdf", usedFor: "sistem warna dasar luka" },
  { id: "iwii-2022", topic: "infeksi", title: "Infeksi luka dalam praktik klinis", publisher: "International Wound Infection Institute", year: 2022, url: "https://woundsinternational.com/wp-content/uploads/sites/8/2023/02/ebdcfc5426783d6a07e91c29d174bf89.pdf", usedFor: "infeksi luka dalam praktik klinis" },
  { id: "wi-skintones-2023", topic: "infeksi", title: "Konsensus penilaian luka pada berbagai warna kulit", publisher: "Wounds International", year: 2023, url: "https://woundsinternational.com/wp-content/uploads/2023/05/MULTI23_ME_SkinTones_WINT-web.pdf", usedFor: "penilaian luka pada berbagai warna kulit" },
  { id: "johnson-2024", topic: "infeksi", title: "Kemerahan luka menurut warna kulit", publisher: "Johnson dkk.", year: 2024, url: "https://link.springer.com/article/10.1007/s40615-023-01584-8", usedFor: "kemerahan tercatat 2,3% vs 13,4%" },
  { id: "davis-2010", topic: "infeksi", title: "Hiperpigmentasi pascaradang pada kulit berwarna", publisher: "Davis & Callender", year: 2010, url: "https://jcadonline.com/postinflammatory-hyperpigmentation-a-review-of-the-epidemiology-clinical-features-and-treatment-options-in-skin-of-color/", usedFor: "hiperpigmentasi setelah luka sembuh" },
  { id: "griffin-2020", topic: "bakar", title: "Air mengalir mengurangi cangkok kulit", publisher: "Griffin dkk.", year: 2020, url: "https://em-consulte.com/article/1340436/cool-running-water-first-aid-decreases-skin-grafti", usedFor: "air mengalir 20 menit pada 2.495 anak" },
  { id: "hyland-2013", topic: "bakar", title: "Luka bakar knalpot pada anak", publisher: "Hyland dkk., Medical Journal of Australia", year: 2013, url: "https://www.mja.com.au/journal/2013/198/10/burns-motorcycle-exhausts-among-children-new-south-wales-continuing-problem", usedFor: "luka bakar knalpot pada anak" },
  { id: "dermtimes-2025", topic: "infeksi", title: "Luka bakar pada kulit berwarna", publisher: "Dermatology Times", year: 2025, url: "https://dermatologytimes.com/view/burn-care-disparities-in-skin-of-color", usedFor: "luka bakar pada kulit berwarna" },
];

export const SOURCE_BY_ID = Object.fromEntries(SOURCES.map((s) => [s.id, s]));
