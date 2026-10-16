// Buat akun demo yang sudah terverifikasi di database D1 lokal (aman dijalankan berkali-kali).
//   npm run db:seed:local
// Kata sandi di-hash dengan format yang sama seperti src/lib/crypto.js (PBKDF2-SHA256).
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pbkdf2Sync, randomBytes } from "node:crypto";

const DEMO = { name: "Akun Demo", email: "demo@lukacare.test", password: "lukacare123" };

const ITERATIONS = 100_000;
const salt = randomBytes(16);
const hash = pbkdf2Sync(DEMO.password, salt, ITERATIONS, 32, "sha256");
const passwordHash = `pbkdf2$${ITERATIONS}$${salt.toString("base64")}$${hash.toString("base64")}`;
const now = new Date().toISOString();
const q = (v) => `'${String(v).replace(/'/g, "''")}'`;

const daysAgo = (n, hour = 9) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};
const j = (v) => q(JSON.stringify(v));

// Contoh luka untuk demo (tahap 2): satu luka bakar yang waktunya dilihat ulang, satu lecet dengan
// tanda yang perlu diperiksakan hari ini, dan satu sayatan yang sudah lewat batas periksa.
// Dibuat ulang bila terhapus, selama akun demo belum punya luka buatan sendiri; data Anda tidak pernah ditimpa.
const WOUNDS = [
  {
    id: "w_demo_bakar", title: "Luka bakar di tangan", type: "bakar", area: "tangan", condition: "basah", size: "sedang", days: 1,
    healing: { rowId: "bakar-derajat-2", checkByDays: 14, evidence: "B" }, depthLayer: "dermis_atas",
    burn: { blister: true, baseColor: "merah_muda_pucat", painful: true, palms: "kurang_1", degree: "d2s" },
    exams: [
      { day: 1, pain: 6, fluid: "bening_tipis", bed: [], note: "Catatan awal dari panduan." },
      { day: 0, pain: 4, fluid: "bening_tipis", bed: ["merah_muda"], note: "Lepuh masih utuh, nyeri berkurang." },
    ],
  },
  {
    id: "w_demo_lecet", title: "Lecet di lutut", type: "lecet", area: "lutut", condition: "berdarah", size: "sedang", days: 4,
    healing: { rowId: "lecet-lebar", checkByDays: 14, evidence: "A" }, depthLayer: "dermis_atas",
    exams: [
      { day: 4, pain: 3, fluid: "tidak", bed: [], note: "Catatan awal dari panduan." },
      { day: 2, pain: 3, fluid: "kuning_tipis", bed: ["merah", "kuning"], skin: ["lebih_hangat"], spread: "di_dalam_garis", note: "Batas kemerahan sudah ditandai pulpen." },
      { day: 0, pain: 6, fluid: "kuning_tipis", bed: ["merah", "kuning"], skin: ["lebih_hangat", "tegang_mengilap"], spread: "melewati_garis",
        level: "hari_ini", reasons: ["meluas", "nyeri-naik"], note: "Perubahan kulit melewati garis pulpen." },
    ],
  },
  {
    id: "w_demo_sayatan", title: "Sayatan di jari", type: "sayatan", area: "tangan", condition: "kering", size: "kecil", days: 9,
    healing: { rowId: "sayatan", checkByDays: 7, evidence: "I" }, depthLayer: "dermis_atas",
    exams: [
      { day: 9, pain: 2, fluid: "tidak", bed: [], note: "Catatan awal dari panduan." },
      { day: 4, pain: 1, fluid: "tidak", bed: ["merah"], note: "Tepi masih terbuka sedikit." },
    ],
  },
];

const woundSql = WOUNDS.map((w) => {
  const created = daysAgo(w.days, 8);
  const wound = `INSERT INTO wounds (id, user_id, title, type, area, condition, size, who, diabetes, status, created_at, risk, healing, content_version, depth_layer, burn)
SELECT ${q(w.id)}, 'u_demo_lokal', ${q(w.title)}, ${q(w.type)}, ${q(w.area)}, ${q(w.condition)}, ${q(w.size)}, 'dewasa', 0, 'dipantau', ${q(created)},
  ${j({ perokok: false, imunLemah: false })}, ${j(w.healing)}, '2026-10', ${q(w.depthLayer)}, ${w.burn ? j(w.burn) : "NULL"}
WHERE NOT EXISTS (SELECT 1 FROM wounds WHERE id = ${q(w.id)})
  AND NOT EXISTS (SELECT 1 FROM wounds WHERE user_id = 'u_demo_lokal' AND id NOT LIKE 'w_demo_%');`;
  const exams = w.exams.map((e, i) => {
    const spread = e.spread ?? "belum_ditandai";
    const at = i === 0 ? created : daysAgo(e.day, 19);
    return `INSERT INTO wound_examinations (id, wound_id, at, photo_key, pain, redness, fluid, swelling, fever, dressing_changed, note, schema, bed_colors, new_odor, skin, spread, burn_worse, assessment)
SELECT ${q(`${w.id}_c${i}`)}, ${q(w.id)}, ${q(at)}, NULL, ${e.pain}, ${q(spread === "melewati_garis" ? "meluas" : "tidak")}, ${q(e.fluid)}, 0, 0, 1, ${q(e.note)}, 2,
  ${j(e.bed)}, 0, ${j(e.skin ?? [])}, ${q(spread)}, 0, ${j({ level: e.level ?? "pantau", reasons: e.reasons ?? [] })}
WHERE EXISTS (SELECT 1 FROM wounds WHERE id = ${q(w.id)}) AND NOT EXISTS (SELECT 1 FROM wound_examinations WHERE id = ${q(`${w.id}_c${i}`)});`;
  });
  return [wound, ...exams].join("\n");
}).join("\n");

// Kata sandi selalu disetel ulang ke nilai di atas.
const sql = `
INSERT INTO users (id, name, email, password_hash, consent_at, created_at, email_verified_at)
VALUES ('u_demo_lokal', ${q(DEMO.name)}, ${q(DEMO.email)}, ${q(passwordHash)}, ${q(now)}, ${q(now)}, ${q(now)})
ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash,
  email_verified_at = COALESCE(users.email_verified_at, excluded.email_verified_at);
${woundSql}
`;

const dir = mkdtempSync(join(tmpdir(), "lukacare-seed-"));
const file = join(dir, "seed.sql");
try {
  writeFileSync(file, sql);
  execFileSync("npx", ["wrangler", "d1", "execute", "lukacare", "--local", "--file", file], { stdio: ["ignore", "ignore", "inherit"] });
  console.log(`Akun demo siap: ${DEMO.email} / ${DEMO.password}`);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
