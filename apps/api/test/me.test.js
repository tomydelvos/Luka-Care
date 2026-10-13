import { env } from "cloudflare:workers";
import { describe, expect, it } from "vitest";
import { CHECKIN, call, createWound, registerUser, uploadPhoto } from "./helpers";
import { isAllowedOrigin } from "../src/index";

describe("me (hak subjek data)", () => {
  it("mengekspor semua data pengguna", async () => {
    const { token, user } = await registerUser();
    const wound = await createWound(token);
    await call(`/wounds/${wound.id}/examinations`, { method: "POST", token, body: CHECKIN });
    const res = await call("/me/export", { token });
    expect(res.status).toBe(200);
    expect(res.json.data.user.id).toBe(user.id);
    expect(res.json.data.wounds[0].checkins).toHaveLength(1);
  });

  it("menghapus akun beserta luka, sesi, dan foto", async () => {
    const { token, user } = await registerUser();
    const wound = await createWound(token);
    const up = await uploadPhoto(token, wound.id);
    await call(`/wounds/${wound.id}/photos`, { method: "POST", token, body: { src: up.photoUrl } });

    expect((await call("/me", { method: "DELETE", token })).status).toBe(200);
    expect((await call("/me", { token })).status).toBe(401);
    expect(await env.PHOTOS.head(up.photoUrl.slice(3))).toBeNull();
    for (const table of ["users", "wounds", "sessions"]) {
      const col = table === "users" ? "id" : "user_id";
      const row = await env.DB.prepare(`SELECT COUNT(*) AS n FROM ${table} WHERE ${col} = ?`).bind(user.id).first();
      expect(row.n).toBe(0);
    }
  });
});

describe("umum", () => {
  it("health check dan 404 berformat envelope", async () => {
    expect((await call("/health")).json).toEqual({ success: true, data: { status: "ok" } });
    expect((await call("/tidak-ada")).json).toEqual({ success: false, message: "Alamat API tidak ditemukan." });
  });

  it("CORS hanya untuk origin yang diizinkan", async () => {
    const pre = (origin) =>
      call("/wounds", { method: "OPTIONS", headers: { Origin: origin, "Access-Control-Request-Method": "POST" } });
    expect((await pre("http://localhost:3001")).res.headers.get("Access-Control-Allow-Origin")).toBe("http://localhost:3001");
    expect((await pre("https://jahat.example")).res.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });

  it("pola :* hanya cocok untuk port angka di host yang sama", () => {
    const list = ["http://localhost:*", "https://lukacare.com"];
    expect(isAllowedOrigin("http://localhost:3002", list)).toBe(true);
    expect(isAllowedOrigin("https://lukacare.com", list)).toBe(true);
    expect(isAllowedOrigin("http://localhost:3002.jahat.example", list)).toBe(false);
    expect(isAllowedOrigin("http://localhost.jahat.example", list)).toBe(false);
    expect(isAllowedOrigin("https://lukacare.com.jahat.example", list)).toBe(false);
    expect(isAllowedOrigin(undefined, list)).toBe(false);
  });
});
