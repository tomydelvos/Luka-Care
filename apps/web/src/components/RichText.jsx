// Menampilkan teks konten dengan markup sederhana dari buku: **tebal** dan [tautan](url).
const TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

export function RichText({ text }) {
  if (!text) return null;
  return text.split(TOKEN).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <a key={i} href={link[2]} target="_blank" rel="noreferrer" className="font-semibold text-pine underline-offset-2 hover:underline">
          {link[1]}
        </a>
      );
    }
    return part;
  });
}
