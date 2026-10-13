import { API_URL } from "../config/env";
import { readJSON, removeKey } from "../lib/storage";

// Dikirim saat server menolak token (sesi kedaluwarsa atau dicabut); AuthProvider mendengarkannya.
export const SESSION_EXPIRED_EVENT = "lukacare:session-expired";

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
  if (res.status === 401 && session?.token) {
    removeKey("session");
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  }
  if (!res.ok || data.success === false) {
    const message = data.message || `Permintaan gagal (${res.status}). Coba lagi beberapa saat.`;
    throw new Error(message);
  }
  return data.data ?? data;
}
