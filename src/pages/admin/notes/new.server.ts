import { defineHandler, defineHead } from "void";
import type { InferProps } from "void";
import { env } from "void/env";
import { isAccessAuthorized } from "../../../lib/access";
import { publishedEntries } from "../../../lib/entries";

// 投稿画面はリクエストごとに描画する(静的に書き出さない)
export const prerender = false;

export type Props = InferProps<typeof loader>;

export const loader = defineHandler(async (c) => {
  const authorized = await isAccessAuthorized(c.req.raw, {
    teamDomain: env.ACCESS_TEAM_DOMAIN,
    audience: env.ACCESS_AUD,
  });
  if (!authorized) return c.text("forbidden", 403);

  // 関連 entry の選択肢(公開中の記事を新しい順に)
  const entries = publishedEntries.map((entry) => ({
    id: entry.path.slice("/entries/".length),
    title: entry.title,
  }));
  return { entries };
});

export const head = defineHead(() => ({
  title: "new note",
  meta: [{ name: "robots", content: "noindex" }],
}));
