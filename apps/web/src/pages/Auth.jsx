import { useEffect, useState } from "react";
import { LuEye, LuEyeOff, LuCheck } from "react-icons/lu";
import { Link, useRouter } from "../lib/router";
import { Banner, Button, Field, MissingHint } from "../components/ui";
import { PlasterGlyph } from "../components/art";
import { useAuth, useToast } from "../store/AppProviders";
import { DEMO_ACCOUNT, USE_MOCK_API } from "../config/env";
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

const secondsUntil = (iso) => (iso ? Math.max(0, Math.ceil((Date.parse(iso) - Date.now()) / 1000)) : 0);

// Langkah kedua daftar/masuk: masukkan kode 6 digit yang dikirim ke email.
export function VerifyEmailForm({ verification, onDone, onBack }) {
  const { verify, resend } = useAuth();
  const [info, setInfo] = useState(verification);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(() => secondsUntil(verification.resendAt));

  useEffect(() => {
    setWait(secondsUntil(info.resendAt));
    const timer = setInterval(() => setWait(secondsUntil(info.resendAt)), 1000);
    return () => clearInterval(timer);
  }, [info.resendAt]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      onDone(await verify({ email: info.email, code }));
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  const sendAgain = async () => {
    setError("");
    setNotice("");
    try {
      const { verification: next } = await resend({ email: info.email });
      setInfo({ ...info, ...next });
      setCode("");
      setNotice("Kode baru sudah dikirim. Kode sebelumnya tidak berlaku lagi.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <p className="text-[15px] text-ink-soft">
        Kami mengirim kode 6 digit ke <span className="font-semibold text-ink">{info.email}</span>. Kode berlaku 15 menit.
      </p>
      {info.devCode && (
        <Banner tone="info" title={USE_MOCK_API ? "Mode demo" : "Mode lokal"}>
          Email belum benar-benar dikirim. Kode Anda: <span className="tabular font-bold text-ink">{info.devCode}</span>
        </Banner>
      )}
      <Field
        label="Kode verifikasi"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
        className="tabular"
      />
      {notice && <Banner tone="info">{notice}</Banner>}
      {error && <Banner tone="alert">{error}</Banner>}
      <div>
        <MissingHint items={[code.length < 6 && "6 digit kode verifikasi"]} />
        <Button type="submit" block size="lg" disabled={busy || code.length < 6}>
          {busy ? "Memeriksa kode…" : "Verifikasi email"}
        </Button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={sendAgain} disabled={wait > 0}>
          {wait > 0 ? <span className="tabular">Kirim ulang dalam {wait} detik</span> : "Kirim ulang kode"}
        </Button>
        {onBack && (
          <Button type="button" variant="ghost" size="sm" onClick={onBack}>
            Ganti email
          </Button>
        )}
      </div>
    </form>
  );
}

export function LoginForm({ onDone }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [verification, setVerification] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await login({ email: form.email.trim().toLowerCase(), password: form.password });
      if (result.verification) {
        setVerification(result.verification);
        setBusy(false);
      } else {
        onDone(result.user);
      }
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  if (verification) {
    return (
      <>
        <Banner tone="caution" className="mb-4">
          Email Anda belum diverifikasi. Masukkan kode yang kami kirim untuk melanjutkan.
        </Banner>
        <VerifyEmailForm verification={verification} onDone={onDone} onBack={() => setVerification(null)} />
      </>
    );
  }

  return (
    <>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Email" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <PasswordField value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="current-password" />
        {error && <Banner tone="alert">{error}</Banner>}
        <div>
          <MissingHint items={[!form.email && "email", !form.password && "kata sandi"]} />
          <Button type="submit" block size="lg" disabled={busy || !form.email || !form.password}>
            {busy ? "Masuk…" : "Masuk"}
          </Button>
        </div>
      </form>
      {USE_MOCK_API && (
        <p className="mt-4 rounded-2xl bg-sunken p-3 text-[13px] text-muted">
          Mode demo: akun tersimpan di browser ini. Daftar dulu, lalu masuk dengan email yang sama.
        </p>
      )}
      {DEMO_ACCOUNT && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-sunken p-3 text-[13px] text-muted">
          <span>
            Akun demo lokal: <span className="font-semibold text-ink-soft">{DEMO_ACCOUNT.email}</span> /{" "}
            <span className="font-semibold text-ink-soft">{DEMO_ACCOUNT.password}</span>
          </span>
          <Button type="button" variant="ghost" size="sm" onClick={() => setForm({ ...DEMO_ACCOUNT })}>
            Isi otomatis
          </Button>
        </div>
      )}
    </>
  );
}

export function RegisterForm({ onDone, submitLabel = "Buat akun" }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", consent: false, understand: false });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [verification, setVerification] = useState(null);
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
      const result = await register({ name: form.name.trim(), email: form.email.trim().toLowerCase(), password: form.password, consent: form.consent });
      if (result.verification) {
        setVerification(result.verification);
        setBusy(false);
      } else {
        onDone(result.user);
      }
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  // Akun sudah dibuat di server; "Ganti email" tidak dibuka di sini karena email itu sudah terdaftar.
  if (verification) return <VerifyEmailForm verification={verification} onDone={onDone} />;

  return (
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
      <div>
        <MissingHint items={[(!form.consent || !form.understand) && "centang kedua persetujuan di atas"]} />
        <Button type="submit" block size="lg" disabled={busy || !form.consent || !form.understand}>
          {busy ? "Membuat akun…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}

export function Login() {
  const { navigate } = useRouter();
  const toast = useToast();
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
      <LoginForm
        onDone={(user) => {
          toast(`Selamat datang kembali, ${user.name.split(" ")[0]}`);
          navigate("/", { replace: true });
        }}
      />
    </AuthLayout>
  );
}

export function Register() {
  const { navigate } = useRouter();
  const toast = useToast();
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
      <RegisterForm
        onDone={() => {
          toast("Email terverifikasi. Akun Anda siap dipakai.");
          navigate("/", { replace: true });
        }}
      />
    </AuthLayout>
  );
}
