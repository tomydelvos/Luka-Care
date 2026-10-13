import { sha256Hex, newToken } from "./crypto";
import { HttpError, nowIso } from "./http";

const SESSION_DAYS = 30;

export async function createSession(env, userId) {
  const token = newToken();
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_DAYS * 86_400_000);
  await env.DB.prepare("INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)")
    .bind(await sha256Hex(token), userId, now.toISOString(), expires.toISOString())
    .run();
  return token;
}

const bearer = (c) => {
  const header = c.req.header("Authorization") || "";
  return header.startsWith("Bearer ") ? header.slice(7).trim() : "";
};

export async function deleteSession(c) {
  const token = bearer(c);
  if (token) await c.env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha256Hex(token)).run();
}

// Middleware: isi c.var.user dari token Bearer yang masih berlaku.
export async function requireUser(c, next) {
  const token = bearer(c);
  if (!token) throw new HttpError(401, "Silakan masuk untuk melanjutkan.");
  const user = await c.env.DB.prepare(
    `SELECT u.id, u.name, u.email, u.consent_at, u.created_at
       FROM sessions s JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = ? AND s.expires_at > ?`
  )
    .bind(await sha256Hex(token), nowIso())
    .first();
  if (!user) throw new HttpError(401, "Sesi Anda sudah berakhir. Silakan masuk lagi.");
  c.set("user", user);
  await next();
}

export const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  consentAt: u.consent_at,
  createdAt: u.created_at,
});
