import { defineHandler, defineHead } from "void";
import type { InferProps } from "void";
import { findEntry } from "../../lib/entries";
import { noteIds, notePath, notes } from "../../lib/notes";
import { formatDate } from "../../lib/timeline";

export async function getPrerenderPaths() {
  return noteIds.map((id) => ({ id }));
}

export type Props = InferProps<typeof loader>;

export const loader = defineHandler((c) => {
  const path = notePath(c.req.param("id") ?? "");
  const entryId = notes.find((note) => note.path === path)?.entry;
  // 関連 entry(draft や存在しない id なら出さない)
  const related = entryId ? findEntry(entryId) : undefined;
  return { path, related: related ?? null };
});

// notes にはタイトルが無いので、日付をページタイトルにする
export const head = defineHead<Props>((_c, props) => {
  const note = notes.find((candidate) => candidate.path === props.path);
  return { title: note ? `note ${formatDate(note.date)}` : "note" };
});
