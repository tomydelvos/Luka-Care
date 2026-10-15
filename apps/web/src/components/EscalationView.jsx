import { LuPhone, LuMapPin, LuArrowLeft } from "react-icons/lu";
import { Button } from "./ui";
import { LEVEL_COPY } from "../data/redFlags";
import { EMERGENCY_NUMBERS, NEAREST_FACILITY_URL } from "../config/env";
import { cx } from "../lib/cx";

export function EscalationView({ reasons, onBack, backLabel = "Kembali" }) {
  const level = reasons.some((r) => r.level === "darurat") ? "darurat" : "segera";
  const copy = LEVEL_COPY[level];
  const urgent = level === "darurat";

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
        <h2 id="sambil-menunggu" className="text-lg font-extrabold">
          {urgent ? "Sambil menunggu bantuan" : "Sebelum berangkat"}
        </h2>
        <div className="mt-3 divide-y divide-line rounded-[1.5rem] border border-line bg-surface">
          {reasons.map((reason) => (
            <div key={reason.id} className="p-5">
              <p className="font-bold">{reason.title}</p>
              <p className="mt-0.5 text-sm text-muted">{reason.detail}</p>
              <ol className="mt-3 space-y-2">
                {reason.whileWaiting.map((step, i) => (
                  <li key={step} className="flex gap-3 text-[15px] text-ink-soft">
                    <span className="tabular mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sunken text-xs font-bold text-ink">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
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
