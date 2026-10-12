import { useEffect, useState } from "react";
import { LuDownload, LuLogOut, LuTrash2, LuShieldCheck } from "react-icons/lu";
import { useRouter } from "../lib/router";
import { Button, PageHeader, Sheet } from "../components/ui";
import { useAuth, useToast, useWounds, wipeLocalData } from "../store/AppProviders";
import { exportAll } from "../lib/storage";
import { formatDate } from "../lib/format";
import { APP_ENV, API_URL, USE_MOCK_API } from "../config/env";

export default function Account() {
  const { user, logout } = useAuth();
  const { wounds } = useWounds();
  const { navigate } = useRouter();
  const toast = useToast();
  const [confirmWipe, setConfirmWipe] = useState(false);

  useEffect(() => {
    if (!user) navigate("/masuk", { replace: true });
  }, [user, navigate]);

  if (!user) return null;

  const download = () => {
    const data = exportAll();
    delete data["mock-users"];
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lukacare-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl">
      <PageHeader title="Akun" />
      <section className="flex items-center gap-4 rounded-[1.5rem] border border-line bg-surface p-5">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-plaster-soft text-xl font-extrabold text-ink">
          {user.name.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate text-lg font-extrabold">{user.name}</p>
          <p className="truncate text-[15px] text-muted">{user.email}</p>
          <p className="text-sm text-muted">Bergabung {formatDate(user.createdAt)}</p>
        </div>
      </section>

      <section className="mt-6 rounded-[1.5rem] border border-line bg-surface p-5" aria-labelledby="privasi">
        <h2 id="privasi" className="flex items-center gap-2 text-[17px] font-extrabold">
          <LuShieldCheck size={20} className="text-pine" aria-hidden="true" />
          Data dan privasi
        </h2>
        <p className="mt-1 text-[15px] text-muted">
          Persetujuan pengolahan data kesehatan diberikan {formatDate(user.consentAt)}. Anda berhak mengunduh atau menghapus data kapan saja.
        </p>
        <p className="tabular mt-3 text-[15px]">{wounds.length} catatan luka tersimpan.</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" onClick={download}>
            <LuDownload size={18} aria-hidden="true" />
            Unduh data saya
          </Button>
          <Button variant="danger-ghost" onClick={() => setConfirmWipe(true)}>
            <LuTrash2 size={18} aria-hidden="true" />
            Hapus semua data
          </Button>
        </div>
      </section>

      <Button
        variant="secondary"
        className="mt-6"
        onClick={async () => {
          await logout();
          toast("Anda sudah keluar");
          navigate("/", { replace: true });
        }}
      >
        <LuLogOut size={18} aria-hidden="true" />
        Keluar
      </Button>

      <p className="tabular mt-10 text-[13px] text-muted">
        Environment {APP_ENV}. API {USE_MOCK_API ? "mode demo (data di browser)" : API_URL}.
      </p>

      <Sheet
        open={confirmWipe}
        onClose={() => setConfirmWipe(false)}
        title="Hapus semua data?"
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={() => setConfirmWipe(false)}>
              Batal
            </Button>
            <Button variant="danger" onClick={wipeLocalData}>
              Hapus semua
            </Button>
          </div>
        }
      >
        <p className="text-[15px] text-ink-soft">
          Akun demo, catatan luka, foto, dan keranjang di perangkat ini akan dihapus permanen.
        </p>
      </Sheet>
    </div>
  );
}
