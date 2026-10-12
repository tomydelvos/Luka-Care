import { API_URL } from "../config/env";
import { readJSON } from "../lib/storage";

// Klien HTTP untuk API Worker (api.lukacare.com).
// Token sesi disimpan oleh authService; header Authorization ditambahkan otomatis.
export async function apiFetch(path, { method = "GET", body, headers = {} } = {}) {
  const session = readJSON("session", null);
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    const message = data.message || `Permintaan gagal (${res.status}). Coba lagi beberapa saat.`;
    throw new Error(message);
  }
  return data.data ?? data;
}
