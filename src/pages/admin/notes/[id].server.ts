import { defineHandler, defineHead } from "void";
import type { InferProps } from "void";
import { isAccessAuthorized } from "../../../lib/access";
import { entryOptions } from "../../../lib/entries";
import { parseNoteSource, readNote } from "../../../lib/note-store";

export const prerender = false;
export type Props = InferProps<typeof loader>;

export const loader = defineHandler(async (c) => {
  const authorized = await isAccessAuthorized(c.req.raw);
  if (!authorized) return c.text("forbidden", 403);
  const id = c.req.param("id") ?? "";
  const saved = await readNote(id);
  return {
    note: { id, ...parseNoteSource(saved.source), version: saved.version },
    entries: entryOptions,
  };
});

export const head = defineHead(() => ({
  title: "edit note",
  meta: [{ name: "robots", content: "noindex" }],
}));
