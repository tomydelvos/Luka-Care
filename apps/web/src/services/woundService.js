import { USE_MOCK_API } from "../config/env";
import { readJSON, writeJSON } from "../lib/storage";
import { uid } from "../lib/format";
import { apiFetch } from "./http";

// Kontrak data (sama untuk mock dan API):
//
// Wound {
//   id, title, type: "lecet"|"sayatan"|"bakar"|"lepuh",
//   area, condition, size, who, diabetes,
//   status: "dipantau"|"sembuh", createdAt, healedAt,
//   checkins: Checkin[]
// }
// Checkin {
//   id, at, photo (dataURL di mock / URL R2 di API),
//   pain 0–10, redness: "tidak"|"sedikit"|"meluas",
//   fluid: "tidak"|"bening"|"nanah", swelling, fever, dressingChanged, note
// }
//
// Endpoint API yang diharapkan (Cloudflare Worker + D1 + R2):
//   GET    /wounds
//   POST   /wounds
//   PATCH  /wounds/:id
//   DELETE /wounds/:id
//   POST   /wounds/:id/examinations      (tabel wound_examinations)
//   POST   /uploads/wound-photo           → { uploadUrl, photoUrl } (R2 presigned URL)

const KEY = "wounds";

const mock = {
  async list() {
    return readJSON(KEY, []);
  },
  async create(input) {
    const wounds = readJSON(KEY, []);
    const wound = {
      id: uid("w"),
      status: "dipantau",
      createdAt: new Date().toISOString(),
      healedAt: null,
      checkins: [],
      ...input,
    };
    writeJSON(KEY, [wound, ...wounds]);
    return wound;
  },
  async update(id, patch) {
    const wounds = readJSON(KEY, []).map((w) => (w.id === id ? { ...w, ...patch } : w));
    writeJSON(KEY, wounds);
    return wounds.find((w) => w.id === id);
  },
  async remove(id) {
    writeJSON(
      KEY,
      readJSON(KEY, []).filter((w) => w.id !== id)
    );
  },
  async addCheckin(id, input) {
    const checkin = { id: uid("c"), at: new Date().toISOString(), ...input };
    const wounds = readJSON(KEY, []).map((w) =>
      w.id === id ? { ...w, checkins: [...w.checkins, checkin] } : w
    );
    if (!writeJSON(KEY, wounds)) {
      throw new Error("Penyimpanan perangkat penuh. Hapus luka lama atau simpan tanpa foto.");
    }
    return wounds.find((w) => w.id === id);
  },
  async replaceAll(wounds) {
    writeJSON(KEY, wounds);
    return wounds;
  },
};

const http = {
  list: () => apiFetch("/wounds"),
  create: (input) => apiFetch("/wounds", { method: "POST", body: input }),
  update: (id, patch) => apiFetch(`/wounds/${id}`, { method: "PATCH", body: patch }),
  remove: (id) => apiFetch(`/wounds/${id}`, { method: "DELETE" }),
  async addCheckin(id, input) {
    let photo = input.photo;
    if (photo && photo.startsWith("data:")) {
      const { uploadUrl, photoUrl } = await apiFetch("/uploads/wound-photo", {
        method: "POST",
        body: { woundId: id, contentType: "image/jpeg" },
      });
      const blob = await (await fetch(photo)).blob();
      await fetch(uploadUrl, { method: "PUT", body: blob, headers: { "Content-Type": "image/jpeg" } });
      photo = photoUrl;
    }
    return apiFetch(`/wounds/${id}/examinations`, { method: "POST", body: { ...input, photo } });
  },
  replaceAll: async (wounds) => wounds,
};

export const woundService = USE_MOCK_API ? mock : http;
