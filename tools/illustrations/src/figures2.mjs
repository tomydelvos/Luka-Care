import { C, f, rng, text, blobPath } from "./lib.mjs";

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Instrument Sans, sans-serif"><rect width="${w}" height="${h}" fill="${C.bg}" />${body}</svg>`;

function patch(id, x, y, w, h, tone = "base") {
  const light = tone === "dark" ? "#9A6744" : C.skinLight;
  const base = tone === "dark" ? "#7E5134" : C.skin;
  return {
    defs: `<radialGradient id="${id}-g" cx="45%" cy="40%" r="80%"><stop offset="0%" stop-color="${light}" /><stop offset="100%" stop-color="${base}" /></radialGradient>
      <clipPath id="${id}-c"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" /></clipPath>`,
    base: `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="url(#${id}-g)" />`,
    clip: `${id}-c`,
  };
}

/* ------------------------------------------------ Warna dasar luka */
export function warnaDasar() {
  const W = 1200;
  const H = 690;
  let defs = "";
  let body = "";
  const tiles = [
    { name: "Hitam", what: "Jaringan mati (eskar)", stage: "Penyembuhan belum mulai.\nSelalu periksakan." },
    { name: "Kuning", what: "Jaringan mati lunak (slough)", stage: "Luka masih perlu\ndibersihkan tenaga kesehatan." },
    { name: "Merah", what: "Jaringan granulasi", stage: "Luka sedang terisi\ndari dasarnya." },
    { name: "Merah muda", what: "Kulit baru (epitelisasi)", stage: "Luka sedang menutup.\nMasih rapuh." },
  ];
  body += text(60, 50, "Empat warna tahap penyembuhan", { size: 19, weight: 700, color: C.ink });
  tiles.forEach((t, i) => {
    const x = 60 + i * 275;
    const y = 74;
    const w = 255;
    const h = 170;
    const p = patch(`t${i}`, x, y, w, h);
    defs += p.defs;
    const cx = x + w / 2;
    const cy = y + h / 2;
    const r = rng(40 + i);
    let wound = "";
    const outer = blobPath(cx, cy, 82, 52, 50 + i, 14, 0.16);
    defs += `<clipPath id="w${i}"><path d="${outer}" /></clipPath>`;
    if (i === 0) {
      let cracks = "";
      for (let k = 0; k < 9; k += 1) {
        const sx = cx - 60 + r() * 120;
        const sy = cy - 30 + r() * 60;
        cracks += `<path d="M${f(sx)} ${f(sy)} l ${f(10 + r() * 18)} ${f(-8 + r() * 16)} l ${f(8 + r() * 12)} ${f(-6 + r() * 12)}" stroke="#5C4A40" stroke-width="1.6" fill="none" />`;
      }
      wound = `<path d="${outer}" fill="${C.red}" opacity="0.35" transform="translate(0 0) scale(1)" />
        <path d="${blobPath(cx, cy, 74, 46, 60, 14, 0.16)}" fill="#2A201C" stroke="#4A3A32" stroke-width="2" />
        <g clip-path="url(#w${i})">${cracks}</g>`;
    } else if (i === 1) {
      let strands = "";
      for (let k = 0; k < 16; k += 1) {
        const sx = cx - 70 + r() * 140;
        const sy = cy - 34 + r() * 68;
        strands += `<path d="M${f(sx)} ${f(sy)} q 12 ${f(-6 + r() * 12)} ${f(22 + r() * 14)} ${f(-4 + r() * 8)}" stroke="#C9A64E" stroke-width="${f(2 + r() * 2)}" fill="none" stroke-linecap="round" />`;
      }
      wound = `<path d="${outer}" fill="${C.raw}" />
        <path d="${blobPath(cx, cy, 70, 42, 61, 14, 0.2)}" fill="#E6CD7E" />
        <g clip-path="url(#w${i})">${strands}</g>`;
    } else if (i === 2) {
      let gran = "";
      for (let k = 0; k < 70; k += 1) {
        const gx = cx - 75 + r() * 150;
        const gy = cy - 45 + r() * 90;
        gran += `<circle cx="${f(gx)}" cy="${f(gy)}" r="${f(3 + r() * 3.5)}" fill="${r() > 0.5 ? "#D24B55" : "#B32E3A"}" />`;
      }
      wound = `<path d="${outer}" fill="#C23642" />
        <g clip-path="url(#w${i})">${gran}<ellipse cx="${cx - 20}" cy="${cy - 16}" rx="26" ry="8" fill="#FFFFFF" opacity="0.35" /></g>`;
    } else {
      wound = `<path d="${outer}" fill="#EDB2AC" />
        <path d="${blobPath(cx, cy, 40, 22, 62, 12, 0.2)}" fill="#D2575F" />
        <path d="${outer}" fill="none" stroke="#F6CFC9" stroke-width="10" opacity="0.8" />
        <ellipse cx="${cx - 30}" cy="${cy - 18}" rx="22" ry="6" fill="#FFFFFF" opacity="0.45" />`;
    }
    body += `${p.base}<g clip-path="url(#${p.clip})">${wound}</g>`;
    body += text(x, y + h + 36, t.name, { size: 22, weight: 700, color: C.ink });
    body += text(x, y + h + 60, t.what, { size: 15, weight: 600, color: C.inkSoft });
    body += text(x, y + h + 84, t.stage, { size: 15, color: C.muted });
  });
  // arrow: arah penyembuhan
  const ay = 400;
  body += `<line x1="60" x2="1120" y1="${ay}" y2="${ay}" stroke="${C.pine}" stroke-width="4" stroke-linecap="round" />
    <path d="M1126 ${ay} l -16 -10 v 20 Z" fill="${C.pine}" />
    ${text(60, ay + 30, "Arah penyembuhan. Warna terburuk yang masih ada menentukan tahap luka.", { size: 15, weight: 600, color: C.pine })}`;

  // warning row
  const wy = 480;
  body += text(60, wy, "Bukan tahap, tetapi tanda bahaya", { size: 19, weight: 700, color: C.alert });
  const warns = [
    { tone: "base", title: "Hijau, keruh, kental,\natau berbau", act: "Infeksi. Periksakan hari ini." },
    { tone: "base", title: "Kemerahan meluas\nmelewati garis pulpen", act: "Infeksi menyebar. Hari ini;\nIGD bila demam." },
    { tone: "dark", title: "Di kulit sawo matang gelap,\nperadangan bisa keunguan", act: "Raba: lebih hangat, tegang,\natau makin nyeri?" },
  ];
  warns.forEach((wn, i) => {
    const x = 60 + i * 366;
    const y = wy + 22;
    const w = 150;
    const h = 150;
    const p = patch(`wn${i}`, x, y, w, h, wn.tone);
    defs += p.defs;
    const cx = x + w / 2;
    const cy = y + h / 2;
    let art = "";
    if (i === 0) {
      art = `<ellipse cx="${cx}" cy="${cy}" rx="58" ry="44" fill="${C.red}" opacity="0.35" />
        <ellipse cx="${cx}" cy="${cy}" rx="40" ry="20" fill="${C.raw}" />
        <path d="${blobPath(cx - 6, cy, 26, 13, 70, 9, 0.3)}" fill="#A9B84E" stroke="#7F8C33" stroke-width="1.5" />
        <path d="${blobPath(cx + 18, cy + 6, 12, 7, 71, 8, 0.3)}" fill="${C.pus}" stroke="${C.pusLine}" stroke-width="1.5" />`;
    } else if (i === 1) {
      art = `<path d="${blobPath(cx + 6, cy + 4, 66, 58, 72, 12, 0.18)}" fill="${C.red}" opacity="0.55" />
        <path d="${blobPath(cx, cy, 44, 36, 73, 12, 0.14)}" fill="none" stroke="${C.pen}" stroke-width="2.5" stroke-dasharray="7 5" />
        <ellipse cx="${cx}" cy="${cy}" rx="22" ry="10" fill="${C.raw}" />`;
    } else {
      art = `<path d="${blobPath(cx, cy, 60, 50, 74, 12, 0.16)}" fill="#4B2C3E" opacity="0.55" />
        <path d="${blobPath(cx, cy, 40, 32, 75, 12, 0.16)}" fill="#3E2234" opacity="0.4" />
        <ellipse cx="${cx}" cy="${cy}" rx="22" ry="10" fill="${C.raw}" />`;
    }
    body += `${p.base}<g clip-path="url(#${p.clip})">${art}</g>`;
    body += text(x + w + 18, y + 40, wn.title, { size: 16, weight: 700, color: C.ink });
    body += text(x + w + 18, y + 98, wn.act, { size: 15, color: C.alert, weight: 600 });
  });
  return svg(W, H, `<defs>${defs}</defs>${body}`);
}

/* ------------------------------------------- Waktu pulih per lapisan */
export function waktuLapisan() {
  const W = 1200;
  const H = 720;
  const top = 120;
  const rowH = 100;
  const bx0 = 60;
  const bx1 = 330;
  const cx0 = 390;
  const cx1 = 1140;
  const ln = (d) => Math.log(d);
  const X = (d) => cx0 + ((ln(d) - ln(1)) / (ln(90) - ln(1))) * (cx1 - cx0);
  const rows = [
    { name: "Epidermis", fill: C.epi, label: "3–7 hari, tanpa bekas", ex: "Lecet ringan, luka bakar merah tanpa lepuh", from: 3, to: 7, tone: "pine" },
    { name: "Dermis atas", fill: C.dermis, label: "1–2 minggu, paling lama ±3 minggu", ex: "Lecet lebar, sayatan kecil, luka bakar melepuh", from: 7, to: 14, tail: 21, tone: "pine" },
    { name: "Dermis dalam", fill: "#E2AE99", label: "Lebih dari 3 minggu, berisiko parut tebal", ex: "Luka bakar belang atau pucat, nyeri berkurang", from: 21, to: 56, arrow: true, tone: "alert" },
    { name: "Lemak", fill: "#EDD08F", label: "Berminggu-minggu sampai berbulan-bulan bila tidak dijahit", ex: "Luka robek menganga, lemak kuning terlihat", from: 14, to: 84, dashed: true, arrow: true, tone: "alert" },
    { name: "Otot", fill: C.muscle, label: "Bergantung pada operasi. Langsung ke IGD.", ex: "Luka tusuk dalam, luka robek berat", tone: "alert", none: true },
  ];
  let defs = `<clipPath id="blk"><rect x="${bx0}" y="${top}" width="${bx1 - bx0}" height="${rowH * rows.length}" rx="18" /></clipPath>`;
  let body = text(60, 50, "Perkiraan waktu pulih menurut lapisan kulit yang rusak", { size: 19, weight: 700, color: C.ink });
  body += text(60, 78, "Garis hijau: umumnya bisa dirawat di rumah. Garis merah: perlu tenaga kesehatan.", { size: 15, color: C.muted });

  // axis
  const ticks = [
    [1, "1 hari"],
    [3, "3 hari"],
    [7, "1 mgg"],
    [14, "2 mgg"],
    [21, "3 mgg"],
    [30, "1 bln"],
    [60, "2 bln"],
    [90, "3 bln"],
  ];
  for (const [d, l] of ticks) {
    const x = X(d);
    body += `<line x1="${f(x)}" x2="${f(x)}" y1="${top - 6}" y2="${top + rowH * rows.length}" stroke="${C.line}" stroke-width="1.4" />`;
    body += text(f(x), top - 14, l, { size: 13.5, weight: 600, color: C.muted, anchor: "middle" });
  }

  // block
  let block = "";
  const r = rng(9);
  rows.forEach((row, i) => {
    const y = top + i * rowH;
    block += `<rect x="${bx0}" y="${y}" width="${bx1 - bx0}" height="${rowH}" fill="${row.fill}" />`;
    if (row.name === "Lemak") {
      for (let k = 0; k < 4; k += 1) for (let c = 0; c < 9; c += 1) block += `<ellipse cx="${bx0 + 14 + c * 32 + (k % 2) * 16}" cy="${y + 14 + k * 24}" rx="14" ry="11" fill="${C.fat}" stroke="${C.fatLine}" stroke-width="1.2" />`;
    }
    if (row.name === "Otot") {
      for (let yy = y + 8; yy < y + rowH; yy += 9) block += `<line x1="${bx0}" x2="${bx1}" y1="${yy}" y2="${yy}" stroke="${C.muscleLine}" stroke-width="1.3" opacity="0.6" />`;
    }
    if (row.name.startsWith("Dermis")) {
      for (let k = 0; k < 5; k += 1) {
        const fy = y + 14 + r() * (rowH - 28);
        const fx = bx0 + r() * 160;
        block += `<path d="M${f(fx)} ${f(fy)} q 20 -6 40 0 t 40 0" stroke="${C.dermisLine}" stroke-width="1.2" fill="none" opacity="0.7" />`;
      }
    }
    if (i > 0) block += `<line x1="${bx0}" x2="${bx1}" y1="${y}" y2="${y}" stroke="${i === 2 ? "#C98F7C" : "#FFFFFF"}" stroke-width="${i === 2 ? 2 : 2.5}" stroke-dasharray="${i === 2 ? "6 5" : ""}" opacity="0.9" />`;
    const labelColor = row.name === "Otot" ? "#FFFFFF" : C.ink;
    body += "";
    block += `<rect x="${bx0 + 14}" y="${y + rowH / 2 - 17}" width="${row.name.length * 10.5 + 22}" height="32" rx="10" fill="${row.name === "Otot" ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.78)"}" />`;
    block += text(bx0 + 25, y + rowH / 2 + 6, row.name, { size: 17, weight: 700, color: labelColor });
  });
  body += `<g clip-path="url(#blk)">${block}</g>`;

  // bars
  rows.forEach((row, i) => {
    const y = top + i * rowH;
    const yc = y + 34;
    const color = row.tone === "alert" ? C.alert : C.pine;
    if (!row.none) {
      const x1 = X(row.from);
      const x2 = X(row.to);
      if (row.dashed) {
        body += `<line x1="${f(x1)}" x2="${f(x2)}" y1="${yc}" y2="${yc}" stroke="${color}" stroke-width="14" stroke-dasharray="14 8" />`;
      } else {
        body += `<rect x="${f(x1)}" y="${yc - 8}" width="${f(x2 - x1)}" height="16" rx="8" fill="${color}" />`;
      }
      if (row.tail) body += `<rect x="${f(x2 - 8)}" y="${yc - 8}" width="${f(X(row.tail) - x2 + 8)}" height="16" rx="8" fill="${color}" opacity="0.3" />`;
      if (row.arrow) body += `<path d="M${f(x2 + 6)} ${yc - 12} l 18 12 l -18 12 Z" fill="${color}" />`;
    } else {
      body += `<circle cx="${cx0 + 8}" cy="${yc}" r="8" fill="${color}" />`;
    }
    const tx = row.none ? cx0 + 26 : cx0;
    const ty = y + 70;
    body += text(row.none ? tx : cx0, ty, row.label, { size: 17, weight: 700, color: row.tone === "alert" ? C.alert : C.pine });
    body += text(row.none ? tx : cx0, ty + 21, row.ex, { size: 14, color: C.muted });
  });

  body += text(60, H - 34, "Skala waktu logaritmik. Angka dermis sebagian besar berasal dari data luka bakar (PNPK Kemenkes 2019, AAFP, StatPearls).", { size: 14, color: C.muted });
  return svg(W, H, `<defs>${defs}</defs>${body}`);
}
