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

// Kata sandi selalu disetel ulang ke nilai di atas, data luka akun demo tidak disentuh.
const sql = `
INSERT INTO users (id, name, email, password_hash, consent_at, created_at, email_verified_at)
VALUES ('u_demo_lokal', ${q(DEMO.name)}, ${q(DEMO.email)}, ${q(passwordHash)}, ${q(now)}, ${q(now)}, ${q(now)})
ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash,
  email_verified_at = COALESCE(users.email_verified_at, excluded.email_verified_at);
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
