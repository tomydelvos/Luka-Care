import { useEffect, useMemo, useRef, useState } from "react";
import { LuArrowLeft, LuX, LuCheck, LuPhone, LuCircleHelp } from "react-icons/lu";
import { Link, useRouter } from "../lib/router";
import { cx } from "../lib/cx";
import { Button, ChoiceGroup, Toggle, Banner, Field, Badge } from "../components/ui";
import { WoundArt } from "../components/art";
import { StepTimer } from "../components/StepTimer";
import { EscalationView } from "../components/EscalationView";
import { ProductRow, ProductSheet } from "../components/shop";
import { PhotoPicker, PainScale } from "../components/monitor";
import { Disclaimer } from "../components/AppShell";
import { RED_FLAGS, RED_FLAG_BY_ID } from "../data/redFlags";
import { WOUND_GUIDES, WOUND_TYPE_LIST, assessDetails } from "../data/woundGuides";
import { AREA_OPTIONS, CONDITION_OPTIONS, SIZE_OPTIONS, WHO_OPTIONS, labelOf } from "../data/options";
import { CATEGORY_BY_ID, productsFor } from "../data/products";
import { useAuth, useToast, useWounds } from "../store/AppProviders";

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
                  checked ? "border-alert bg-alert text-white" : "border-muted/60 bg-surface"
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
              <WoundArt type={g.id} size={64} className="shrink-0" />
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
    </>
  );
}

/* ---------- Langkah 4: perawatan ---------- */
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
                  isDone ? "step-done bg-mint text-white" : isActive ? "bg-pine text-on-pine" : "bg-sunken text-ink-soft"
                )}
                aria-hidden="true"
              >
                {isDone ? <LuCheck size={16} strokeWidth={3} /> : i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className={cx("text-[17px] font-extrabold", isDone && "text-ink-soft")}>{s.title}</h3>
                  {s.optional && <Badge>Opsional</Badge>}
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
  const { create } = useWounds();
  const toast = useToast();
  const headingRef = useRef(null);

  const presetType = WOUND_GUIDES[query.get("jenis")] ? query.get("jenis") : null;
  const [step, setStep] = useState(0);
  const [flags, setFlags] = useState([]);
  const [type, setType] = useState(presetType);
  const [details, setDetails] = useState({ who: "dewasa", area: "", condition: "", size: "", diabetes: false });
  const [done, setDone] = useState({});
  const [escalation, setEscalation] = useState(null);
  const [openProduct, setOpenProduct] = useState(null);
  const [save, setSave] = useState({ title: "", photo: null, pain: null });
  const [saving, setSaving] = useState(false);

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
      const wound = await create(
        { title: save.title.trim() || guide.defaultTitle(AREA_NOUN[details.area]), type, ...details },
        {
          photo: save.photo,
          pain: save.pain,
          redness: "tidak",
          fluid: details.condition === "basah" ? "bening" : "tidak",
          swelling: false,
          fever: false,
          dressingChanged: true,
          note: "Catatan awal dari panduan.",
        }
      );
      toast("Luka disimpan. Catat kondisinya setiap hari.");
      navigate(`/pantau/${wound.id}`, { replace: true });
    } catch (err) {
      toast(err.message, "alert");
      setSaving(false);
    }
  };

  const detailsReady = details.area && details.condition && details.size;
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
          <ChoiceGroup
            label="Seberapa luas?"
            hint="Bandingkan dengan telapak tangan orang yang terluka."
            options={SIZE_OPTIONS}
            value={details.size}
            onChange={(size) => setDetail({ size })}
          />
          <div className="rounded-2xl border border-line bg-surface px-4 py-3">
            <Toggle
              label="Orang yang terluka memiliki diabetes"
              description="Luka pada penderita diabetes perlu perhatian lebih."
              checked={details.diabetes}
              onChange={(diabetes) => setDetail({ diabetes })}
            />
          </div>
        </div>
      </>
    );
    footer = (
      <Button block size="lg" onClick={toDetailsNext} disabled={!detailsReady}>
        Lihat langkah perawatan
      </Button>
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
              <Banner key={c} tone="caution">
                {c}
              </Banner>
            ))}
          </div>
        )}
        <p className="tabular mb-3 text-sm font-semibold text-muted" aria-live="polite">
          {doneCount} dari {careSteps.length} langkah selesai
        </p>
        <CareSteps
          steps={careSteps}
          done={done}
          onDone={(id) => setDone((d) => ({ ...d, [id]: true }))}
          onEscalate={(flagId) => setEscalation({ reasons: [RED_FLAG_BY_ID[flagId]], back: "Kembali ke langkah perawatan" })}
        />
        <section className="mt-8" aria-labelledby="hindari">
          <h2 id="hindari" className="text-lg font-extrabold">
            Yang sebaiknya dihindari
          </h2>
          <ul className="mt-3 space-y-2">
            {guide.avoid.map((a) => (
              <li key={a} className="flex gap-3 text-[15px] text-ink-soft">
                <LuX size={18} className="mt-0.5 shrink-0 text-alert" aria-hidden="true" />
                {a}
              </li>
            ))}
          </ul>
        </section>
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
          {!user && (
            <Banner tone="info" title="Belum masuk akun">
              Catatan akan disimpan di perangkat ini saja.{" "}
              <Link to="/daftar" className="font-semibold text-pine underline underline-offset-2">
                Buat akun
              </Link>{" "}
              agar riwayat luka tersimpan aman dan bisa dibuka di perangkat lain.
            </Banner>
          )}
        </div>
      </>
    );
    footer = (
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="ghost" size="lg" onClick={() => navigate("/")}>
          Selesai tanpa menyimpan
        </Button>
        <Button size="lg" onClick={saveWound} disabled={save.pain === null || saving} className="sm:min-w-64">
          {saving ? "Menyimpan…" : "Simpan dan mulai pantau"}
        </Button>
      </div>
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

      <main className={cx("mx-auto max-w-2xl px-4 pt-7 sm:px-6", footer ? "pb-40" : "pb-16")}>
        {content}
        {!escalation && step >= 3 && <Disclaimer className="mt-10" />}
      </main>

      {footer && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur-md">
          <div className="mx-auto max-w-2xl px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-6">{footer}</div>
        </div>
      )}
    </div>
  );
}
