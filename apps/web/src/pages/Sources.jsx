import { PageHeader } from "../components/ui";
import { Disclaimer } from "../components/AppShell";
import { SourceItem } from "../components/ContentMeta";
import { EVIDENCE, SOURCES, SOURCE_TOPICS } from "../content";

// Halaman /sumber: semua rujukan konten medis, dikelompokkan per topik (PRD tahap 2, F8).
export default function Sources() {
  return (
    <div>
      <PageHeader
        title="Sumber"
        lead="Langkah perawatan dan tanda bahaya di LukaCare disusun dari rujukan berikut. Ilustrasi digambar khusus sebagai gambaran umum, bukan foto klinis."
      />
      <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
        <div className="space-y-10">
          {SOURCE_TOPICS.map((topic) => {
            const list = SOURCES.filter((s) => s.topic === topic.id);
            if (!list.length) return null;
            return (
              <section key={topic.id} aria-labelledby={`topik-${topic.id}`}>
                <h2 id={`topik-${topic.id}`} className="mb-3 text-lg font-extrabold">
                  {topic.label}
                </h2>
                <ul className="divide-y divide-line rounded-[1.5rem] border border-line bg-surface px-4 sm:px-5">
                  {list.map((s) => (
                    <SourceItem key={s.id} source={s} />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
        <aside aria-labelledby="label-bukti" className="self-start rounded-[1.75rem] bg-surface p-5 ring-1 ring-line sm:p-6">
          <h2 id="label-bukti" className="text-lg font-extrabold">
            Label asal data
          </h2>
          <p className="mt-1 text-sm text-muted">Setiap bagian konten diberi label agar jelas seberapa jauh angkanya berlaku untuk luka sehari-hari.</p>
          <dl className="mt-4 space-y-3">
            {Object.entries(EVIDENCE).map(([key, e]) => (
              <div key={key} className="flex gap-3">
                <dt className="tabular grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sunken text-sm font-bold text-ink">{key}</dt>
                <dd className="text-[15px] text-ink-soft">
                  <span className="font-semibold text-ink">{e.label}.</span> {e.detail}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
      <Disclaimer className="mt-12 max-w-2xl" />
    </div>
  );
}
