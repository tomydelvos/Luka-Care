import { describe, expect, it } from "vitest";
import { call, registerUser } from "./helpers";

describe("auth", () => {
  it("mendaftar, masuk, dan keluar", async () => {
    const email = `budi-${Date.now()}@contoh.id`;
    const reg = await call("/auth/register", {
      method: "POST",
      body: { name: "Budi", email, password: "rahasia123", consent: true },
    });
    expect(reg.status).toBe(201);
    expect(reg.json.data.user).toMatchObject({ name: "Budi", email });
    expect(reg.json.data.user.consentAt).toBeTruthy();
    expect(reg.json.data.user).not.toHaveProperty("password_hash");

    const login = await call("/auth/login", { method: "POST", body: { email: email.toUpperCase(), password: "rahasia123" } });
    expect(login.status).toBe(200);
    const token = login.json.data.token;

    expect((await call("/me", { token })).status).toBe(200);
    expect((await call("/auth/logout", { method: "POST", token })).status).toBe(200);
    const after = await call("/me", { token });
    expect(after.status).toBe(401);
    expect(after.json).toEqual({ success: false, message: expect.stringMatching(/Sesi Anda sudah berakhir/) });
  });

  it("menolak pendaftaran tanpa persetujuan data kesehatan", async () => {
    const res = await call("/auth/register", {
      method: "POST",
      body: { name: "Tanpa", email: `tanpa-${Date.now()}@contoh.id`, password: "rahasia123", consent: false },
    });
    expect(res.status).toBe(422);
    expect(res.json.message).toMatch(/Persetujuan/);
  });

  it("menolak email ganda dan kata sandi pendek", async () => {
    const { user } = await registerUser();
    const dup = await call("/auth/register", { method: "POST", body: { name: "Xavier", email: user.email, password: "rahasia123", consent: true } });
    expect(dup.status).toBe(409);
    const short = await call("/auth/register", { method: "POST", body: { name: "Xy", email: "a@b.co", password: "123", consent: true } });
    expect(short.status).toBe(422);
  });

  it("memberi pesan sama untuk email tidak terdaftar dan kata sandi salah", async () => {
    const { user } = await registerUser();
    const wrongPass = await call("/auth/login", { method: "POST", body: { email: user.email, password: "salah12345" } });
    const noUser = await call("/auth/login", { method: "POST", body: { email: "tidakada@contoh.id", password: "rahasia123" } });
    expect(wrongPass.status).toBe(401);
    expect(noUser.json.message).toBe(wrongPass.json.message);
  });

  it("menolak body bukan JSON", async () => {
    const res = await call("/auth/login", { method: "POST", body: undefined, headers: { "Content-Type": "application/json" } });
    expect(res.status).toBe(400);
  });
});
