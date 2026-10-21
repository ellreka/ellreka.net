import { defineHandler, defineHead } from "void";
import type { InferProps } from "void";
import { noteIds, notePath, notes } from "../../lib/notes";
import { formatDate } from "../../lib/timeline";

export async function getPrerenderPaths() {
  return noteIds.map((id) => ({ id }));
}

export type Props = InferProps<typeof loader>;

export const loader = defineHandler((c) => {
  return { path: notePath(c.req.param("id") ?? "") };
});

// notes にはタイトルが無いので、日付をページタイトルにする
export const head = defineHead<Props>((_c, props) => {
  const note = notes.find((candidate) => candidate.path === props.path);
  return { title: note ? `note ${formatDate(note.date)}` : "note" };
});
