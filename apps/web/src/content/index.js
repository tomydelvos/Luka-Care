// Semua konten medis LukaCare. Komponen mengimpor dari sini, bukan dari file per topik.
// Setiap blok membawa sumber, label bukti, dan status tinjauan (lihat meta.js).
export { EVIDENCE, isApproved } from "./meta";
export { SOURCES, SOURCE_BY_ID, SOURCE_TOPICS } from "./sources";
export { WOUND_GUIDES, WOUND_TYPE_LIST, MONITOR_SIGNS } from "./wounds";
export { RED_FLAGS, RED_FLAG_BY_ID, LEVEL_COPY, EMERGENCY_LEAD, strongestLevel } from "./redFlags";
export { assessDetails } from "./assessment";
export { CHECKIN_WARNINGS, FEVER_HINT } from "./checkin";
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
} from "./library";
export * from "./options";
