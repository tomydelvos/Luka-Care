import { exports } from "cloudflare:workers";

export const BASE = "https://api.test";

export async function call(path, { method = "GET", body, token, headers = {} } = {}) {
  const res = await exports.default.fetch(
    new Request(path.startsWith("http") ? path : `${BASE}${path}`, {
      method,
      headers: {
        ...(body !== undefined && !(body instanceof ArrayBuffer) ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : body instanceof ArrayBuffer ? body : JSON.stringify(body),
    })
  );
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  return { status: res.status, json, res };
}

let n = 0;
export async function registerUser(overrides = {}) {
  n += 1;
  const { json } = await call("/auth/register", {
    method: "POST",
    body: { name: "Rina Pengguna", email: `rina${n}-${Date.now()}@contoh.id`, password: "rahasia123", consent: true, ...overrides },
  });
  return json.data;
}

export const WOUND = { title: "Lecet di lutut", type: "lecet", area: "lutut", condition: "kering", size: "kecil", who: "dewasa", diabetes: false };

export const CHECKIN = { pain: 3, redness: "tidak", fluid: "tidak", swelling: false, fever: false, dressingChanged: true, note: "" };

export async function createWound(token, body = WOUND) {
  const { json } = await call("/wounds", { method: "POST", token, body });
  return json.data;
}

// JPEG kecil (header saja sudah cukup untuk test; Worker tidak mendekode gambar).
export const jpeg = (size = 1024) => {
  const bytes = new Uint8Array(size);
  bytes.set([0xff, 0xd8, 0xff, 0xe0]);
  return bytes.buffer;
};

export async function uploadPhoto(token, woundId, data = jpeg()) {
  const { json } = await call("/uploads/wound-photo", { method: "POST", token, body: { woundId, contentType: "image/jpeg" } });
  const put = await call(json.data.uploadUrl, { method: "PUT", body: data, headers: { "Content-Type": "image/jpeg" } });
  return { ...json.data, putStatus: put.status };
}
