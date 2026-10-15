import { LuArrowLeft } from "react-icons/lu";
import { Link } from "../lib/router";
import { Disclaimer } from "../components/AppShell";
import { LibraryNodes } from "../components/LibraryNodes";
import { ReviewRibbon, SourcesButton } from "../components/ContentMeta";
import { WOUND_COLORS } from "../content";

// /pustaka/warna-luka: Bagian C buku panduan (warna dasar luka, waktu pulih, kulit sawo matang).
export default function WoundColors() {
  const [intro, ...groups] = WOUND_COLORS;
  return (
    <article className="mx-auto max-w-3xl">
      <Link to="/pustaka" className="mb-5 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-pine">
        <LuArrowLeft size={18} aria-hidden="true" />
        Pustaka luka
      </Link>
      <p className="text-sm font-semibold text-muted">Bagian C</p>
      <h1 className="text-[1.75rem] font-extrabold sm:text-[2rem]">Warna luka dan waktu pulih</h1>
      <LibraryNodes nodes={intro.nodes} />
      {groups.map((g, i) => (
        <section key={g.title} className="mt-10" aria-labelledby={`c-${i}`}>
          <div className="flex flex-wrap items-center gap-2">
            <h2 id={`c-${i}`} className="text-xl font-extrabold">
              {g.title}
            </h2>
            <ReviewRibbon blocks={g.nodes} />
            <SourcesButton blocks={g.nodes} title={`Sumber: ${g.title.toLowerCase()}`} className="ml-auto" />
          </div>
          <LibraryNodes nodes={g.nodes} />
        </section>
      ))}
      <Disclaimer className="mt-10" />
    </article>
  );
}
