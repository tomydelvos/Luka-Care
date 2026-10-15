import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { reviewReport } from "./src/content/review.js";

// Gerbang konten medis (PRD tahap 2, F1): build dengan VITE_APP_ENV=production gagal selama
// masih ada blok yang belum ditinjau klinisi, label I yang belum disetujui, atau sumber yang tidak ada.
function contentReviewGate(mode) {
  return {
    name: "lukacare-content-review",
    apply: "build",
    buildStart() {
      const { VITE_APP_ENV } = loadEnv(mode, process.cwd(), "VITE_");
      if (VITE_APP_ENV !== "production") return;
      const r = reviewReport();
      const problems = [
        ...r.invalid.map((p) => `metadata tidak lengkap: ${p}`),
        ...r.unknownSources.map((p) => `sumber tidak ada: ${p}`),
        ...r.unapproved.map((p) => `belum ditinjau klinisi: ${p}`),
      ];
      if (!problems.length) return;
      const shown = problems.slice(0, 15).map((p) => `  - ${p}`).join("\n");
      const more = problems.length > 15 ? `\n  …dan ${problems.length - 15} lainnya` : "";
      this.error(
        `Build production dihentikan: ${problems.length} masalah konten medis.\n${shown}${more}\n` +
          "Isi review di src/content/ setelah ditinjau dokter atau perawat (lihat src/content/meta.js)."
      );
    },
  };
}

// Port 3001 sesuai rencana environment lokal (API Worker di 8787).
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), contentReviewGate(mode)],
  server: {
    port: 3001,
    strictPort: false,
  },
  preview: {
    port: 4173,
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.{js,jsx}"],
  },
}));
