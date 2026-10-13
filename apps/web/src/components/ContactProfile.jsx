import { useId } from "react";
import { LuBadgeCheck, LuClock, LuGlobe, LuMail, LuPhone } from "react-icons/lu";
import { FaInstagram, FaWhatsapp } from "react-icons/fa6";
import { cx } from "../lib/cx";
import { Button } from "./ui";
import { PlasterGlyph } from "./art";
import { CONTACT_PROFILE } from "../data/contact";

function contactRows(p) {
  return [
    p.whatsapp && { id: "wa", label: "WhatsApp", value: `+${p.whatsapp}`, href: `https://wa.me/${p.whatsapp}`, icon: FaWhatsapp, external: true },
    p.email && { id: "email", label: "Email", value: p.email, href: `mailto:${p.email}`, icon: LuMail },
    p.instagram && { id: "ig", label: "Instagram", value: `@${p.instagram}`, href: `https://instagram.com/${p.instagram}`, icon: FaInstagram, external: true },
    p.website && { id: "web", label: "Situs", value: p.website.replace(/^https?:\/\//, "").replace(/\/$/, ""), href: p.website, icon: LuGlobe, external: true },
  ].filter(Boolean);
}

/**
 * Profile kontak di footer langkah perawatan. Sengaja dipisah tegas dari nomor darurat
 * agar pengguna tidak menunggu balasan pesan saat kondisinya gawat.
 */
export function ContactProfile({ profile = CONTACT_PROFILE, className }) {
  const headingId = useId();
  const rows = contactRows(profile);
  const reviewer = profile.reviewer;

  return (
    <footer aria-labelledby={headingId} className={cx("overflow-hidden rounded-[1.75rem] border border-line bg-surface", className)}>
      <div className="flex items-center gap-3.5 border-b border-line bg-sunken/60 px-5 py-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-surface ring-1 ring-line" aria-hidden="true">
          <PlasterGlyph size={36} />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-pine">Profile kontak</p>
          <h2 id={headingId} className="text-lg font-extrabold leading-tight">
            {profile.name}
          </h2>
          {profile.role && <p className="text-sm text-muted">{profile.role}</p>}
        </div>
      </div>

      <div className="px-5 py-4">
        {profile.about && <p className="text-[15px] text-ink-soft">{profile.about}</p>}
        {rows.length > 0 && (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {rows.map((r) => {
              const Icon = r.icon;
              return (
                <li key={r.id}>
                  <a
                    href={r.href}
                    {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex min-h-14 items-center gap-3 rounded-2xl border border-line px-3.5 py-2 transition-colors hover:border-muted hover:bg-sunken/60"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pine-soft text-pine-strong" aria-hidden="true">
                      <Icon size={17} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] text-muted">{r.label}</span>
                      <span className="block truncate font-semibold text-ink">{r.value}</span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
        {profile.hours && (
          <p className="mt-3 flex items-start gap-2 text-sm text-muted">
            <LuClock size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>
              {profile.hours}. Pesan dibalas pada jam layanan, tidak langsung.
            </span>
          </p>
        )}
        {reviewer && (
          <p className="mt-3 flex items-start gap-2 text-sm text-ink-soft">
            <LuBadgeCheck size={17} className="mt-0.5 shrink-0 text-pine" aria-hidden="true" />
            <span>
              Konten panduan ditinjau oleh <span className="font-semibold text-ink">{reviewer.name}</span>
              {reviewer.role && `, ${reviewer.role}`}
              {reviewer.org && `, ${reviewer.org}`}.
            </span>
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-alert/30 bg-alert-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink">
          <span className="font-bold">Bukan layanan darurat.</span> Jika kondisi memburuk, telepon 119 atau segera ke IGD terdekat.
        </p>
        <Button href="tel:119" variant="danger" className="shrink-0 self-start sm:self-auto">
          <LuPhone size={16} aria-hidden="true" />
          Telepon 119
        </Button>
      </div>
    </footer>
  );
}
