import { equalText, sha256Hex } from "./crypto";
import { HttpError, nowIso } from "./http";

export const CODE_MINUTES = 15;
export const RESEND_SECONDS = 60;
export const MAX_ATTEMPTS = 5;

const newCode = () => String(crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000).padStart(6, "0");
const hashCode = (userId, code) => sha256Hex(`${userId}:${code}`);

// Belum ada penyedia email. Kode ditulis ke log Worker; di dev lokal (DEV_EXPOSE_CODES=true)
// kode juga dikembalikan di respons agar bisa ditampilkan di layar.
function deliver(user, code) {
  console.log(`[verifikasi] kode untuk ${user.email}: ${code}`);
}

// Buat (atau ganti) kode untuk user; kode lama tidak berlaku lagi. Dengan cooldown: true
// (dipakai "kirim ulang") permintaan dalam jeda RESEND_SECONDS ditolak. Login tidak memakai
// jeda karena sudah butuh kata sandi yang benar.
export async function issueCode(env, user, { cooldown = false } = {}) {
  const now = new Date();
  if (cooldown) {
    const current = await env.DB.prepare("SELECT sent_at FROM email_verifications WHERE user_id = ?").bind(user.id).first();
    const wait = current ? Math.ceil((Date.parse(current.sent_at) + RESEND_SECONDS * 1000 - now) / 1000) : 0;
    if (wait > 0) throw new HttpError(429, `Tunggu ${wait} detik sebelum meminta kode baru.`);
  }

  const code = newCode();
  const expires = new Date(now.getTime() + CODE_MINUTES * 60_000);
  await env.DB.prepare(
    `INSERT INTO email_verifications (user_id, code_hash, sent_at, expires_at, attempts) VALUES (?, ?, ?, ?, 0)
     ON CONFLICT(user_id) DO UPDATE SET code_hash = excluded.code_hash, sent_at = excluded.sent_at,
       expires_at = excluded.expires_at, attempts = 0`
  )
    .bind(user.id, await hashCode(user.id, code), now.toISOString(), expires.toISOString())
    .run();
  deliver(user, code);

  return {
    email: user.email,
    resendAt: new Date(now.getTime() + RESEND_SECONDS * 1000).toISOString(),
    ...(env.DEV_EXPOSE_CODES === "true" ? { devCode: code } : {}),
  };
}

// Cocokkan kode. Melempar HttpError bila salah, kedaluwarsa, atau terlalu banyak percobaan.
export async function checkCode(env, user, code) {
  const row = await env.DB.prepare("SELECT * FROM email_verifications WHERE user_id = ?").bind(user.id).first();
  const resend = "Minta kode baru lalu coba lagi.";
  if (!row) throw new HttpError(400, `Kode verifikasi tidak ditemukan. ${resend}`);
  if (row.expires_at <= nowIso()) throw new HttpError(400, `Kode verifikasi sudah kedaluwarsa. ${resend}`);
  if (row.attempts >= MAX_ATTEMPTS) throw new HttpError(429, `Terlalu banyak percobaan. ${resend}`);

  if (!/^\d{6}$/.test(String(code ?? "")) || !equalText(row.code_hash, await hashCode(user.id, code))) {
    await env.DB.prepare("UPDATE email_verifications SET attempts = attempts + 1 WHERE user_id = ?").bind(user.id).run();
    const left = MAX_ATTEMPTS - row.attempts - 1;
    throw new HttpError(400, left > 0 ? `Kode salah. Periksa lagi 6 digit di email Anda (sisa ${left} percobaan).` : `Kode salah. ${resend}`);
  }

  const now = nowIso();
  await env.DB.batch([
    env.DB.prepare("UPDATE users SET email_verified_at = ? WHERE id = ?").bind(now, user.id),
    env.DB.prepare("DELETE FROM email_verifications WHERE user_id = ?").bind(user.id),
  ]);
  return { ...user, email_verified_at: now };
}
