// Shared drawing primitives for the LukaCare wound illustrations.
export const C = {
  bg: "#F5F7F4",
  card: "#FFFFFF",
  ink: "#12312C",
  inkSoft: "#2F4C46",
  muted: "#566B66",
  line: "#D9E1DB",
  pine: "#0E6B58",
  pineSoft: "#DCEFE7",
  alert: "#C8283A",
  alertSoft: "#FBE7E9",
  skin: "#C68A5E",
  skinLight: "#D6A27A",
  skinDark: "#A86F47",
  epi: "#D9A27C",
  epiTop: "#9C6640",
  dermis: "#EDC5B2",
  dermisLine: "#D7A08C",
  fat: "#F6DFAA",
  fatLine: "#E0BC77",
  muscle: "#BC5D57",
  muscleLine: "#9E4743",
  raw: "#D8676A",
  rawDark: "#B03A44",
  blood: "#A61E2B",
  bloodDark: "#6F1520",
  scab: "#6B2B22",
  fluid: "#F8E9CF",
  pus: "#E5C85C",
  pusLine: "#C3A33A",
  red: "#D9433F",
  char: "#3D2F29",
  leather: "#EEE5D6",
  gravel: "#7E7A71",
  glass: "#C9E6EE",
  glassLine: "#7FB0BF",
  gauze: "#FFFFFF",
  gauzeLine: "#C9D3CD",
  pen: "#2C4FA3",
  germ: "#6E8C47",
};

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const f = (n) => Math.round(n * 10) / 10;

// Text helpers ---------------------------------------------------------------
export function text(x, y, s, { size = 16, weight = 400, color = C.inkSoft, anchor = "start", extra = "" } = {}) {
  const lines = String(s).split("\n");
  const lh = size * 1.25;
  const tspans = lines.map((l, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : lh}">${esc(l)}</tspan>`).join("");
  return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}" ${extra}>${tspans}</text>`;
}

export const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

// A label pill with a leader line from (px,py) on the drawing to the pill at (tx,ty).
// The pill rect is sized in the browser after layout (see render.mjs).
export function callout(px, py, tx, ty, label, { anchor = "start", tone = "ink" } = {}) {
  const color = tone === "alert" ? C.alert : tone === "pine" ? C.pine : C.ink;
  return `<g>
    <line x1="${px}" y1="${py}" x2="${tx}" y2="${ty}" stroke="${C.ink}" stroke-width="1.6" />
    <circle cx="${px}" cy="${py}" r="4.5" fill="${C.card}" stroke="${C.ink}" stroke-width="2" />
    <g class="pill" data-anchor="${anchor}" data-x="${tx}" data-y="${ty}">
      <rect fill="${C.card}" stroke="${C.line}" stroke-width="1.2" rx="10" />
      ${text(tx, ty, label, { size: 15, weight: 600, color, anchor })}
    </g>
  </g>`;
}

// Figure frame ---------------------------------------------------------------
export function frame(w, h, body, { leftTitle, rightTitle, footer, footerTone = "pine" } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Instrument Sans, sans-serif">
  <rect width="${w}" height="${h}" fill="${C.bg}" />
  ${leftTitle ? text(60, 50, leftTitle, { size: 17, weight: 700, color: C.muted }) : ""}
  ${rightTitle ? text(640, 50, rightTitle, { size: 17, weight: 700, color: C.muted }) : ""}
  ${body}
  ${footer ? footerBar(w, h, footer, footerTone) : ""}
</svg>`;
}

function footerBar(w, h, s, tone) {
  const color = tone === "alert" ? C.alert : C.pine;
  return `<line x1="60" x2="${w - 60}" y1="${h - 58}" y2="${h - 58}" stroke="${C.line}" stroke-width="1.5" />
  ${text(60, h - 26, s, { size: 18, weight: 600, color })}`;
}

// Top view: a patch of skin ---------------------------------------------------
export function skinPatch({ x = 60, y = 70, w = 520, h = 500, seed = 1, id = "p" } = {}) {
  const r = rng(seed);
  let pores = "";
  for (let i = 0; i < 140; i += 1) {
    const px = x + 16 + r() * (w - 32);
    const py = y + 16 + r() * (h - 32);
    pores += `<circle cx="${f(px)}" cy="${f(py)}" r="${f(0.9 + r() * 1.1)}" fill="${C.skinDark}" opacity="${f(0.25 + r() * 0.25)}" />`;
  }
  let hairs = "";
  for (let i = 0; i < 26; i += 1) {
    const px = x + 20 + r() * (w - 40);
    const py = y + 20 + r() * (h - 40);
    const len = 7 + r() * 7;
    hairs += `<path d="M${f(px)} ${f(py)} q ${f(len * 0.4)} ${f(-len * 0.3)} ${f(len)} ${f(-len * 0.15)}" stroke="#5A3A27" stroke-width="1" fill="none" opacity="0.35" />`;
  }
  let creases = "";
  for (let i = 0; i < 5; i += 1) {
    const cy = y + 60 + i * (h / 5.2) + r() * 20;
    creases += `<path d="M${x} ${f(cy)} C ${f(x + w * 0.3)} ${f(cy - 14 + r() * 28)}, ${f(x + w * 0.65)} ${f(cy - 14 + r() * 28)}, ${x + w} ${f(cy + r() * 10)}" stroke="${C.skinDark}" stroke-width="1.2" fill="none" opacity="0.22" />`;
  }
  return {
    defs: `<clipPath id="${id}-clip"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="34" /></clipPath>
      <radialGradient id="${id}-skin" cx="45%" cy="40%" r="75%">
        <stop offset="0%" stop-color="${C.skinLight}" />
        <stop offset="100%" stop-color="${C.skin}" />
      </radialGradient>`,
    base: `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="34" fill="url(#${id}-skin)" />
      <g clip-path="url(#${id}-clip)">${creases}${pores}${hairs}</g>`,
    clip: `${id}-clip`,
  };
}

// Cross-section ---------------------------------------------------------------
export const S = { x0: 640, x1: 1070, surf: 200, epiB: 224, derB: 340, fatB: 470, bot: 560 };

// Builds the layered skin block. Options:
//  surface(x)  : y of skin surface (default flat)
//  lift(x)     : how far epidermis is lifted off dermis (blister)
//  layers below the epidermis stay fixed so cavities read clearly.
export function section({ id = "s", seed = 7, surface = () => S.surf, lift = () => 0, follicles = true, glands = true } = {}) {
  const r = rng(seed);
  const xs = [];
  for (let x = S.x0; x <= S.x1; x += 4) xs.push(x);
  const top = (x) => surface(x) - lift(x);
  const epiTopPath = xs.map((x, i) => `${i ? "L" : "M"}${x} ${f(top(x))}`).join(" ");
  const epiBottom = (x) => {
    const base = surface(x) + (S.epiB - S.surf) - lift(x);
    return lift(x) > 0.5 ? base : base + Math.sin(x / 9) * 3.2;
  };
  const epiBotPath = [...xs].reverse().map((x) => `L${x} ${f(epiBottom(x))}`).join(" ");
  const dermTop = (x) => surface(x) + (S.epiB - S.surf) + Math.sin(x / 9) * 3.2;
  const dermPath = `M${S.x0} ${f(dermTop(S.x0))} ` + xs.map((x) => `L${x} ${f(dermTop(x))}`).join(" ") + ` L${S.x1} ${S.derB} L${S.x0} ${S.derB} Z`;

  // fluid between lifted epidermis and dermis
  const liftXs = xs.filter((x) => lift(x) > 0.5);
  let fluid = "";
  if (liftXs.length) {
    const a = liftXs.map((x, i) => `${i ? "L" : "M"}${x} ${f(epiBottom(x))}`).join(" ");
    const b = [...liftXs].reverse().map((x) => `L${x} ${f(dermTop(x))}`).join(" ");
    fluid = `<path d="${a} ${b} Z" fill="${C.fluid}" stroke="#E7CFA8" stroke-width="1.2" />`;
  }

  // fat lobules
  let lobules = "";
  for (let row = 0; row < 6; row += 1) {
    for (let col = 0; col < 13; col += 1) {
      const cx = S.x0 + 14 + col * 36 + (row % 2) * 18 + (r() - 0.5) * 6;
      const cy = S.derB + 14 + row * 25 + (r() - 0.5) * 4;
      lobules += `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(16 + r() * 3)}" ry="${f(12 + r() * 2)}" fill="${C.fat}" stroke="${C.fatLine}" stroke-width="1.3" />`;
    }
  }
  let striations = "";
  for (let y = S.fatB + 10; y < S.bot; y += 10) {
    striations += `<path d="M${S.x0} ${y} C ${S.x0 + 140} ${y - 3}, ${S.x0 + 280} ${y + 3}, ${S.x1} ${y}" stroke="${C.muscleLine}" stroke-width="1.4" fill="none" opacity="0.55" />`;
  }
  // dermis fibres and vessels
  let fibres = "";
  for (let i = 0; i < 16; i += 1) {
    const y = 240 + r() * 90;
    const x = S.x0 + r() * (S.x1 - S.x0 - 60);
    fibres += `<path d="M${f(x)} ${f(y)} q 20 -6 40 0 t 40 0" stroke="${C.dermisLine}" stroke-width="1.2" fill="none" opacity="0.6" />`;
  }
  let vessels = "";
  for (let x = S.x0 + 30; x < S.x1 - 10; x += 62) {
    vessels += `<ellipse cx="${x}" cy="${S.derB - 8}" rx="7" ry="4.5" fill="#C23B44" />`;
    vessels += `<ellipse cx="${x + 18}" cy="${S.derB - 6}" rx="6" ry="4" fill="#5E70A8" />`;
  }
  let follicleSvg = "";
  if (follicles) {
    for (const fx of [690, 1036]) {
      const st = surface(fx);
      follicleSvg += `<path d="M${fx - 6} ${st + 20} L${fx - 8} ${S.derB - 30} Q ${fx} ${S.derB - 14} ${fx + 8} ${S.derB - 30} L${fx + 6} ${st + 20} Z" fill="#E3B19B" stroke="${C.dermisLine}" stroke-width="1.2" />
        <path d="M${fx} ${S.derB - 28} L${fx + 2} ${st} Q ${fx + 6} ${st - 30} ${fx + 18} ${st - 52}" stroke="#3E2A1E" stroke-width="2.4" fill="none" stroke-linecap="round" />`;
    }
  }
  let glandSvg = "";
  if (glands) {
    const gx = 990;
    glandSvg = `<path d="M${gx} ${surface(gx) + 22} L${gx} ${S.derB - 34}" stroke="#D99A86" stroke-width="2" fill="none" />
      <path d="M${gx - 12} ${S.derB - 30} c 0 -10 24 -10 24 0 s -24 10 -24 0 m 2 6 c 0 -9 20 -9 20 0 s -20 9 -20 0" stroke="#C9806B" stroke-width="2" fill="none" />`;
  }

  const blockClip = `<clipPath id="${id}-block"><path d="M${S.x0} 0 H${S.x1} V${S.bot - 18} Q ${S.x1} ${S.bot} ${S.x1 - 18} ${S.bot} H${S.x0 + 18} Q ${S.x0} ${S.bot} ${S.x0} ${S.bot - 18} Z" /></clipPath>
    <clipPath id="${id}-below"><rect x="${S.x0}" y="${S.surf + 2.5}" width="${S.x1 - S.x0}" height="${S.bot}" /></clipPath>
    <clipPath id="${id}-fat"><rect x="${S.x0}" y="${S.derB}" width="${S.x1 - S.x0}" height="${S.fatB - S.derB}" /></clipPath>`;

  const layers = `<g clip-path="url(#${id}-block)">
    <rect x="${S.x0}" y="${S.fatB}" width="${S.x1 - S.x0}" height="${S.bot - S.fatB}" fill="${C.muscle}" />
    ${striations}
    <rect x="${S.x0}" y="${S.derB}" width="${S.x1 - S.x0}" height="${S.fatB - S.derB}" fill="#EDD08F" />
    <g clip-path="url(#${id}-fat)">${lobules}</g>
    <line x1="${S.x0}" x2="${S.x1}" y1="${S.fatB}" y2="${S.fatB}" stroke="#E8D5CC" stroke-width="3" />
    <path d="${dermPath}" fill="${C.dermis}" />
    ${fibres}${vessels}${glandSvg}
    ${fluid}
    <path d="${epiTopPath} ${epiBotPath} Z" fill="${C.epi}" />
    <path d="${epiTopPath}" stroke="${C.epiTop}" stroke-width="2.2" fill="none" />
    ${follicleSvg}
  </g>`;

  const labels = [
    ["Epidermis", (S.surf + S.epiB) / 2 + 5],
    ["Dermis", (S.epiB + S.derB) / 2 + 5],
    ["Lemak", (S.derB + S.fatB) / 2 + 5],
    ["Otot", (S.fatB + S.bot) / 2 + 5],
  ]
    .map(([t, y]) => `<line x1="${S.x1 + 4}" x2="${S.x1 + 14}" y1="${y - 5}" y2="${y - 5}" stroke="${C.muted}" stroke-width="1.4" />${text(S.x1 + 20, y, t, { size: 15, weight: 600, color: C.inkSoft })}`)
    .join("");

  return { defs: blockClip, layers, labels, blockClip: `${id}-block`, below: `${id}-below` };
}

// An open cavity cut into the section: filled with background, lined with raw tissue.
export function cavity(d, sec, { lining = C.rawDark, width = 4, fill = C.bg } = {}) {
  return `<g clip-path="url(#${sec.blockClip})">
    <path d="${d}" fill="${fill}" stroke="${fill}" stroke-width="3" />
    <g clip-path="url(#${sec.below})"><path d="${d}" fill="none" stroke="${lining}" stroke-width="${width}" stroke-linejoin="round" /></g>
  </g>`;
}

// Depth bracket on the left of the section block
export function depthBracket(yTo, label, tone = "pine") {
  const color = tone === "alert" ? C.alert : C.pine;
  const x = S.x0 - 16;
  return `<path d="M${x + 8} ${S.surf} H${x} V${yTo} H${x + 8}" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round" />
    ${label ? text(x - 8, (S.surf + yTo) / 2 + 5, label, { size: 14, weight: 700, color, anchor: "end" }) : ""}`;
}

export function blobPath(cx, cy, rx, ry, seed, points = 14, jitter = 0.18) {
  const r = rng(seed);
  const pts = [];
  for (let i = 0; i < points; i += 1) {
    const a = (i / points) * Math.PI * 2;
    const k = 1 + (r() - 0.5) * 2 * jitter;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  // Catmull-Rom to bezier
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length; i += 1) {
    const p0 = pts[(i - 1 + pts.length) % pts.length];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % pts.length];
    const p3 = pts[(i + 2) % pts.length];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1[0])} ${f(c1[1])}, ${f(c2[0])} ${f(c2[1])}, ${f(p2[0])} ${f(p2[1])}`;
  }
  return `${d} Z`;
}

export function blister(cx, cy, rx, ry, id) {
  return `<radialGradient id="${id}" cx="40%" cy="35%" r="70%">
      <stop offset="0%" stop-color="#FFF7EA" />
      <stop offset="55%" stop-color="${C.fluid}" />
      <stop offset="100%" stop-color="#E8C7A2" />
    </radialGradient>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx + 7}" ry="${ry + 6}" fill="${C.red}" opacity="0.28" />
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${id})" stroke="#D9A983" stroke-width="2" />
    <path d="M${cx - rx * 0.55} ${cy - ry * 0.35} Q ${cx - rx * 0.2} ${cy - ry * 0.8} ${cx + rx * 0.25} ${cy - ry * 0.62}" stroke="#FFFFFF" stroke-width="${Math.max(3, rx * 0.12)}" stroke-linecap="round" fill="none" opacity="0.9" />`;
}

export function gauzeRoll(x, y, w, h) {
  let lines = "";
  for (let i = 1; i < 5; i += 1) lines += `<line x1="${x + (w * i) / 5}" x2="${x + (w * i) / 5}" y1="${y + 3}" y2="${y + h - 3}" stroke="${C.gauzeLine}" stroke-width="1.4" />`;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${C.gauze}" stroke="${C.gauzeLine}" stroke-width="2" />${lines}`;
}
