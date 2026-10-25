import { defineHandler, defineHead } from "void";
import type { InferProps } from "void";
import { isAccessAuthorized } from "../../../lib/access";
import { entryOptions } from "../../../lib/entries";

// 投稿画面はリクエストごとに描画する(静的に書き出さない)
export const prerender = false;

export type Props = InferProps<typeof loader>;

export const loader = defineHandler(async (c) => {
  const authorized = await isAccessAuthorized(c.req.raw);
  if (!authorized) return c.text("forbidden", 403);
  return { entries: entryOptions };
});

export const head = defineHead(() => ({
  title: "new note",
  meta: [{ name: "robots", content: "noindex" }],
}));
