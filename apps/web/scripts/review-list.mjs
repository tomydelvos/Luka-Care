// Menulis daftar tinjauan klinisi ke docs/tinjauan-klinisi.md. Jalankan: npm run review:list
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { reviewChecklist } from "../src/content/reviewList.js";

const target = fileURLToPath(new URL("../../../docs/tinjauan-klinisi.md", import.meta.url));
const text = reviewChecklist();
await writeFile(target, text);
console.log(`docs/tinjauan-klinisi.md ditulis (${text.split("\n").length} baris).`);
