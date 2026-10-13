import { Hono } from "hono";
import { requireUser } from "../lib/auth";
import { HttpError, newId, nowIso, ok, publicOrigin, readBody } from "../lib/http";
import { acceptPhotoRef, deletePhotos } from "../lib/photos";
import { getOwnedWound, loadWound, loadWounds, photoKeysOf } from "../lib/wounds";
import {
  AREAS,
  CONDITIONS,
  FLUID,
  REDNESS,
  SIZES,
  STATUSES,
  WHO,
  WOUND_TYPES,
  flag,
  int,
  isoDate,
  oneOf,
  text,
} from "../lib/validate";

// Sama dengan MAX_GALLERY_PHOTOS di frontend.
export const MAX_GALLERY_PHOTOS = 3;

export const wounds = new Hono();
wounds.use("*", requireUser);

const origin = publicOrigin;

wounds.get("/", async (c) => ok(c, await loadWounds(c.env, origin(c), c.var.user.id)));

wounds.post("/", async (c) => {
  const body = await readBody(c);
  const id = newId("w");
  await c.env.DB.prepare(
    `INSERT INTO wounds (id, user_id, title, type, area, condition, size, who, diabetes, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'dipantau', ?)`
  )
    .bind(
      id,
      c.var.user.id,
      text(body.title, "Nama luka"),
      oneOf(body.type, WOUND_TYPES, "Jenis luka"),
      oneOf(body.area, AREAS, "Bagian tubuh", { optional: true }),
      oneOf(body.condition, CONDITIONS, "Kondisi luka", { optional: true }),
      oneOf(body.size, SIZES, "Luas luka", { optional: true }),
      oneOf(body.who ?? "dewasa", WHO, "Siapa yang terluka"),
      flag(body.diabetes),
      nowIso()
    )
    .run();
  return ok(c, await loadWound(c.env, origin(c), c.var.user.id, id), 201);
});

wounds.patch("/:id", async (c) => {
  const id = c.req.param("id");
  await getOwnedWound(c.env, c.var.user.id, id);
  const body = await readBody(c);
  const fields = {
    title: (v) => text(v, "Nama luka"),
    status: (v) => oneOf(v, STATUSES, "Status"),
    healedAt: (v) => isoDate(v, "Tanggal pulih"),
    area: (v) => oneOf(v, AREAS, "Bagian tubuh"),
    condition: (v) => oneOf(v, CONDITIONS, "Kondisi luka"),
    size: (v) => oneOf(v, SIZES, "Luas luka"),
    who: (v) => oneOf(v, WHO, "Siapa yang terluka"),
    diabetes: flag,
  };
  const column = { healedAt: "healed_at" };
  const sets = [];
  const args = [];
  for (const [key, check] of Object.entries(fields)) {
    if (key in body) {
      sets.push(`${column[key] ?? key} = ?`);
      args.push(check(body[key]));
    }
  }
  if (!sets.length) throw new HttpError(422, "Tidak ada perubahan yang dikirim.");
  await c.env.DB.prepare(`UPDATE wounds SET ${sets.join(", ")} WHERE id = ?`).bind(...args, id).run();
  return ok(c, await loadWound(c.env, origin(c), c.var.user.id, id));
});

wounds.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await getOwnedWound(c.env, c.var.user.id, id);
  const keys = await photoKeysOf(c.env, "?", [id]);
  await c.env.DB.prepare("DELETE FROM wounds WHERE id = ?").bind(id).run();
  await deletePhotos(c.env, keys);
  return ok(c, null);
});

// Catatan harian → tabel wound_examinations.
wounds.post("/:id/examinations", async (c) => {
  const id = c.req.param("id");
  const userId = c.var.user.id;
  await getOwnedWound(c.env, userId, id);
  const body = await readBody(c);
  const row = {
    pain: int(body.pain, "Tingkat nyeri", 0, 10),
    redness: oneOf(body.redness, REDNESS, "Kemerahan"),
    fluid: oneOf(body.fluid, FLUID, "Cairan dari luka"),
    note: text(body.note, "Catatan", { min: 0, max: 500, optional: true }),
  };
  const photoKey = await acceptPhotoRef(c.env, body.photo, userId, id);
  await c.env.DB.prepare(
    `INSERT INTO wound_examinations (id, wound_id, at, photo_key, pain, redness, fluid, swelling, fever, dressing_changed, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      newId("c"),
      id,
      nowIso(),
      photoKey,
      row.pain,
      row.redness,
      row.fluid,
      flag(body.swelling),
      flag(body.fever),
      flag(body.dressingChanged),
      row.note
    )
    .run();
  return ok(c, await loadWound(c.env, origin(c), userId, id), 201);
});

// Galeri foto → tabel wound_photos.
wounds.post("/:id/photos", async (c) => {
  const id = c.req.param("id");
  const userId = c.var.user.id;
  await getOwnedWound(c.env, userId, id);
  const body = await readBody(c);
  const { count } = await c.env.DB.prepare("SELECT COUNT(*) AS count FROM wound_photos WHERE wound_id = ?").bind(id).first();
  if (count >= MAX_GALLERY_PHOTOS) {
    throw new HttpError(
      409,
      `Galeri sudah berisi ${MAX_GALLERY_PHOTOS} foto. Hapus salah satu foto dulu untuk menambah yang baru.`
    );
  }
  const key = await acceptPhotoRef(c.env, body.src, userId, id);
  if (!key) throw new HttpError(422, "Foto wajib diisi.");
  await c.env.DB.prepare("INSERT INTO wound_photos (id, wound_id, photo_key, at) VALUES (?, ?, ?, ?)")
    .bind(newId("p"), id, key, nowIso())
    .run();
  return ok(c, await loadWound(c.env, origin(c), userId, id), 201);
});

wounds.delete("/:id/photos/:photoId", async (c) => {
  const id = c.req.param("id");
  const userId = c.var.user.id;
  await getOwnedWound(c.env, userId, id);
  const photo = await c.env.DB.prepare("SELECT photo_key FROM wound_photos WHERE id = ? AND wound_id = ?")
    .bind(c.req.param("photoId"), id)
    .first();
  if (!photo) throw new HttpError(404, "Foto tidak ditemukan.");
  await c.env.DB.prepare("DELETE FROM wound_photos WHERE id = ?").bind(c.req.param("photoId")).run();
  await deletePhotos(c.env, [photo.photo_key]);
  return ok(c, await loadWound(c.env, origin(c), userId, id));
});
