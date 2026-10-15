import { RichText } from "./RichText";
import { ReviewRibbon } from "./ContentMeta";
import { assetUrl } from "../config/env";
import { cx } from "../lib/cx";

// Gambar bab luka (2400 × 1380) dipotong per panel untuk ponsel: potongan/<nama>-atas|penampang.webp.
function WoundFigure({ node, illustration }) {
  const [top, section] = node.alt.split(" Penampang: ");
  return (
    <figure className="my-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <img
          src={assetUrl(`illustrations/potongan/${illustration}-atas.webp`)}
          alt={top}
          width="720"
          height="692"
          loading="lazy"
          decoding="async"
          className="w-full rounded-2xl border border-line bg-canvas"
        />
        {section && (
          <img
            src={assetUrl(`illustrations/potongan/${illustration}-penampang.webp`)}
            alt={`Penampang: ${section}`}
            width="760"
            height="650"
            loading="lazy"
            decoding="async"
            className="w-full rounded-2xl border border-line bg-canvas"
          />
        )}
      </div>
      <figcaption className="mt-2 text-[13px] text-muted">
        Tampak atas dan penampang kulit.{" "}
        <a href={assetUrl(node.src)} target="_blank" rel="noreferrer" className="font-semibold text-pine">
          Lihat gambar utuh
        </a>
      </figcaption>
    </figure>
  );
}

function Figure({ node }) {
  return (
    <figure className="my-6">
      <a href={assetUrl(node.src)} target="_blank" rel="noreferrer" aria-label={`Perbesar gambar: ${node.alt}`}>
        <img
          src={assetUrl(node.src)}
          alt={node.alt}
          width="2400"
          height="1380"
          loading="lazy"
          decoding="async"
          className="w-full rounded-2xl border border-line bg-canvas"
        />
      </a>
      <figcaption className="mt-2 text-[13px] text-muted">Ketuk gambar untuk memperbesar.</figcaption>
    </figure>
  );
}

function List({ items, ordered }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={cx("mt-2 space-y-2 text-[15px] text-ink-soft", ordered ? "list-decimal pl-5" : "")}>
      {items.map((item) =>
        ordered ? (
          <li key={item} className="pl-1">
            <RichText text={item} />
          </li>
        ) : (
          <li key={item} className="flex gap-2.5">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted" aria-hidden="true" />
            <span>
              <RichText text={item} />
            </span>
          </li>
        )
      )}
    </Tag>
  );
}

function Table({ head, rows }) {
  return (
    <div className="mt-3 overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        <thead className="bg-sunken text-ink">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="px-3 py-2.5 font-bold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line text-ink-soft">
          {rows.map((row) => (
            <tr key={row.join("|")}>
              {row.map((cell, i) =>
                i === 0 ? (
                  <th key={i} scope="row" className="px-3 py-2.5 align-top font-semibold text-ink">
                    <RichText text={cell} />
                  </th>
                ) : (
                  <td key={i} className="px-3 py-2.5 align-top">
                    <RichText text={cell} />
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Menampilkan node konten pustaka (lihat src/content/library.js) secara berurutan.
export function LibraryNodes({ nodes, illustration }) {
  return nodes.map((node, i) => {
    const key = `${node.type}-${i}`;
    switch (node.type) {
      case "p":
        return (
          <p key={key} className="mt-4 max-w-prose text-[15px] text-ink-soft">
            <RichText text={node.text} />
          </p>
        );
      case "img":
        return illustration && node.src.endsWith(`${illustration}.png`) ? (
          <WoundFigure key={key} node={node} illustration={illustration} />
        ) : (
          <Figure key={key} node={node} />
        );
      case "list":
        return <List key={key} items={node.items} ordered={node.ordered} />;
      case "table":
        return <Table key={key} head={node.head} rows={node.rows} />;
      case "section":
        return (
          <section key={key} className="mt-7" aria-label={node.label}>
            <h3 className="flex flex-wrap items-center gap-2 text-[17px] font-extrabold">
              {node.label} <ReviewRibbon blocks={node} />
            </h3>
            {node.text && (
              <p className="mt-1.5 max-w-prose text-[15px] text-ink-soft">
                <RichText text={node.text} />
              </p>
            )}
            {node.items && <List items={node.items} ordered={node.ordered} />}
            {node.rows && <Table head={node.head} rows={node.rows} />}
          </section>
        );
      default:
        return null;
    }
  });
}
