// Semua konten medis LukaCare. Komponen mengimpor dari sini, bukan dari file per topik.
// Setiap blok membawa sumber, label bukti, dan status tinjauan (lihat meta.js).
export { EVIDENCE, isApproved } from "./meta";
export { SOURCES, SOURCE_BY_ID, SOURCE_TOPICS } from "./sources";
export { WOUND_GUIDES, WOUND_TYPE_LIST, MONITOR_SIGNS } from "./wounds";
export { RED_FLAGS, RED_FLAG_BY_ID, LEVEL_COPY, EMERGENCY_LEAD, strongestLevel } from "./redFlags";
export { assessDetails } from "./assessment";
export {
  BED_COLOR_OPTIONS,
  BURN_RECHECK,
  DANGER_REFERENCES,
  FEVER_HINT,
  FLUID_OPTIONS_V2,
  LEVELS,
  PHOTO_HELP,
  REASONS,
  SKIN_OPTIONS,
  SPREAD_OPTIONS,
} from "./checkin";
export { EVIDENCE_NOTE, FOUR_WEEKS, HEALING_PHASES, HEALING_ROWS, RISK_GROUP } from "./healing";
export { CARE_LEVELS, CASE_GROUPS, CASE_STORIES, casesFor } from "./caseStories";
export {
  CHAPTERS,
  CHAPTER_BY_SLUG,
  CHAPTER_FOR_GUIDE,
  CHAPTER_FOR_REASON,
  LIBRARY_INTRO,
  LIBRARY_PARTS,
  WOUND_COLORS,
  chapterFigure,
  chapterFirstAid,
} from "./library";
export {
  BLISTER_RULE,
  BURN_DEGREES,
  BURN_PALMS_BY_ID,
  BURN_QUESTIONS,
  DEPTH_QUESTION,
  depthLayerFor,
  estimateBurn,
} from "./depth";
export * from "./options";
