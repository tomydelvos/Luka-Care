import { env } from "cloudflare:workers";
import { describe, expect, it } from "vitest";
import { CHECKIN, WOUND, call, createWound, jpeg, registerUser, uploadPhoto } from "./helpers";

describe("wounds", () => {
  it("butuh login", async () => {
    expect((await call("/wounds")).status).toBe(401);
  });

  it("membuat, mengubah, dan menghapus luka dengan bentuk data seperti frontend", async () => {
    const { token } = await registerUser();
    const wound = await createWound(token);
    expect(wound).toMatchObject({ ...WOUND, status: "dipantau", healedAt: null, checkins: [], photos: [] });

    const healedAt = new Date().toISOString();
    const patched = await call(`/wounds/${wound.id}`, { method: "PATCH", token, body: { status: "sembuh", healedAt } });
    expect(patched.json.data).toMatchObject({ status: "sembuh", healedAt });

    const list = await call("/wounds", { token });
    expect(list.json.data.map((w) => w.id)).toEqual([wound.id]);

    expect((await call(`/wounds/${wound.id}`, { method: "DELETE", token })).status).toBe(200);
    expect((await call("/wounds", { token })).json.data).toEqual([]);
  });

  it("memvalidasi isian luka", async () => {
    const { token } = await registerUser();
    const res = await call("/wounds", { method: "POST", token, body: { ...WOUND, type: "patah" } });
    expect(res.status).toBe(422);
    expect(res.json.message).toMatch(/Jenis luka/);
  });

  it("tidak membocorkan luka pengguna lain", async () => {
    const a = await registerUser();
    const b = await registerUser();
    const wound = await createWound(a.token);
    expect((await call("/wounds", { token: b.token })).json.data).toEqual([]);
    expect((await call(`/wounds/${wound.id}`, { method: "PATCH", token: b.token, body: { title: "x" } })).status).toBe(404);
    expect((await call(`/wounds/${wound.id}/examinations`, { method: "POST", token: b.token, body: CHECKIN })).status).toBe(404);
    expect((await call("/uploads/wound-photo", { method: "POST", token: b.token, body: { woundId: wound.id, contentType: "image/jpeg" } })).status).toBe(404);
  });

  it("mencatat kondisi harian dengan foto", async () => {
    const { token } = await registerUser();
    const wound = await createWound(token);
    const up = await uploadPhoto(token, wound.id);
    expect(up.putStatus).toBe(200);
    expect(up.photoUrl).toMatch(/^r2:u\//);

    const res = await call(`/wounds/${wound.id}/examinations`, { method: "POST", token, body: { ...CHECKIN, photo: up.photoUrl, at: "2000-01-01T00:00:00Z" } });
    expect(res.status).toBe(201);
    const [checkin] = res.json.data.checkins;
    expect(checkin).toMatchObject({ pain: 3, redness: "tidak", fluid: "tidak", dressingChanged: true });
    expect(checkin.at.startsWith("2000")).toBe(false);

    // URL foto bertanda tangan bisa dibuka; tanpa tanda tangan ditolak.
    const view = await call(checkin.photo);
    expect(view.status).toBe(200);
    expect(view.res.headers.get("Content-Type")).toBe("image/jpeg");
    expect((await call(checkin.photo.split("?")[0])).status).toBe(403);
  });

  it("menolak foto yang belum diunggah atau milik luka lain", async () => {
    const { token, user } = await registerUser();
    const w1 = await createWound(token);
    const w2 = await createWound(token);
    const up = await uploadPhoto(token, w1.id);
    const other = await call(`/wounds/${w2.id}/examinations`, { method: "POST", token, body: { ...CHECKIN, photo: up.photoUrl } });
    expect(other.status).toBe(403);
    const missing = await call(`/wounds/${w1.id}/examinations`, {
      method: "POST",
      token,
      body: { ...CHECKIN, photo: `r2:u/${user.id}/w/${w1.id}/tidak-ada.jpg` },
    });
    expect(missing.status).toBe(422);
    const dataUrl = await call(`/wounds/${w1.id}/examinations`, { method: "POST", token, body: { ...CHECKIN, photo: "data:image/jpeg;base64,AAAA" } });
    expect(dataUrl.status).toBe(422);
  });

  it("menolak unggahan bukan JPEG atau lebih dari 2 MB", async () => {
    const { token } = await registerUser();
    const wound = await createWound(token);
    const { json } = await call("/uploads/wound-photo", { method: "POST", token, body: { woundId: wound.id, contentType: "image/jpeg" } });
    expect((await call(json.data.uploadUrl, { method: "PUT", body: jpeg(), headers: { "Content-Type": "image/png" } })).status).toBe(415);
    expect((await call(json.data.uploadUrl, { method: "PUT", body: jpeg(2 * 1024 * 1024 + 1), headers: { "Content-Type": "image/jpeg" } })).status).toBe(413);
    expect((await call("/uploads/wound-photo", { method: "POST", token, body: { woundId: wound.id, contentType: "image/png" } })).status).toBe(422);
  });

  it("membatasi galeri 3 foto dan menghapus foto dari R2", async () => {
    const { token } = await registerUser();
    const wound = await createWound(token);
    let latest;
    for (let i = 0; i < 3; i += 1) {
      const up = await uploadPhoto(token, wound.id);
      latest = await call(`/wounds/${wound.id}/photos`, { method: "POST", token, body: { src: up.photoUrl } });
      expect(latest.status).toBe(201);
    }
    expect(latest.json.data.photos).toHaveLength(3);

    const fourth = await uploadPhoto(token, wound.id);
    const full = await call(`/wounds/${wound.id}/photos`, { method: "POST", token, body: { src: fourth.photoUrl } });
    expect(full.status).toBe(409);
    expect(full.json.message).toMatch(/maksimal|sudah berisi 3 foto/);

    const photo = latest.json.data.photos[0];
    const key = new URL(photo.src).pathname.slice("/files/".length);
    expect(await env.PHOTOS.head(key)).not.toBeNull();
    const del = await call(`/wounds/${wound.id}/photos/${photo.id}`, { method: "DELETE", token });
    expect(del.json.data.photos).toHaveLength(2);
    expect(await env.PHOTOS.head(key)).toBeNull();
  });

  it("menghapus foto R2 saat luka dihapus", async () => {
    const { token } = await registerUser();
    const wound = await createWound(token);
    const up = await uploadPhoto(token, wound.id);
    await call(`/wounds/${wound.id}/examinations`, { method: "POST", token, body: { ...CHECKIN, photo: up.photoUrl } });
    const key = up.photoUrl.slice(3);
    await call(`/wounds/${wound.id}`, { method: "DELETE", token });
    expect(await env.PHOTOS.head(key)).toBeNull();
    const rows = await env.DB.prepare("SELECT COUNT(*) AS n FROM wound_examinations WHERE wound_id = ?").bind(wound.id).first();
    expect(rows.n).toBe(0);
  });
});
