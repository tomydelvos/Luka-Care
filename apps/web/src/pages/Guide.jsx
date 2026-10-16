import { useEffect, useMemo, useRef, useState } from "react";
import { LuArrowLeft, LuX, LuCheck, LuPhone, LuCircleHelp, LuBookOpen } from "react-icons/lu";
import { Link, useRouter } from "../lib/router";
import { cx } from "../lib/cx";
import { Button, ChoiceGroup, Toggle, Banner, Field, Badge, MissingHint, Sheet } from "../components/ui";
import { LoginForm, RegisterForm } from "./Auth";
import { WoundArt } from "../components/art";
import { StepTimer } from "../components/StepTimer";
import { EscalationView } from "../components/EscalationView";
import { ProductRow, ProductSheet } from "../components/shop";
import { PhotoPicker, PainScale } from "../components/monitor";
import { Disclaimer } from "../components/AppShell";
import { ReviewRibbon, SourcesButton } from "../components/ContentMeta";
import { CaseStories } from "../components/CaseStories";
import { ContactProfile } from "../components/ContactProfile";
import { CHAPTER_FOR_GUIDE, RED_FLAGS, RED_FLAG_BY_ID, RISK_GROUP, chapterFigure } from "../content";
import { BURN_PALMS_BY_ID, BURN_QUESTIONS, DEPTH_QUESTION, depthLayerFor, estimateBurn } from "../content";
import { CONTENT_VERSION, healingSnapshot } from "../lib/healing";
import { WOUND_GUIDES, WOUND_TYPE_LIST, assessDetails } from "../content";
import { AREA_OPTIONS, CONDITION_OPTIONS, SIZE_OPTIONS, WHO_OPTIONS, labelOf } from "../content";
import { CATEGORY_BY_ID, productsFor } from "../data/products";
import { useAuth, useToast, useWounds } from "../store/AppProviders";
import { assetUrl } from "../config/env";

const STEPS = [
  { id: "cek", label: "Tanda bahaya" },
  { id: "jenis", label: "Jenis luka" },
  { id: "detail", label: "Detail luka" },
  { id: "rawat", label: "Perawatan" },
  { id: "alat", label: "Perlengkapan" },
  { id: "simpan", label: "Pantau" },
];

const AREA_NOUN = {
  tangan: "tangan",
  lengan: "lengan",
  lutut: "lutut",
  kaki: "kaki",
  badan: "badan",
  wajah: "wajah",
  kelamin: "area kelamin",
};

function StepHeading({ title, lead, headingRef }) {
  return (
    <div className="mb-6">
      <h1 ref={headingRef} tabIndex={-1} className="text-[1.65rem] font-extrabold outline-none sm:text-[2rem]">
        {title}
      </h1>
      {lead && <p className="mt-2 max-w-prose text-[15px] text-muted">{lead}</p>}
    </div>
  );
}

function ProgressStrip({ current, escalated }) {
  return (
    <div className="flex gap-1.5" aria-hidden="true">
      {STEPS.map((s, i) => (
        <span
          key={s.id}
          className={cx(
            "h-1.5 flex-1 rounded-full transition-colors duration-300",
            escalated ? "bg-alert/70" : i <= current ? "bg-pine" : "bg-line"
          )}
        />
      ))}
    </div>
  );
}

/* ---------- Langkah 1: tanda bahaya ---------- */
function FlagChecklist({ selected, onToggle }) {
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-[1.5rem] border border-line bg-surface">
      {RED_FLAGS.map((flag) => {
        const checked = selected.includes(flag.id);
        return (
          <li key={flag.id}>
            <label className={cx("flex cursor-pointer gap-4 p-4 transition-colors sm:p-5", checked ? "bg-alert-soft" : "hover:bg-sunken/60")}>
              <input type="checkbox" className="peer sr-only" checked={checked} onChange={() => onToggle(flag.id)} />
              <span
                className={cx(
                  "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg border-2 transition-colors peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-pine",
                  checked ? "border-alert bg-alert text-on-alert" : "border-muted/60 bg-surface"
                )}
                aria-hidden="true"
              >
                {checked && <LuCheck size={15} strokeWidth={3} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-[15px] font-bold">{flag.title}</span>
                  {flag.level === "darurat" && <Badge tone="alert">Darurat</Badge>}
                </span>
                <span className="mt-0.5 block text-sm text-muted">{flag.detail}</span>
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- Langkah 2: jenis luka ---------- */
function TypePicker({ value, onPick }) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        {WOUND_TYPE_LIST.map((g) => {
          const selected = value === g.id;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => onPick(g.id)}
              aria-pressed={selected}
              className={cx(
                "flex items-center gap-4 rounded-[1.5rem] border-2 bg-surface p-4 text-left transition-colors sm:flex-col sm:items-start sm:p-5",
                selected ? "border-pine" : "border-transparent ring-1 ring-line hover:ring-muted"
              )}
            >
              <img
                src={assetUrl(`illustrations/kecil/${CHAPTER_FOR_GUIDE[g.id].illustration}.webp`)}
                alt=""
                width="640"
                height="429"
                loading="lazy"
                decoding="async"
                className="h-16 w-24 shrink-0 rounded-xl border border-line object-cover sm:h-auto sm:w-full"
              />
              <span>
                <span className="block text-[17px] font-extrabold">{g.name}</span>
                <span className="mt-0.5 block text-sm text-muted">{g.examples}</span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-5 flex gap-3 rounded-2xl bg-sunken p-4 text-[15px]">
        <LuCircleHelp size={20} className="mt-0.5 shrink-0 text-muted" aria-hidden="true" />
        <p className="text-ink-soft">
          Lukanya tidak ada di daftar, atau tidak yakin? Untuk luka lain sebaiknya diperiksa langsung oleh tenaga kesehatan.{" "}
          <Link to="/darurat" className="font-semibold text-pine underline underline-offset-2">
            Lihat kapan harus ke dokter
          </Link>
        </p>
      </div>
      <div className="mt-3 flex gap-3 rounded-2xl bg-sunken p-4 text-[15px]">
        <LuBookOpen size={20} className="mt-0.5 shrink-0 text-muted" aria-hidden="true" />
        <p className="text-ink-soft">
          Belum yakin jenisnya? Bandingkan bentuk dan kedalamannya di{" "}
          <Link to="/pustaka" className="font-semibold text-pine underline underline-offset-2">
            pustaka luka
          </Link>
          .
        </p>
      </div>
    </>
  );
}

/* ---------- Langkah 3: pertanyaan kedalaman (M4) ---------- */
const EMPTY_BURN = { blister: null, baseColor: "", painful: null, palms: "" };
const yesNo = (v) => (v === null || v === undefined ? "" : v ? "ya" : "tidak");

function ExampleImage({ image, className }) {
  return (
    <img
      src={assetUrl(image.src)}
      alt={image.alt}
      loading="lazy"
      decoding="async"
      className={cx("w-full rounded-2xl border border-line bg-canvas", className)}
    />
  );
}

function Question({ q, value, onChange, columns, children }) {
  return (
    <ChoiceGroup
      label={
        <span className="inline-flex flex-wrap items-center gap-2">
          {q.question} <ReviewRibbon blocks={q} />
        </span>
      }
      hint={q.hint}
      options={q.options}
      value={value}
      onChange={onChange}
      columns={columns}
    >
      {children}
    </ChoiceGroup>
  );
}

// Lecet dan sayatan: dasar putih atau lemak terlihat → rujukan Bab 5. Luka bakar: empat pertanyaan PNPK.
function DepthQuestions({ type, details, setDetail }) {
  if (type === "lecet" || type === "sayatan") {
    return (
      <Question q={DEPTH_QUESTION} value={details.deep} onChange={(deep) => setDetail({ deep })}>
        <ExampleImage image={DEPTH_QUESTION.image} className="max-w-60" />
      </Question>
    );
  }
  if (type !== "bakar") return null;
  const burn = details.burn;
  const setBurn = (patch) => setDetail({ burn: { ...burn, ...patch } });
  const q = BURN_QUESTIONS;
  return (
    <>
      <Question q={q.palms} value={burn.palms} onChange={(palms) => setDetail({ burn: { ...burn, palms }, size: BURN_PALMS_BY_ID[palms].size })} />
      <Question q={q.blister} value={yesNo(burn.blister)} onChange={(v) => setBurn({ blister: v === "ya" })} />
      <Question q={q.baseColor} value={burn.baseColor} onChange={(baseColor) => setBurn({ baseColor })} columns>
        <ExampleImage image={q.baseColor.image} />
      </Question>
      <Question q={q.painful} value={yesNo(burn.painful)} onChange={(v) => setBurn({ painful: v === "ya" })} />
    </>
  );
}

const depthMissing = (type, details) => {
  if (type === "lecet" || type === "sayatan") return [!details.deep && "dasar luka"];
  if (type !== "bakar") return [];
  const b = details.burn;
  return [!b.palms && "luas", b.blister === null && "lepuh", !b.baseColor && "warna dasar", b.painful === null && "nyeri"];
};

/* ---------- Langkah 4: perawatan ---------- */
// Penampang kulit dari bab pustaka, di atas daftar langkah (PRD tahap 2, F3).
function CareFigure({ type }) {
  const chapter = CHAPTER_FOR_GUIDE[type];
  if (!chapter) return null;
  const fig = chapterFigure(chapter);
  return (
    <figure className="mb-6">
      <img
        src={assetUrl(`illustrations/potongan/${chapter.illustration}-penampang.webp`)}
        alt={fig.altSection}
        width="760"
        height="650"
        loading="lazy"
        decoding="async"
        className="mx-auto w-full max-w-sm rounded-2xl border border-line bg-canvas"
      />
      <figcaption className="mt-2 text-center text-[13px] text-muted">
        Seberapa dalam luka ini.{" "}
        <Link to={`/pustaka/${chapter.slug}`} className="font-semibold text-pine">
          Baca Bab {chapter.number} di pustaka
        </Link>
      </figcaption>
    </figure>
  );
}

function CareSteps({ steps, done, onDone, onEscalate }) {
  const activeIndex = steps.findIndex((s) => !done[s.id]);
  return (
    <ol className="space-y-3">
      {steps.map((s, i) => {
        const isDone = Boolean(done[s.id]);
        const isActive = i === activeIndex;
        return (
          <li
            key={s.id}
            className={cx(
              "rounded-[1.5rem] border bg-surface p-4 transition-colors sm:p-5",
              isActive ? "border-pine shadow-[0_0_0_3px_var(--lc-pine-soft)]" : "border-line",
              isDone && "bg-surface/60"
            )}
            aria-current={isActive ? "step" : undefined}
          >
            <div className="flex gap-3.5">
              <span
                className={cx(
                  "tabular grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-extrabold",
                  isDone ? "step-done bg-mint text-on-mint" : isActive ? "bg-pine text-on-pine" : "bg-sunken text-ink-soft"
                )}
                aria-hidden="true"
              >
                {isDone ? <LuCheck size={16} strokeWidth={3} /> : i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className={cx("text-[17px] font-extrabold", isDone && "text-ink-soft")}>{s.title}</h3>
                  {s.optional && <Badge>Opsional</Badge>}
                  <ReviewRibbon blocks={s} />
                  {isDone && <span className="sr-only">(selesai)</span>}
                </div>
                <p className={cx("mt-1 text-[15px]", isDone ? "text-muted" : "text-ink-soft")}>{s.body}</p>
                {s.tip && !isDone && <p className="mt-2 text-sm text-muted">{s.tip}</p>}
                {s.timer && !isDone && <StepTimer seconds={s.timer} label={s.title.toLowerCase()} />}

                {!isDone && s.check && (
                  <div className="mt-4 rounded-2xl bg-sunken p-4">
                    <p className="text-[15px] font-bold">{s.check.question}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button size="sm" variant="danger-soft" onClick={() => onEscalate(s.check.escalateTo)}>
                        Ya
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => onDone(s.id)}>
                        Tidak, lanjut
                      </Button>
                    </div>
                  </div>
                )}
                {!isDone && !s.check && (
                  <div className="mt-4">
                    <Button size="sm" variant={isActive ? "primary" : "secondary"} onClick={() => onDone(s.id)}>
                      <LuCheck size={16} aria-hidden="true" />
                      Sudah dilakukan
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function Guide() {
  const { query, navigate } = useRouter();
  const { user } = useAuth();
  const { create, loadedFor } = useWounds();
  const toast = useToast();
  const headingRef = useRef(null);

  const presetType = WOUND_GUIDES[query.get("jenis")] ? query.get("jenis") : null;
  const [step, setStep] = useState(0);
  const [flags, setFlags] = useState([]);
  const [type, setType] = useState(presetType);
  const [details, setDetails] = useState({
    who: "dewasa",
    area: "",
    condition: "",
    size: "",
    diabetes: false,
    deep: "",
    burn: EMPTY_BURN,
  });
  const [done, setDone] = useState({});
  const [escalation, setEscalation] = useState(null);
  const [openProduct, setOpenProduct] = useState(null);
  const [save, setSave] = useState({ title: "", photo: null, pain: null, risk: { perokok: false, imunLemah: false } });
  const [saving, setSaving] = useState(false);
  // Pengguna yang belum masuk diminta daftar (atau masuk) sebelum luka disimpan.
  // Isian langkah ini tetap ada di state selama Sheet terbuka.
  const [authMode, setAuthMode] = useState(null);
  const [saveAfterAuth, setSaveAfterAuth] = useState(false);

  const guide = type ? WOUND_GUIDES[type] : null;
  const careSteps = useMemo(() => (guide ? guide.steps(details) : []), [guide, details]);
  const assessment = useMemo(() => (guide ? assessDetails(type, details) : { escalations: [], cautions: [] }), [guide, type, details]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    headingRef.current?.focus({ preventScroll: true });
  }, [step, escalation]);

  const goBack = () => {
    if (escalation) setEscalation(null);
    else if (step > 0) setStep(step - 1);
    else navigate("/");
  };

  const toggleFlag = (id) => setFlags((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  const setDetail = (patch) => setDetails((d) => ({ ...d, ...patch }));

  const pickType = (id) => {
    if (id !== type) setDone({});
    setType(id);
    setStep(2);
  };

  const toDetailsNext = () => {
    if (assessment.escalations.length) {
      setEscalation({ reasons: assessment.escalations, back: "Kembali ke detail luka" });
    } else {
      setStep(3);
    }
  };

  const toSave = () => {
    if (!save.title) setSave((s) => ({ ...s, title: guide.defaultTitle(AREA_NOUN[details.area] ?? "tubuh") }));
    setStep(5);
  };

  const saveWound = async () => {
    setSaving(true);
    try {
      // `deep` dan `burn` mentah tidak disimpan; yang disimpan lapisan perkiraan dan hasil penilaian luka bakar.
      const { burn } = details;
      const rest = { ...details };
      delete rest.deep;
      delete rest.burn;
      const input = {
        title: save.title.trim() || guide.defaultTitle(AREA_NOUN[details.area]),
        type,
        ...rest,
        risk: save.risk,
        depthLayer: depthLayerFor(type, details),
        burn: type === "bakar" ? { ...burn, degree: estimateBurn(burn).degree } : null,
      };
      const first = {
        schema: 2,
        photo: save.photo,
        pain: save.pain,
        bedColors: [],
        fluid: details.condition === "basah" ? "bening_tipis" : "tidak",
        newOdor: false,
        skin: [],
        spread: "belum_ditandai",
        fever: false,
        dressingChanged: true,
        note: "Catatan awal dari panduan.",
        assessment: { level: "pantau", reasons: [] },
      };
      const wound = await create({ ...input, healing: healingSnapshot(input), contentVersion: CONTENT_VERSION }, first);
      toast("Luka disimpan. Catat kondisinya setiap hari.");
      navigate(`/pantau/${wound.id}`, { replace: true });
    } catch (err) {
      toast(err.message, "alert");
      setSaving(false);
    }
  };

  // Setelah daftar/masuk lewat Sheet, simpan begitu data akun baru selesai dimuat.
  useEffect(() => {
    if (saveAfterAuth && user && loadedFor === user.id) {
      setSaveAfterAuth(false);
      saveWound();
    }
    // saveWound sengaja tidak dijadikan dependency: dibuat ulang tiap render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveAfterAuth, user, loadedFor]);

  const missingDetails = type
    ? [
        !details.area && "bagian tubuh",
        !details.condition && "kondisi luka",
        type !== "bakar" && !details.size && "seberapa luas",
        ...depthMissing(type, details),
      ].filter(Boolean)
    : [];
  const detailsReady = missingDetails.length === 0;
  const doneCount = careSteps.filter((s) => done[s.id]).length;

  let content;
  let footer = null;

  if (escalation) {
    content = <EscalationView reasons={escalation.reasons} onBack={() => setEscalation(null)} backLabel={escalation.back} />;
  } else if (step === 0) {
    content = (
      <>
        <StepHeading
          headingRef={headingRef}
          title="Sebelum mulai, apakah ada kondisi ini?"
          lead="Pilih semua yang sesuai. Kondisi berikut perlu ditangani tenaga kesehatan, bukan dirawat sendiri."
        />
        <FlagChecklist selected={flags} onToggle={toggleFlag} />
      </>
    );
    footer = flags.length ? (
      <Button block size="lg" variant="danger" onClick={() => setEscalation({ reasons: flags.map((id) => RED_FLAG_BY_ID[id]), back: "Ubah pilihan" })}>
        Lihat yang harus dilakukan
      </Button>
    ) : (
      <Button block size="lg" onClick={() => setStep(1)}>
        Tidak ada, lanjutkan
      </Button>
    );
  } else if (step === 1) {
    content = (
      <>
        <StepHeading headingRef={headingRef} title="Luka seperti apa?" lead="Pilih yang paling mirip dengan luka Anda." />
        <TypePicker value={type} onPick={pickType} />
      </>
    );
  } else if (step === 2) {
    content = (
      <>
        <StepHeading
          headingRef={headingRef}
          title="Ceritakan sedikit tentang lukanya"
          lead="Jawaban ini membantu kami menyesuaikan langkah perawatan dan mengenali kondisi yang perlu diperiksakan."
        />
        <div className="space-y-7">
          <ChoiceGroup label="Siapa yang terluka?" options={WHO_OPTIONS} value={details.who} onChange={(who) => setDetail({ who })} />
          <ChoiceGroup label="Di bagian tubuh mana?" options={AREA_OPTIONS} value={details.area} onChange={(area) => setDetail({ area })} />
          <ChoiceGroup label="Kondisi luka sekarang" options={CONDITION_OPTIONS} value={details.condition} onChange={(condition) => setDetail({ condition })} />
          {type !== "bakar" && (
            <ChoiceGroup
              label="Seberapa luas?"
              hint="Bandingkan dengan telapak tangan orang yang terluka."
              options={SIZE_OPTIONS}
              value={details.size}
              onChange={(size) => setDetail({ size })}
            />
          )}
          <DepthQuestions type={type} details={details} setDetail={setDetail} />
          <div className="rounded-2xl border border-line bg-surface px-4 py-3">
            <Toggle
              label="Orang yang terluka memiliki diabetes"
              description="Luka pada penderita diabetes perlu perhatian lebih."
              checked={details.diabetes}
              onChange={(diabetes) => setDetail({ diabetes })}
            />
          </div>
        </div>
        <CaseStories woundType={type} className="mt-12" />
      </>
    );
    footer = (
      <>
        <MissingHint items={missingDetails} />
        <Button block size="lg" onClick={toDetailsNext} disabled={!detailsReady}>
          Lihat langkah perawatan
        </Button>
      </>
    );
  } else if (step === 3) {
    content = (
      <>
        <div className="mb-6 flex items-start gap-4">
          <WoundArt type={type} size={56} className="shrink-0" />
          <div>
            <h1 ref={headingRef} tabIndex={-1} className="text-[1.65rem] font-extrabold outline-none sm:text-[2rem]">
              Perawatan {guide.name.toLowerCase()}
            </h1>
            <p className="mt-1 text-[15px] text-muted">
              {labelOf(AREA_OPTIONS, details.area)}, {labelOf(CONDITION_OPTIONS, details.condition).toLowerCase()}
            </p>
          </div>
        </div>
        {assessment.cautions.length > 0 && (
          <div className="mb-5 space-y-2.5">
            {assessment.cautions.map((c) => (
              <Banner key={c.id} tone="caution">
                {c.text} <ReviewRibbon blocks={c} />
              </Banner>
            ))}
          </div>
        )}
        <CareFigure type={type} />
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="tabular text-sm font-semibold text-muted" aria-live="polite">
            {doneCount} dari {careSteps.length} langkah selesai
          </p>
          <SourcesButton blocks={[...careSteps, guide.avoid, ...assessment.cautions]} title={`Sumber perawatan ${guide.name.toLowerCase()}`} />
        </div>
        <CareSteps
          steps={careSteps}
          done={done}
          onDone={(id) => setDone((d) => ({ ...d, [id]: true }))}
          onEscalate={(flagId) => setEscalation({ reasons: [RED_FLAG_BY_ID[flagId]], back: "Kembali ke langkah perawatan" })}
        />
        <section className="mt-8" aria-labelledby="hindari">
          <h2 id="hindari" className="flex flex-wrap items-center gap-2 text-lg font-extrabold">
            Yang sebaiknya dihindari <ReviewRibbon blocks={guide.avoid} />
          </h2>
          <ul className="mt-3 space-y-2">
            {guide.avoid.items.map((a) => (
              <li key={a} className="flex gap-3 text-[15px] text-ink-soft">
                <LuX size={18} className="mt-0.5 shrink-0 text-alert" aria-hidden="true" />
                {a}
              </li>
            ))}
          </ul>
        </section>
        <ContactProfile className="mt-10" />
      </>
    );
    footer = (
      <Button block size="lg" onClick={() => setStep(4)}>
        Lanjut ke perlengkapan
      </Button>
    );
  } else if (step === 4) {
    content = (
      <>
        <StepHeading
          headingRef={headingRef}
          title="Perlengkapan yang membantu"
          lead="Kategori ini mendukung langkah perawatan tadi. Ambil yang belum Anda punya saja, tidak harus semua."
        />
        <div className="space-y-4">
          {guide.productCategories.map((catId) => {
            const items = productsFor(type, catId, 2);
            if (!items.length) return null;
            const cat = CATEGORY_BY_ID[catId];
            return (
              <section key={catId} className="rounded-[1.5rem] border border-line bg-surface px-4 pt-4 sm:px-5" aria-label={cat.name}>
                <h2 className="text-[17px] font-extrabold">{cat.name}</h2>
                <p className="text-sm text-muted">{cat.purpose}</p>
                <div className="divide-y divide-line">
                  {items.map((p) => (
                    <ProductRow key={p.id} product={p} onOpen={setOpenProduct} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
        <p className="mt-4 text-sm text-muted">
          Data produk masih contoh.{" "}
          <Link to={`/belanja?untuk=${type}`} className="font-semibold text-pine underline underline-offset-2">
            Lihat semua perlengkapan
          </Link>
        </p>
        <ProductSheet product={openProduct} onClose={() => setOpenProduct(null)} />
      </>
    );
    footer = (
      <Button block size="lg" onClick={toSave}>
        Lanjut ke pemantauan
      </Button>
    );
  } else {
    content = (
      <>
        <StepHeading
          headingRef={headingRef}
          title="Pantau sampai pulih"
          lead="Simpan luka ini, lalu catat foto dan kondisinya setiap hari. LukaCare akan menandai bila catatan Anda menunjukkan tanda yang perlu diperiksakan."
        />
        <div className="space-y-6">
          <Field label="Nama luka" value={save.title} onChange={(e) => setSave((s) => ({ ...s, title: e.target.value }))} maxLength={60} />
          <PhotoPicker value={save.photo} onChange={(photo) => setSave((s) => ({ ...s, photo }))} />
          <PainScale value={save.pain} onChange={(pain) => setSave((s) => ({ ...s, pain }))} />
          <fieldset className="rounded-2xl border border-line bg-surface px-4 py-2">
            <legend className="sr-only">Faktor yang memperlambat pulih</legend>
            <p className="pt-2 text-sm text-muted">{RISK_GROUP.text}</p>
            <div className="divide-y divide-line">
              <div className="py-3">
                <Toggle
                  label="Orang yang terluka merokok"
                  checked={save.risk.perokok}
                  onChange={(perokok) => setSave((s) => ({ ...s, risk: { ...s.risk, perokok } }))}
                />
              </div>
              <div className="py-3">
                <Toggle
                  label="Daya tahan tubuh rendah atau gizi kurang"
                  checked={save.risk.imunLemah}
                  onChange={(imunLemah) => setSave((s) => ({ ...s, risk: { ...s.risk, imunLemah } }))}
                />
              </div>
            </div>
          </fieldset>
          {!user && (
            <Banner tone="info" title="Buat akun untuk menyimpan">
              Pemantauan luka butuh akun agar foto dan catatan tersimpan aman dan bisa dibuka di perangkat lain. Isian Anda di halaman ini
              tidak hilang saat mendaftar.
            </Banner>
          )}
        </div>
      </>
    );
    footer = (
      <>
        <MissingHint items={[save.pain === null && "tingkat nyeri"]} className="sm:text-right" />
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" size="lg" onClick={() => navigate("/")}>
            Selesai tanpa menyimpan
          </Button>
          <Button
            size="lg"
            onClick={user ? saveWound : () => setAuthMode("daftar")}
            disabled={save.pain === null || saving}
            className="sm:min-w-64"
          >
            {saving ? "Menyimpan…" : user ? "Simpan dan mulai pantau" : "Buat akun dan simpan"}
          </Button>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-line/70 bg-canvas/92 backdrop-blur-md">
        <div className="mx-auto max-w-2xl px-4 pb-3 pt-3 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={goBack}
              className="grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-sunken"
              aria-label={step === 0 && !escalation ? "Keluar dari panduan" : "Kembali"}
            >
              <LuArrowLeft size={22} />
            </button>
            <p className="min-w-0 flex-1 text-center text-sm font-semibold text-muted">
              {escalation ? (
                <span className="text-alert">Perlu pertolongan medis</span>
              ) : (
                <>
                  <span className="tabular">Langkah {step + 1} dari {STEPS.length}</span>
                  <span className="text-ink">, {STEPS[step].label}</span>
                </>
              )}
            </p>
            <Link to="/darurat" className="grid h-10 w-10 place-items-center rounded-full text-alert hover:bg-alert-soft" aria-label="Halaman darurat">
              <LuPhone size={20} />
            </Link>
          </div>
          <div className="mt-2.5">
            <ProgressStrip current={step} escalated={Boolean(escalation)} />
          </div>
        </div>
      </header>

      <main className={cx("mx-auto max-w-2xl px-4 pt-7 sm:px-6", footer ? "pb-48" : "pb-16")}>
        {content}
        {!escalation && step >= 3 && <Disclaimer className="mt-10" />}
      </main>

      <Sheet
        open={Boolean(authMode)}
        onClose={() => setAuthMode(null)}
        title={authMode === "masuk" ? "Masuk untuk menyimpan" : "Buat akun untuk menyimpan"}
      >
        <p className="mb-5 text-[15px] text-muted">
          {authMode === "masuk"
            ? "Setelah masuk, luka ini langsung disimpan ke akun Anda."
            : "Setelah akun dibuat, luka ini langsung disimpan dan bisa Anda pantau setiap hari."}
        </p>
        {authMode === "masuk" ? (
          <LoginForm
            onDone={() => {
              setAuthMode(null);
              setSaveAfterAuth(true);
            }}
          />
        ) : (
          <RegisterForm
            submitLabel="Buat akun dan simpan luka"
            onDone={() => {
              setAuthMode(null);
              setSaveAfterAuth(true);
            }}
          />
        )}
        <p className="mt-5 text-center text-[15px] text-muted">
          {authMode === "masuk" ? "Belum punya akun? " : "Sudah punya akun? "}
          <button
            type="button"
            className="min-h-11 font-semibold text-pine"
            onClick={() => setAuthMode(authMode === "masuk" ? "daftar" : "masuk")}
          >
            {authMode === "masuk" ? "Daftar" : "Masuk"}
          </button>
        </p>
      </Sheet>

      {footer && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur-md">
          <div className="mx-auto max-w-2xl px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-6">{footer}</div>
        </div>
      )}
    </div>
  );
}
