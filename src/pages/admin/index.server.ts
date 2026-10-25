import { defineHandler, defineHead } from "void";
import type { InferProps } from "void";
import { isAccessAuthorized } from "../../lib/access";
import { listNotes } from "../../lib/note-store";

export const prerender = false;
export type Props = InferProps<typeof loader>;

export const loader = defineHandler(async (c) => {
  c.header("cache-control", "private, no-store");
  const authorized = await isAccessAuthorized(c.req.raw);
  if (!authorized) return c.text("forbidden", 403);
  return { notes: await listNotes() };
});

export const head = defineHead(() => ({
  title: "admin / notes",
  meta: [{ name: "robots", content: "noindex" }],
}));
