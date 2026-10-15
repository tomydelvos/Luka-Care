import { describe, expect, it } from "vitest";
import { checkinWarnings, latestWarnings } from "./checkin";

const calm = { pain: 3, redness: "tidak", fluid: "tidak", swelling: false, fever: false };

describe("checkinWarnings", () => {
  it("catatan tenang tidak memberi tanda", () => {
    expect(checkinWarnings(calm, { ...calm, pain: 4 })).toEqual([]);
    expect(checkinWarnings(null)).toEqual([]);
  });

  it("mengenali kemerahan meluas, nanah, dan demam", () => {
    expect(checkinWarnings({ ...calm, redness: "meluas", fluid: "nanah", fever: true })).toEqual([
      "Kemerahan makin melebar",
      "Keluar cairan keruh atau nanah",
      "Demam",
    ]);
  });

  it("bengkak hanya ditandai bila nyeri bertambah", () => {
    expect(checkinWarnings({ ...calm, swelling: true, pain: 4 }, calm)).toEqual(["Bengkak disertai nyeri yang bertambah"]);
    expect(checkinWarnings({ ...calm, swelling: true }, calm)).toEqual([]);
  });

  it("nyeri naik 3 poin atau lebih ditandai", () => {
    expect(checkinWarnings({ ...calm, pain: 6 }, calm)).toContain("Nyeri naik tajam dibanding catatan sebelumnya");
    expect(checkinWarnings({ ...calm, pain: 5 }, calm)).not.toContain("Nyeri naik tajam dibanding catatan sebelumnya");
  });

  it("latestWarnings membaca dua catatan terakhir", () => {
    expect(latestWarnings({ checkins: [calm, { ...calm, pain: 7 }] })).toEqual(["Nyeri naik tajam dibanding catatan sebelumnya"]);
    expect(latestWarnings({ checkins: [] })).toEqual([]);
  });
});
