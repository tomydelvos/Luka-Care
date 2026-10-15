import { useEffect } from "react";
import { LuArrowLeft, LuArrowRight, LuPhone } from "react-icons/lu";
import { Link } from "../lib/router";
import { Badge, Banner, Button } from "../components/ui";
import { Disclaimer } from "../components/AppShell";
import { LibraryNodes } from "../components/LibraryNodes";
import { CaseDetail } from "../components/CaseStories";
import { ReviewRibbon, SourcesButton } from "../components/ContentMeta";
import { CARE_LEVELS, CASE_STORIES, CHAPTERS, CHAPTER_BY_SLUG } from "../content";
import NotFound from "./NotFound";

// /pustaka/:jenis: satu bab buku panduan (PRD tahap 2, F2).
export default function LibraryChapter({ slug }) {
  const chapter = CHAPTER_BY_SLUG[slug];
  useEffect(() => {
    if (chapter) document.title = `${chapter.title} · Pustaka LukaCare`;
    return () => {
      document.title = "LukaCare";
    };
  }, [chapter]);
  if (!chapter) return <NotFound />;

  const index = CHAPTERS.indexOf(chapter);
  const prev = CHAPTERS[index - 1];
  const next = CHAPTERS[index + 1];
  const story = CASE_STORIES.find((c) => c.chapter === chapter.number);
  const care = CARE_LEVELS[chapter.part === "A" ? "rumah" : "nakes"];

  return (
    <article className="mx-auto max-w-3xl">
      <Link to="/pustaka" className="mb-5 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-pine">
        <LuArrowLeft size={18} aria-hidden="true" />
        Pustaka luka
      </Link>
      <p className="tabular text-sm font-semibold text-muted">Bab {chapter.number}</p>
      <h1 className="text-[1.75rem] font-extrabold sm:text-[2rem]">{chapter.title}</h1>
      {chapter.latin && <p className="text-[15px] italic text-muted">{chapter.latin}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge tone={care.tone}>{care.label}</Badge>
        <ReviewRibbon blocks={chapter.nodes} />
        <SourcesButton blocks={[...chapter.nodes, story]} title={`Sumber Bab ${chapter.number}`} className="ml-auto" />
      </div>

      {chapter.part === "B" && (
        <Banner tone="caution" className="mt-5" title="Perlu ditangani tenaga kesehatan">
          Lakukan pertolongan pertama di bawah sambil menuju puskesmas, klinik, atau IGD. Dalam keadaan darurat, telepon 119.
        </Banner>
      )}

      <LibraryNodes nodes={chapter.nodes} illustration={chapter.illustration} />

      <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
        {chapter.guideType ? (
          <Button to={`/panduan?jenis=${chapter.guideType}`} size="lg">
            Mulai panduan perawatan
          </Button>
        ) : (
          <Button href="tel:119" variant="danger" size="lg">
            <LuPhone size={18} aria-hidden="true" />
            Telepon 119
          </Button>
        )}
        <Button to="/darurat" variant="secondary" size="lg">
          Lihat tanda bahaya
        </Button>
      </div>

      {story && (
        <section className="mt-10 rounded-[1.5rem] border border-line bg-surface p-5 sm:p-6" aria-labelledby="contoh-kasus">
          <h2 id="contoh-kasus" className="text-lg font-extrabold">
            Contoh kasus: {story.person.name}, {story.person.age} tahun
          </h2>
          <div className="mt-3">
            <CaseDetail story={story} />
          </div>
        </section>
      )}

      <nav aria-label="Bab lain" className="mt-10 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link to={`/pustaka/${prev.slug}`} className="rounded-2xl border border-line bg-surface p-4 hover:border-muted">
            <span className="flex items-center gap-1.5 text-[13px] font-semibold text-muted">
              <LuArrowLeft size={14} aria-hidden="true" /> Bab {prev.number}
            </span>
            <span className="mt-0.5 block font-bold">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/pustaka/${next.slug}`} className="rounded-2xl border border-line bg-surface p-4 text-right hover:border-muted">
            <span className="flex items-center justify-end gap-1.5 text-[13px] font-semibold text-muted">
              Bab {next.number} <LuArrowRight size={14} aria-hidden="true" />
            </span>
            <span className="mt-0.5 block font-bold">{next.title}</span>
          </Link>
        )}
      </nav>
      <Disclaimer className="mt-10" />
    </article>
  );
}
