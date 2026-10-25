import { defineHandler, defineHead } from "void";
import type { InferProps } from "void";
import { findEntry } from "../../lib/entries";
import { findNote, publishedNotes, visibleNotes } from "../../lib/notes";
import { formatDate } from "../../lib/timeline";
import { previewNote } from "../../lib/timeline-preview";

export async function getPrerenderPaths() {
  return publishedNotes.map((note) => ({ id: note.path.slice("/notes/".length) }));
}

export type Props = InferProps<typeof loader>;

export const loader = defineHandler((c) => {
  const id = c.req.param("id") ?? "";
  const note = findNote(id);
  if (!note) return c.notFound();
  const index = visibleNotes.indexOf(note);
  const entryId = note.entry;
  // 関連 entry(draft や存在しない id なら出さない)
  const related = entryId ? findEntry(entryId) : undefined;
  // 前後の note はトップと同じく省略した本文と画像だけを渡す(全文の Markdown コンポーネントは使わない)
  const newer = index > 0 ? visibleNotes[index - 1] : undefined;
  const older = visibleNotes[index + 1];
  return {
    id,
    note,
    related: related ?? null,
    newer: newer ? previewNote(newer) : null,
    older: older ? previewNote(older) : null,
  };
});

// notes にはタイトルが無いので、日付をページタイトルにする
export const head = defineHead<Props>((_c, props) => ({
  title: `note ${formatDate(props.note.date)}`,
}));
