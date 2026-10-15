import { LuMapPin, LuPhone } from "react-icons/lu";
import { Banner, Button } from "./ui";
import { ReviewRibbon, SourcesButton } from "./ContentMeta";
import { LEVELS } from "../content";
import { NEAREST_FACILITY_URL } from "../config/env";

// Banner hasil penilaian (PRD tahap 2, F5). Level `igd` selalu menampilkan telepon 119 dan faskes terdekat.
export function LevelBanner({ assessment, className }) {
  const { level, reasons } = assessment;
  if (level === "pantau" || !reasons.length) return null;
  const info = LEVELS[level];
  const urgent = level === "igd" || level === "hari_ini";
  return (
    <Banner
      tone={urgent ? "alert" : "caution"}
      className={className}
      title={info.title}
      action={
        <div className="flex flex-wrap gap-2">
          {level === "igd" && (
            <Button href="tel:119" variant="danger" size="sm">
              <LuPhone size={16} aria-hidden="true" />
              Telepon 119
            </Button>
          )}
          {urgent ? (
            <Button href={NEAREST_FACILITY_URL} target="_blank" rel="noreferrer" variant={level === "igd" ? "secondary" : "danger"} size="sm">
              <LuMapPin size={16} aria-hidden="true" />
              Cari faskes terdekat
            </Button>
          ) : (
            <Button to="/darurat" variant="secondary" size="sm">
              Lihat kapan harus ke dokter
            </Button>
          )}
          <SourcesButton blocks={[info, ...reasons]} title="Sumber penilaian" />
        </div>
      }
    >
      <ul className="list-disc space-y-0.5 pl-5">
        {reasons.map((r) => (
          <li key={r.id}>{r.text}</li>
        ))}
      </ul>
      <p className="mt-2 text-sm">
        Berdasarkan catatan yang Anda masukkan, bukan diagnosis. <ReviewRibbon blocks={reasons} />
      </p>
    </Banner>
  );
}
