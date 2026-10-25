import { defineHandler, defineHead } from "void";
import type { InferProps } from "void";
import { entryLead, findEntry, publishedEntries } from "../../lib/entries";

// draft は書き出さない
export async function getPrerenderPaths() {
  return publishedEntries.map((entry) => ({ id: entry.path.slice("/entries/".length) }));
}

export type Props = InferProps<typeof loader>;

export const loader = defineHandler((c) => {
  const id = c.req.param("id") ?? "";
  // 本番では draft も見つからない扱いになる
  const entry = findEntry(id);
  if (!entry) return c.notFound();
  return { id, entry, lead: entryLead(id) };
});

export const head = defineHead<Props>((_c, props) => ({
  title: props.entry.title,
  meta: props.entry.description ? [{ name: "description", content: props.entry.description }] : [],
}));
