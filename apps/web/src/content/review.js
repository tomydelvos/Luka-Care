// Mengumpulkan semua blok konten medis dan memeriksa metadata-nya.
// Dipakai oleh test (src/content/content.test.js) dan gerbang build production (vite.config.js).
import { isApproved, isBlock } from "./meta";
import { SOURCE_BY_ID } from "./sources";
import { COMMON_STEPS, MONITOR_SIGNS, WOUND_GUIDES } from "./wounds";
import { EMERGENCY_LEAD, LEVEL_COPY, RED_FLAGS } from "./redFlags";
import { CAUTIONS, ESCALATIONS } from "./assessment";
import { CHECKIN_WARNINGS, FEVER_HINT } from "./checkin";
import { CASE_STORIES } from "./caseStories";
import { CHAPTERS, LIBRARY_INTRO, WOUND_COLORS } from "./library";

const CONTENT = {
  wounds: Object.fromEntries(Object.entries(WOUND_GUIDES).map(([id, g]) => [id, { blocks: g.blocks, avoid: g.avoid }])),
  commonSteps: COMMON_STEPS,
  monitorSigns: MONITOR_SIGNS,
  redFlags: RED_FLAGS,
  levelCopy: LEVEL_COPY,
  emergencyLead: EMERGENCY_LEAD,
  escalations: ESCALATIONS,
  cautions: CAUTIONS,
  checkinWarnings: CHECKIN_WARNINGS,
  feverHint: FEVER_HINT,
  caseStories: CASE_STORIES,
  libraryIntro: LIBRARY_INTRO,
  chapters: CHAPTERS.map((c) => ({ [c.slug]: c.nodes })),
  woundColors: WOUND_COLORS.map((g) => g.nodes),
};

// Daftar { path, block } untuk setiap blok. Blok di dalam blok tidak dicari lagi.
export function collectBlocks(node = CONTENT, path = "content") {
  if (isBlock(node)) return [{ path: node.id ? `${path} (${node.id})` : path, block: node }];
  if (!node || typeof node !== "object") return [];
  return Object.entries(node).flatMap(([key, value]) => collectBlocks(value, `${path}.${key}`));
}

const EVIDENCE_LABELS = ["A", "B", "K", "F", "I"];

export function reviewReport(blocks = collectBlocks()) {
  const report = { total: blocks.length, invalid: [], unknownSources: [], unapproved: [] };
  for (const { path, block } of blocks) {
    if (!Array.isArray(block.sourceIds) || !block.sourceIds.length || !EVIDENCE_LABELS.includes(block.evidence)) {
      report.invalid.push(path);
    }
    for (const id of block.sourceIds ?? []) if (!SOURCE_BY_ID[id]) report.unknownSources.push(`${path}: ${id}`);
    if (!isApproved(block)) report.unapproved.push(path);
  }
  return report;
}
