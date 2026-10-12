import { LuPhone, LuMapPin, LuChevronDown } from "react-icons/lu";
import { Button, PageHeader, Badge } from "../components/ui";
import { RED_FLAGS } from "../data/redFlags";
import { EMERGENCY_NUMBERS, NEAREST_FACILITY_URL } from "../config/env";
import { Disclaimer } from "../components/AppShell";

function FlagList({ flags }) {
  return (
    <div className="divide-y divide-line rounded-[1.5rem] border border-line bg-surface">
      {flags.map((f) => (
        <details key={f.id} className="group px-5 py-4">
          <summary className="flex cursor-pointer list-none items-start gap-3 [&::-webkit-details-marker]:hidden">
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-bold">{f.title}</span>
              <span className="mt-0.5 block text-sm text-muted">{f.detail}</span>
            </span>
            <LuChevronDown size={20} className="mt-0.5 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="mt-3 rounded-2xl bg-sunken p-4">
            <p className="text-sm font-bold">Yang bisa dilakukan</p>
            <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[15px] text-ink-soft">
              {f.whileWaiting.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>
        </details>
      ))}
    </div>
  );
}

export default function Emergency() {
  const darurat = RED_FLAGS.filter((f) => f.level === "darurat");
  const segera = RED_FLAGS.filter((f) => f.level === "segera");

  return (
    <div>
      <PageHeader title="Darurat" lead="Jika nyawa terancam atau perdarahan tidak berhenti, jangan menunggu. Telepon sekarang." />

      <div className="grid gap-3 sm:grid-cols-2">
        {EMERGENCY_NUMBERS.map((n, i) => (
          <a
            key={n.number}
            href={`tel:${n.number}`}
            className={
              i === 0
                ? "flex items-center gap-4 rounded-[1.5rem] bg-alert p-5 text-white"
                : "flex items-center gap-4 rounded-[1.5rem] border border-alert/30 bg-alert-soft p-5 text-ink"
            }
          >
            <span className={i === 0 ? "grid h-12 w-12 place-items-center rounded-full bg-white/20" : "grid h-12 w-12 place-items-center rounded-full bg-surface text-alert"}>
              <LuPhone size={22} aria-hidden="true" />
            </span>
            <span>
              <span className="tabular block text-3xl font-extrabold leading-none">{n.number}</span>
              <span className="mt-1 block text-[15px] font-semibold">{n.label}</span>
            </span>
          </a>
        ))}
      </div>
      <Button href={NEAREST_FACILITY_URL} target="_blank" rel="noreferrer" variant="secondary" size="lg" block className="mt-3 sm:w-auto">
        <LuMapPin size={18} aria-hidden="true" />
        Cari puskesmas atau IGD terdekat
      </Button>

      <section className="mt-10" aria-labelledby="telepon-sekarang">
        <div className="mb-3 flex items-center gap-2">
          <h2 id="telepon-sekarang" className="text-lg font-extrabold">
            Telepon 119 sekarang jika
          </h2>
          <Badge tone="alert">Darurat</Badge>
        </div>
        <FlagList flags={darurat} />
      </section>

      <section className="mt-8" aria-labelledby="periksakan">
        <h2 id="periksakan" className="mb-3 text-lg font-extrabold">
          Periksakan hari ini jika
        </h2>
        <FlagList flags={segera} />
      </section>

      <Disclaimer className="mt-10 max-w-2xl" />
    </div>
  );
}
