import { defineHandler, defineHead } from "void";
import type { InferProps } from "void";
import { findEntry } from "../../lib/entries";
import { noteIds, notePath, notes } from "../../lib/notes";
import { formatDate } from "../../lib/timeline";
import { previewNote } from "../../lib/timeline-preview";

export async function getPrerenderPaths() {
  return noteIds.map((id) => ({ id }));
}

export type Props = InferProps<typeof loader>;

export const loader = defineHandler((c) => {
  const path = notePath(c.req.param("id") ?? "");
  const index = notes.findIndex((note) => note.path === path);
  const entryId = notes[index]?.entry;
  // 関連 entry(draft や存在しない id なら出さない)
  const related = entryId ? findEntry(entryId) : undefined;
  // 前後の note はトップと同じく省略した本文と画像だけを渡す(全文の Markdown コンポーネントは使わない)
  const newer = index > 0 ? notes[index - 1] : undefined;
  const older = index >= 0 ? notes[index + 1] : undefined;
  return {
    path,
    related: related ?? null,
    newer: newer ? previewNote(newer) : null,
    older: older ? previewNote(older) : null,
  };
});

// notes にはタイトルが無いので、日付をページタイトルにする
export const head = defineHead<Props>((_c, props) => {
  const note = notes.find((candidate) => candidate.path === props.path);
  return { title: note ? `note ${formatDate(note.date)}` : "note" };
});
