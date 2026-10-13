// Bentuk respons sama dengan yang dibaca frontend (src/services/http.js):
//   { success: true, data }  atau  { success: false, message }
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const ok = (c, data, status = 200) => c.json({ success: true, data }, status);

export const fail = (c, status, message) => c.json({ success: false, message }, status);

export async function readBody(c) {
  try {
    const body = await c.req.json();
    if (body && typeof body === "object" && !Array.isArray(body)) return body;
  } catch {
    // jatuh ke error di bawah
  }
  throw new HttpError(400, "Format permintaan tidak valid. Kirim data sebagai JSON.");
}

// Alamat publik API untuk membangun URL foto. wrangler dev menulis ulang host request
// menjadi pola `routes` (api.lukacare.com), jadi jangan mengandalkan c.req.url saja.
export const publicOrigin = (c) => (c.env.PUBLIC_API_URL || new URL(c.req.url).origin).replace(/\/$/, "");

export const nowIso = () => new Date().toISOString();

export const newId = (prefix) => `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 20)}`;
