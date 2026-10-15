import { describe, expect, it } from "vitest";
import { assessCheckin, assessWound, normalizeCheckin } from "./checkin";

const wound = { type: "lecet", size: "kecil", status: "dipantau", createdAt: "2026-10-01T08:00:00", checkins: [] };
const calm = {
  schema: 2,
  pain: 3,
  bedColors: ["merah"],
  fluid: "bening_tipis",
  newOdor: false,
  skin: [],
  spread: "di_dalam_garis",
  fever: false,
};
const ids = (r) => r.reasons.map((x) => x.id);
const check = (patch, previous = calm, w = wound) => assessCheckin(w, { ...calm, ...patch }, previous);

describe("assessCheckin (Lampiran B)", () => {
  it("tanpa pemicu: pantau", () => {
    expect(check({})).toEqual({ level: "pantau", reasons: [] });
    expect(assessCheckin(wound, null)).toEqual({ level: "pantau", reasons: [] });
  });

  it("demam bersama tanda infeksi: igd", () => {
    const r = check({ fever: true, fluid: "kental_keruh" });
    expect(r.level).toBe("igd");
    expect(ids(r)).toContain("demam-infeksi");
    expect(check({ fever: true, skin: ["lebih_hangat"] }).level).toBe("igd");
  });

  it("demam tanpa tanda lain: hari ini (aturan tambahan, label I)", () => {
    const r = check({ fever: true });
    expect(r.level).toBe("hari_ini");
    expect(ids(r)).toEqual(["demam"]);
  });

  it("kulit menghitam, keabuan, melepuh, atau mati rasa: igd", () => {
    for (const s of ["menghitam", "melepuh", "mati_rasa"]) {
      const r = check({ skin: [s] });
      expect(r.level, s).toBe("igd");
      expect(ids(r), s).toContain("kulit-bahaya");
    }
  });

  it("meluas melewati garis pulpen: hari ini, igd bila demam", () => {
    expect(check({ spread: "melewati_garis" })).toMatchObject({ level: "hari_ini" });
    expect(ids(check({ spread: "melewati_garis" }))).toEqual(["meluas"]);
    const fever = check({ spread: "melewati_garis", fever: true });
    expect(fever.level).toBe("igd");
    expect(ids(fever)).toEqual(["meluas-demam"]);
  });

  it("garis yang menjalar: hari ini", () => {
    expect(ids(check({ skin: ["garis_menjalar"] }))).toEqual(["garis-menjalar"]);
    expect(check({ skin: ["garis_menjalar"] }).level).toBe("hari_ini");
  });

  it("cairan kental, keruh, atau kehijauan: hari ini; kuning tipis tidak", () => {
    expect(check({ fluid: "kental_keruh" }).level).toBe("hari_ini");
    expect(check({ fluid: "kehijauan" }).level).toBe("hari_ini");
    expect(check({ fluid: "kuning_tipis" }).level).toBe("pantau");
  });

  it("bau baru: hari ini", () => {
    expect(ids(check({ newOdor: true }))).toEqual(["bau"]);
  });

  it("hangat + tegang/keras + nyeri naik: hari ini; tanpa nyeri naik tidak", () => {
    expect(ids(check({ skin: ["lebih_hangat", "keras"], pain: 4 }))).toEqual(["hangat"]);
    expect(ids(check({ skin: ["lebih_hangat", "tegang_mengilap"], pain: 4 }))).toEqual(["hangat"]);
    expect(check({ skin: ["lebih_hangat", "keras"], pain: 3 }).level).toBe("pantau");
    expect(check({ skin: ["lebih_hangat"], pain: 4 }).level).toBe("pantau");
  });

  it("nyeri naik 3 poin atau lebih: hari ini", () => {
    expect(ids(check({ pain: 6 }))).toEqual(["nyeri-naik"]);
    expect(check({ pain: 5 }).level).toBe("pantau");
    expect(check({ pain: 9 }, null).level).toBe("pantau");
  });

  it("luka bakar tampak lebih pucat, belang, atau kurang nyeri: hari ini; hanya untuk luka bakar", () => {
    expect(ids(check({ burnWorse: true }, calm, { ...wound, type: "bakar" }))).toEqual(["bakar-memburuk"]);
    expect(check({ burnWorse: true }).level).toBe("pantau");
  });

  it("bagian hitam baru: beberapa hari; hitam yang sudah ada tidak dihitung ulang", () => {
    expect(check({ bedColors: ["hitam", "merah"] })).toMatchObject({ level: "beberapa_hari" });
    expect(ids(check({ bedColors: ["hitam"] }, { ...calm, bedColors: ["hitam"] }))).toEqual([]);
  });

  it("kuning menempel yang muncul kembali: beberapa hari", () => {
    expect(ids(check({ bedColors: ["kuning"] }, { ...calm, bedColors: ["kuning", "merah"] }))).toEqual(["kuning-berulang"]);
    expect(check({ bedColors: ["kuning"] }).level).toBe("pantau");
  });

  it("dasar merah pucat, rapuh, atau menonjol: beberapa hari", () => {
    expect(ids(check({ bedColors: ["merah_rapuh"] }))).toEqual(["dasar-rapuh"]);
  });

  it("level tertinggi menentukan bila beberapa pemicu muncul", () => {
    const r = check({ bedColors: ["merah_rapuh"], newOdor: true, skin: ["mati_rasa"] });
    expect(r.level).toBe("igd");
    expect(ids(r)).toEqual(["kulit-bahaya", "bau", "dasar-rapuh"]);
  });

  it("setiap alasan membawa teks dan sumber", () => {
    const r = check({ fever: true, spread: "melewati_garis", newOdor: true, fluid: "kehijauan", skin: ["menghitam"] });
    for (const reason of r.reasons) {
      expect(reason.text.length).toBeGreaterThan(10);
      expect(reason.sourceIds.length).toBeGreaterThan(0);
      expect(reason.text).not.toMatch(/Anda terkena|infeksi Anda|didiagnosis/i);
    }
  });
});

describe("normalizeCheckin (migrasi tahap 1)", () => {
  const v1 = { pain: 4, redness: "meluas", fluid: "nanah", swelling: true, fever: false };

  it("memetakan nilai lama ke versi 2", () => {
    expect(normalizeCheckin(v1)).toMatchObject({
      schema: 2,
      spread: "melewati_garis",
      fluid: "kental_keruh",
      bedColors: [],
      newOdor: false,
      legacy: { redness: "meluas", fluid: "nanah", swelling: true },
    });
    expect(normalizeCheckin({ ...v1, redness: "tidak", fluid: "bening", swelling: false })).toMatchObject({
      spread: "belum_ditandai",
      fluid: "bening_tipis",
      skin: [],
    });
  });

  it("catatan lama tetap dinilai seperti tahap 1", () => {
    expect(assessCheckin(wound, v1, null).level).toBe("hari_ini");
    const calmV1 = { pain: 3, redness: "tidak", fluid: "tidak", swelling: false, fever: false };
    expect(assessCheckin(wound, calmV1, calmV1).level).toBe("pantau");
    expect(ids(assessCheckin(wound, { ...calmV1, swelling: true, pain: 4 }, calmV1))).toEqual(["hangat"]);
  });

  it("catatan versi 2 tidak diubah", () => {
    expect(normalizeCheckin(calm)).toEqual(calm);
  });
});

describe("assessWound (aturan waktu)", () => {
  const at = (iso) => new Date(iso);

  it("sebelum batas periksa: pantau", () => {
    const r = assessWound({ ...wound, checkins: [calm] }, at("2026-10-05T10:00:00"));
    expect(r.level).toBe("pantau");
    expect(r.plan.day).toBe(5);
  });

  it("lewat batas periksa tanpa tanda menutup: beberapa hari", () => {
    const r = assessWound({ ...wound, checkins: [calm] }, at("2026-10-08T10:00:00"));
    expect(ids(r)).toEqual(["lewat-batas"]);
    expect(r.level).toBe("beberapa_hari");
  });

  it("lewat batas periksa tetapi catatan terakhir menunjukkan luka menutup: pantau", () => {
    const closing = { ...calm, bedColors: ["merah_muda", "keropeng"] };
    expect(assessWound({ ...wound, checkins: [closing] }, at("2026-10-09T10:00:00")).level).toBe("pantau");
  });

  it("masih terbuka setelah 28 hari: beberapa hari, perlu perawatan profesional", () => {
    const closing = { ...calm, bedColors: ["merah_muda"] };
    const r = assessWound({ ...wound, checkins: [closing] }, at("2026-10-29T10:00:00"));
    expect(ids(r)).toEqual(["empat-minggu"]);
    expect(r.reasons[0].text).toMatch(/perawatan profesional/);
  });

  it("aturan waktu tidak menurunkan level catatan terakhir", () => {
    const r = assessWound({ ...wound, checkins: [calm, { ...calm, newOdor: true }] }, at("2026-10-20T10:00:00"));
    expect(r.level).toBe("hari_ini");
    expect(ids(r)).toEqual(["bau", "lewat-batas"]);
  });

  it("luka yang sudah ditandai pulih tidak diberi aturan waktu", () => {
    const r = assessWound({ ...wound, status: "sembuh", checkins: [calm] }, at("2026-12-01T10:00:00"));
    expect(r).toMatchObject({ level: "pantau", plan: null });
  });
});
