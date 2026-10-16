import { useEffect, useId, useRef } from "react";
import { LuX, LuMinus, LuPlus, LuTriangleAlert, LuInfo, LuCircleCheck } from "react-icons/lu";
import { Link } from "../lib/router";
import { cx } from "../lib/cx";
import { assetUrl } from "../config/env";

/* ---------- Button ---------- */
const VARIANTS = {
  primary: "bg-pine text-on-pine hover:bg-pine-strong",
  secondary: "bg-surface text-ink border border-line hover:border-muted",
  soft: "bg-pine-soft text-pine-strong hover:brightness-95",
  danger: "bg-alert text-on-alert hover:brightness-110",
  "danger-soft": "bg-alert-soft text-alert hover:brightness-95",
  ghost: "text-pine hover:bg-pine-soft",
  "danger-ghost": "text-alert hover:bg-alert-soft",
};
const SIZES = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-[15px] gap-2",
  lg: "h-[3.25rem] px-6 text-base gap-2",
};

export function Button({ to, href, variant = "primary", size = "md", block, className, children, ...props }) {
  const classes = cx(
    "inline-flex select-none items-center justify-center rounded-full font-semibold transition-[background-color,border-color,filter] duration-150 disabled:cursor-not-allowed disabled:opacity-45",
    VARIANTS[variant],
    SIZES[size],
    block && "w-full",
    className
  );
  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}

/* ---------- Pilihan (chip) ---------- */
export function ChoiceGroup({ label, hint, options, value, onChange, columns = false, children }) {
  const id = useId();
  return (
    <fieldset className="space-y-2.5">
      <legend id={id} className="text-[15px] font-bold text-ink">
        {label}
      </legend>
      {hint && <p className="-mt-1 text-sm text-muted">{hint}</p>}
      {children}
      <div className={cx("flex flex-wrap gap-2", columns && "sm:grid sm:grid-cols-2")} role="radiogroup" aria-labelledby={id}>
        {options.map((opt) => {
          const selected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt.id)}
              className={cx(
                "min-h-11 border px-4 py-2 text-left text-[15px] font-medium transition-colors",
                opt.description ? "rounded-2xl" : "rounded-full",
                selected
                  ? "border-pine bg-pine text-on-pine"
                  : "border-line bg-surface text-ink hover:border-muted"
              )}
            >
              {opt.label}
              {opt.description && (
                <span className={cx("block text-[13px] font-normal", selected ? "text-on-pine/85" : "text-muted")}>{opt.description}</span>
              )}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ---------- Toggle ---------- */
/* ---------- MultiChoice ---------- */
// Pilihan "boleh lebih dari satu". Opsi dengan `swatch` tampil sebagai kartu bergambar.
export function MultiChoice({ label, hint, options, value, onChange, children }) {
  const id = useId();
  const selected = new Set(value);
  const toggle = (optId) => onChange(selected.has(optId) ? value.filter((v) => v !== optId) : [...value, optId]);
  const withSwatch = options.some((o) => o.swatch);
  return (
    <fieldset className="space-y-2.5">
      <legend id={id} className="text-[15px] font-bold text-ink">
        {label}
      </legend>
      {hint && <p className="-mt-1 text-sm text-muted">{hint}</p>}
      <div className={cx(withSwatch ? "grid grid-cols-2 gap-2 sm:grid-cols-3" : "flex flex-wrap gap-2")} role="group" aria-labelledby={id}>
        {options.map((opt) => {
          const on = selected.has(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(opt.id)}
              className={cx(
                "min-h-11 border text-left text-[15px] font-medium transition-colors",
                withSwatch ? "flex flex-col overflow-hidden rounded-2xl" : "rounded-full px-4 py-2",
                on ? "border-pine bg-pine text-on-pine" : "border-line bg-surface text-ink hover:border-muted"
              )}
            >
              {withSwatch &&
                (opt.swatch ? (
                  <img src={assetUrl(opt.swatch)} alt="" width="360" height="240" loading="lazy" className="aspect-[3/2] w-full object-cover" />
                ) : (
                  <span className="grid aspect-[3/2] w-full place-items-center bg-sunken text-[13px] text-muted" aria-hidden="true">
                    Tanpa gambar
                  </span>
                ))}
              <span className={cx(withSwatch && "px-3 py-2")}>
                <span className="block">{opt.label}</span>
                {withSwatch && opt.hint && <span className={cx("block text-[13px]", on ? "text-on-pine/85" : "text-muted")}>{opt.hint}</span>}
              </span>
            </button>
          );
        })}
      </div>
      {children}
    </fieldset>
  );
}

export function Toggle({ label, description, checked, onChange }) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start justify-between gap-4 py-1">
      <span>
        <span className="block text-[15px] font-semibold text-ink">{label}</span>
        {description && <span className="mt-0.5 block text-sm text-muted">{description}</span>}
      </span>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input
          id={id}
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span className="h-7 w-12 rounded-full bg-line transition-colors peer-checked:bg-pine peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-pine" />
        <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-surface shadow transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

/* ---------- Field ---------- */
export function Field({ label, hint, error, as = "input", className, ...props }) {
  const id = useId();
  const Comp = as;
  return (
    <div className={cx("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-[15px] font-semibold text-ink">
        {label}
      </label>
      <Comp
        id={id}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={hint || error ? `${id}-desc` : undefined}
        className={cx(
          "w-full rounded-2xl border bg-surface px-4 text-[15px] text-ink placeholder:text-muted/80 focus:border-pine focus:outline-none focus:ring-3 focus:ring-pine/20",
          as === "textarea" ? "min-h-24 py-3" : "h-12",
          error ? "border-alert" : "border-line"
        )}
        {...props}
      />
      {(hint || error) && (
        <p id={`${id}-desc`} className={cx("text-sm", error ? "text-alert" : "text-muted")}>
          {error || hint}
        </p>
      )}
    </div>
  );
}

/* ---------- Sheet (dialog) ---------- */
export function Sheet({ open, onClose, title, children, footer }) {
  const panel = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const nodes = panel.current.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    window.setTimeout(() => panel.current?.focus(), 10);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center sm:p-6">
      <div className="fade-in absolute inset-0 bg-ink/45" onClick={onClose} aria-hidden="true" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="sheet-in relative flex max-h-[92dvh] w-full flex-col rounded-t-[1.75rem] bg-surface shadow-2xl outline-none sm:max-w-lg sm:rounded-[1.75rem]"
      >
        <div className="flex items-center justify-between gap-4 px-5 pb-2 pt-5 sm:px-6">
          <h2 id={titleId} className="text-lg font-extrabold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full text-muted hover:bg-sunken hover:text-ink"
            aria-label="Tutup"
          >
            <LuX size={20} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 pb-5 sm:px-6">{children}</div>
        {footer && (
          <div className="border-t border-line px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:px-6">{footer}</div>
        )}
      </div>
    </div>
  );
}

/* ---------- Qty stepper ---------- */
export function QtyStepper({ value, onChange, label, size = "md" }) {
  const btn = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-surface" role="group" aria-label={`Jumlah ${label}`}>
      <button type="button" className={cx(btn, "grid place-items-center rounded-full text-ink hover:bg-sunken")} onClick={() => onChange(value - 1)} aria-label="Kurangi">
        <LuMinus size={16} />
      </button>
      <span className="tabular min-w-7 text-center text-[15px] font-bold" aria-live="polite">
        {value}
      </span>
      <button type="button" className={cx(btn, "grid place-items-center rounded-full text-ink hover:bg-sunken")} onClick={() => onChange(value + 1)} aria-label="Tambah">
        <LuPlus size={16} />
      </button>
    </div>
  );
}

/* ---------- Banner ---------- */
const BANNER = {
  alert: { cls: "bg-alert-soft text-ink border-alert/30", icon: LuTriangleAlert, iconCls: "text-alert" },
  caution: { cls: "bg-caution-soft text-ink border-caution/25", icon: LuInfo, iconCls: "text-caution" },
  success: { cls: "bg-mint-soft text-ink border-mint/25", icon: LuCircleCheck, iconCls: "text-mint" },
  info: { cls: "bg-sunken text-ink border-line", icon: LuInfo, iconCls: "text-muted" },
};
export function Banner({ tone = "info", title, children, action, className }) {
  const b = BANNER[tone];
  const Icon = b.icon;
  return (
    <div className={cx("flex gap-3 rounded-2xl border p-4", b.cls, className)} role={tone === "alert" ? "alert" : undefined}>
      <Icon size={20} className={cx("mt-0.5 shrink-0", b.iconCls)} aria-hidden="true" />
      <div className="min-w-0 flex-1 text-[15px]">
        {title && <p className="font-bold">{title}</p>}
        {children && <div className={cx(title && "mt-1", "text-ink-soft")}>{children}</div>}
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}

/* ---------- Badge ---------- */
const BADGE = {
  neutral: "bg-sunken text-ink-soft",
  pine: "bg-pine-soft text-pine-strong",
  alert: "bg-alert-soft text-alert",
  caution: "bg-caution-soft text-caution",
  mint: "bg-mint-soft text-mint",
};
export function Badge({ tone = "neutral", children, className }) {
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[13px] font-semibold", BADGE[tone], className)}>
      {children}
    </span>
  );
}

/* ---------- Petunjuk isian yang kurang ---------- */
// Dipasang di atas tombol yang masih nonaktif, supaya pengguna tahu apa yang perlu diisi.
export function MissingHint({ items, className }) {
  const list = items.filter(Boolean);
  if (!list.length) return null;
  return (
    <p className={cx("mb-2.5 text-center text-sm text-muted", className)} aria-live="polite">
      Lengkapi dulu: {list.join(", ")}.
    </p>
  );
}

/* ---------- Page heading ---------- */
export function PageHeader({ title, lead, action }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-xl">
        <h1 className="text-[1.75rem] font-extrabold sm:text-[2rem]">{title}</h1>
        {lead && <p className="mt-1.5 text-[15px] text-muted">{lead}</p>}
      </div>
      {action}
    </header>
  );
}

export function SectionTitle({ children, action, id }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-4">
      <h2 id={id} className="text-lg font-extrabold">
        {children}
      </h2>
      {action}
    </div>
  );
}
