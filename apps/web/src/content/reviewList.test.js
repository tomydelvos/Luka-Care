import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { reviewChecklist } from "./reviewList";
import { collectBlocks } from "./review";

const DOC = new URL("../../../../docs/tinjauan-klinisi.md", import.meta.url);

describe("daftar tinjauan klinisi", () => {
  it("memuat setiap blok konten tepat sekali", () => {
    const text = reviewChecklist();
    for (const { path } of collectBlocks()) {
      const id = `] \`${path.replace(/^content\./, "")}\``;
      expect(text.split(id).length - 1, id).toBe(1);
    }
  });

  it("docs/tinjauan-klinisi.md sama dengan konten (jalankan npm run review:list bila gagal)", () => {
    expect(readFileSync(DOC, "utf8")).toBe(reviewChecklist());
  });
});
