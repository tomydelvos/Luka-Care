import { C, S, f, rng, text, callout, frame, skinPatch, section, cavity, depthBracket, blobPath, blister, gauzeRoll } from "./lib.mjs";

const W = 1200;
const H = 690;
const titles = { leftTitle: "Tampak atas", rightTitle: "Penampang kulit" };

function sectionFig({ id, seed, sectionOpts = {}, top, sectionArt, footer, tone = "pine", extraDefs = "" }) {
  const p = skinPatch({ seed, id: `${id}p` });
  const s = section({ id: `${id}s`, seed: seed + 3, ...sectionOpts });
  const topArt = top(p);
  const secArt = sectionArt(s);
  const body = `<defs>${p.defs}${s.defs}${extraDefs}${topArt.defs ?? ""}${secArt.defs ?? ""}</defs>
    ${p.base}
    <g clip-path="url(#${p.clip})">${topArt.art}</g>
    ${s.layers}
    ${secArt.art}
    ${s.labels}
    ${topArt.callouts ?? ""}
    ${secArt.callouts ?? ""}`;
  return frame(W, H, body, { ...titles, footer, footerTone: tone });
}

/* ---------------------------------------------------------------- 1 Lecet */
export function lecet() {
  return sectionFig({
    id: "lecet",
    seed: 11,
    footer: "Kedalaman: epidermis sampai dermis bagian atas. Umumnya bisa dirawat di rumah.",
    top: () => {
      const r = rng(31);
      const area = blobPath(320, 330, 155, 92, 5, 16, 0.2);
      let streaks = "";
      for (let i = -12; i < 14; i += 1) {
        const y = 330 + i * 9 + (r() - 0.5) * 4;
        streaks += `<path d="M150 ${f(y + 40)} L 500 ${f(y - 50)}" stroke="${C.rawDark}" stroke-width="${f(1.5 + r() * 2.5)}" opacity="${f(0.35 + r() * 0.45)}" />`;
      }
      let dots = "";
      for (let i = 0; i < 46; i += 1) {
        const x = 200 + r() * 240;
        const y = 270 + r() * 120;
        dots += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(1.4 + r() * 2.4)}" fill="${C.blood}" opacity="${f(0.6 + r() * 0.4)}" />`;
      }
      const gravel = [
        [398, 352, 7],
        [412, 338, 4],
        [252, 312, 5],
        [355, 296, 4],
        [430, 362, 3.5],
      ]
        .map(([x, y, s]) => `<path d="M${x - s} ${y} L${x - s * 0.2} ${y - s} L${x + s} ${y - s * 0.3} L${x + s * 0.6} ${y + s * 0.8} L${x - s * 0.5} ${y + s * 0.9} Z" fill="${C.gravel}" stroke="#55524C" stroke-width="1" />`)
        .join("");
      return {
        defs: `<clipPath id="lecet-area"><path d="${area}" /></clipPath>`,
        art: `<path d="${blobPath(320, 330, 190, 122, 6, 14, 0.15)}" fill="${C.red}" opacity="0.17" />
          <path d="${area}" fill="${C.raw}" />
          <g clip-path="url(#lecet-area)">${streaks}${dots}</g>
          <path d="${area}" fill="none" stroke="#EBA48F" stroke-width="6" opacity="0.75" />
          ${gravel}`,
        callouts:
          callout(300, 318, 92, 128, "Goresan sejajar\narah tergesek") +
          callout(400, 352, 372, 524, "Kerikil dan pasir") +
          callout(240, 360, 92, 524, "Bintik darah"),
      };
    },
    sectionArt: (s) => {
      const d = "M770 200 C 780 222, 800 231, 830 230 S 880 236, 905 232 S 948 226, 962 200 Z";
      const gravel = [
        [836, 224, 5],
        [902, 226, 6],
      ]
        .map(([x, y, sz]) => `<path d="M${x - sz} ${y} L${x} ${y - sz} L${x + sz} ${y - 1} L${x + sz * 0.5} ${y + sz * 0.7} L${x - sz * 0.6} ${y + sz * 0.6} Z" fill="${C.gravel}" stroke="#55524C" stroke-width="1" />`)
        .join("");
      return {
        art: `${cavity(d, s)}
          <g clip-path="url(#${s.blockClip})">
            <circle cx="800" cy="226" r="3" fill="${C.blood}" /><circle cx="860" cy="231" r="3.5" fill="${C.blood}" /><circle cx="940" cy="222" r="3" fill="${C.blood}" />
          </g>
          ${gravel}
          ${depthBracket(234, null)}`,
        callouts: callout(902, 224, 960, 120, "Kotoran menempel", { anchor: "middle" }),
      };
    },
  });
}

/* -------------------------------------------------------------- 2 Sayatan */
function lens(x1, y1, x2, y2, half) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const len = Math.hypot(x2 - x1, y2 - y1);
  const nx = -(y2 - y1) / len;
  const ny = (x2 - x1) / len;
  return `M${x1} ${y1} Q ${f(mx + nx * half * 2)} ${f(my + ny * half * 2)} ${x2} ${y2} Q ${f(mx - nx * half * 2)} ${f(my - ny * half * 2)} ${x1} ${y1} Z`;
}

export function sayatan() {
  return sectionFig({
    id: "sayatan",
    seed: 12,
    footer: "Kedalaman: menembus epidermis sampai dermis. Tepi rapat, biasanya menutup sendiri.",
    top: () => ({
      art: `<path d="${lens(170, 410, 470, 250, 9)}" fill="${C.raw}" opacity="0.55" />
        <path d="${lens(172, 409, 468, 251, 5.5)}" fill="${C.blood}" />
        <path d="M342 322 q 5 14 2 34 q -2 10 -7 2 q -3 -16 5 -36 Z" fill="${C.blood}" />
        <circle cx="262" cy="363" r="5" fill="${C.blood}" />
        <circle cx="402" cy="288" r="4" fill="${C.blood}" />`,
      callouts: callout(222, 382, 92, 128, "Tepi lurus dan rapat") + callout(342, 352, 300, 524, "Darah merembes di\nsepanjang garis"),
    }),
    sectionArt: (s) => {
      const d = "M850 200 L 858 207 L 864 294 L 867 299 L 870 294 L 876 207 L 884 200 Z";
      return {
        defs: `<clipPath id="say-cav"><path d="${d}" /></clipPath>`,
        art: `${cavity(d, s, { width: 3 })}
          <g clip-path="url(#say-cav)"><rect x="840" y="244" width="60" height="70" fill="${C.blood}" /></g>
          <ellipse cx="867" cy="199" rx="15" ry="4" fill="${C.blood}" />
          ${depthBracket(299, null)}`,
        callouts: callout(870, 270, 960, 120, "Celah sempit", { anchor: "middle" }),
      };
    },
  });
}

/* --------------------------------------------------- 3 Luka bakar ringan */
export function bakarRingan() {
  return sectionFig({
    id: "bakar",
    seed: 13,
    footer: "Derajat 1 hanya di epidermis. Derajat 2 superfisial sampai dermis atas dan memunculkan lepuh.",
    sectionOpts: {
      lift: (x) => (x > 800 && x < 924 ? 30 * Math.pow(Math.sin((Math.PI * (x - 800)) / 124), 0.8) : 0),
    },
    top: () => ({
      defs: `<radialGradient id="bakar-red" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${C.red}" stop-opacity="0.75" />
          <stop offset="70%" stop-color="${C.red}" stop-opacity="0.45" />
          <stop offset="100%" stop-color="${C.red}" stop-opacity="0" />
        </radialGradient>`,
      art: `<path d="${blobPath(320, 330, 205, 150, 9, 12, 0.14)}" fill="url(#bakar-red)" />
        <path d="${blobPath(310, 335, 120, 82, 10, 12, 0.18)}" fill="${C.red}" opacity="0.3" />
        <defs>${""}</defs>
        ${blister(296, 322, 50, 34, "bb1")}
        ${blister(376, 360, 26, 20, "bb2")}
        ${blister(240, 372, 17, 13, "bb3")}`,
      callouts: callout(440, 250, 352, 116, "Merah dan nyeri\n(derajat 1)") + callout(290, 312, 92, 512, "Lepuh berisi cairan bening\n(derajat 2 superfisial)"),
    }),
    sectionArt: (s) => ({
      defs: `<radialGradient id="bakar-sec" cx="855" cy="200" r="230" gradientUnits="userSpaceOnUse" gradientTransform="translate(855 200) scale(1 0.5) translate(-855 -200)">
          <stop offset="0%" stop-color="${C.red}" stop-opacity="0.6" />
          <stop offset="100%" stop-color="${C.red}" stop-opacity="0" />
        </radialGradient>`,
      art: `<g clip-path="url(#${s.blockClip})"><g clip-path="url(#${s.below})"><rect x="${S.x0}" y="150" width="${S.x1 - S.x0}" height="160" fill="url(#bakar-sec)" /></g></g>
        ${depthBracket(262, null)}`,
      callouts: callout(862, 192, 960, 112, "Lepuh: epidermis\nterangkat cairan", { anchor: "middle" }),
    }),
  });
}

/* ---------------------------------------------------------------- 4 Lepuh */
export function lepuh() {
  return sectionFig({
    id: "lepuh",
    seed: 14,
    footer: "Kedalaman: cairan terkumpul di antara epidermis dan dermis. Kulit di atasnya melindungi luka.",
    sectionOpts: {
      lift: (x) => (x > 770 && x < 960 ? 44 * Math.pow(Math.sin((Math.PI * (x - 770)) / 190), 0.7) : 0),
    },
    top: () => ({
      art: `<ellipse cx="320" cy="330" rx="170" ry="128" fill="${C.red}" opacity="0.16" />
        ${blister(320, 330, 128, 92, "lb1")}`,
      callouts: callout(285, 278, 92, 128, "Kulit lepuh utuh\nmelindungi dari kuman") + callout(448, 350, 352, 524, "Kemerahan tipis di tepi"),
    }),
    sectionArt: () => ({
      art: depthBracket(226, null),
      callouts: callout(865, 200, 960, 112, "Cairan bening", { anchor: "middle" }),
    }),
  });
}

/* ---------------------------------------------------- 5 Luka robek/menganga */
function jagged(x1, y1, x2, y2, maxHalf, seed, n = 30) {
  const r = rng(seed);
  const len = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const nx = -uy;
  const ny = ux;
  const upper = [];
  const lower = [];
  for (let i = 0; i <= n; i += 1) {
    const t = i / n;
    const w = maxHalf * Math.pow(Math.sin(Math.PI * t), 0.75);
    const zz = i % 2 ? 1 : -1;
    const ju = w + zz * 2.2 * Math.sin(Math.PI * t) + (r() - 0.5) * 9 * Math.sin(Math.PI * t);
    const jl = w * 0.85 - zz * 2.2 * Math.sin(Math.PI * t) + (r() - 0.5) * 9 * Math.sin(Math.PI * t);
    const px = x1 + ux * len * t;
    const py = y1 + uy * len * t;
    upper.push([px + nx * ju, py + ny * ju]);
    lower.push([px - nx * jl, py - ny * jl]);
  }
  const pts = [...upper, ...lower.reverse()];
  return pts.map((p, i) => `${i ? "L" : "M"}${f(p[0])} ${f(p[1])}`).join(" ") + " Z";
}

export function robek() {
  const r = rng(77);
  let lob = "";
  for (let i = 0; i < 40; i += 1) {
    const x = 200 + r() * 250;
    const y = 270 + r() * 130;
    lob += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(7 + r() * 5)}" fill="${C.fat}" stroke="${C.fatLine}" stroke-width="1.2" />`;
  }
  return sectionFig({
    id: "robek",
    seed: 15,
    tone: "alert",
    footer: "Kedalaman: menembus dermis sampai lemak. Perlu dijahit atau ditutup oleh tenaga kesehatan.",
    top: () => ({
      defs: `<clipPath id="robek-in"><path d="${jagged(185, 395, 455, 262, 40, 4)}" /></clipPath>`,
      art: `<path d="${jagged(170, 402, 470, 255, 62, 3)}" fill="${C.red}" opacity="0.2" />
        <path d="${jagged(178, 398, 462, 258, 52, 3)}" fill="${C.raw}" stroke="#8E5A38" stroke-width="3" />
        <g clip-path="url(#robek-in)"><rect x="150" y="220" width="340" height="220" fill="#EDD08F" />${lob}</g>
        <path d="${jagged(230, 372, 410, 285, 14, 5, 12)}" fill="${C.blood}" />
        <path d="M232 384 q 6 18 2 40 q -3 12 -8 2 q -2 -20 6 -42 Z" fill="${C.blood}" />`,
      callouts: callout(205, 352, 92, 128, "Tepi tidak rata\ndan terbuka") + callout(352, 300, 352, 128, "Tampak lemak kuning") + callout(232, 420, 92, 524, "Darah terus keluar"),
    }),
    sectionArt: (s) => {
      const d = "M788 200 C 800 236, 792 280, 815 328 S 836 408, 860 420 S 906 402, 916 352 S 936 262, 952 200 Z";
      return {
        defs: `<clipPath id="robek-cav"><path d="${d}" /></clipPath>`,
        art: `${cavity(d, s, { width: 3 })}
          <g clip-path="url(#robek-cav)"><rect x="780" y="386" width="190" height="60" fill="${C.blood}" /></g>
          ${depthBracket(420, null, "alert")}`,
        callouts: callout(870, 300, 960, 112, "Celah lebar\nsampai lemak", { anchor: "middle", tone: "alert" }),
      };
    },
  });
}

/* ---------------------------------------------------------------- 6 Tusuk */
export function tusuk() {
  return sectionFig({
    id: "tusuk",
    seed: 16,
    tone: "alert",
    footer: "Kecil di permukaan, tetapi bisa dalam sampai otot. Perlu dicek kebutuhan suntik tetanus.",
    top: () => ({
      art: `<circle cx="320" cy="330" r="30" fill="${C.red}" opacity="0.25" />
        <circle cx="320" cy="330" r="14" fill="${C.rawDark}" />
        <circle cx="320" cy="330" r="8" fill="#3A1418" />
        <path d="M324 340 q 6 16 4 34 q -2 10 -7 1 q -3 -14 3 -35 Z" fill="${C.blood}" />
        <g transform="translate(415 170) rotate(-24)">
          <rect x="0" y="-5" width="150" height="10" rx="2" fill="#8C9095" />
          <rect x="40" y="-5" width="26" height="10" fill="#9A5B2E" opacity="0.8" />
          <rect x="96" y="-5" width="14" height="10" fill="#9A5B2E" opacity="0.7" />
          <path d="M150 -5 L172 0 L150 5 Z" fill="#7B7F84" />
          <rect x="-8" y="-15" width="10" height="30" rx="3" fill="#7B7F84" />
        </g>`,
      callouts: callout(320, 330, 92, 524, "Lubang kecil, mudah dianggap sepele") + callout(470, 150, 300, 108, "Paku berkarat atau kotor"),
    }),
    sectionArt: (s) => {
      const d = "M858 200 L 874 200 L 903 504 L 893 507 Z";
      const r = rng(5);
      let dirt = "";
      for (let i = 0; i < 9; i += 1) dirt += `<circle cx="${f(890 + r() * 18)}" cy="${f(480 + r() * 28)}" r="${f(2 + r() * 2.2)}" fill="#4A3A2C" />`;
      return {
        art: `<g clip-path="url(#${s.blockClip})"><path d="${d}" fill="${C.bloodDark}" /><path d="${d}" fill="none" stroke="${C.rawDark}" stroke-width="2" /></g>
          ${dirt}
          ${depthBracket(507, null, "alert")}`,
        callouts: callout(898, 494, 700, 526, "Kotoran ikut\nmasuk ke dalam", { tone: "alert" }),
      };
    },
  });
}

/* ------------------------------------------------------ 7 Benda tertancap */
export function tertancap() {
  return sectionFig({
    id: "tancap",
    seed: 17,
    tone: "alert",
    footer: "Benda ikut menahan perdarahan. Mencabutnya bisa memicu perdarahan hebat.",
    top: () => ({
      art: `<ellipse cx="322" cy="332" rx="70" ry="56" fill="${C.red}" opacity="0.28" />
        <path d="M300 300 q 40 10 52 40 q -6 26 -36 28 q -24 -14 -16 -68 Z" fill="${C.blood}" opacity="0.8" />
        <path d="M292 248 L 362 272 L 372 352 L 322 396 L 286 340 Z" fill="${C.glass}" stroke="${C.glassLine}" stroke-width="2.5" />
        <path d="M292 248 L 362 272 L 340 296 L 300 284 Z" fill="#E9F6FA" stroke="${C.glassLine}" stroke-width="1.5" />
        <path d="M306 300 L 330 372" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity="0.8" />
        <g transform="rotate(90 200 330)">${gauzeRoll(140, 302, 120, 56)}</g>
        <g transform="rotate(90 448 330)">${gauzeRoll(388, 302, 120, 56)}</g>
        <path d="M200 270 L 448 270 M200 390 L 448 390" stroke="#FFFFFF" stroke-width="10" opacity="0.0" />`,
      callouts: callout(336, 262, 352, 118, "Jangan dicabut", { tone: "alert" }) + callout(200, 380, 92, 524, "Ganjal dengan kasa\ndi kedua sisi"),
    }),
    sectionArt: (s) => ({
      art: `<g clip-path="url(#${s.blockClip})"><ellipse cx="878" cy="204" rx="26" ry="8" fill="${C.blood}" /></g>
        <path d="M842 108 L 912 128 L 900 250 L 886 440 L 862 300 Z" fill="${C.glass}" stroke="${C.glassLine}" stroke-width="2.5" opacity="0.95" />
        <path d="M862 132 L 878 290" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity="0.8" />
        <circle cx="800" cy="178" r="22" fill="${C.gauze}" stroke="${C.gauzeLine}" stroke-width="2" />
        <path d="M800 178 m -12 0 a 12 12 0 1 1 24 0 a 8 8 0 1 1 -16 0" fill="none" stroke="${C.gauzeLine}" stroke-width="1.6" />
        <circle cx="956" cy="178" r="22" fill="${C.gauze}" stroke="${C.gauzeLine}" stroke-width="2" />
        <path d="M956 178 m -12 0 a 12 12 0 1 1 24 0 a 8 8 0 1 1 -16 0" fill="none" stroke="${C.gauzeLine}" stroke-width="1.6" />
        ${depthBracket(440, null, "alert")}`,
      callouts: callout(800, 160, 700, 104, "Gulungan kasa", { anchor: "middle" }),
    }),
  });
}

/* ------------------------------------------------- 8 Gigitan dan cakaran */
export function gigitan() {
  const marks = (cx, cy, rad, a0, a1, n, big) => {
    let out = "";
    for (let i = 0; i < n; i += 1) {
      const a = ((a0 + ((a1 - a0) * i) / (n - 1)) * Math.PI) / 180;
      const x = cx + Math.cos(a) * rad;
      const y = cy + Math.sin(a) * rad;
      const s = big && (i === 0 || i === n - 1) ? 1.5 : 1;
      out += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(10 * s)}" ry="${f(7 * s)}" transform="rotate(${f((a * 180) / Math.PI + 90)} ${f(x)} ${f(y)})" fill="${C.rawDark}" />
        <ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(5 * s)}" ry="${f(3.4 * s)}" transform="rotate(${f((a * 180) / Math.PI + 90)} ${f(x)} ${f(y)})" fill="#3A1418" />`;
    }
    return out;
  };
  return sectionFig({
    id: "gigit",
    seed: 18,
    tone: "alert",
    footer: "Tusukan kecil tetapi dalam dan membawa kuman. Cuci 15 menit, lalu ke puskesmas hari ini.",
    top: () => ({
      art: `<ellipse cx="330" cy="290" rx="150" ry="100" fill="#7B4F7E" opacity="0.2" />
        ${marks(330, 340, 100, 205, 335, 6, true)}
        ${marks(330, 238, 100, 25, 155, 6, true)}
        <path d="M118 488 L 250 410 M128 506 L 262 428 M140 524 L 272 448" stroke="${C.raw}" stroke-width="5" stroke-linecap="round" />
        <path d="M118 488 L 250 410 M128 506 L 262 428 M140 524 L 272 448" stroke="${C.rawDark}" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="10 7" />`,
      callouts: callout(243, 290, 92, 118, "Bekas gigi membentuk\nlengkungan") + callout(262, 428, 332, 520, "Cakaran: garis sejajar"),
    }),
    sectionArt: (s) => {
      const holes = [
        [760, 300],
        [860, 410],
        [962, 330],
      ];
      const r = rng(8);
      let art = "";
      for (const [x, depth] of holes) {
        const d = `M${x - 8} 200 L ${x + 8} 200 L ${x + 2} ${depth} L ${x - 2} ${depth} Z`;
        art += `<path d="${d}" fill="${C.bloodDark}" stroke="${C.rawDark}" stroke-width="2" />`;
        for (let i = 0; i < 6; i += 1) {
          const gx = x - 14 + r() * 28;
          const gy = depth - 18 + r() * 26;
          art += `<rect x="${f(gx)}" y="${f(gy)}" width="9" height="4" rx="2" fill="${C.germ}" transform="rotate(${f(r() * 180)} ${f(gx + 4)} ${f(gy + 2)})" />`;
        }
      }
      return {
        art: `<g clip-path="url(#${s.blockClip})">${art}</g>${depthBracket(410, null, "alert")}`,
        callouts: callout(866, 404, 700, 526, "Kuman dari air liur\nikut masuk", { tone: "alert" }),
      };
    },
  });
}

/* ---------------------------------------------------- 9 Luka bakar berat */
export function bakarBerat() {
  const r = rng(91);
  let mottle = "";
  for (let i = 0; i < 26; i += 1) {
    mottle += `<circle cx="${f(230 + r() * 180)}" cy="${f(280 + r() * 100)}" r="${f(6 + r() * 12)}" fill="#C9BBA6" opacity="${f(0.3 + r() * 0.4)}" />`;
  }
  return sectionFig({
    id: "berat",
    seed: 19,
    tone: "alert",
    footer: "Derajat 3: seluruh lapisan kulit rusak. Bisa tidak terasa nyeri karena ujung saraf ikut rusak.",
    sectionOpts: { lift: (x) => (x > 712 && x < 762 ? 14 * Math.sin((Math.PI * (x - 712)) / 50) : 0) },
    top: () => ({
      defs: `<clipPath id="berat-c"><path d="${blobPath(320, 330, 120, 82, 22, 12, 0.2)}" /></clipPath>`,
      art: `<path d="${blobPath(320, 330, 220, 168, 20, 12, 0.12)}" fill="${C.red}" opacity="0.3" />
        <path d="${blobPath(320, 330, 170, 125, 21, 14, 0.14)}" fill="${C.raw}" />
        ${blister(178, 300, 16, 12, "bz1")}${blister(452, 370, 20, 14, "bz2")}${blister(410, 236, 12, 9, "bz3")}
        <path d="${blobPath(320, 330, 120, 82, 22, 12, 0.2)}" fill="${C.leather}" stroke="#B9A88F" stroke-width="2" />
        <g clip-path="url(#berat-c)">${mottle}
          <path d="${blobPath(285, 312, 34, 22, 23, 9, 0.3)}" fill="${C.char}" />
          <path d="${blobPath(360, 352, 24, 16, 24, 9, 0.3)}" fill="${C.char}" />
          <path d="M240 340 l 30 -8 l 22 12 M330 290 l 26 10 l 18 -6" stroke="#8C7A66" stroke-width="2" fill="none" />
        </g>`,
      callouts: callout(320, 312, 92, 118, "Putih, kaku, atau hangus") + callout(196, 380, 92, 524, "Tepi merah dan melepuh"),
    }),
    sectionArt: (s) => {
      let vessels = "";
      for (let x = 790; x < 980; x += 30) vessels += `<circle cx="${x}" cy="${S.derB - 9}" r="4.5" fill="#4A2A26" />`;
      return {
        defs: `<linearGradient id="berat-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${C.char}" />
            <stop offset="12%" stop-color="#6B5446" />
            <stop offset="22%" stop-color="${C.leather}" />
            <stop offset="100%" stop-color="#E2D3BE" />
          </linearGradient>`,
        art: `<g clip-path="url(#${s.blockClip})">
            <rect x="${S.x0}" y="203" width="${S.x1 - S.x0}" height="97" fill="${C.red}" opacity="0.18" />
            <path d="M772 199 L 990 199 L 994 ${S.derB + 4} L 768 ${S.derB + 4} Z" fill="url(#berat-g)" stroke="#A8957C" stroke-width="2" />
            <rect x="768" y="${S.derB + 4}" width="226" height="22" fill="${C.red}" opacity="0.35" />
            ${vessels}
          </g>
          ${depthBracket(346, null, "alert")}`,
        callouts: callout(880, 206, 960, 112, "Kulit mati dan kaku", { anchor: "middle", tone: "alert" }),
      };
    },
  });
}

/* --------------------------------------------------- 10 Luka terinfeksi */
export function infeksi() {
  const bump = (x) => 200 - 26 * Math.exp(-Math.pow((x - 865) / 95, 2));
  const pts = [];
  for (let x = 836; x <= 894; x += 4) pts.push([x, bump(x) + 10 * Math.sin((Math.PI * (x - 836)) / 58)]);
  const cav = `M836 ${f(bump(836))} ` + pts.map(([x, y]) => `L${x} ${f(y)}`).join(" ") + ` L894 ${f(bump(894))} Z`;
  const tissueXs = [];
  for (let x = S.x0; x <= S.x1; x += 5) tissueXs.push(x);
  const tissue = tissueXs.map((x, i) => `${i ? "L" : "M"}${x} ${f(bump(x) + 2)}`).join(" ") + ` L${S.x1} ${S.bot} L${S.x0} ${S.bot} Z`;
  return sectionFig({
    id: "infeksi",
    seed: 20,
    tone: "alert",
    footer: "Infeksi menyebar di dermis: bengkak, panas, nyeri bertambah. Periksakan hari ini.",
    sectionOpts: { surface: bump },
    top: () => ({
      defs: `<radialGradient id="inf-red" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${C.red}" stop-opacity="0.7" />
          <stop offset="75%" stop-color="${C.red}" stop-opacity="0.4" />
          <stop offset="100%" stop-color="${C.red}" stop-opacity="0.08" />
        </radialGradient>`,
      art: `<path d="${blobPath(320, 330, 175, 128, 30, 12, 0.16)}" fill="url(#inf-red)" />
        <g transform="rotate(-16 320 330)">
          <ellipse cx="320" cy="330" rx="74" ry="26" fill="${C.raw}" />
          <ellipse cx="300" cy="328" rx="26" ry="10" fill="${C.scab}" />
          <path d="${blobPath(352, 322, 18, 11, 31, 8, 0.3)}" fill="${C.pus}" stroke="${C.pusLine}" stroke-width="1.5" />
          <path d="${blobPath(270, 340, 12, 8, 32, 8, 0.3)}" fill="${C.pus}" stroke="${C.pusLine}" stroke-width="1.5" />
          <path d="${blobPath(380, 340, 9, 6, 33, 8, 0.3)}" fill="${C.pus}" stroke="${C.pusLine}" stroke-width="1.5" />
        </g>
        <path d="${blobPath(320, 330, 150, 108, 34, 12, 0.12)}" fill="none" stroke="${C.pen}" stroke-width="3" stroke-dasharray="9 7" stroke-linecap="round" />
        ${text(400, 214, "Sen, 08.00", { size: 15, weight: 600, color: C.pen, extra: 'transform="rotate(-12 400 214)"' })}`,
      callouts: callout(354, 314, 92, 118, "Nanah kekuningan", { tone: "alert" }) + callout(196, 392, 92, 512, "Tandai batas kemerahan dengan pulpen.\nKalau melebar, segera periksakan."),
    }),
    sectionArt: (s) => ({
      defs: `<radialGradient id="inf-sec" cx="865" cy="250" r="230" gradientUnits="userSpaceOnUse" gradientTransform="translate(865 250) scale(1 0.6) translate(-865 -250)">
          <stop offset="0%" stop-color="${C.red}" stop-opacity="0.55" />
          <stop offset="100%" stop-color="${C.red}" stop-opacity="0" />
        </radialGradient>`,
      art: `<clipPath id="inf-tissue"><path d="${tissue}" /></clipPath>
        <g clip-path="url(#${s.blockClip})">
          <g clip-path="url(#inf-tissue)"><rect x="${S.x0}" y="150" width="${S.x1 - S.x0}" height="210" fill="url(#inf-sec)" /></g>
          <path d="${cav}" fill="${C.scab}" />
          <ellipse cx="865" cy="270" rx="54" ry="27" fill="${C.pus}" stroke="${C.pusLine}" stroke-width="2" />
          <ellipse cx="850" cy="262" rx="16" ry="6" fill="#F6E7A6" opacity="0.8" />
        </g>
        ${depthBracket(300, null, "alert")}`,
      callouts: callout(890, 270, 960, 108, "Kantong nanah\ndan bengkak", { anchor: "middle", tone: "alert" }),
    }),
  });
}

/* ----------------------------------------------------- Peta kedalaman */
export function petaKedalaman() {
  const H2 = 760;
  const s = section({ id: "peta", seed: 3 });
  const dx = -560;
  const cols = [
    ["Lepuh", 226, "pine"],
    ["Bakar\nderajat 1", 224, "pine"],
    ["Lecet", 234, "pine"],
    ["Bakar\nderajat 2", 268, "pine"],
    ["Sayatan\nkecil", 299, "pine"],
    ["Bakar\nderajat 3", 346, "alert"],
    ["Gigitan", 410, "alert"],
    ["Luka\nrobek", 420, "alert"],
    ["Tusukan", 507, "alert"],
  ];
  const x0 = 640;
  const step = 62;
  let chart = `<line x1="610" x2="1170" y1="${S.surf}" y2="${S.surf}" stroke="${C.ink}" stroke-width="2" />`;
  for (const y of [S.epiB, S.derB, S.fatB]) chart += `<line x1="610" x2="1170" y1="${y}" y2="${y}" stroke="#B9C6BE" stroke-width="1.3" stroke-dasharray="5 5" />`;
  cols.forEach(([name, depth, tone], i) => {
    const cx = x0 + i * step;
    const color = tone === "alert" ? C.alert : C.pine;
    chart += `<path d="M${cx - 14} ${S.surf} H${cx + 14} V${depth - 8} Q ${cx + 14} ${depth} ${cx + 6} ${depth} H${cx - 6} Q ${cx - 14} ${depth} ${cx - 14} ${depth - 8} Z" fill="${color}" />`;
    chart += text(cx, name.includes("\n") ? 160 : 178, name, { size: 13.5, weight: 600, color: C.inkSoft, anchor: "middle" });
  });
  const legend = `<rect x="610" y="606" width="18" height="18" rx="5" fill="${C.pine}" />${text(638, 621, "Umumnya bisa dirawat di rumah", { size: 15, weight: 600, color: C.inkSoft })}
    <rect x="610" y="640" width="18" height="18" rx="5" fill="${C.alert}" />${text(638, 655, "Perlu diperiksa tenaga kesehatan", { size: 15, weight: 600, color: C.inkSoft })}`;
  const body = `<defs>${s.defs}</defs>
    <g transform="translate(${dx} 0)">${s.layers}${s.labels}</g>
    ${chart}${legend}
    ${callout(148, 150, 96, 104, "Rambut")}
    ${callout(430, 300, 300, 104, "Kelenjar keringat")}
    ${callout(132, 332, 96, 612, "Pembuluh darah")}
    ${text(96, 700, "Garis putus-putus di kanan sejajar dengan batas lapisan kulit di kiri.", { size: 14, color: C.muted })}`;
  return frame(W, H2, body, { leftTitle: "Lapisan kulit", rightTitle: "Seberapa dalam tiap jenis luka" });
}

/* ----------------------------------------------------- Derajat luka bakar */
export function derajatBakar() {
  const H2 = 570;
  const blocks = [
    { title: "Derajat 1", sub: "Superfisial", desc: "Merah, kering, nyeri.\nTanpa lepuh.\nPulih dalam 5–10 hari.", tag: "Bisa dirawat di rumah", tone: "pine" },
    { title: "Derajat 2", sub: "Sebagian ketebalan kulit", desc: "Melepuh, basah mengilap,\nsangat nyeri. Yang superfisial\npulih sekitar 3 minggu.", tag: "Kecil: rawat di rumah.\nLuas atau dalam: ke faskes.", tone: "caution" },
    { title: "Derajat 3", sub: "Seluruh ketebalan kulit", desc: "Putih, cokelat, atau hangus.\nKaku seperti kulit kering,\nbisa tidak terasa nyeri.", tag: "Selalu ke rumah sakit", tone: "alert" },
  ];
  const surf = 150;
  const epiB = 170;
  const derB = 270;
  const bot = 350;
  const bw = 320;
  let body = "";
  blocks.forEach((b, i) => {
    const bx = 60 + i * 380;
    const mid = bx + bw / 2;
    const id = `db${i}`;
    let lob = "";
    for (let row = 0; row < 4; row += 1) for (let col = 0; col < 10; col += 1) lob += `<ellipse cx="${bx + 12 + col * 34 + (row % 2) * 17}" cy="${derB + 12 + row * 22}" rx="15" ry="11" fill="${C.fat}" stroke="${C.fatLine}" stroke-width="1.2" />`;
    let epi = `<rect x="${bx}" y="${surf}" width="${bw}" height="${epiB - surf}" fill="${C.epi}" /><line x1="${bx}" x2="${bx + bw}" y1="${surf}" y2="${surf}" stroke="${C.epiTop}" stroke-width="2.2" />`;
    let over = "";
    if (i === 0) {
      over = `<rect x="${bx + 50}" y="${surf}" width="${bw - 100}" height="${epiB - surf}" fill="${C.red}" opacity="0.55" />
        <rect x="${bx + 50}" y="${epiB}" width="${bw - 100}" height="16" fill="${C.red}" opacity="0.18" />`;
    }
    if (i === 1) {
      const a = bx + 80;
      const c = bx + bw - 80;
      epi = `<rect x="${bx}" y="${surf}" width="${a - bx}" height="${epiB - surf}" fill="${C.epi}" />
        <rect x="${c}" y="${surf}" width="${bx + bw - c}" height="${epiB - surf}" fill="${C.epi}" />
        <path d="M${a} ${epiB} Q ${mid} ${epiB - 70} ${c} ${epiB} Z" fill="${C.fluid}" stroke="#E7CFA8" stroke-width="1.2" />
        <path d="M${a} ${surf} Q ${mid} ${surf - 70} ${c} ${surf} L ${c} ${epiB} Q ${mid} ${epiB - 70} ${a} ${epiB} Z" fill="${C.epi}" />
        <path d="M${bx} ${surf} H${a} Q ${mid} ${surf - 70} ${c} ${surf} H${bx + bw}" stroke="${C.epiTop}" stroke-width="2.2" fill="none" />`;
      over = `<rect x="${bx + 40}" y="${epiB}" width="${bw - 80}" height="55" fill="${C.red}" opacity="0.35" />`;
    }
    if (i === 2) {
      over = `<rect x="${bx + 70}" y="${surf - 2}" width="${bw - 140}" height="${derB - surf + 4}" fill="${C.leather}" stroke="#A8957C" stroke-width="2" />
        <rect x="${bx + 70}" y="${surf - 2}" width="${bw - 140}" height="12" fill="${C.char}" />
        <rect x="${bx + 70}" y="${derB + 2}" width="${bw - 140}" height="18" fill="${C.red}" opacity="0.35" />
        <rect x="${bx + 30}" y="${surf}" width="40" height="${epiB - surf + 30}" fill="${C.red}" opacity="0.3" />
        <rect x="${bx + bw - 70}" y="${surf}" width="40" height="${epiB - surf + 30}" fill="${C.red}" opacity="0.3" />`;
    }
    const tagColor = b.tone === "alert" ? C.alert : b.tone === "caution" ? "#9A5A06" : C.pine;
    body += `<clipPath id="${id}"><path d="M${bx} 0 H${bx + bw} V${bot - 16} Q ${bx + bw} ${bot} ${bx + bw - 16} ${bot} H${bx + 16} Q ${bx} ${bot} ${bx} ${bot - 16} Z" /></clipPath>
      ${text(bx, 52, b.title, { size: 24, weight: 700, color: C.ink })}
      ${text(bx, 78, b.sub, { size: 15, weight: 600, color: C.muted })}
      <g clip-path="url(#${id})">
        <rect x="${bx}" y="${derB}" width="${bw}" height="${bot - derB}" fill="#EDD08F" />${lob}
        <rect x="${bx}" y="${epiB}" width="${bw}" height="${derB - epiB}" fill="${C.dermis}" />
        ${epi}${over}
      </g>
      ${text(bx, 392, b.desc, { size: 16, color: C.inkSoft })}
      ${text(bx, 500, b.tag, { size: 16, weight: 700, color: tagColor })}`;
  });
  return frame(W, H2, body, {});
}

/* ----------------------------------------------------- Isi kotak P3K */
const art = {
  bottle: `<rect x="38" y="14" width="20" height="9" rx="3" fill="${C.pine}" /><rect x="41" y="23" width="14" height="10" rx="2" fill="#fff" stroke="${C.inkSoft}" stroke-width="2.2" /><rect x="31" y="33" width="34" height="47" rx="9" fill="#fff" stroke="${C.inkSoft}" stroke-width="2.2" /><rect x="36" y="47" width="24" height="18" rx="3" fill="${C.pineSoft}" /><path d="M48 51c0 0 4 4.5 4 7a4 4 0 0 1-8 0c0-2.5 4-7 4-7z" fill="${C.pine}" />`,
  gauze: `<rect x="20" y="20" width="56" height="56" rx="6" fill="#fff" stroke="${C.inkSoft}" stroke-width="2.2" />${[28, 36, 44, 52, 60, 68].map((v) => `<path d="M${v} 22v52M22 ${v}h52" stroke="${C.inkSoft}" stroke-width="1" opacity="0.35" />`).join("")}`,
  pad: `<rect x="18" y="18" width="60" height="60" rx="14" fill="#fff" stroke="${C.inkSoft}" stroke-width="2.2" /><rect x="31" y="31" width="34" height="34" rx="8" fill="#E1F4EA" stroke="#22865F" stroke-width="2" />`,
  plaster: `<g transform="rotate(-28 48 48)"><rect x="12" y="35" width="72" height="26" rx="13" fill="#E9BE93" /><rect x="36" y="35" width="24" height="26" fill="#F8EADB" />${[[21, 43], [21, 53], [27, 48], [75, 43], [75, 53], [69, 48]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="#C98F5C" />`).join("")}</g>`,
  tape: `<circle cx="48" cy="48" r="30" fill="#fff" stroke="${C.inkSoft}" stroke-width="2.2" /><circle cx="48" cy="48" r="16" fill="#F5F7F4" stroke="${C.inkSoft}" stroke-width="2.2" /><path d="M78 48 L 88 70 L 70 74 Z" fill="#fff" stroke="${C.inkSoft}" stroke-width="2" />`,
  roll: `<rect x="18" y="26" width="52" height="44" rx="6" fill="#F4F0E6" stroke="${C.inkSoft}" stroke-width="2.2" /><ellipse cx="70" cy="48" rx="10" ry="22" fill="#fff" stroke="${C.inkSoft}" stroke-width="2.2" /><ellipse cx="70" cy="48" rx="4" ry="9" fill="#E6E1D4" /><path d="M30 26v44M42 26v44M54 26v44" stroke="${C.inkSoft}" stroke-width="1" opacity="0.3" />`,
  glove: `<path d="M30 82 V52 L24 34 a5 5 0 0 1 9 -3 L40 46 V20 a5 5 0 0 1 10 0 V44 V16 a5 5 0 0 1 10 0 V44 V22 a5 5 0 0 1 10 0 V60 c0 14 -6 22 -14 22 Z" fill="#9CC3E0" stroke="${C.inkSoft}" stroke-width="2.2" stroke-linejoin="round" />`,
  tools: `<path d="M28 18 L46 78 M40 18 L48 78" stroke="${C.inkSoft}" stroke-width="3.5" stroke-linecap="round" /><circle cx="64" cy="66" r="8" fill="none" stroke="${C.pine}" stroke-width="3.5" /><circle cx="80" cy="60" r="8" fill="none" stroke="${C.pine}" stroke-width="3.5" /><path d="M68 59 L58 20 M76 53 L62 20" stroke="${C.inkSoft}" stroke-width="3" stroke-linecap="round" />`,
  tube: `<g transform="rotate(-35 48 48)"><path d="M22 38h40l10 4v12l-10 4H22z" fill="#fff" stroke="${C.inkSoft}" stroke-width="2.2" /><rect x="72" y="42" width="10" height="12" rx="2" fill="${C.pine}" /><rect x="32" y="43" width="22" height="10" rx="2" fill="#E9BE93" /></g>`,
};

export function p3k() {
  const items = [
    ["gauze", "#ECF0EB", "Kasa steril", "Menekan perdarahan\ndan menutup luka"],
    ["pad", "#E1F4EA", "Kasa non-lengket", "Menutup luka basah\natau luka bakar"],
    ["plaster", "#ECF0EB", "Plester luka", "Melindungi luka kecil\ndari gesekan"],
    ["tape", "#ECF0EB", "Plester kertas", "Merekatkan kasa\ndi kulit sehat"],
    ["roll", "#F8EADB", "Perban gulung", "Menahan kasa di\nlengan atau kaki"],
    ["bottle", "#DCEFE7", "NaCl 0,9% steril", "Membilas luka bila\nair bersih terbatas"],
    ["glove", "#E4EEF6", "Sarung tangan", "Melindungi penolong\ndan luka"],
    ["tools", "#ECF0EB", "Pinset dan gunting", "Mengangkat kotoran,\nmemotong kasa"],
    ["tube", "#F8EADB", "Gel luka bakar", "Menyejukkan luka\nbakar ringan setelah\ndialiri air"],
  ];
  let body = "";
  items.forEach(([a, bg, name, use], i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 60 + col * 366;
    const y = 40 + row * 200;
    body += `<rect x="${x}" y="${y}" width="346" height="180" rx="22" fill="#FFFFFF" stroke="${C.line}" stroke-width="1.5" />
      <rect x="${x + 18}" y="${y + 28}" width="124" height="124" rx="18" fill="${bg}" />
      <g transform="translate(${x + 28} ${y + 38}) scale(1.08)">${art[a]}</g>
      ${text(x + 160, y + 66, name, { size: 18, weight: 700, color: C.ink })}
      ${text(x + 160, y + 94, use, { size: 15, color: C.muted })}`;
  });
  return frame(W, 660, body, {});
}

/* ----------------------------------------------------- Sampul */
export function sampul() {
  const body = `<defs>
      <pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="2" fill="#C98F5C" /></pattern>
      <pattern id="grid" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M12 0V12M0 12H12" stroke="#C98F5C" stroke-opacity="0.16" stroke-width="1" /></pattern>
    </defs>
    <rect width="1200" height="560" fill="${C.bg}" />
    <g transform="rotate(-2.5 600 280)">
      <rect x="40" y="96" width="1120" height="360" rx="180" fill="#E9BE93" />
      <rect x="40" y="96" width="1120" height="360" rx="180" fill="url(#dots)" />
      <rect x="250" y="96" width="700" height="360" fill="#F8EADB" />
      <rect x="250" y="96" width="700" height="360" fill="url(#grid)" />
      ${text(300, 196, "LukaCare", { size: 24, weight: 700, color: C.pine })}
      ${text(300, 268, "Buku Panduan", { size: 54, weight: 700, color: C.ink })}
      ${text(300, 332, "Perawatan Luka Luar", { size: 54, weight: 700, color: C.ink })}
      ${text(300, 392, "Edisi pertama, Oktober 2026", { size: 19, weight: 600, color: C.inkSoft })}
      <path d="M870 170 v 46 M847 193 h 46" stroke="${C.pine}" stroke-width="12" stroke-linecap="round" />
    </g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 560" width="1200" height="560" font-family="Instrument Sans, sans-serif">${body}</svg>`;
}
