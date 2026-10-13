import { Hono } from "hono";
import { cors } from "hono/cors";
import { HttpError, fail, ok } from "./lib/http";
import { auth } from "./routes/auth";
import { wounds } from "./routes/wounds";
import { files, uploads } from "./routes/uploads";
import { me } from "./routes/me";

const app = new Hono();

// ALLOWED_ORIGINS: daftar origin dipisah koma. Entri berakhiran ":*" mengizinkan semua port
// host itu (dipakai di dev lokal, mis. "http://localhost:*"), selain itu harus sama persis.
export function isAllowedOrigin(origin, list) {
  if (!origin) return false;
  return list.some((entry) => {
    if (!entry.endsWith(":*")) return entry === origin;
    const base = entry.slice(0, -1);
    return origin.startsWith(base) && /^\d+$/.test(origin.slice(base.length));
  });
}

app.use("*", async (c, next) => {
  const allowed = (c.env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  return cors({
    origin: (origin) => (isAllowedOrigin(origin, allowed) ? origin : null),
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  })(c, next);
});

app.get("/health", (c) => ok(c, { status: "ok" }));
app.route("/auth", auth);
app.route("/wounds", wounds);
app.route("/uploads", uploads);
app.route("/files", files);
app.route("/me", me);

app.notFound((c) => fail(c, 404, "Alamat API tidak ditemukan."));

app.onError((err, c) => {
  if (err instanceof HttpError) return fail(c, err.status, err.message);
  console.error(err);
  return fail(c, 500, "Terjadi kesalahan di server. Coba lagi beberapa saat.");
});

export default app;
