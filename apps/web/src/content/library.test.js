import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CHAPTERS, CHAPTER_FOR_GUIDE, CHAPTER_FOR_REASON, WOUND_COLORS, chapterFigure } from "./library";
import { CASE_STORIES } from "./caseStories";
import { RED_FLAG_BY_ID } from "./redFlags";
import { ESCALATIONS } from "./assessment";
import { WOUND_GUIDES } from "./wounds";

const pub = (file) => new URL(`../../public/${file}`, import.meta.url);

describe("pustaka luka", () => {
  it("memuat 10 bab, 4 di Bagian A dan 6 di Bagian B, dengan slug unik", () => {
    expect(CHAPTERS.map((c) => c.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(CHAPTERS.filter((c) => c.part === "A")).toHaveLength(4);
    expect(new Set(CHAPTERS.map((c) => c.slug)).size).toBe(10);
  });

  it("setiap bab punya ciri-ciri, langkah, dan larangan", () => {
    for (const c of CHAPTERS) {
      const labels = c.nodes.filter((n) => n.type === "section").map((n) => n.label);
      expect(labels, c.slug).toContain("Ciri-ciri");
      expect(labels.some((l) => ["Langkah perawatan", "Pertolongan pertama", "Yang dilakukan"].includes(l)), c.slug).toBe(true);
      expect(labels, c.slug).toContain("Hindari");
    }
  });

  it("setiap bab punya contoh kasus", () => {
    for (const c of CHAPTERS) expect(CASE_STORIES.some((s) => s.chapter === c.number), c.slug).toBe(true);
  });

  it("gambar punya teks alternatif dan berkasnya ada", () => {
    const images = [...CHAPTERS.flatMap((c) => c.nodes), ...WOUND_COLORS.flatMap((g) => g.nodes)].filter((n) => n.type === "img");
    for (const img of images) {
      expect(img.alt.length, img.src).toBeGreaterThan(20);
      expect(existsSync(pub(img.src)), img.src).toBe(true);
    }
    for (const c of CHAPTERS) {
      const fig = chapterFigure(c);
      expect(fig.altSection, c.slug).toMatch(/^Penampang: /);
      for (const f of [`kecil/${c.illustration}.webp`, `potongan/${c.illustration}-atas.webp`, `potongan/${c.illustration}-penampang.webp`]) {
        expect(existsSync(pub(`illustrations/${f}`)), f).toBe(true);
      }
    }
  });

  it("setiap jenis panduan dan alasan rujukan menunjuk ke bab yang ada", () => {
    for (const type of Object.keys(WOUND_GUIDES)) expect(CHAPTER_FOR_GUIDE[type], type).toBeDefined();
    const reasons = new Set([...Object.keys(RED_FLAG_BY_ID), ...Object.values(ESCALATIONS).map((e) => e.id)]);
    for (const [id, chapter] of Object.entries(CHAPTER_FOR_REASON)) {
      expect(reasons.has(id), id).toBe(true);
      expect(chapter, id).toBeDefined();
    }
  });
});
