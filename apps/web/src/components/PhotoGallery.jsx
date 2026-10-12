import { useRef, useState } from "react";
import { LuImagePlus, LuTrash2 } from "react-icons/lu";
import { Banner, Button, Sheet } from "./ui";
import { compressImage } from "../lib/image";
import { formatDate, formatTime } from "../lib/format";
import { MAX_GALLERY_PHOTOS } from "../services/woundService";
import { useToast, useWounds } from "../store/AppProviders";
import { USE_MOCK_API } from "../config/env";
import { cx } from "../lib/cx";

function PhotoViewer({ wound, photo, onClose }) {
  const { removePhoto } = useWounds();
  const toast = useToast();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  const close = () => {
    setConfirm(false);
    onClose();
  };

  const remove = async () => {
    setBusy(true);
    try {
      await removePhoto(wound.id, photo.id);
      toast("Foto dihapus");
      close();
    } catch (err) {
      toast(err.message, "alert");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Sheet
      open={Boolean(photo)}
      onClose={close}
      title="Foto luka"
      footer={
        confirm ? (
          <div className="space-y-3">
            <p className="text-[15px] text-ink-soft">Foto ini akan dihapus permanen dari galeri.</p>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={() => setConfirm(false)}>
                Batal
              </Button>
              <Button variant="danger" onClick={remove} disabled={busy}>
                {busy ? "Menghapus…" : "Hapus permanen"}
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="danger-ghost" onClick={() => setConfirm(true)}>
            <LuTrash2 size={18} aria-hidden="true" />
            Hapus foto
          </Button>
        )
      }
    >
      {photo && (
        <figure>
          <img src={photo.src} alt={`Foto luka ${formatDate(photo.at)}`} className="w-full rounded-2xl object-contain" />
          <figcaption className="tabular mt-2 text-sm text-muted">
            Diunggah {formatDate(photo.at)}, {formatTime(photo.at)}
          </figcaption>
        </figure>
      )}
    </Sheet>
  );
}

export function PhotoGallery({ wound }) {
  const { addPhotos } = useWounds();
  const toast = useToast();
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [dragging, setDragging] = useState(false);
  const [viewing, setViewing] = useState(null);

  const photos = wound.photos ?? [];
  const remaining = MAX_GALLERY_PHOTOS - photos.length;

  const upload = async (fileList) => {
    const files = [...(fileList ?? [])].filter((f) => f.type.startsWith("image/"));
    if (!files.length) {
      setError("File yang dipilih bukan gambar. Pilih foto JPG atau PNG.");
      return;
    }
    if (remaining <= 0) {
      setError(`Galeri sudah berisi ${MAX_GALLERY_PHOTOS} foto. Hapus salah satu foto dulu untuk menambah yang baru.`);
      return;
    }
    const picked = files.slice(0, remaining);
    setError("");
    setNotice(
      files.length > picked.length
        ? `Hanya ${picked.length} foto yang ditambahkan, karena galeri maksimal ${MAX_GALLERY_PHOTOS} foto.`
        : ""
    );
    setBusy(true);
    try {
      const sources = [];
      for (const file of picked) sources.push(await compressImage(file));
      await addPhotos(wound.id, sources);
      toast(sources.length > 1 ? `${sources.length} foto ditambahkan` : "Foto ditambahkan");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    upload(e.dataTransfer.files);
  };

  return (
    <section aria-labelledby="galeri" className="rounded-[1.5rem] border border-line bg-surface p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="galeri" className="text-[17px] font-extrabold">
          Galeri foto
        </h2>
        <span className="tabular text-sm font-semibold text-muted">
          {photos.length} dari {MAX_GALLERY_PHOTOS} foto
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">
        Simpan foto tambahan di luar catatan harian, misalnya dari sudut lain atau setelah ganti penutup.
      </p>

      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          upload(e.target.files);
          e.target.value = "";
        }}
      />

      <ul className="mt-4 grid max-w-md grid-cols-3 gap-3">
        {photos.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => setViewing(p)}
              className="block w-full overflow-hidden rounded-2xl hover:brightness-95"
              aria-label={`Lihat foto ${formatDate(p.at)}`}
            >
              <img src={p.src} alt="" className="aspect-square w-full object-cover" />
            </button>
            <p className="tabular mt-1 truncate text-[13px] text-muted">{formatDate(p.at)}</p>
          </li>
        ))}
        {remaining > 0 && (
          <li>
            <button
              type="button"
              onClick={() => input.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              disabled={busy}
              className={cx(
                "flex aspect-square w-full flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed px-2 text-center text-sm font-semibold transition-colors disabled:opacity-60",
                dragging ? "border-pine bg-pine-soft text-pine-strong" : "border-line bg-sunken/60 text-ink-soft hover:border-muted"
              )}
            >
              <LuImagePlus size={22} aria-hidden="true" />
              {busy ? "Memproses…" : "Tambah foto"}
            </button>
            <p className="tabular mt-1 text-[13px] text-muted">Sisa {remaining}</p>
          </li>
        )}
      </ul>

      {notice && (
        <Banner tone="caution" className="mt-4">
          {notice}
        </Banner>
      )}
      {error && (
        <p className="mt-3 text-sm text-alert" role="alert">
          {error}
        </p>
      )}
      <p className="mt-3 text-[13px] text-muted">
        {USE_MOCK_API
          ? "Foto hanya disimpan di perangkat ini dan tidak dikirim ke mana pun."
          : "Foto disimpan terenkripsi dan hanya bisa dilihat oleh Anda."}
      </p>

      <PhotoViewer wound={wound} photo={viewing} onClose={() => setViewing(null)} />
    </section>
  );
}
