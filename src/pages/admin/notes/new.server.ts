import pages from "@void/md/pages";
import { defineHandler, defineHead } from "void";
import type { InferProps } from "void";
import { env } from "void/env";
import { isAccessAuthorized } from "../../../lib/access";
import { buildTimeline } from "../../../lib/timeline";

// 投稿画面はリクエストごとに描画する(静的に書き出さない)
export const prerender = false;

export type Props = InferProps<typeof loader>;

export const loader = defineHandler(async (c) => {
  const authorized = await isAccessAuthorized(c.req.raw, {
    teamDomain: env.ACCESS_TEAM_DOMAIN,
    audience: env.ACCESS_AUD,
  });
  if (!authorized) return c.text("forbidden", 403);

  // 関連 entry の選択肢(新しい順)
  const entries = buildTimeline(pages, []).flatMap((item) =>
    item.kind === "entry" ? [{ id: item.path.slice("/entries/".length), title: item.title }] : [],
  );
  return { entries };
});

export const head = defineHead(() => ({
  title: "new note",
  meta: [{ name: "robots", content: "noindex" }],
}));
