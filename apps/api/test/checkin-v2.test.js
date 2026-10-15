import { describe, expect, it } from "vitest";
import { CHECKIN, WOUND, call, createWound, registerUser } from "./helpers";

const V2 = {
  schema: 2,
  pain: 4,
  bedColors: ["merah", "kuning"],
  fluid: "kuning_tipis",
  newOdor: true,
  skin: ["lebih_hangat", "keras"],
  spread: "di_dalam_garis",
  fever: false,
  burnWorse: false,
  dressingChanged: true,
  note: "Tepi luka gatal",
  assessment: { level: "hari_ini", reasons: ["bau"] },
};

const post = (token, id, body) => call(`/wounds/${id}/examinations`, { method: "POST", token, body });

describe("catatan harian versi 2", () => {
  it("menyimpan dan mengembalikan semua isian versi 2", async () => {
    const { token } = await registerUser();
    const wound = await createWound(token);
    const res = await post(token, wound.id, V2);
    expect(res.status).toBe(201);
    const { photo, id, at, ...saved } = res.json.data.checkins[0];
    expect({ photo, id: Boolean(id), at: Boolean(at) }).toEqual({ photo: null, id: true, at: true });
    expect(saved).toEqual(V2);
  });

  it("menolak nilai di luar pilihan", async () => {
    const { token } = await registerUser();
    const wound = await createWound(token);
    for (const bad of [{ fluid: "nanah" }, { bedColors: ["ungu"] }, { skin: "lebih_hangat" }, { spread: "jauh" }, { assessment: { level: "darurat" } }]) {
      const res = await post(token, wound.id, { ...V2, ...bad });
      expect(res.status, JSON.stringify(bad)).toBe(422);
    }
  });

  it("catatan tahap 1 dan versi 2 bisa bercampur di satu luka", async () => {
    const { token } = await registerUser();
    const wound = await createWound(token);
    await post(token, wound.id, CHECKIN);
    const res = await post(token, wound.id, { ...V2, spread: "melewati_garis" });
    const [v1, v2] = res.json.data.checkins;
    expect(v1).toMatchObject({ redness: "tidak", fluid: "tidak", swelling: false });
    expect(v1).not.toHaveProperty("schema");
    expect(v2).toMatchObject({ schema: 2, spread: "melewati_garis" });
  });

  it("menyimpan faktor risiko dan rencana pemulihan luka", async () => {
    const { token } = await registerUser();
    const wound = await createWound(token, {
      ...WOUND,
      risk: { perokok: true, imunLemah: false, lain: "abaikan" },
      healing: { rowId: "lecet-ringan", checkByDays: 7, evidence: "A" },
      contentVersion: "2026-10",
    });
    expect(wound).toMatchObject({
      risk: { perokok: true, imunLemah: false },
      healing: { rowId: "lecet-ringan", checkByDays: 7, evidence: "A" },
      contentVersion: "2026-10",
    });
    const patched = await call(`/wounds/${wound.id}`, { method: "PATCH", token, body: { risk: { imunLemah: true } } });
    expect(patched.json.data.risk).toEqual({ perokok: false, imunLemah: true });
    const bad = await call("/wounds", { method: "POST", token, body: { ...WOUND, healing: { rowId: "x", checkByDays: 0, evidence: "A" } } });
    expect(bad.status).toBe(422);
  });

  it("ekspor data memuat isian versi 2", async () => {
    const { token } = await registerUser();
    const wound = await createWound(token);
    await post(token, wound.id, V2);
    const exp = await call("/me/export", { token });
    expect(exp.json.data.wounds[0].checkins[0]).toMatchObject({ schema: 2, bedColors: ["merah", "kuning"], newOdor: true });
  });
});
