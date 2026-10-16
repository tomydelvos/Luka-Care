import { describe, expect, it } from "vitest";
import { assessDetails } from "./assessment";
import { CHAPTER_FOR_REASON } from "./library";

const base = { who: "dewasa", area: "lengan", size: "kecil", condition: "kering", diabetes: false };
const ids = (list) => list.map((x) => x.id);

describe("assessDetails", () => {
  it("luka kecil biasa tidak memberi rujukan atau catatan", () => {
    expect(assessDetails("lecet", base)).toEqual({ escalations: [], cautions: [] });
  });

  it("luka bakar besar selalu dirujuk sebagai darurat", () => {
    const { escalations } = assessDetails("bakar", { ...base, size: "besar" });
    expect(ids(escalations)).toEqual(["bakar-berat"]);
    expect(escalations[0].level).toBe("darurat");
  });

  it("luka bakar di wajah, kelamin, atau pada bayi dirujuk", () => {
    expect(ids(assessDetails("bakar", { ...base, area: "wajah" }).escalations)).toEqual(["bakar-sensitif"]);
    expect(ids(assessDetails("bakar", { ...base, area: "kelamin" }).escalations)).toEqual(["bakar-sensitif"]);
    expect(ids(assessDetails("bakar", { ...base, who: "bayi" }).escalations)).toEqual(["bakar-bayi"]);
  });

  it("luka bakar di tangan, atau pada anak dan lansia, memberi catatan", () => {
    expect(ids(assessDetails("bakar", { ...base, area: "tangan" }).cautions)).toEqual(["bakar-tangan-kaki"]);
    expect(ids(assessDetails("bakar", { ...base, who: "lansia" }).cautions)).toEqual(["bakar-anak-lansia"]);
  });

  it("diabetes: luka kaki dirujuk, luka lain diberi catatan", () => {
    expect(ids(assessDetails("lecet", { ...base, diabetes: true, area: "kaki" }).escalations)).toEqual(["diabetes-kaki"]);
    const other = assessDetails("lecet", { ...base, diabetes: true });
    expect(other.escalations).toEqual([]);
    expect(ids(other.cautions)).toEqual(["diabetes"]);
  });

  it("catatan per jenis dan area", () => {
    expect(ids(assessDetails("sayatan", { ...base, size: "besar" }).cautions)).toEqual(["besar"]);
    expect(ids(assessDetails("sayatan", { ...base, area: "wajah" }).cautions)).toEqual(["sayatan-wajah"]);
    expect(ids(assessDetails("lecet", { ...base, area: "wajah" }).cautions)).toEqual(["lecet-wajah"]);
  });

  describe("kedalaman (M4)", () => {
    const burn = (b) => ({ ...base, size: "sedang", burn: { blister: false, baseColor: "merah", painful: true, palms: "kurang_1", ...b } });

    it("luka bakar dangkal dan nyeri tetap dirawat di rumah", () => {
      expect(assessDetails("bakar", burn({})).escalations).toEqual([]);
      expect(assessDetails("bakar", burn({ blister: true, baseColor: "merah_muda_pucat" })).escalations).toEqual([]);
    });

    it("dasar putih, hitam, belang, atau tidak nyeri selalu dirujuk, berapa pun luasnya", () => {
      for (const size of ["kecil", "sedang"]) {
        expect(ids(assessDetails("bakar", { ...burn({ baseColor: "putih" }), size }).escalations)).toEqual(["bakar-berat"]);
        expect(ids(assessDetails("bakar", { ...burn({ baseColor: "hitam" }), size }).escalations)).toEqual(["bakar-berat"]);
        expect(ids(assessDetails("bakar", { ...burn({ baseColor: "belang" }), size }).escalations)).toEqual(["bakar-dalam"]);
        expect(ids(assessDetails("bakar", { ...burn({ painful: false }), size }).escalations)).toEqual(["bakar-dalam"]);
      }
      expect(ids(assessDetails("bakar", burn({ baseColor: "merah_muda_gelap" })).escalations)).toEqual(["bakar-dalam"]);
    });

    it("luka bakar melepuh lebih luas dari satu telapak tangan pada anak selalu diarahkan periksa", () => {
      const { escalations } = assessDetails("bakar", { ...burn({ blister: true, baseColor: "merah_muda_pucat", palms: "lebih_1" }), who: "anak", size: "besar" });
      expect(escalations.length).toBeGreaterThan(0);
    });

    it("warna dasar belum diketahui memberi catatan lihat ulang", () => {
      expect(ids(assessDetails("bakar", burn({ baseColor: "tidak_yakin" })).cautions)).toContain("bakar-belum-yakin");
    });

    it("lecet atau sayatan dengan dasar putih atau lemak terlihat diarahkan ke Bab 5", () => {
      for (const type of ["lecet", "sayatan"]) {
        const { escalations } = assessDetails(type, { ...base, deep: "ya" });
        expect(ids(escalations)).toEqual(["dalam"]);
        expect(CHAPTER_FOR_REASON[escalations[0].id].number).toBe(5);
      }
      expect(assessDetails("lecet", { ...base, deep: "tidak" }).escalations).toEqual([]);
    });
  });
});
