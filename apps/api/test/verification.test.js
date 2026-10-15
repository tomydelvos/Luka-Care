import { env } from "cloudflare:workers";
import { describe, expect, it } from "vitest";
import { call } from "./helpers";

const PASSWORD = "rahasia123";

async function register() {
  const email = `verif-${crypto.randomUUID().slice(0, 8)}@contoh.id`;
  const { json } = await call("/auth/register", { method: "POST", body: { name: "Sari", email, password: PASSWORD, consent: true } });
  return json.data.verification;
}

const verify = (email, code) => call("/auth/verify", { method: "POST", body: { email, code } });

describe("verifikasi email", () => {
  it("login sebelum verifikasi tidak memberi token", async () => {
    const { email } = await register();
    const login = await call("/auth/login", { method: "POST", body: { email, password: PASSWORD } });
    expect(login.status).toBe(200);
    expect(login.json.data).not.toHaveProperty("token");
    expect(login.json.data.verification.email).toBe(email);
  });

  it("login dengan kata sandi salah tetap ditolak walau belum verifikasi", async () => {
    const { email } = await register();
    const login = await call("/auth/login", { method: "POST", body: { email, password: "salah12345" } });
    expect(login.status).toBe(401);
  });

  it("menolak kode salah dan memblokir setelah 5 percobaan", async () => {
    const { email, devCode } = await register();
    const wrong = devCode === "000000" ? "111111" : "000000";
    const first = await verify(email, wrong);
    expect(first.status).toBe(400);
    expect(first.json.message).toMatch(/sisa 4 percobaan/);
    for (let i = 0; i < 4; i += 1) await verify(email, wrong);
    const blocked = await verify(email, devCode);
    expect(blocked.status).toBe(429);
  });

  it("menolak kode kedaluwarsa", async () => {
    const { email, devCode } = await register();
    await env.DB.prepare(
      "UPDATE email_verifications SET expires_at = ? WHERE user_id = (SELECT id FROM users WHERE email = ?)"
    )
      .bind("2000-01-01T00:00:00.000Z", email)
      .run();
    const res = await verify(email, devCode);
    expect(res.status).toBe(400);
    expect(res.json.message).toMatch(/kedaluwarsa/);
  });

  it("kirim ulang dibatasi jeda, lalu kode baru menggantikan yang lama", async () => {
    const { email, devCode: oldCode } = await register();
    const tooSoon = await call("/auth/resend", { method: "POST", body: { email } });
    expect(tooSoon.status).toBe(429);

    await env.DB.prepare(
      "UPDATE email_verifications SET sent_at = ? WHERE user_id = (SELECT id FROM users WHERE email = ?)"
    )
      .bind("2000-01-01T00:00:00.000Z", email)
      .run();
    const resend = await call("/auth/resend", { method: "POST", body: { email } });
    expect(resend.status).toBe(200);
    const newCode = resend.json.data.verification.devCode;
    expect(newCode).toMatch(/^\d{6}$/);

    if (newCode !== oldCode) expect((await verify(email, oldCode)).status).toBe(400);
    const ok = await verify(email, newCode);
    expect(ok.status).toBe(200);
    expect(ok.json.data.token).toBeTruthy();

    expect((await verify(email, newCode)).status).toBe(409);
  });

  it("kirim ulang untuk email tidak terdaftar tidak membocorkan apa pun", async () => {
    const res = await call("/auth/resend", { method: "POST", body: { email: "siapa@contoh.id" } });
    expect(res.status).toBe(200);
    expect(res.json.data.verification).toEqual({ email: "siapa@contoh.id" });
  });
});
