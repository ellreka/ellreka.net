import { defineHandler, defineHead } from "void";
import type { InferProps } from "void";
import { entryLead, entryToc, findEntry, publishedEntries } from "../../lib/entries";
import { ogImageUrl, ogMeta } from "../../lib/og";

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
  return { id, entry, lead: entryLead(id), toc: entryToc(id) };
});

export const head = defineHead<Props>((_c, props) => ({
  title: props.entry.title,
  meta: ogMeta({
    title: props.entry.title,
    description: props.entry.description,
    path: props.entry.path,
    type: "article",
    image: ogImageUrl(`entries/${props.id}`, props.entry.title),
  }),
}));
