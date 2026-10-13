import { HttpError } from "./http";
import { viewUrl } from "./photos";

// Ubah baris D1 menjadi bentuk Wound/Checkin/Photo yang dipakai frontend
// (lihat kontrak di apps/web/src/services/woundService.js).

export async function getOwnedWound(env, userId, woundId) {
  const row = await env.DB.prepare("SELECT * FROM wounds WHERE id = ? AND user_id = ?").bind(woundId, userId).first();
  if (!row) throw new HttpError(404, "Catatan luka tidak ditemukan.");
  return row;
}

export async function loadWounds(env, origin, userId, woundId = null) {
  const where = woundId ? "w.user_id = ?1 AND w.id = ?2" : "w.user_id = ?1";
  const args = woundId ? [userId, woundId] : [userId];
  const [wounds, exams, photos] = await env.DB.batch([
    env.DB.prepare(`SELECT w.* FROM wounds w WHERE ${where} ORDER BY w.created_at DESC`).bind(...args),
    env.DB.prepare(
      `SELECT e.* FROM wound_examinations e JOIN wounds w ON w.id = e.wound_id WHERE ${where} ORDER BY e.at ASC`
    ).bind(...args),
    env.DB.prepare(`SELECT p.* FROM wound_photos p JOIN wounds w ON w.id = p.wound_id WHERE ${where} ORDER BY p.at ASC`).bind(
      ...args
    ),
  ]);

  const byWound = new Map(
    wounds.results.map((w) => [
      w.id,
      {
        id: w.id,
        title: w.title,
        type: w.type,
        area: w.area,
        condition: w.condition,
        size: w.size,
        who: w.who,
        diabetes: Boolean(w.diabetes),
        status: w.status,
        createdAt: w.created_at,
        healedAt: w.healed_at,
        checkins: [],
        photos: [],
      },
    ])
  );

  for (const e of exams.results) {
    byWound.get(e.wound_id)?.checkins.push({
      id: e.id,
      at: e.at,
      photo: e.photo_key ? await viewUrl(env, origin, e.photo_key) : null,
      pain: e.pain,
      redness: e.redness,
      fluid: e.fluid,
      swelling: Boolean(e.swelling),
      fever: Boolean(e.fever),
      dressingChanged: Boolean(e.dressing_changed),
      note: e.note,
    });
  }
  for (const p of photos.results) {
    byWound.get(p.wound_id)?.photos.push({ id: p.id, at: p.at, src: await viewUrl(env, origin, p.photo_key) });
  }
  return [...byWound.values()];
}

export async function loadWound(env, origin, userId, woundId) {
  const [wound] = await loadWounds(env, origin, userId, woundId);
  if (!wound) throw new HttpError(404, "Catatan luka tidak ditemukan.");
  return wound;
}

export async function photoKeysOf(env, woundIdsSql, args) {
  const [exams, photos] = await env.DB.batch([
    env.DB.prepare(`SELECT photo_key FROM wound_examinations WHERE photo_key IS NOT NULL AND wound_id IN (${woundIdsSql})`).bind(
      ...args
    ),
    env.DB.prepare(`SELECT photo_key FROM wound_photos WHERE wound_id IN (${woundIdsSql})`).bind(...args),
  ]);
  return [...exams.results, ...photos.results].map((r) => r.photo_key);
}
