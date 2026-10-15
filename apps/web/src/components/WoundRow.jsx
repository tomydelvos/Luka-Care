import { LuChevronRight } from "react-icons/lu";
import { Link } from "../lib/router";
import { WoundArt } from "./art";
import { Badge } from "./ui";
import { dayNumber, formatDate, isToday } from "../lib/format";
import { assessWound } from "../lib/checkin";
import { LEVELS } from "../content";

export function woundStatus(wound) {
  if (wound.status === "sembuh") return { tone: "mint", label: "Pulih" };
  const { level } = assessWound(wound);
  if (level === "igd" || level === "hari_ini") return { tone: "alert", label: LEVELS[level].label };
  if (level === "beberapa_hari") return { tone: "caution", label: LEVELS[level].label };
  if (!wound.checkins.some((c) => isToday(c.at))) return { tone: "caution", label: "Belum dicek hari ini" };
  return { tone: "pine", label: "Sudah dicek" };
}

export function WoundRow({ wound }) {
  const last = wound.checkins[wound.checkins.length - 1];
  const photo = [...wound.checkins].reverse().find((c) => c.photo)?.photo ?? wound.photos?.at(-1)?.src;
  const status = woundStatus(wound);
  const meta =
    wound.status === "sembuh"
      ? `Pulih ${formatDate(wound.healedAt)}`
      : `Hari ke-${dayNumber(wound.createdAt)}${last ? `, nyeri ${last.pain} dari 10` : ""}`;
  return (
    <Link to={`/pantau/${wound.id}`} className="flex items-center gap-4 py-3.5 hover:opacity-90">
      {photo ? (
        <img src={photo} alt="" className="h-14 w-14 shrink-0 rounded-2xl object-cover" />
      ) : (
        <WoundArt type={wound.type} size={56} className="shrink-0" />
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[16px] font-bold">{wound.title}</span>
        <span className="tabular mt-0.5 block text-sm text-muted">{meta}</span>
        <Badge tone={status.tone} className="mt-1.5">
          {status.label}
        </Badge>
      </span>
      <LuChevronRight size={20} className="shrink-0 text-muted" aria-hidden="true" />
    </Link>
  );
}
