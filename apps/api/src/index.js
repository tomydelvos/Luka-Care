import { Hono } from "hono";
import { cors } from "hono/cors";
import { HttpError, fail, ok } from "./lib/http";
import { auth } from "./routes/auth";
import { wounds } from "./routes/wounds";
import { files, uploads } from "./routes/uploads";
import { me } from "./routes/me";

const app = new Hono();

app.use("*", async (c, next) => {
  const allowed = (c.env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  return cors({
    origin: (origin) => (allowed.includes(origin) ? origin : null),
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
