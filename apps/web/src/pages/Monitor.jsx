import { useState } from "react";
import { LuPlus } from "react-icons/lu";
import { Button, PageHeader } from "../components/ui";
import { WoundRow } from "../components/WoundRow";
import { PlasterGlyph } from "../components/art";
import { useToast, useWounds } from "../store/AppProviders";
import { cx } from "../lib/cx";

export default function Monitor() {
  const { wounds, loading, loadSample } = useWounds();
  const toast = useToast();
  const [tab, setTab] = useState("dipantau");
  const active = wounds.filter((w) => w.status === "dipantau");
  const healed = wounds.filter((w) => w.status === "sembuh");
  const list = tab === "dipantau" ? active : healed;

  if (loading) {
    return <p className="text-muted">Memuat catatan luka…</p>;
  }

  return (
    <div>
      <PageHeader
        title="Pantau luka"
        lead="Catat foto dan kondisi luka setiap hari untuk melihat perkembangannya."
        action={
          wounds.length > 0 && (
            <Button to="/panduan">
              <LuPlus size={18} aria-hidden="true" />
              Tambah luka
            </Button>
          )
        }
      />

      {wounds.length === 0 ? (
        <section className="rounded-[1.75rem] border border-line bg-surface px-6 py-10 text-center">
          <PlasterGlyph size={56} className="mx-auto" />
          <h2 className="mt-4 text-xl font-extrabold">Belum ada luka yang dipantau</h2>
          <p className="mx-auto mt-2 max-w-sm text-[15px] text-muted">
            Mulai dari panduan perawatan. Di langkah terakhir, simpan lukanya agar bisa dicatat setiap hari.
          </p>
          <div className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
            <Button to="/panduan" size="lg">
              Mulai panduan
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={async () => {
                await loadSample();
                toast("Data contoh dimuat");
              }}
            >
              Lihat dengan data contoh
            </Button>
          </div>
        </section>
      ) : (
        <>
          <div className="mb-4 inline-flex rounded-full bg-sunken p-1" role="tablist" aria-label="Status luka">
            {[
              { id: "dipantau", label: "Dipantau", count: active.length },
              { id: "sembuh", label: "Pulih", count: healed.length },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cx(
                  "tabular h-10 rounded-full px-5 text-[15px] font-semibold transition-colors",
                  tab === t.id ? "bg-surface text-ink shadow-sm" : "text-muted"
                )}
              >
                {t.label} ({t.count})
              </button>
            ))}
          </div>
          {list.length ? (
            <div className="divide-y divide-line rounded-[1.5rem] border border-line bg-surface px-4 sm:px-5" role="tabpanel">
              {list.map((w) => (
                <WoundRow key={w.id} wound={w} />
              ))}
            </div>
          ) : (
            <p className="rounded-[1.5rem] border border-dashed border-line px-5 py-8 text-center text-[15px] text-muted" role="tabpanel">
              {tab === "dipantau" ? "Tidak ada luka yang sedang dipantau." : "Luka yang sudah ditandai pulih akan muncul di sini."}
            </p>
          )}
        </>
      )}
    </div>
  );
}
