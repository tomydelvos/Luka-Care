import { Hono } from "hono";
import { hashPassword, verifyPassword } from "../lib/crypto";
import { createSession, deleteSession, publicUser } from "../lib/auth";
import { HttpError, newId, nowIso, ok, readBody } from "../lib/http";
import { email, text } from "../lib/validate";

export const auth = new Hono();

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

  const exists = await c.env.DB.prepare("SELECT 1 FROM users WHERE email = ?").bind(mail).first();
  if (exists) throw new HttpError(409, "Email ini sudah terdaftar. Silakan masuk.");

  const now = nowIso();
  const user = { id: newId("u"), name, email: mail, consent_at: now, created_at: now };
  await c.env.DB.prepare(
    "INSERT INTO users (id, name, email, password_hash, consent_at, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  )
    .bind(user.id, user.name, user.email, await hashPassword(body.password), user.consent_at, user.created_at)
    .run();

  const token = await createSession(c.env, user.id);
  return ok(c, { token, user: publicUser(user) }, 201);
});

auth.post("/login", async (c) => {
  const body = await readBody(c);
  const wrong = new HttpError(401, "Email atau kata sandi salah.");
  if (typeof body.email !== "string" || typeof body.password !== "string") throw wrong;
  const user = await c.env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(body.email.trim().toLowerCase()).first();
  if (!user || !(await verifyPassword(body.password, user.password_hash))) throw wrong;
  const token = await createSession(c.env, user.id);
  return ok(c, { token, user: publicUser(user) });
});

auth.post("/logout", async (c) => {
  await deleteSession(c);
  return ok(c, null);
});
