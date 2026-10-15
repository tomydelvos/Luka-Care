import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  LuArrowRight,
  LuBookOpen,
  LuChevronLeft,
  LuChevronRight,
  LuCircleCheck,
  LuEye,
  LuFlag,
  LuHand,
  LuHospital,
  LuSiren,
  LuTriangleAlert,
  LuCheck,
} from "react-icons/lu";
import { cx } from "../lib/cx";
import { assetUrl } from "../config/env";
import { Badge, Button, Sheet } from "./ui";
import { CARE_LEVELS, CASE_GROUPS, CASE_STORIES, casesFor } from "../data/caseStories";

/* Gaya per jenis peristiwa di linimasa. Merah hanya untuk tanda bahaya. */
const KIND = {
  kejadian: { label: "Kejadian", icon: LuFlag, chip: "bg-plaster-soft text-ink-soft", dot: "bg-plaster-deep", text: "text-ink-soft" },
  aksi: { label: "Pertolongan", icon: LuHand, chip: "bg-pine-soft text-pine-strong", dot: "bg-pine", text: "text-pine-strong" },
  pantau: { label: "Pantau", icon: LuEye, chip: "bg-sunken text-ink-soft", dot: "bg-muted", text: "text-ink-soft" },
  faskes: { label: "Tenaga kesehatan", icon: LuHospital, chip: "bg-ink text-canvas", dot: "bg-ink", text: "text-ink" },
  waspada: { label: "Waspada", icon: LuTriangleAlert, chip: "bg-caution-soft text-caution", dot: "bg-caution", text: "text-caution" },
  bahaya: { label: "Tanda bahaya", icon: LuSiren, chip: "bg-alert-soft text-alert", dot: "bg-alert", text: "text-alert" },
  pulih: { label: "Pulih", icon: LuCircleCheck, chip: "bg-mint-soft text-mint", dot: "bg-mint", text: "text-mint" },
};

const personLine = (p) => `${p.name}, ${p.age} tahun${p.role ? `, ${p.role.toLowerCase()}` : ""}`;

/* ---------- Linimasa ringkas di kartu ---------- */
function MiniTimeline({ timeline }) {
  const first = timeline[0];
  const last = timeline[timeline.length - 1];
  return (
    <div className="mt-3.5">
      <div className="relative flex items-center justify-between px-0.5" aria-hidden="true">
        <span className="absolute inset-x-1 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-line" />
        {timeline.map((t, i) => (
          <span key={i} className={cx("relative h-2.5 w-2.5 rounded-full ring-[3px] ring-surface", KIND[t.kind].dot)} />
        ))}
      </div>
      <p className="tabular mt-1.5 flex justify-between gap-3 text-[12px] font-semibold text-muted">
        <span className="truncate">{first.at}</span>
        <span className="truncate text-right">{last.at}</span>
      </p>
      <p className="sr-only">
        {timeline.length} tahap, dari {first.at} sampai {last.at}.
      </p>
    </div>
  );
}

/* ---------- Kartu kasus ---------- */
function CaseCard({ story, matched, onOpen }) {
  const care = CARE_LEVELS[story.care];
  return (
    <article className="relative h-full overflow-hidden rounded-[1.5rem] border border-line bg-surface transition-colors hover:border-muted">
      <button type="button" onClick={() => onOpen(story.id)} className="group flex h-full w-full flex-col text-left">
        <div className="relative aspect-[3/2] w-full overflow-hidden bg-sunken">
          <img
            src={assetUrl(story.thumb)}
            alt=""
            loading="lazy"
            decoding="async"
            width="640"
            height="429"
            className="h-full w-full object-cover transition-[filter] group-hover:brightness-[0.97]"
          />
          {matched && (
            <span className="absolute left-3 top-3">
              <Badge tone="pine" className="shadow-sm">
                Mirip luka Anda
              </Badge>
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div className="flex flex-wrap gap-1.5">
            <Badge>{story.woundLabel}</Badge>
            <Badge tone={care.tone}>{care.label}</Badge>
          </div>
          <h3 className="mt-2.5 text-[17px] font-extrabold leading-snug">{story.headline}</h3>
          <p className="mt-0.5 text-sm text-muted">{personLine(story.person)}</p>
          <MiniTimeline timeline={story.timeline} />
          <p className="mt-auto flex items-start gap-2 pt-3.5 text-sm font-semibold text-ink-soft">
            <LuCircleCheck size={17} className="mt-px shrink-0 text-mint" aria-hidden="true" />
            {story.outcome}
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-pine">
            Baca kronologi
            <LuArrowRight size={16} aria-hidden="true" />
          </span>
        </div>
      </button>
    </article>
  );
}

/* ---------- Isi lengkap satu kasus ---------- */
function CaseDetail({ story }) {
  const care = CARE_LEVELS[story.care];
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        <Badge>{story.woundLabel}</Badge>
        <Badge tone={care.tone}>{care.label}</Badge>
      </div>
      {story.person.role && <p className="mt-2 text-sm text-muted">{story.person.role}</p>}
      <img
        src={assetUrl(story.image)}
        alt={`Ilustrasi ${story.woundLabel.toLowerCase()}: tampak atas dan penampang lapisan kulit.`}
        loading="lazy"
        decoding="async"
        width="2400"
        height="1380"
        className="mt-4 w-full rounded-2xl border border-line bg-canvas"
      />
      <p className="mt-4 text-[15px] text-ink-soft">{story.situation}</p>

      <h3 className="mt-6 text-[17px] font-extrabold">Kronologi</h3>
      <ol className="mt-3">
        {story.timeline.map((t, i) => {
          const k = KIND[t.kind];
          const Icon = k.icon;
          const last = i === story.timeline.length - 1;
          return (
            <li key={i} className={cx("relative flex gap-3.5", !last && "pb-5")}>
              {!last && <span className="absolute bottom-0 left-[17px] top-10 w-0.5 rounded-full bg-line" aria-hidden="true" />}
              <span className={cx("grid h-9 w-9 shrink-0 place-items-center rounded-full", k.chip)} aria-hidden="true">
                <Icon size={17} />
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="tabular text-[13px] font-semibold text-muted">
                  {t.at}
                  <span aria-hidden="true"> · </span>
                  <span className={cx("font-bold", k.text)}>{k.label}</span>
                </p>
                <p className="mt-0.5 font-bold text-ink">{t.title}</p>
                <p className="mt-0.5 text-[15px] text-ink-soft">{t.text}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 rounded-2xl bg-pine-soft p-4">
        <h3 className="text-[15px] font-extrabold text-pine-strong">Yang bisa dipelajari</h3>
        <ul className="mt-2.5 space-y-2">
          {story.lessons.map((l) => (
            <li key={l} className="flex gap-2.5 text-[15px] text-ink">
              <LuCheck size={18} className="mt-0.5 shrink-0 text-pine" aria-hidden="true" />
              {l}
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4 text-[13px] leading-relaxed text-muted">
        Kisah ilustrasi dari Bab {story.chapter} Buku Panduan LukaCare, bukan pasien nyata. Setiap luka bisa berbeda. Jika ragu,
        periksakan ke puskesmas, klinik, atau IGD.
      </p>
    </div>
  );
}

/* ---------- Bagian utama ---------- */
export function CaseStories({ woundType, className }) {
  const headingId = useId();
  const counts = useMemo(
    () => Object.fromEntries(CASE_GROUPS.map((g) => [g.id, CASE_STORIES.filter((c) => c.group === g.id).length])),
    []
  );
  const groups = useMemo(() => {
    const mine = CASE_GROUPS.filter((g) => g.id === woundType);
    return [{ id: "semua", label: "Semua" }, ...mine, ...CASE_GROUPS.filter((g) => g.id !== woundType)];
  }, [woundType]);

  const [group, setGroup] = useState("semua");
  const [openId, setOpenId] = useState(null);
  const [pos, setPos] = useState({ index: 0, start: true, end: false });
  const list = useMemo(() => casesFor(woundType, group), [woundType, group]);
  const track = useRef(null);
  const sheetTop = useRef(null);

  const openPos = list.findIndex((c) => c.id === openId);
  const openStory = openPos >= 0 ? list[openPos] : null;

  const step = () => {
    const card = track.current?.querySelector("li");
    return card ? card.getBoundingClientRect().width + 12 : 280;
  };
  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const index = Math.min(list.length - 1, Math.round(el.scrollLeft / step()));
    const start = el.scrollLeft <= 4;
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    setPos((p) => (p.index === index && p.start === start && p.end === end ? p : { index: end ? list.length - 1 : index, start, end }));
  }, [list.length]);
  const scrollBy = (dir) => track.current?.scrollBy({ left: dir * step(), behavior: "smooth" });
  const closeSheet = useCallback(() => setOpenId(null), []);

  // Kembali ke awal saat filter berganti, dan ukur ulang saat layar berubah.
  useEffect(() => {
    track.current?.scrollTo({ left: 0 });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [group, measure]);

  // Saat pindah kasus di dalam sheet, mulai baca dari atas.
  useEffect(() => {
    if (openId) sheetTop.current?.scrollIntoView({ block: "start" });
  }, [openId]);


  const groupLabel = (g) => (g.id === "semua" ? `Semua (${CASE_STORIES.length})` : `${g.label} (${counts[g.id]})`);

  return (
    <section className={cx("border-t border-line pt-8", className)} aria-labelledby={headingId}>
      <p className="flex items-center gap-2 text-sm font-bold text-pine">
        <LuBookOpen size={17} aria-hidden="true" />
        Contoh kasus untuk dibaca
      </p>
      <h2 id={headingId} className="mt-1.5 text-xl font-extrabold sm:text-[1.6rem]">
        Belajar dari kasus serupa
      </h2>
      <p className="mt-1.5 max-w-prose text-[15px] text-muted">
        Sepuluh kisah singkat dari buku panduan, masing-masing disusun dari menit pertama sampai pulih. Kasus yang mirip
        dengan pilihan Anda tampil paling depan.
      </p>
      <p className="mt-1 max-w-prose text-sm text-muted">Sedang menangani luka? Lanjutkan dulu ke langkah perawatan. Kasus ini bisa dibaca nanti.</p>

      <div className="no-scrollbar relative -mx-4 mt-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex w-max gap-2" role="radiogroup" aria-label="Saring menurut jenis luka">
          {groups.map((g) => {
            const selected = group === g.id;
            return (
              <button
                key={g.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setGroup(g.id)}
                className={cx(
                  "inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-[15px] font-medium transition-colors",
                  selected ? "border-pine bg-pine text-on-pine" : "border-line bg-surface text-ink hover:border-muted"
                )}
              >
                {g.id === woundType && (
                  <span className={cx("h-2 w-2 rounded-full", selected ? "bg-on-pine" : "bg-pine")} aria-hidden="true" />
                )}
                {groupLabel(g)}
                {g.id === woundType && <span className="sr-only">, sesuai jenis luka Anda</span>}
              </button>
            );
          })}
        </div>
      </div>

      <ul
        ref={track}
        onScroll={measure}
        className="no-scrollbar relative -mx-4 mt-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:scroll-px-0 sm:px-0"
        aria-label="Daftar contoh kasus"
      >
        {list.map((story) => (
          <li key={story.id} className="w-[78%] max-w-[300px] shrink-0 snap-start sm:w-[calc(50%-0.375rem)] sm:max-w-none">
            <CaseCard story={story} matched={story.group === woundType} onOpen={setOpenId} />
          </li>
        ))}
      </ul>

      {list.length > 1 && (
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="tabular text-sm font-semibold text-muted" aria-live="polite">
            Kasus {pos.index + 1} dari {list.length}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={pos.start}
              className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-ink hover:border-muted disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Kasus sebelumnya"
            >
              <LuChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={pos.end}
              className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-ink hover:border-muted disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Kasus berikutnya"
            >
              <LuChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      <Sheet
        open={Boolean(openStory)}
        onClose={closeSheet}
        title={openStory ? `${openStory.person.name}, ${openStory.person.age} tahun` : ""}
        footer={
          openStory && (
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="secondary"
                onClick={() => setOpenId(list[openPos - 1].id)}
                disabled={openPos <= 0}
                aria-label="Kasus sebelumnya"
              >
                <LuChevronLeft size={16} aria-hidden="true" />
                Sebelumnya
              </Button>
              <span className="tabular hidden whitespace-nowrap text-sm font-semibold text-muted sm:inline">
                {openPos + 1} dari {list.length}
              </span>
              <Button
                variant="secondary"
                onClick={() => setOpenId(list[openPos + 1].id)}
                disabled={openPos >= list.length - 1}
                aria-label="Kasus berikutnya"
              >
                Berikutnya
                <LuChevronRight size={16} aria-hidden="true" />
              </Button>
            </div>
          )
        }
      >
        <div ref={sheetTop} className="scroll-mt-4" />
        {openStory && <CaseDetail story={openStory} />}
      </Sheet>
    </section>
  );
}
