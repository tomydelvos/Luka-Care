import { Hono } from "hono";
import { hashPassword, verifyPassword } from "../lib/crypto";
import { createSession, deleteSession, publicUser } from "../lib/auth";
import { HttpError, newId, nowIso, ok, readBody } from "../lib/http";
import { email, text } from "../lib/validate";
import { checkCode, issueCode } from "../lib/verification";

// Akun baru harus memverifikasi email dulu. Selama belum terverifikasi, register dan login
// mengembalikan { verification } (tanpa token); token baru diberikan oleh POST /auth/verify.
export const auth = new Hono();

const findUser = (env, mail) => env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(mail).first();

auth.post("/register", async (c) => {
  const body = await readBody(c);
  const name = text(body.name, "Nama", { min: 2, max: 80 });
  const mail = email(body.email);
  if (typeof body.password !== "string" || body.password.length < 8) {
    throw new HttpError(422, "Kata sandi minimal 8 karakter.");
  }
  if (body.password.length > 200) throw new HttpError(422, "Kata sandi maksimal 200 karakter.");
  // UU PDP: data kesehatan hanya boleh diproses dengan persetujuan eksplisit.
  if (body.consent !== true) {
    throw new HttpError(422, "Persetujuan pengolahan data kesehatan diperlukan untuk membuat akun.");
  }

  const exists = await findUser(c.env, mail);
  if (exists) throw new HttpError(409, "Email ini sudah terdaftar. Silakan masuk.");

  const now = nowIso();
  const user = { id: newId("u"), name, email: mail, consent_at: now, created_at: now };
  await c.env.DB.prepare(
    "INSERT INTO users (id, name, email, password_hash, consent_at, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  )
    .bind(user.id, user.name, user.email, await hashPassword(body.password), user.consent_at, user.created_at)
    .run();

  return ok(c, { verification: await issueCode(c.env, user) }, 201);
});

auth.post("/login", async (c) => {
  const body = await readBody(c);
  const wrong = new HttpError(401, "Email atau kata sandi salah.");
  if (typeof body.email !== "string" || typeof body.password !== "string") throw wrong;
  const user = await findUser(c.env, body.email.trim().toLowerCase());
  if (!user || !(await verifyPassword(body.password, user.password_hash))) throw wrong;
  if (!user.email_verified_at) return ok(c, { verification: await issueCode(c.env, user) });
  const token = await createSession(c.env, user.id);
  return ok(c, { token, user: publicUser(user) });
});

auth.post("/verify", async (c) => {
  const body = await readBody(c);
  const mail = email(body.email);
  const user = await findUser(c.env, mail);
  if (!user) throw new HttpError(400, "Kode verifikasi tidak ditemukan. Minta kode baru lalu coba lagi.");
  if (user.email_verified_at) throw new HttpError(409, "Email ini sudah terverifikasi. Silakan masuk.");
  const verified = await checkCode(c.env, user, typeof body.code === "string" ? body.code.trim() : body.code);
  const token = await createSession(c.env, verified.id);
  return ok(c, { token, user: publicUser(verified) });
});

// Kirim ulang kode. Untuk email yang tidak terdaftar respons tetap berhasil agar
// endpoint ini tidak bisa dipakai menebak email siapa saja yang terdaftar.
auth.post("/resend", async (c) => {
  const body = await readBody(c);
  const mail = email(body.email);
  const user = await findUser(c.env, mail);
  if (!user || user.email_verified_at) return ok(c, { verification: { email: mail } });
  return ok(c, { verification: await issueCode(c.env, user, { cooldown: true }) });
});

auth.post("/logout", async (c) => {
  await deleteSession(c);
  return ok(c, null);
});
