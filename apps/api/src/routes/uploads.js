import { Hono } from "hono";
import { requireUser } from "../lib/auth";
import { HttpError, ok, publicOrigin, readBody } from "../lib/http";
import { MAX_PHOTO_BYTES, PHOTO_TYPE, photoKey, photoRef, uploadUrl, verifyLocalSignature } from "../lib/photos";
import { getOwnedWound } from "../lib/wounds";

export const uploads = new Hono();

// Langkah 1: minta URL unggah. Klien lalu PUT JPEG ke uploadUrl dan mengirim photoUrl
// ke /wounds/:id/examinations (photo) atau /wounds/:id/photos (src).
uploads.post("/wound-photo", requireUser, async (c) => {
  const body = await readBody(c);
  if (body.contentType !== PHOTO_TYPE) throw new HttpError(422, "Foto harus dikirim sebagai JPEG (image/jpeg).");
  if (typeof body.woundId !== "string") throw new HttpError(422, "woundId wajib diisi.");
  await getOwnedWound(c.env, c.var.user.id, body.woundId);
  const key = photoKey(c.var.user.id, body.woundId);
  return ok(c, { uploadUrl: await uploadUrl(c.env, publicOrigin(c), key), photoUrl: photoRef(key) });
});

// Mode lokal (tanpa kredensial R2): unggah lewat Worker dengan URL bertanda tangan.
uploads.put("/direct/*", async (c) => {
  const key = decodeURIComponent(c.req.path.slice("/uploads/direct/".length));
  if (!(await verifyLocalSignature(c.env, "PUT", key, c.req.query("exp"), c.req.query("sig")))) {
    throw new HttpError(403, "Tautan unggah tidak valid atau sudah kedaluwarsa. Coba unggah ulang.");
  }
  if ((c.req.header("Content-Type") || "").split(";")[0] !== PHOTO_TYPE) {
    throw new HttpError(415, "Foto harus dikirim sebagai JPEG (image/jpeg).");
  }
  const data = await c.req.arrayBuffer();
  if (data.byteLength > MAX_PHOTO_BYTES) throw new HttpError(413, "Foto maksimal 2 MB.");
  await c.env.PHOTOS.put(key, data, { httpMetadata: { contentType: PHOTO_TYPE } });
  return c.body(null, 200);
});

export const files = new Hono();

files.get("/*", async (c) => {
  const key = decodeURIComponent(c.req.path.slice("/files/".length));
  if (!(await verifyLocalSignature(c.env, "GET", key, c.req.query("exp"), c.req.query("sig")))) {
    throw new HttpError(403, "Tautan foto tidak valid atau sudah kedaluwarsa.");
  }
  const object = await c.env.PHOTOS.get(key);
  if (!object) throw new HttpError(404, "Foto tidak ditemukan.");
  return new Response(object.body, {
    headers: { "Content-Type": PHOTO_TYPE, "Cache-Control": "private, max-age=3600" },
  });
});

