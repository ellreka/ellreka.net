import { defineHandler, defineHead } from "void";
import type { InferProps } from "void";
import { findNote, publishedNotes } from "../../../lib/notes";
import { formatDate } from "../../../lib/timeline";
import { noteExcerpt } from "../../../lib/timeline-preview";

// OGP 画像として撮影する note のカード。タイトルが無いので本文の先頭を出す。draft は書き出さない
export async function getPrerenderPaths() {
  return publishedNotes.map((note) => ({ id: note.path.slice("/notes/".length) }));
}

export type Props = InferProps<typeof loader>;

export const loader = defineHandler((c) => {
  const note = findNote(c.req.param("id") ?? "");
  if (!note) return c.notFound();
  return { note, excerpt: noteExcerpt(note) };
});

export const head = defineHead<Props>((_c, props) => ({
  title: `note ${formatDate(props.note.date)}`,
  meta: [{ name: "robots", content: "noindex" }],
}));
