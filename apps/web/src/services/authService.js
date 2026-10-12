import { USE_MOCK_API } from "../config/env";
import { readJSON, writeJSON, removeKey } from "../lib/storage";
import { apiFetch } from "./http";

// Endpoint API yang diharapkan:
//   POST /auth/register  { name, email, password, consent } → { token, user }
//   POST /auth/login     { email, password }                → { token, user }
//   POST /auth/logout

const mock = {
  async register({ name, email, password, consent }) {
    if (!consent) throw new Error("Persetujuan pengolahan data kesehatan diperlukan untuk membuat akun.");
    if (password.length < 8) throw new Error("Kata sandi minimal 8 karakter.");
    const users = readJSON("mock-users", {});
    if (users[email]) throw new Error("Email ini sudah terdaftar. Silakan masuk.");
    const user = { id: `u_${Date.now()}`, name, email, consentAt: new Date().toISOString(), createdAt: new Date().toISOString() };
    users[email] = { user, password };
    writeJSON("mock-users", users);
    return { token: `mock.${user.id}`, user };
  },
  async login({ email, password }) {
    const users = readJSON("mock-users", {});
    const found = users[email];
    if (!found || found.password !== password) {
      throw new Error("Email atau kata sandi salah.");
    }
    return { token: `mock.${found.user.id}`, user: found.user };
  },
  async logout() {},
};

const http = {
  register: (input) => apiFetch("/auth/register", { method: "POST", body: input }),
  login: (input) => apiFetch("/auth/login", { method: "POST", body: input }),
  logout: () => apiFetch("/auth/logout", { method: "POST" }).catch(() => {}),
};

const impl = USE_MOCK_API ? mock : http;

export const authService = {
  current: () => readJSON("session", null),
  async register(input) {
    const session = await impl.register(input);
    writeJSON("session", session);
    return session;
  },
  async login(input) {
    const session = await impl.login(input);
    writeJSON("session", session);
    return session;
  },
  async logout() {
    await impl.logout();
    removeKey("session");
  },
};
