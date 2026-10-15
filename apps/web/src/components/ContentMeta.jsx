import { useState } from "react";
import { LuBookOpen, LuExternalLink } from "react-icons/lu";
import { Badge, Button, Sheet } from "./ui";
import { Link } from "../lib/router";
import { EVIDENCE, SOURCE_BY_ID, isApproved } from "../content";
import { SHOW_REVIEW_RIBBON } from "../config/env";

const asList = (blocks) => (Array.isArray(blocks) ? blocks : [blocks]).filter(Boolean);

// Pita di staging untuk konten medis yang belum ditinjau klinisi.
export function ReviewRibbon({ blocks, className }) {
  if (!SHOW_REVIEW_RIBBON || asList(blocks).every(isApproved)) return null;
  return (
    <Badge tone="caution" className={className}>
      Belum ditinjau klinisi
    </Badge>
  );
}

export function SourceItem({ source }) {
  return (
    <li className="py-3">
      <a href={source.url} target="_blank" rel="noreferrer" className="group inline-flex items-start gap-1.5 font-semibold text-pine">
        <span className="group-hover:underline">{source.title}</span>
        <LuExternalLink size={14} className="mt-1 shrink-0" aria-hidden="true" />
        <span className="sr-only">(membuka situs lain)</span>
      </a>
      <p className="mt-0.5 text-sm text-muted">
        {source.publisher}
        {source.year ? `, ${source.year}` : ""}. Dipakai untuk: {source.usedFor}.
      </p>
    </li>
  );
}

// Tombol "Sumber" yang membuka daftar rujukan untuk blok-blok yang sedang tampil (PRD F8).
export function SourcesButton({ blocks, title = "Sumber bagian ini", className }) {
  const [open, setOpen] = useState(false);
  const list = asList(blocks);
  const ids = [...new Set(list.flatMap((b) => b.sourceIds ?? []))];
  const evidence = [...new Set(list.map((b) => b.evidence).filter(Boolean))];
  if (!ids.length) return null;

  return (
    <>
      <Button variant="ghost" size="sm" className={className} onClick={() => setOpen(true)}>
        <LuBookOpen size={16} aria-hidden="true" />
        Sumber
      </Button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        footer={
          <Button to="/sumber" variant="secondary" block onClick={() => setOpen(false)}>
            Lihat semua sumber
          </Button>
        }
      >
        <ul className="divide-y divide-line">
          {ids.map((id) => SOURCE_BY_ID[id] && <SourceItem key={id} source={SOURCE_BY_ID[id]} />)}
        </ul>
        {evidence.length > 0 && (
          <p className="mt-4 text-sm text-muted">
            Asal data: {evidence.map((e) => EVIDENCE[e].label.toLowerCase()).join(", ")}.{" "}
            <Link to="/sumber" className="font-semibold text-pine" onClick={() => setOpen(false)}>
              Arti label
            </Link>
          </p>
        )}
      </Sheet>
    </>
  );
}
