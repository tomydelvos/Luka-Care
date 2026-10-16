import { Banner } from "./ui";
import { ReviewRibbon, SourcesButton } from "./ContentMeta";
import { BURN_DEGREES, BURN_RECHECK, EVIDENCE_NOTE, FOUR_WEEKS, HEALING_PHASES, RISK_GROUP } from "../content";
import { formatDayDate } from "../lib/format";
import { cx } from "../lib/cx";

// Perkiraan pulih dan batas periksa (PRD tahap 2, F6). Angka ditampilkan sebagai batas periksa, bukan tanggal sembuh.
export function HealingPanel({ plan, burn, className }) {
  const { row } = plan;
  if (!row) return null;
  const degree = burn?.degree ? BURN_DEGREES.labels[burn.degree] : null;
  const blocks = [
    row,
    FOUR_WEEKS,
    ...(plan.atRisk ? [RISK_GROUP] : []),
    ...(row.recheckDays ? [BURN_RECHECK] : []),
    ...(degree ? [BURN_DEGREES] : []),
  ];
  return (
    <section aria-labelledby="perkiraan" className={cx("rounded-[1.5rem] border border-line bg-surface p-5", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="perkiraan" className="text-[17px] font-extrabold">
          Perkiraan pulih
        </h2>
        <ReviewRibbon blocks={blocks} />
        <SourcesButton blocks={blocks} title="Sumber perkiraan pulih" className="ml-auto" />
      </div>
      <p className="mt-1 text-sm text-muted">
        {row.label}
        {EVIDENCE_NOTE[row.evidence] ? `. ${EVIDENCE_NOTE[row.evidence]}.` : "."}
      </p>
      {degree && (
        <p className="mt-1 text-sm text-muted">
          Perkiraan derajat: <span className="font-semibold text-ink-soft">{degree}</span>. {BURN_DEGREES.note}
        </p>
      )}
      <p className="mt-2 text-[15px] font-semibold text-ink">{row.estimate}</p>
      {row.note && <p className="mt-1 text-sm text-muted">{row.note}</p>}

      <div className={cx("mt-4 rounded-2xl p-4", plan.overdue ? "bg-caution-soft" : "bg-sunken")}>
        <p className="text-sm font-semibold text-muted">Batas periksa</p>
        <p className="tabular mt-0.5 text-[15px] font-bold text-ink">
          {plan.overdue
            ? `Sudah lewat ${formatDayDate(plan.checkBy)}. Bila belum membaik, periksakan.`
            : `Jika belum membaik pada ${formatDayDate(plan.checkBy)}, periksakan.`}
        </p>
        <p className="tabular mt-1 text-sm text-muted">
          {FOUR_WEEKS.text} Untuk luka ini: {formatDayDate(plan.fourWeeks)}.
        </p>
      </div>

      {row.recheckDays && (
        <Banner tone={plan.recheckDue ? "caution" : "info"} className="mt-3" title={plan.recheckDue ? "Hari ini waktunya melihat ulang luka bakar" : "Lihat ulang pada hari ke-2–3"}>
          {BURN_RECHECK.note}
        </Banner>
      )}
      {plan.atRisk && (
        <Banner tone="caution" className="mt-3" title={RISK_GROUP.title}>
          {RISK_GROUP.text}
        </Banner>
      )}

      <PhaseTimeline plan={plan} />
    </section>
  );
}

// Linimasa fase penyembuhan normal (Bagian C buku) dengan posisi hari ini.
function PhaseTimeline({ plan }) {
  return (
    <div className="mt-5">
      <h3 className="text-[15px] font-bold">
        Perjalanan luka yang sembuh normal
      </h3>
      <ol className="mt-3">
        {HEALING_PHASES.items.map((p, i) => {
          const now = p.id === plan.phase.id;
          const last = i === HEALING_PHASES.items.length - 1;
          return (
            <li key={p.id} className={cx("relative flex gap-3.5", !last && "pb-4")} aria-current={now ? "step" : undefined}>
              {!last && <span className="absolute bottom-0 left-[11px] top-7 w-0.5 rounded-full bg-line" aria-hidden="true" />}
              <span
                className={cx("mt-0.5 h-6 w-6 shrink-0 rounded-full border-2", now ? "border-pine bg-pine" : "border-line bg-surface")}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-muted">
                  {p.when}
                  {now && <span className="tabular rounded-full bg-pine-soft px-2 py-0.5 text-[13px] font-bold text-pine-strong">Hari ke-{plan.day}</span>}
                </p>
                <p className={cx("text-[15px]", now ? "font-semibold text-ink" : "text-ink-soft")}>{p.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-[13px] text-muted">Setiap luka bisa berbeda. Linimasa ini bukan janji tanggal sembuh.</p>
    </div>
  );
}
