import { describe, expect, it } from "vitest";
import { assessDetails } from "./assessment";

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
});
