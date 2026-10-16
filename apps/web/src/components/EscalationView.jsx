import { LuPhone, LuMapPin, LuArrowLeft } from "react-icons/lu";
import { Button } from "./ui";
import { CHAPTER_FOR_REASON, LEVEL_COPY, chapterFigure, chapterFirstAid } from "../content";
import { Link } from "../lib/router";
import { EMERGENCY_NUMBERS, NEAREST_FACILITY_URL, assetUrl } from "../config/env";
import { cx } from "../lib/cx";
import { ReviewRibbon, SourcesButton } from "./ContentMeta";
import { RichText } from "./RichText";

// Alasan yang menunjuk bab Bagian B yang sama digabung, agar langkah bab tidak tampil dua kali.
function groupReasons(reasons) {
  const groups = [];
  for (const reason of reasons) {
    const chapter = CHAPTER_FOR_REASON[reason.id] ?? null;
    const firstAid = chapterFirstAid(chapter);
    const existing = firstAid && groups.find((g) => g.chapter === chapter);
    if (existing) existing.reasons.push(reason);
    else groups.push({ chapter, firstAid, reasons: [reason] });
  }
  return groups;
}

function StepList({ steps }) {
  return (
    <ol className="mt-3 space-y-2">
      {steps.map((step, i) => (
        <li key={step} className="flex gap-3 text-[15px] text-ink-soft">
          <span className="tabular mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sunken text-xs font-bold text-ink">
            {i + 1}
          </span>
          <span>
            <RichText text={step} />
          </span>
        </li>
      ))}
    </ol>
  );
}

function ChapterLink({ chapter }) {
  return (
    <Link to={`/pustaka/${chapter.slug}`} className="mt-1 inline-flex min-h-11 items-center text-sm font-semibold text-pine">
      Baca Bab {chapter.number}: {chapter.title.toLowerCase()}
    </Link>
  );
}

function ReasonGroup({ group }) {
  const { chapter, firstAid, reasons } = group;
  const fig = firstAid ? chapterFigure(chapter) : null;
  return (
    <div className="p-5">
      {reasons.map((reason) => (
        <div key={reason.id} className="mb-3 last:mb-0">
          <p className="flex flex-wrap items-center gap-2 font-bold">
            {reason.title} <ReviewRibbon blocks={reason} />
          </p>
          <p className="mt-0.5 text-sm text-muted">{reason.detail}</p>
        </div>
      ))}
      {firstAid ? (
        <>
          <figure className="mt-4">
            <img
              src={assetUrl(`illustrations/potongan/${chapter.illustration}-atas.webp`)}
              alt={fig.altTop}
              width="720"
              height="692"
              loading="lazy"
              decoding="async"
              className="mx-auto w-full max-w-64 rounded-2xl border border-line bg-canvas"
            />
          </figure>
          <p className="mt-4 flex flex-wrap items-center gap-2 text-[15px] font-bold">
            Pertolongan pertama dari Bab {chapter.number} <ReviewRibbon blocks={firstAid.steps} />
          </p>
          <StepList steps={firstAid.steps.items} />
          {firstAid.avoid && (
            <p className="mt-3 text-sm text-muted">
              <span className="font-semibold text-ink-soft">Hindari:</span> <RichText text={firstAid.avoid.text} />
            </p>
          )}
          <ChapterLink chapter={chapter} />
        </>
      ) : (
        <>
          {chapter && <ChapterLink chapter={chapter} />}
          <StepList steps={reasons.flatMap((r) => r.whileWaiting)} />
        </>
      )}
    </div>
  );
}

export function EscalationView({ reasons, onBack, backLabel = "Kembali" }) {
  const level = reasons.some((r) => r.level === "darurat") ? "darurat" : "segera";
  const copy = LEVEL_COPY[level];
  const urgent = level === "darurat";
  const groups = groupReasons(reasons);
  const chapterBlocks = groups.flatMap((g) => (g.firstAid ? [g.firstAid.steps, g.firstAid.avoid].filter(Boolean) : []));

  return (
    <div className="fade-in">
      <section
        className={cx(
          "rounded-[1.75rem] border p-5 sm:p-7",
          urgent ? "border-alert bg-alert text-on-alert" : "border-alert/30 bg-alert-soft text-ink"
        )}
        aria-labelledby="eskalasi-judul"
      >
        <h1 id="eskalasi-judul" className="text-[1.6rem] font-extrabold sm:text-3xl">
          {copy.heading}
        </h1>
        <p className={cx("mt-2 max-w-prose text-[15px]", urgent ? "text-on-alert/90" : "text-ink-soft")}>{copy.lead}</p>

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          {urgent ? (
            <>
              <a
                href="tel:119"
                className="inline-flex h-14 items-center sm:flex-1 justify-center gap-2 rounded-full bg-on-alert text-lg font-extrabold text-alert"
              >
                <LuPhone size={20} aria-hidden="true" />
                Telepon 119
              </a>
              <a
                href="tel:112"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-on-alert/50 px-6 font-bold text-on-alert sm:flex-none"
              >
                Telepon 112
              </a>
            </>
          ) : (
            <>
              <Button href={NEAREST_FACILITY_URL} target="_blank" rel="noreferrer" variant="danger" size="lg" className="sm:flex-1">
                <LuMapPin size={18} aria-hidden="true" />
                Cari faskes terdekat
              </Button>
              <Button href="tel:119" variant="secondary" size="lg">
                <LuPhone size={18} aria-hidden="true" />
                Telepon 119
              </Button>
            </>
          )}
        </div>
      </section>

      <section className="mt-6" aria-labelledby="sambil-menunggu">
        <div className="flex items-center justify-between gap-3">
          <h2 id="sambil-menunggu" className="text-lg font-extrabold">
            {urgent ? "Sambil menunggu bantuan" : "Sebelum berangkat"}
          </h2>
          <SourcesButton blocks={[copy, ...reasons, ...chapterBlocks]} title="Sumber langkah ini" />
        </div>
        <div className="mt-3 divide-y divide-line rounded-[1.5rem] border border-line bg-surface">
          {groups.map((group) => (
            <ReasonGroup key={group.reasons[0].id} group={group} />
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-2.5 sm:grid-cols-2" aria-label="Nomor darurat">
        {EMERGENCY_NUMBERS.map((n) => (
          <a key={n.number} href={`tel:${n.number}`} className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 hover:border-muted">
            <span className="tabular text-2xl font-extrabold text-alert">{n.number}</span>
            <span>
              <span className="block text-[15px] font-semibold">{n.label}</span>
              <span className="block text-sm text-muted">{n.note}</span>
            </span>
          </a>
        ))}
      </section>

      {onBack && (
        <button type="button" onClick={onBack} className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-pine">
          <LuArrowLeft size={18} aria-hidden="true" />
          {backLabel}
        </button>
      )}
    </div>
  );
}
