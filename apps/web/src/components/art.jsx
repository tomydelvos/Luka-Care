import { cx } from "../lib/cx";

/* ---------- Logo ---------- */
export function PlasterGlyph({ size = 30, className }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <g transform="rotate(-40 32 32)">
        <rect x="4" y="21" width="56" height="22" rx="11" fill="var(--lc-plaster)" />
        <rect x="22" y="21" width="20" height="22" fill="var(--lc-plaster-soft)" />
        {[
          [11, 28],
          [11, 36],
          [16, 32],
          [53, 28],
          [53, 36],
          [48, 32],
        ].map(([cx_, cy]) => (
          <circle key={`${cx_}-${cy}`} cx={cx_} cy={cy} r="1.6" fill="var(--lc-plaster-deep)" />
        ))}
      </g>
      <path d="M32 24v16M24 32h16" stroke="var(--lc-pine)" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className }) {
  return (
    <span className={cx("inline-flex items-center gap-2", className)}>
      <PlasterGlyph />
      <span className="text-[1.2rem] font-extrabold tracking-[-0.03em] text-ink">LukaCare</span>
    </span>
  );
}

/* ---------- Ilustrasi jenis luka ---------- */
const stroke = { stroke: "var(--lc-ink)", strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" };

export function WoundArt({ type, size = 64, className }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="var(--lc-plaster-soft)" />
      {type === "lecet" && (
        <>
          <path d="M14 40c2-10 10-17 20-18s16 5 17 12-6 12-16 12-23 2-21-6z" fill="var(--lc-plaster)" />
          <path d="M22 36l7-6M28 40l10-9M36 41l8-7" {...stroke} stroke="var(--lc-plaster-deep)" strokeWidth="3" />
        </>
      )}
      {type === "sayatan" && (
        <>
          <path d="M12 42c3-11 13-20 25-20s15 7 15 13-8 11-20 11-22 3-20-4z" fill="var(--lc-plaster)" />
          <path d="M19 41l26-13" {...stroke} stroke="var(--lc-plaster-deep)" strokeWidth="3" />
          <path d="M44 38c0 2-1.4 3.2-3 3.2s-3-1.2-3-3.2 3-5.5 3-5.5 3 3.5 3 5.5z" fill="var(--lc-plaster-deep)" />
        </>
      )}
      {type === "bakar" && (
        <>
          <path
            d="M32 12c2 7 12 11 12 23a12 12 0 0 1-24 0c0-6 3-9 6-12 0 4 2 6 4 6-2-6 0-12 2-17z"
            fill="var(--lc-plaster)"
          />
          <path d="M32 12c2 7 12 11 12 23a12 12 0 0 1-24 0c0-6 3-9 6-12 0 4 2 6 4 6-2-6 0-12 2-17z" {...stroke} />
          <path d="M32 47a5 5 0 0 1-5-5c0-3 3-5 4-8 2 3 6 5 6 8a5 5 0 0 1-5 5z" fill="var(--lc-plaster-soft)" />
        </>
      )}
      {type === "lepuh" && (
        <>
          <path d="M10 44h44" {...stroke} />
          <path d="M18 44c0-9 6-15 14-15s14 6 14 15" fill="var(--lc-plaster)" />
          <path d="M18 44c0-9 6-15 14-15s14 6 14 15" {...stroke} />
          <path d="M26 35c1.5-2 3.5-3 6-3" {...stroke} stroke="var(--lc-surface)" strokeWidth="3" />
        </>
      )}
    </svg>
  );
}

/* ---------- Ilustrasi produk per kategori ---------- */
const TILE = {
  pembersih: "bg-pine-soft",
  kasa: "bg-sunken",
  plester: "bg-plaster-soft",
  dressing: "bg-mint-soft",
  pelembap: "bg-caution-soft",
  bakar: "bg-plaster-soft",
  p3k: "bg-pine-soft",
};

const line = { stroke: "var(--lc-ink-soft)", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" };

function ProductShape({ art }) {
  switch (art) {
    case "bottle":
      return (
        <>
          <rect x="38" y="14" width="20" height="9" rx="3" fill="var(--lc-pine)" />
          <rect x="41" y="23" width="14" height="10" rx="2" fill="var(--lc-surface)" {...line} />
          <rect x="31" y="33" width="34" height="47" rx="9" fill="var(--lc-surface)" {...line} />
          <rect x="36" y="47" width="24" height="18" rx="3" fill="var(--lc-pine-soft)" />
          <path d="M48 51c0 0 4 4.5 4 7a4 4 0 0 1-8 0c0-2.5 4-7 4-7z" fill="var(--lc-pine)" />
        </>
      );
    case "gauze":
      return (
        <>
          <rect x="20" y="20" width="56" height="56" rx="6" fill="var(--lc-surface)" {...line} />
          {[28, 36, 44, 52, 60, 68].map((v) => (
            <g key={v} opacity="0.35">
              <path d={`M${v} 22v52`} stroke="var(--lc-ink-soft)" strokeWidth="1" />
              <path d={`M22 ${v}h52`} stroke="var(--lc-ink-soft)" strokeWidth="1" />
            </g>
          ))}
          <path d="M58 76l18-18v12a6 6 0 0 1-6 6z" fill="var(--lc-sunken)" {...line} />
        </>
      );
    case "plaster":
      return (
        <g transform="rotate(-28 48 48)">
          <rect x="12" y="35" width="72" height="26" rx="13" fill="var(--lc-plaster)" />
          <rect x="36" y="35" width="24" height="26" fill="var(--lc-plaster-soft)" />
          {[
            [21, 43],
            [21, 53],
            [27, 48],
            [75, 43],
            [75, 53],
            [69, 48],
          ].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r="1.8" fill="var(--lc-plaster-deep)" />
          ))}
        </g>
      );
    case "pad":
      return (
        <>
          <rect x="18" y="18" width="60" height="60" rx="14" fill="var(--lc-surface)" {...line} />
          <rect x="31" y="31" width="34" height="34" rx="8" fill="var(--lc-mint-soft)" stroke="var(--lc-mint)" strokeWidth="2" />
          <path d="M40 48h16M48 40v16" stroke="var(--lc-mint)" strokeWidth="2.2" strokeLinecap="round" opacity="0.5" />
        </>
      );
    case "jar":
      return (
        <>
          <rect x="24" y="28" width="48" height="13" rx="4" fill="var(--lc-pine)" />
          <rect x="27" y="41" width="42" height="36" rx="10" fill="var(--lc-surface)" {...line} />
          <rect x="33" y="51" width="30" height="14" rx="3" fill="var(--lc-caution-soft)" />
        </>
      );
    case "tube":
      return (
        <g transform="rotate(-35 48 48)">
          <path d="M22 38h40l10 4v12l-10 4H22z" fill="var(--lc-surface)" {...line} />
          <rect x="72" y="42" width="10" height="12" rx="2" fill="var(--lc-pine)" />
          <path d="M22 38v20" {...line} />
          <rect x="32" y="43" width="22" height="10" rx="2" fill="var(--lc-plaster)" />
        </g>
      );
    case "kit":
    default:
      return (
        <>
          <path d="M38 30v-6a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v6" fill="none" {...line} />
          <rect x="16" y="30" width="64" height="46" rx="9" fill="var(--lc-surface)" {...line} />
          <rect x="16" y="44" width="64" height="4" fill="var(--lc-pine-soft)" />
          <path d="M48 52v14M41 59h14" stroke="var(--lc-pine)" strokeWidth="5" strokeLinecap="round" />
        </>
      );
  }
}

export function ProductArt({ category, art, className }) {
  return (
    <div className={cx("grid aspect-square place-items-center", TILE[category] ?? "bg-sunken", className)}>
      <svg viewBox="0 0 96 96" className="h-[72%] w-[72%]" aria-hidden="true">
        <ProductShape art={art} />
      </svg>
    </div>
  );
}
