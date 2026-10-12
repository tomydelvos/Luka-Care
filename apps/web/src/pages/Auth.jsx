import { useState } from "react";
import { LuEye, LuEyeOff, LuCheck } from "react-icons/lu";
import { Link, useRouter } from "../lib/router";
import { Banner, Button, Field } from "../components/ui";
import { PlasterGlyph } from "../components/art";
import { useAuth, useToast } from "../store/AppProviders";
import { USE_MOCK_API } from "../config/env";
import { cx } from "../lib/cx";

function AuthLayout({ title, lead, children, footer }) {
  return (
    <div className="mx-auto max-w-md py-2 sm:py-6">
      <PlasterGlyph size={48} />
      <h1 className="mt-4 text-[1.75rem] font-extrabold">{title}</h1>
      <p className="mt-1.5 text-[15px] text-muted">{lead}</p>
      <div className="mt-7">{children}</div>
      <p className="mt-6 text-center text-[15px] text-muted">{footer}</p>
    </div>
  );
}

function PasswordField({ value, onChange, label = "Kata sandi", hint, error, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Field label={label} type={show ? "text" : "password"} value={value} onChange={onChange} hint={hint} error={error} autoComplete={autoComplete} />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-2 top-[2.1rem] grid h-10 w-10 place-items-center rounded-full text-muted hover:text-ink"
        aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
      >
        {show ? <LuEyeOff size={18} /> : <LuEye size={18} />}
      </button>
    </div>
  );
}

function Checkbox({ checked, onChange, children }) {
  return (
    <label className="flex cursor-pointer gap-3 text-[15px] text-ink-soft">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span
        className={cx(
          "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg border-2 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-pine",
          checked ? "border-pine bg-pine text-on-pine" : "border-muted/60 bg-surface"
        )}
        aria-hidden="true"
      >
        {checked && <LuCheck size={15} strokeWidth={3} />}
      </span>
      <span>{children}</span>
    </label>
  );
}

export function Login() {
  const { login } = useAuth();
  const { navigate } = useRouter();
  const toast = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const user = await login({ email: form.email.trim().toLowerCase(), password: form.password });
      toast(`Selamat datang kembali, ${user.name.split(" ")[0]}`);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Masuk"
      lead="Masuk untuk menyimpan riwayat luka dan pesanan ke akun Anda."
      footer={
        <>
          Belum punya akun?{" "}
          <Link to="/daftar" className="font-semibold text-pine">
            Daftar
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Email" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <PasswordField value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="current-password" />
        {error && <Banner tone="alert">{error}</Banner>}
        <Button type="submit" block size="lg" disabled={busy || !form.email || !form.password}>
          {busy ? "Masuk…" : "Masuk"}
        </Button>
      </form>
      {USE_MOCK_API && (
        <p className="mt-4 rounded-2xl bg-sunken p-3 text-[13px] text-muted">
          Mode demo: akun tersimpan di browser ini. Daftar dulu, lalu masuk dengan email yang sama.
        </p>
      )}
    </AuthLayout>
  );
}

export function Register() {
  const { register } = useAuth();
  const { navigate } = useRouter();
  const toast = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "", consent: false, understand: false });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = "Isi nama Anda.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Format email belum benar, contoh: nama@email.com.";
    if (form.password.length < 8) next.password = "Kata sandi minimal 8 karakter.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    setError("");
    try {
      await register({ name: form.name.trim(), email: form.email.trim().toLowerCase(), password: form.password, consent: form.consent });
      toast("Akun dibuat");
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Buat akun"
      lead="Panduan perawatan tetap bisa dipakai tanpa akun. Akun dibutuhkan untuk menyimpan riwayat luka dengan aman."
      footer={
        <>
          Sudah punya akun?{" "}
          <Link to="/masuk" className="font-semibold text-pine">
            Masuk
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Nama" autoComplete="name" value={form.name} onChange={(e) => set({ name: e.target.value })} error={errors.name} />
        <Field label="Email" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={(e) => set({ email: e.target.value })} error={errors.email} />
        <PasswordField value={form.password} onChange={(e) => set({ password: e.target.value })} hint="Minimal 8 karakter" error={errors.password} autoComplete="new-password" />
        <div className="space-y-3 rounded-2xl border border-line bg-surface p-4">
          <Checkbox checked={form.consent} onChange={(consent) => set({ consent })}>
            Saya setuju LukaCare menyimpan foto dan catatan luka saya untuk keperluan pemantauan. Data ini diperlakukan sebagai data pribadi
            yang bersifat spesifik sesuai UU Pelindungan Data Pribadi.
          </Checkbox>
          <Checkbox checked={form.understand} onChange={(understand) => set({ understand })}>
            Saya mengerti LukaCare memberi panduan perawatan dasar, bukan diagnosis medis.
          </Checkbox>
        </div>
        {error && <Banner tone="alert">{error}</Banner>}
        <Button type="submit" block size="lg" disabled={busy || !form.consent || !form.understand}>
          {busy ? "Membuat akun…" : "Buat akun"}
        </Button>
      </form>
    </AuthLayout>
  );
}
