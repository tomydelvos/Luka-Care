import { describe, expect, it } from "vitest";
import { collectBlocks, reviewReport } from "./review";
import { DRAFT, block, isApproved } from "./meta";
import { SOURCES } from "./sources";
import { RED_FLAGS, WOUND_GUIDES } from "./index";

describe("konten medis", () => {
  const blocks = collectBlocks();

  it("menemukan semua blok konten", () => {
    expect(blocks.length).toBeGreaterThan(60);
    const ids = new Set(blocks.map((b) => b.block.id));
    for (const flag of RED_FLAGS) expect(ids).toContain(flag.id);
  });

  it("setiap blok punya sumber dan label bukti yang valid", () => {
    const report = reviewReport(blocks);
    expect(report.invalid).toEqual([]);
    expect(report.unknownSources).toEqual([]);
  });

  it("setiap langkah perawatan yang tampil adalah blok", () => {
    const combos = ["berdarah", "basah", "kering"];
    for (const guide of Object.values(WOUND_GUIDES)) {
      for (const condition of combos) {
        for (const step of guide.steps({ condition })) {
          expect(step.review, `${guide.id}/${step.id}`).toBeDefined();
          expect(step.sourceIds.length, `${guide.id}/${step.id}`).toBeGreaterThan(0);
        }
      }
      expect(guide.avoid.items.length).toBeGreaterThan(0);
    }
  });

  it("id sumber unik dan punya URL https", () => {
    const ids = SOURCES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of SOURCES) expect(s.url).toMatch(/^https:\/\//);
  });
});

describe("status tinjauan", () => {
  const meta = { sources: ["nhs-cuts"], evidence: "A" };
  const reviewed = { status: "reviewed", reviewedBy: "dr. Contoh", reviewedAt: "2026-10-20" };

  it("draft belum disetujui", () => {
    expect(isApproved(block({}, meta))).toBe(false);
    expect(isApproved(block({}, { ...meta, review: DRAFT }))).toBe(false);
  });

  it("ditinjau tanpa nama atau tanggal belum disetujui", () => {
    expect(isApproved(block({}, { ...meta, review: { status: "reviewed" } }))).toBe(false);
  });

  it("ditinjau lengkap disetujui", () => {
    expect(isApproved(block({}, { ...meta, review: reviewed }))).toBe(true);
  });

  it("label I butuh persetujuan inferensi", () => {
    const inferred = { ...meta, evidence: "I", review: reviewed };
    expect(isApproved(block({}, inferred))).toBe(false);
    expect(isApproved(block({}, { ...inferred, review: { ...reviewed, inferenceApproved: true } }))).toBe(true);
  });

  it("laporan mencatat sumber yang tidak ada", () => {
    const report = reviewReport([{ path: "x", block: block({}, { sources: ["tidak-ada"], evidence: "A" }) }]);
    expect(report.unknownSources).toEqual(["x: tidak-ada"]);
    expect(report.unapproved).toEqual(["x"]);
  });
});
