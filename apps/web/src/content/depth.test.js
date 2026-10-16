import { describe, expect, it } from "vitest";
import { depthLayerFor, estimateBurn } from "./depth";

describe("estimateBurn (tabel PNPK)", () => {
  it("memetakan warna dasar ke derajat dan lapisan", () => {
    expect(estimateBurn({ baseColor: "merah", painful: true })).toEqual({ degree: "d1", layer: "epidermis", deep: false });
    expect(estimateBurn({ baseColor: "merah_muda_pucat", blister: true, painful: true })).toEqual({ degree: "d2s", layer: "dermis_atas", deep: false });
    expect(estimateBurn({ baseColor: "merah_muda_gelap", painful: true }).deep).toBe(true);
    expect(estimateBurn({ baseColor: "belang", painful: true }).layer).toBe("dermis_dalam");
    expect(estimateBurn({ baseColor: "putih", painful: false }).degree).toBe("d3");
    expect(estimateBurn({ baseColor: "hitam" }).layer).toBe("otot");
  });

  it("lepuh berarti setidaknya derajat 2 superfisial", () => {
    expect(estimateBurn({ baseColor: "merah", blister: true, painful: true }).degree).toBe("d2s");
  });

  it("tidak nyeri selalu dianggap dalam", () => {
    expect(estimateBurn({ baseColor: "merah", painful: false }).deep).toBe(true);
    expect(estimateBurn({ baseColor: "tidak_yakin", painful: false }).deep).toBe(true);
  });

  it("warna belum diketahui tidak menebak derajat", () => {
    expect(estimateBurn({ baseColor: "tidak_yakin", painful: true })).toEqual({ degree: null, layer: "tidak_diketahui", deep: false });
    expect(estimateBurn(null).degree).toBe(null);
  });
});

describe("depthLayerFor", () => {
  it("mengikuti Lampiran A", () => {
    expect(depthLayerFor("lecet", { size: "kecil" })).toBe("epidermis");
    expect(depthLayerFor("lecet", { size: "sedang" })).toBe("dermis_atas");
    expect(depthLayerFor("lecet", { size: "kecil", deep: "ya" })).toBe("lemak");
    expect(depthLayerFor("sayatan", {})).toBe("dermis_atas");
    expect(depthLayerFor("lepuh", {})).toBe("epidermis");
    expect(depthLayerFor("bakar", { burn: { baseColor: "merah_muda_pucat", blister: true, painful: true } })).toBe("dermis_atas");
  });
});
