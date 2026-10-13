import { AwsClient } from "aws4fetch";
import { hmacHex, equalText } from "./crypto";
import { HttpError } from "./http";

// Foto luka = data kesehatan. Bucket R2 selalu privat; klien hanya menerima URL
// bertanda tangan yang berumur pendek.
//
// Dua mode:
// - R2_ACCESS_KEY_ID + R2_SECRET_ACCESS_KEY + R2_ACCOUNT_ID terisi → presigned URL S3 ke R2,
//   foto diunggah dan dibuka langsung dari R2 tanpa melewati Worker.
// - Selain itu (dev lokal, test) → URL bertanda tangan HMAC ke Worker sendiri
//   (PUT /uploads/direct/*, GET /files/*), yang membaca/menulis lewat binding PHOTOS.

export const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
export const PHOTO_TYPE = "image/jpeg";
const UPLOAD_TTL = 10 * 60;
const VIEW_TTL = 60 * 60;
const REF_PREFIX = "r2:";

export const photoKey = (userId, woundId) => `u/${userId}/w/${woundId}/${crypto.randomUUID()}.jpg`;
export const photoRef = (key) => `${REF_PREFIX}${key}`;

const useR2Presign = (env) => Boolean(env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY && env.R2_ACCOUNT_ID);

function signingSecret(env) {
  if (!env.FILE_SIGNING_SECRET) throw new HttpError(500, "Server belum dikonfigurasi untuk foto (FILE_SIGNING_SECRET kosong).");
  return env.FILE_SIGNING_SECRET;
}

const encodeKey = (key) => key.split("/").map(encodeURIComponent).join("/");

async function presignR2(env, method, key, ttl) {
  const aws = new AwsClient({
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    service: "s3",
    region: "auto",
  });
  const url = new URL(`https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${env.R2_BUCKET}/${encodeKey(key)}`);
  url.searchParams.set("X-Amz-Expires", String(ttl));
  const headers = method === "PUT" ? { "Content-Type": PHOTO_TYPE } : {};
  const signed = await aws.sign(new Request(url, { method, headers }), { aws: { signQuery: true } });
  return signed.url;
}

async function localSignedUrl(env, origin, method, key, ttl) {
  const exp = Math.floor(Date.now() / 1000) + ttl;
  const sig = await hmacHex(signingSecret(env), `${method}:${key}:${exp}`);
  const path = method === "PUT" ? "/uploads/direct/" : "/files/";
  return `${origin}${path}${encodeKey(key)}?exp=${exp}&sig=${sig}`;
}

export async function verifyLocalSignature(env, method, key, exp, sig) {
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false;
  const expected = await hmacHex(signingSecret(env), `${method}:${key}:${exp}`);
  return equalText(expected, sig);
}

export const uploadUrl = (env, origin, key) =>
  useR2Presign(env) ? presignR2(env, "PUT", key, UPLOAD_TTL) : localSignedUrl(env, origin, "PUT", key, UPLOAD_TTL);

export const viewUrl = (env, origin, key) =>
  useR2Presign(env) ? presignR2(env, "GET", key, VIEW_TTL) : localSignedUrl(env, origin, "GET", key, VIEW_TTL);

// Ubah referensi "r2:<key>" dari klien menjadi key yang sudah dicek:
// milik pengguna & luka ini, benar-benar sudah diunggah, JPEG, dan tidak terlalu besar.
export async function acceptPhotoRef(env, ref, userId, woundId) {
  if (ref === null || ref === undefined || ref === "") return null;
  if (typeof ref !== "string" || !ref.startsWith(REF_PREFIX)) {
    throw new HttpError(422, "Foto tidak valid. Unggah foto lewat /uploads/wound-photo terlebih dahulu.");
  }
  const key = ref.slice(REF_PREFIX.length);
  if (!key.startsWith(`u/${userId}/w/${woundId}/`) || key.includes("..")) {
    throw new HttpError(403, "Foto ini bukan milik luka tersebut.");
  }
  const head = await env.PHOTOS.head(key);
  if (!head) throw new HttpError(422, "Foto belum selesai diunggah. Coba unggah ulang.");
  if (head.size > MAX_PHOTO_BYTES || (head.httpMetadata?.contentType && head.httpMetadata.contentType !== PHOTO_TYPE)) {
    await env.PHOTOS.delete(key);
    throw new HttpError(422, "Foto harus JPEG dan maksimal 2 MB.");
  }
  return key;
}

export async function deletePhotos(env, keys) {
  const list = keys.filter(Boolean);
  if (list.length) await env.PHOTOS.delete(list);
}
