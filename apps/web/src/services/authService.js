import { USE_MOCK_API } from "../config/env";
import { readJSON, writeJSON, removeKey } from "../lib/storage";
import { apiFetch } from "./http";

// Endpoint API yang diharapkan (apps/api/src/routes/auth.js):
//   POST /auth/register  { name, email, password, consent } → { verification }
//   POST /auth/login     { email, password }                → { token, user } | { verification } bila email belum diverifikasi
//   POST /auth/verify    { email, code }                    → { token, user }
//   POST /auth/resend    { email }                          → { verification }
//   POST /auth/logout
// verification = { email, resendAt?, devCode? }. devCode hanya ada di dev lokal dan mode mock.

const RESEND_SECONDS = 60;

const mockCode = (users, email) => {
  const code = String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0");
  users[email].code = code;
  writeJSON("mock-users", users);
  return { email, resendAt: new Date(Date.now() + RESEND_SECONDS * 1000).toISOString(), devCode: code };
};

const mock = {
  async register({ name, email, password, consent }) {
    if (!consent) throw new Error("Persetujuan pengolahan data kesehatan diperlukan untuk membuat akun.");
    if (password.length < 8) throw new Error("Kata sandi minimal 8 karakter.");
    const users = readJSON("mock-users", {});
    if (users[email]) throw new Error("Email ini sudah terdaftar. Silakan masuk.");
    const now = new Date().toISOString();
    const user = { id: `u_${Date.now()}`, name, email, consentAt: now, createdAt: now, emailVerifiedAt: null };
    users[email] = { user, password };
    return { verification: mockCode(users, email) };
  },
  async login({ email, password }) {
    const users = readJSON("mock-users", {});
    const found = users[email];
    if (!found || found.password !== password) {
      throw new Error("Email atau kata sandi salah.");
    }
    // Akun mock lama (sebelum ada verifikasi) tidak punya kolom ini dan dianggap terverifikasi.
    if (found.user.emailVerifiedAt === null) return { verification: mockCode(users, email) };
    return { token: `mock.${found.user.id}`, user: found.user };
  },
  async verify({ email, code }) {
    const users = readJSON("mock-users", {});
    const found = users[email];
    if (!found || found.code !== code) throw new Error("Kode salah. Periksa lagi 6 digit kode Anda.");
    found.user.emailVerifiedAt = new Date().toISOString();
    delete found.code;
    writeJSON("mock-users", users);
    return { token: `mock.${found.user.id}`, user: found.user };
  },
  async resend({ email }) {
    const users = readJSON("mock-users", {});
    return { verification: users[email] ? mockCode(users, email) : { email } };
  },
  async logout() {},
};

const http = {
  register: (input) => apiFetch("/auth/register", { method: "POST", body: input }),
  login: (input) => apiFetch("/auth/login", { method: "POST", body: input }),
  verify: (input) => apiFetch("/auth/verify", { method: "POST", body: input }),
  resend: (input) => apiFetch("/auth/resend", { method: "POST", body: input }),
  logout: () => apiFetch("/auth/logout", { method: "POST" }).catch(() => {}),
};

const impl = USE_MOCK_API ? mock : http;

// Simpan sesi hanya bila server memberi token; selain itu teruskan { verification }.
const keep = (result) => {
  if (result.token) writeJSON("session", result);
  return result;
};

export const authService = {
  current: () => readJSON("session", null),
  register: async (input) => keep(await impl.register(input)),
  login: async (input) => keep(await impl.login(input)),
  verify: async (input) => keep(await impl.verify(input)),
  resend: (input) => impl.resend(input),
  async logout() {
    await impl.logout();
    removeKey("session");
  },
};
