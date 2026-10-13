import { USE_MOCK_API } from "../config/env";
import { clearAll, exportAll } from "../lib/storage";
import { apiFetch } from "./http";

// Hak subjek data (UU PDP): unduh dan hapus semua data pengguna.
// Endpoint API: GET /me/export, DELETE /me.

const mock = {
  async exportData() {
    const data = exportAll();
    delete data["mock-users"];
    return data;
  },
  async deleteAll() {
    clearAll();
  },
};

const http = {
  exportData: () => apiFetch("/me/export"),
  async deleteAll() {
    await apiFetch("/me", { method: "DELETE" });
    // Bersihkan juga sesi dan keranjang yang tersimpan di perangkat ini.
    clearAll();
  },
};

export const accountService = USE_MOCK_API ? mock : http;
