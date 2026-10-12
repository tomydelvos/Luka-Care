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
//   checkins: Checkin[],
//   photos: Photo[]          (galeri, maks. MAX_GALLERY_PHOTOS)
// }
// Photo { id, at, src (dataURL di mock / URL R2 di API) }
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
//   POST   /wounds/:id/photos             { src, at } → Wound   (tabel wound_photos)
//   DELETE /wounds/:id/photos/:photoId    → Wound

export const MAX_GALLERY_PHOTOS = 3;

const KEY = "wounds";

const galleryFull = () => new Error(`Galeri sudah berisi ${MAX_GALLERY_PHOTOS} foto. Hapus salah satu foto dulu untuk menambah yang baru.`);

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
  async addPhotos(id, sources) {
    const at = new Date().toISOString();
    const wounds = readJSON(KEY, []);
    const current = wounds.find((w) => w.id === id)?.photos ?? [];
    if (current.length + sources.length > MAX_GALLERY_PHOTOS) throw galleryFull();
    const added = sources.map((src) => ({ id: uid("p"), at, src }));
    const next = wounds.map((w) => (w.id === id ? { ...w, photos: [...(w.photos ?? []), ...added] } : w));
    if (!writeJSON(KEY, next)) {
      throw new Error("Penyimpanan perangkat penuh. Hapus foto atau luka lama, lalu coba lagi.");
    }
    return next.find((w) => w.id === id);
  },
  async removePhoto(id, photoId) {
    const next = readJSON(KEY, []).map((w) =>
      w.id === id ? { ...w, photos: (w.photos ?? []).filter((p) => p.id !== photoId) } : w
    );
    writeJSON(KEY, next);
    return next.find((w) => w.id === id);
  },
  async replaceAll(wounds) {
    writeJSON(KEY, wounds);
    return wounds;
  },
};

async function uploadPhoto(woundId, dataUrl) {
  const { uploadUrl, photoUrl } = await apiFetch("/uploads/wound-photo", {
    method: "POST",
    body: { woundId, contentType: "image/jpeg" },
  });
  const blob = await (await fetch(dataUrl)).blob();
  await fetch(uploadUrl, { method: "PUT", body: blob, headers: { "Content-Type": "image/jpeg" } });
  return photoUrl;
}

const http = {
  list: () => apiFetch("/wounds"),
  create: (input) => apiFetch("/wounds", { method: "POST", body: input }),
  update: (id, patch) => apiFetch(`/wounds/${id}`, { method: "PATCH", body: patch }),
  remove: (id) => apiFetch(`/wounds/${id}`, { method: "DELETE" }),
  async addCheckin(id, input) {
    let photo = input.photo;
    if (photo && photo.startsWith("data:")) photo = await uploadPhoto(id, photo);
    return apiFetch(`/wounds/${id}/examinations`, { method: "POST", body: { ...input, photo } });
  },
  async addPhotos(id, sources) {
    const at = new Date().toISOString();
    let wound;
    for (const src of sources) {
      wound = await apiFetch(`/wounds/${id}/photos`, { method: "POST", body: { src: await uploadPhoto(id, src), at } });
    }
    return wound;
  },
  removePhoto: (id, photoId) => apiFetch(`/wounds/${id}/photos/${photoId}`, { method: "DELETE" }),
  replaceAll: async (wounds) => wounds,
};

export const woundService = USE_MOCK_API ? mock : http;
