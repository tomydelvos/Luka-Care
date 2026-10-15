import { LuChevronRight, LuPalette } from "react-icons/lu";
import { Link } from "../lib/router";
import { PageHeader } from "../components/ui";
import { Disclaimer } from "../components/AppShell";
import { LibraryNodes } from "../components/LibraryNodes";
import { CHAPTERS, LIBRARY_INTRO, LIBRARY_PARTS } from "../content";
import { assetUrl } from "../config/env";

function ChapterRow({ chapter }) {
  return (
    <li>
      <Link to={`/pustaka/${chapter.slug}`} className="flex items-center gap-4 py-3 hover:bg-sunken/50">
        <img
          src={assetUrl(`illustrations/kecil/${chapter.illustration}.webp`)}
          alt=""
          width="640"
          height="429"
          loading="lazy"
          decoding="async"
          className="h-16 w-24 shrink-0 rounded-xl border border-line object-cover"
        />
        <span className="min-w-0 flex-1">
          <span className="tabular block text-[13px] font-semibold text-muted">Bab {chapter.number}</span>
          <span className="block text-[15px] font-bold text-ink">{chapter.title}</span>
          {chapter.latin && <span className="block text-sm italic text-muted">{chapter.latin}</span>}
        </span>
        <LuChevronRight size={20} className="shrink-0 text-muted" aria-hidden="true" />
      </Link>
    </li>
  );
}

// /pustaka: 10 jenis luka dari buku panduan, dikelompokkan Bagian A dan B (PRD tahap 2, F2).
export default function Library() {
  return (
    <div>
      <PageHeader
        title="Pustaka luka"
        lead="Kenali 10 jenis luka luar: bentuknya, seberapa dalam, cara menanganinya, dan kapan harus ke tenaga kesehatan."
      />
      <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
        <div className="space-y-10">
          {["A", "B"].map((part) => (
            <section key={part} aria-labelledby={`bagian-${part}`}>
              <h2 id={`bagian-${part}`} className="text-lg font-extrabold">
                {LIBRARY_PARTS[part].title}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {LIBRARY_PARTS[part].lead}
                {part === "A" && (
                  <>
                    {" "}
                    <Link to="/darurat" className="font-semibold text-pine">
                      Lihat tanda bahaya
                    </Link>
                  </>
                )}
              </p>
              <ul className="mt-3 divide-y divide-line rounded-[1.5rem] border border-line bg-surface px-4">
                {CHAPTERS.filter((c) => c.part === part).map((c) => (
                  <ChapterRow key={c.slug} chapter={c} />
                ))}
              </ul>
            </section>
          ))}
          <section aria-labelledby="bagian-c">
            <h2 id="bagian-c" className="text-lg font-extrabold">
              Bagian C: memantau pemulihan
            </h2>
            <Link
              to="/pustaka/warna-luka"
              className="mt-3 flex items-center gap-4 rounded-[1.5rem] border border-line bg-surface p-4 hover:border-muted"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-pine-soft text-pine-strong" aria-hidden="true">
                <LuPalette size={22} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-bold">Warna luka dan waktu pulih</span>
                <span className="block text-sm text-muted">Arti warna dasar luka, perkiraan waktu pulih per lapisan kulit, dan di kulit sawo matang</span>
              </span>
              <LuChevronRight size={20} className="shrink-0 text-muted" aria-hidden="true" />
            </Link>
          </section>
        </div>
        <aside aria-labelledby="cara-membaca" className="self-start rounded-[1.75rem] bg-surface p-5 ring-1 ring-line sm:p-6">
          <h2 id="cara-membaca" className="text-lg font-extrabold">
            Cara membaca gambar
          </h2>
          <LibraryNodes nodes={LIBRARY_INTRO} />
        </aside>
      </div>
      <Disclaimer className="mt-12 max-w-2xl" />
    </div>
  );
}
