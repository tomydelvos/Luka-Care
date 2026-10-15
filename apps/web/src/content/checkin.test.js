import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { BED_COLOR_OPTIONS, DANGER_REFERENCES } from "./checkin";

const pub = (file) => new URL(`../../public/${file}`, import.meta.url);

describe("gambar pembanding catatan harian", () => {
  it("semua swatch warna dasar dan tanda bahaya ada berkasnya", () => {
    const files = [...BED_COLOR_OPTIONS.items.filter((o) => o.swatch).map((o) => o.swatch), ...Object.values(DANGER_REFERENCES).map((r) => r.swatch)];
    expect(files.length).toBe(7);
    for (const f of files) expect(existsSync(pub(f)), f).toBe(true);
  });

  it("gambar tanda bahaya punya teks alternatif", () => {
    for (const r of Object.values(DANGER_REFERENCES)) expect(r.alt.length).toBeGreaterThan(10);
  });
});
