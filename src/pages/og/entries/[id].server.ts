import { defineHandler, defineHead } from "void";
import type { InferProps } from "void";
import { findEntry, publishedEntries } from "../../../lib/entries";

// OGP 画像として撮影する entry のカード。draft は書き出さない
export async function getPrerenderPaths() {
  return publishedEntries.map((entry) => ({ id: entry.path.slice("/entries/".length) }));
}

export type Props = InferProps<typeof loader>;

export const loader = defineHandler((c) => {
  const entry = findEntry(c.req.param("id") ?? "");
  if (!entry) return c.notFound();
  return { entry };
});

export const head = defineHead<Props>((_c, props) => ({
  title: props.entry.title,
  meta: [{ name: "robots", content: "noindex" }],
}));
