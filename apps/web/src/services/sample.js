import { uid } from "../lib/format";

// Data contoh untuk demo dan uji tampilan. Foto berupa ilustrasi SVG.
function abrasionPhoto({ wound, ring, scab, size }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240">
  <defs>
    <radialGradient id="r" cx="50%" cy="50%" r="50%">
      <stop offset="40%" stop-color="${ring}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${ring}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="320" height="240" fill="#D9A983"/>
  <ellipse cx="160" cy="250" rx="190" ry="150" fill="#E3B590"/>
  <ellipse cx="160" cy="118" rx="${size * 1.6}" ry="${size * 1.2}" fill="url(#r)"/>
  <path d="M${160 - size} ${118 - size * 0.35} q${size * 0.4} ${-size * 0.5} ${size} ${-size * 0.3} t${size} ${size * 0.1} q${size * 0.25} ${size * 0.6} ${-size * 0.2} ${size} t${-size * 1.2} ${size * 0.2} q${-size * 0.5} ${-size * 0.3} ${-size * 0.6} ${-size}z" fill="${wound}"/>
  <path d="M${160 - size * 0.7} ${118 - size * 0.2} l${size * 1.3} ${size * 0.15} M${160 - size * 0.6} ${118 + size * 0.15} l${size * 1.2} ${size * 0.12} M${160 - size * 0.4} ${118 + size * 0.45} l${size * 0.9} ${size * 0.1}" stroke="${scab}" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const daysAgo = (n, hour = 19) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 15, 0, 0);
  return d.toISOString();
};

export function sampleWounds() {
  return [
    {
      id: uid("w"),
      title: "Lecet di lutut kiri",
      type: "lecet",
      area: "lutut",
      condition: "basah",
      size: "sedang",
      who: "dewasa",
      diabetes: false,
      status: "dipantau",
      createdAt: daysAgo(3, 17),
      healedAt: null,
      checkins: [
        {
          id: uid("c"),
          at: daysAgo(3, 17),
          photo: abrasionPhoto({ wound: "#B8323A", ring: "#D0454A", scab: "#7E1F25", size: 46 }),
          pain: 5,
          redness: "sedikit",
          fluid: "bening",
          swelling: false,
          fever: false,
          dressingChanged: true,
          note: "Jatuh dari motor di tikungan. Sudah dibilas air dan ditutup kasa.",
        },
        {
          id: uid("c"),
          at: daysAgo(2),
          photo: abrasionPhoto({ wound: "#A23A33", ring: "#D0574F", scab: "#6E2620", size: 42 }),
          pain: 4,
          redness: "sedikit",
          fluid: "bening",
          swelling: false,
          fever: false,
          dressingChanged: true,
          note: "",
        },
        {
          id: uid("c"),
          at: daysAgo(1),
          photo: abrasionPhoto({ wound: "#8C4A36", ring: "#D88A72", scab: "#5E2E20", size: 37 }),
          pain: 2,
          redness: "tidak",
          fluid: "tidak",
          swelling: false,
          fever: false,
          dressingChanged: true,
          note: "Mulai kering di bagian tengah.",
        },
      ],
    },
    {
      id: uid("w"),
      title: "Luka bakar di tangan",
      type: "bakar",
      area: "tangan",
      condition: "kering",
      size: "kecil",
      who: "dewasa",
      diabetes: false,
      status: "sembuh",
      createdAt: daysAgo(16, 12),
      healedAt: daysAgo(9, 9),
      checkins: [
        {
          id: uid("c"),
          at: daysAgo(16, 12),
          photo: null,
          pain: 4,
          redness: "sedikit",
          fluid: "tidak",
          swelling: false,
          fever: false,
          dressingChanged: false,
          note: "Kena cipratan minyak goreng. Sudah dialiri air 20 menit.",
        },
        {
          id: uid("c"),
          at: daysAgo(12, 20),
          photo: null,
          pain: 1,
          redness: "tidak",
          fluid: "tidak",
          swelling: false,
          fever: false,
          dressingChanged: true,
          note: "",
        },
      ],
    },
  ];
}
