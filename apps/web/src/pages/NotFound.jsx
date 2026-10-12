import { Button } from "../components/ui";
import { PlasterGlyph } from "../components/art";

export default function NotFound() {
  return (
    <div className="py-12 text-center">
      <PlasterGlyph size={56} className="mx-auto" />
      <h1 className="mt-4 text-2xl font-extrabold">Halaman tidak ditemukan</h1>
      <p className="mt-2 text-[15px] text-muted">Alamatnya mungkin salah ketik atau halamannya sudah dipindah.</p>
      <div className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
        <Button to="/">Ke beranda</Button>
        <Button to="/panduan" variant="secondary">
          Mulai panduan luka
        </Button>
      </div>
    </div>
  );
}
