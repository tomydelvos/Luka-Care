import { Hono } from "hono";
import { publicUser, requireUser } from "../lib/auth";
import { ok, publicOrigin } from "../lib/http";
import { deletePhotos } from "../lib/photos";
import { loadWounds, photoKeysOf } from "../lib/wounds";

// Hak subjek data (UU PDP): melihat, mengunduh, dan menghapus semua data.
export const me = new Hono();
me.use("*", requireUser);

me.get("/", (c) => ok(c, publicUser(c.var.user)));

me.get("/export", async (c) => {
  const user = c.var.user;
  return ok(c, {
    exportedAt: new Date().toISOString(),
    user: publicUser(user),
    wounds: await loadWounds(c.env, publicOrigin(c), user.id),
  });
});

me.delete("/", async (c) => {
  const userId = c.var.user.id;
  const keys = await photoKeysOf(c.env, "SELECT id FROM wounds WHERE user_id = ?", [userId]);
  // ON DELETE CASCADE menghapus sesi, luka, catatan, dan baris foto.
  await c.env.DB.prepare("DELETE FROM users WHERE id = ?").bind(userId).run();
  await deletePhotos(c.env, keys);
  return ok(c, null);
});
