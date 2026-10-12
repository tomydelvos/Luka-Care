import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Port 3001 sesuai rencana environment lokal (API Worker di 8787).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3001,
    strictPort: false,
  },
  preview: {
    port: 4173,
  },
});
