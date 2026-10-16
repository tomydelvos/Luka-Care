import { describe, expect, it } from "vitest";
import { healingPlan, healingRowFor, healingSnapshot, isAtRisk } from "./healing";

const base = { status: "dipantau", createdAt: "2026-10-16T21:30:00", who: "dewasa", diabetes: false };
const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

describe("baris Lampiran A", () => {
  it("memilih baris sesuai jenis dan luas", () => {
    expect(healingRowFor({ ...base, type: "lecet", size: "kecil" }).id).toBe("lecet-ringan");
    expect(healingRowFor({ ...base, type: "lecet", size: "besar" }).id).toBe("lecet-lebar");
    expect(healingRowFor({ ...base, type: "sayatan" }).checkByDays).toBe(7);
    expect(healingRowFor({ ...base, type: "lepuh" }).checkByDays).toBe(14);
  });

  it("luka bakar tanpa derajat memakai batas yang lebih awal", () => {
    const row = healingRowFor({ ...base, type: "bakar" });
    expect(row.id).toBe("bakar-belum-diketahui");
    expect(row.checkByDays).toBe(10);
    expect(healingRowFor({ ...base, type: "bakar", burn: { degree: "d2s" } }).checkByDays).toBe(14);
    expect(healingRowFor({ ...base, type: "bakar", burn: { degree: "d1" } }).checkByDays).toBe(10);
    expect(healingRowFor({ ...base, type: "bakar", burn: { degree: null } }).id).toBe("bakar-belum-diketahui");
  });

  it("baris yang tersimpan di luka dipakai lebih dulu", () => {
    expect(healingRowFor({ ...base, type: "lecet", size: "besar", healing: { rowId: "lecet-ringan" } }).id).toBe("lecet-ringan");
    expect(healingSnapshot({ ...base, type: "lepuh" })).toEqual({ rowId: "lepuh", checkByDays: 14, evidence: "I" });
  });

  it("tidak ada teks janji tanggal sembuh", () => {
    for (const type of ["lecet", "sayatan", "bakar", "lepuh"]) {
      expect(healingRowFor({ ...base, type }).estimate).not.toMatch(/sembuh pada/i);
    }
  });
});

describe("healingPlan", () => {
  it("menghitung batas periksa dari tanggal luka di zona waktu perangkat", () => {
    const plan = healingPlan({ ...base, type: "lecet", size: "kecil" }, new Date("2026-10-17T08:00:00"));
    expect(plan.day).toBe(2);
    expect(ymd(plan.checkBy)).toBe("2026-10-23");
    expect(ymd(plan.fourWeeks)).toBe("2026-11-13");
    expect(plan.overdue).toBe(false);
  });

  it("menandai lihat ulang luka bakar pada hari ke-2 dan ke-3 saja", () => {
    const burn = { ...base, type: "bakar" };
    expect(healingPlan(burn, new Date("2026-10-16T22:00:00")).recheckDue).toBe(false);
    expect(healingPlan(burn, new Date("2026-10-17T09:00:00")).recheckDue).toBe(true);
    expect(healingPlan(burn, new Date("2026-10-18T09:00:00")).recheckDue).toBe(true);
    expect(healingPlan(burn, new Date("2026-10-19T09:00:00")).recheckDue).toBe(false);
    expect(healingPlan({ ...base, type: "lecet" }, new Date("2026-10-17T09:00:00")).recheckDue).toBe(false);
  });

  it("menentukan fase penyembuhan hari ini", () => {
    const w = { ...base, type: "lecet" };
    expect(healingPlan(w, new Date("2026-10-16T23:00:00")).phase.id).toBe("radang");
    expect(healingPlan(w, new Date("2026-10-25T09:00:00")).phase.id).toBe("tumbuh");
    expect(healingPlan(w, new Date("2026-11-20T09:00:00")).phase.id).toBe("matang");
  });

  it("mengenali kelompok berisiko", () => {
    expect(isAtRisk(base)).toBe(false);
    expect(isAtRisk({ ...base, diabetes: true })).toBe(true);
    expect(isAtRisk({ ...base, who: "lansia" })).toBe(true);
    expect(isAtRisk({ ...base, risk: { perokok: true } })).toBe(true);
    expect(isAtRisk({ ...base, risk: { imunLemah: true } })).toBe(true);
  });
});
