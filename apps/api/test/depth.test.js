import { describe, expect, it } from "vitest";
import { WOUND, call, createWound, registerUser } from "./helpers";

const BURN = { blister: true, baseColor: "merah_muda_pucat", painful: true, palms: "kurang_1", degree: "d2s" };

describe("kedalaman dan luka bakar (M4)", () => {
  it("menyimpan lapisan perkiraan dan penilaian luka bakar", async () => {
    const { token } = await registerUser();
    const wound = await createWound(token, { ...WOUND, type: "bakar", depthLayer: "dermis_atas", burn: BURN });
    expect(wound).toMatchObject({ depthLayer: "dermis_atas", burn: BURN });
    const list = await call("/wounds", { token });
    expect(list.json.data[0]).toMatchObject({ depthLayer: "dermis_atas", burn: BURN });
  });

  it("luka selain luka bakar tidak menyimpan penilaian luka bakar", async () => {
    const { token } = await registerUser();
    const wound = await createWound(token, { ...WOUND, type: "lecet", depthLayer: "epidermis", burn: BURN });
    expect(wound).toMatchObject({ depthLayer: "epidermis", burn: null });
  });

  it("derajat boleh kosong bila warna dasar belum diketahui", async () => {
    const { token } = await registerUser();
    const burn = { ...BURN, baseColor: "tidak_yakin", degree: null };
    const wound = await createWound(token, { ...WOUND, type: "bakar", depthLayer: "tidak_diketahui", burn });
    expect(wound.burn).toEqual(burn);
  });

  it("menolak nilai di luar pilihan", async () => {
    const { token } = await registerUser();
    for (const bad of [
      { depthLayer: "tulang" },
      { burn: { ...BURN, baseColor: "ungu" } },
      { burn: { ...BURN, palms: 3 } },
      { burn: { ...BURN, degree: 2 } },
      { burn: "derajat 2" },
    ]) {
      const res = await call("/wounds", { method: "POST", token, body: { ...WOUND, type: "bakar", ...bad } });
      expect(res.status, JSON.stringify(bad)).toBe(422);
    }
  });
});
