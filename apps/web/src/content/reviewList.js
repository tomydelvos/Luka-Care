// Daftar tinjauan klinisi (PRD tahap 2, F10), dibuat dari blok konten agar selalu sama dengan isi aplikasi.
// `npm run review:list` menulis hasilnya ke docs/tinjauan-klinisi.md; test di review.test.js memastikan file itu terbaru.
import { EVIDENCE, isApproved } from "./meta";
import { SOURCE_BY_ID } from "./sources";
import { CHAPTERS } from "./library";
import { LEVELS } from "./checkin";
import { BURN_DEGREES } from "./depth";
import { collectBlocks } from "./review";

const SECTIONS = [
  ["redFlags", "Tanda bahaya di awal panduan"],
  ["levelCopy", "Teks layar rujukan"],
  ["emergencyLead", "Teks halaman darurat"],
  ["escalations", "Rujukan dari detail luka"],
  ["cautions", "Catatan tambahan di langkah perawatan"],
  ["depth", "Pertanyaan kedalaman dan luka bakar (M4)"],
  ["commonSteps", "Langkah perawatan umum"],
  ["wounds", "Langkah perawatan per jenis luka"],
  ["monitorSigns", "Tanda yang dipantau"],
  ["checkin", "Catatan harian dan aturan penilaian (Lampiran B)"],
  ["healing", "Waktu pulih dan batas periksa (Lampiran A)"],
  ["caseStories", "Contoh kasus"],
  ["libraryIntro", "Pengantar pustaka"],
  ["chapters", "Pustaka: isi Bab 1–10"],
  ["woundColors", "Pustaka: Bagian C, warna dan kedalaman"],
];

// Angka yang perlu dilihat klinisi, dengan nama yang bisa dibaca.
const NUMBER_LABELS = {
  timer: (v) => `Timer ${v / 60} menit`,
  checkByDays: (v) => `Batas periksa ${v} hari`,
  days: (v) => `${v} hari`,
  recheckDays: (v) => `Lihat ulang hari ke-${v.join("–")}`,
  from: (v) => `Mulai hari ke-${v}`,
  to: (v) => `Sampai hari ke-${v}`,
};

const LEVEL_LABELS = {
  ...Object.fromEntries(Object.entries(LEVELS).map(([id, l]) => [id, l.label])),
  darurat: "Hubungi 119",
  segera: "Periksakan ke faskes hari ini",
};

// Kolom teknis yang tidak perlu ditinjau.
const SKIP = new Set(["sourceIds", "evidence", "review", "id", "src", "swatch", "tone", "rank", "layer", "degree", "selfCare", "size", "type", "ordered", "chapter", "number", "guideType", "kind", "escalateTo", "optional"]);

function lines(value, key = "") {
  if (key === "level") return LEVEL_LABELS[value] ? [`**Level: ${LEVEL_LABELS[value]}**`] : [];
  if (key === "alt") return [`Gambar: ${value}`];
  // Pilihan jawaban: satu baris per pilihan, dengan keterangannya.
  if (value && typeof value === "object" && !Array.isArray(value) && typeof value.label === "string" && key !== "") {
    const note = value.description ?? value.hint ?? value.note;
    // Pilihan warna luka bakar membawa perkiraan derajat; tampilkan agar ikut ditinjau.
    const rule =
      "degree" in value
        ? ` _(perkiraan: ${value.degree ? BURN_DEGREES.labels[value.degree] : "derajat tidak ditebak"}; ${value.selfCare ? "boleh dirawat di rumah bila kecil" : "dirujuk"})_`
        : "";
    return [`• ${value.label}${note ? ` — ${note}` : ""}${rule}`];
  }
  if (key in NUMBER_LABELS && value !== null && value !== undefined) return [NUMBER_LABELS[key](value)];
  if (SKIP.has(key) || value === null || value === undefined || typeof value === "function" || typeof value === "boolean") return [];
  if (typeof value === "string") return [value];
  if (typeof value === "number") return [];
  if (Array.isArray(value)) return value.flatMap((v) => lines(v, "item"));
  return Object.entries(value).flatMap(([k, v]) => lines(v, k));
}

const sourceName = (id) => {
  const s = SOURCE_BY_ID[id];
  return s ? `${s.title} (${s.publisher}${s.year ? `, ${s.year}` : ""})` : id;
};

const chapterTitle = (path) => {
  const index = Number(path.split(".")[2]);
  const c = CHAPTERS[index];
  return c ? `Bab ${c.number}. ${c.title}` : null;
};

const metaOf = (block) => `Label ${block.evidence} (${EVIDENCE[block.evidence]?.label ?? "?"}) · Sumber: ${block.sourceIds.map(sourceName).join("; ")}`;

function item({ path, block }, { showMeta = true } = {}) {
  const status = isApproved(block) ? "x" : " ";
  const id = path.replace(/^content\./, "");
  const meta = showMeta ? metaOf(block) : "";
  const body = lines(block).map((l) => `  > ${l.replace(/\n/g, " ")}`).join("\n  >\n");
  const flag = block.evidence === "I" ? " · **inferensi, butuh persetujuan khusus**" : "";
  return `- [${status}] \`${id}\`${flag}\n${meta ? `  ${meta}\n` : ""}\n${body}\n`;
}

// Pertanyaan yang perlu diputuskan klinisi, di luar persetujuan teks per blok.
export const OPEN_DECISIONS = [
  "**Semua angka waktu dan ambang** di Lampiran A dan B PRD (`docs/prd-tahap-2.md`). Angkanya juga ada di bagian \"Waktu pulih dan batas periksa\" dan \"Catatan harian\" di bawah.",
  "**Ambang periksa untuk kelompok berisiko** (diabetes, lansia, perokok, daya tahan tubuh rendah). Saat ini hanya \"Periksakan lebih awal\" tanpa angka. Berapa hari?",
  "**Ambang luka bakar untuk awam.** PNPK memakai ambang rumah sakit. Aplikasi merujuk semua luka bakar lebih dari 1 telapak tangan korban, dan semua dasar merah muda gelap, belang, putih, hitam, atau tidak nyeri. Apakah sudah tepat?",
  "**Perkiraan derajat luka bakar dari jawaban awam** (`depth.js`): lepuh dengan warna \"merah\" dibaca derajat 2 superfisial; pilihan \"Tidak yakin\" memakai batas periksa 10 hari dan pengingat lihat ulang hari ke-2–3.",
  "**Membedakan keropeng normal dari jaringan mati hitam** untuk awam. Belum ada sumber. Pilihan \"Hitam keras\" di catatan harian dinilai `beberapa_hari` bila baru muncul.",
  "**Gejala tetanus di Bab 6** (kaku rahang, kejang otot). Belum ada sumber terverifikasi.",
  "**Demam tanpa tanda lain** dinilai \"periksa hari ini\" (label I). Ambang demam 37,7 °C mengikuti laporan riset (tahap 1 memakai 38 °C).",
  "**Nyeri naik 3 poin atau lebih** dari catatan sebelumnya dinilai \"periksa hari ini\" (aturan tahap 1).",
  "**Lewat batas periksa tanpa tanda membaik**: luka dianggap membaik bila catatan terakhir hanya merah muda atau keropeng.",
  "**Kronologi dan \"Yang bisa dipelajari\"** pada 10 contoh kasus.",
  "**Siapa peninjau** (dokter umum, perawat luka, atau dokter spesialis bedah plastik untuk luka bakar) dan nama yang boleh ditampilkan di profile kontak.",
];

export function reviewChecklist(blocks = collectBlocks()) {
  const approved = blocks.filter((b) => isApproved(b.block)).length;
  const inference = blocks.filter((b) => b.block.evidence === "I").length;
  const out = [
    "# Daftar tinjauan klinisi LukaCare",
    "",
    "<!-- Dibuat otomatis dari apps/web/src/content. Jangan edit file ini; jalankan `npm run review:list` di apps/web. -->",
    "",
    "Dokumen ini berisi semua teks medis yang tampil di aplikasi LukaCare, untuk ditinjau dokter atau perawat sebelum rilis (PRD tahap 2, F10). Aplikasi tidak akan bisa dirilis ke production selama masih ada blok yang belum disetujui.",
    "",
    `**Status:** ${approved} dari ${blocks.length} blok disetujui. ${inference} blok berlabel I (inferensi tim) butuh persetujuan khusus.`,
    "",
    "## Cara meninjau",
    "",
    "1. Baca setiap blok. Teks dalam kutipan adalah teks yang dilihat pengguna, apa adanya.",
    "2. Beri salah satu keputusan per blok: **setuju**, **setuju dengan perubahan** (tulis teks penggantinya), atau **tolak** (tulis alasannya). Sebutkan kode blok, misalnya `redFlags.0 (perdarahan)`.",
    "3. Untuk blok berlabel **I**, nyatakan secara khusus bahwa inferensinya boleh dipakai.",
    "4. Tim memasukkan keputusan ke kode (`review: { status: \"reviewed\", reviewedBy, reviewedAt }`). Teks yang diubah setelah disetujui kembali ke status draft dan perlu ditinjau lagi.",
    "",
    "Label asal data: " + Object.entries(EVIDENCE).map(([k, v]) => `**${k}** ${v.label.toLowerCase()}`).join(", ") + ". Rujukan lengkap ada di halaman `/sumber` aplikasi dan `apps/web/src/content/sources.js`.",
    "",
    "Yang tidak perlu ditinjau di sini: aplikasi tidak menganalisis foto luka secara otomatis. Penilaian catatan harian hanya mencocokkan jawaban pengguna dengan aturan di bagian \"Catatan harian\".",
    "",
    "## Keputusan yang perlu diambil",
    "",
    ...OPEN_DECISIONS.map((d, i) => `${i + 1}. ${d}`),
    "",
    "Rincian keputusan implementasi ada di PRD, bagian \"Catatan implementasi M3\" dan \"Catatan implementasi M4\".",
    "",
  ];
  for (const [key, title] of SECTIONS) {
    const group = blocks.filter((b) => b.path.startsWith(`content.${key}.`) || b.path === `content.${key}`);
    if (!group.length) continue;
    out.push(`## ${title}`, "");
    let chapter = null;
    for (const b of group) {
      if (key === "chapters") {
        const t = chapterTitle(b.path);
        if (t !== chapter) {
          chapter = t;
          out.push(`### ${t}`, "", metaOf(b.block), "");
        }
        out.push(item(b, { showMeta: false }));
        continue;
      }
      out.push(item(b));
    }
  }
  const covered = new Set(SECTIONS.map(([k]) => k));
  const rest = blocks.filter((b) => !covered.has(b.path.split(".")[1]));
  if (rest.length) out.push("## Lainnya", "", ...rest.map(item));
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}
