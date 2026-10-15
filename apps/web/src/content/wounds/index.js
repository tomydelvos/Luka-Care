// Panduan perawatan dasar per jenis luka, satu file per jenis.
// Prinsip: panduan perawatan dan rekomendasi produk dipisah. Panduan tidak
// menyebut merek, dan tidak pernah menyimpulkan diagnosis.
import { block } from "../meta";
import { changeDaily, coverDry, coverWet, washHands } from "./common";
import { lecet } from "./lecet";
import { sayatan } from "./sayatan";
import { bakar } from "./bakar";
import { lepuh } from "./lepuh";

export const WOUND_GUIDES = { lecet, sayatan, bakar, lepuh };

export const WOUND_TYPE_LIST = Object.values(WOUND_GUIDES);

export const COMMON_STEPS = { washHands, changeDaily, coverWet, coverDry };

export const MONITOR_SIGNS = block(
  {
    items: [
      "Kemerahan makin melebar dari tepi luka",
      "Bengkak atau terasa panas",
      "Keluar nanah atau cairan keruh berbau",
      "Nyeri bertambah, bukan berkurang",
      "Demam",
    ],
  },
  { sources: ["kemenkes-infeksi", "medlineplus-wound"], evidence: "A" }
);
