import { defineHandler } from "void";
import { publishedEntries } from "../lib/entries";
import { SITE_DESCRIPTION, SITE_NAME, SITE_ORIGIN } from "../lib/og";
import { buildRss } from "../lib/rss";

// 公開している entries だけを新しい順に出す。draft は dev でも出さない
const MAX_ITEMS = 50;

const xml = buildRss({
  title: SITE_NAME,
  origin: SITE_ORIGIN,
  description: SITE_DESCRIPTION,
  items: publishedEntries.slice(0, MAX_ITEMS),
});

// 拡張子付きのパスなので、デプロイ後は次のデプロイまで edge でキャッシュされる
export const GET = defineHandler((c) =>
  c.body(xml, 200, { "content-type": "application/rss+xml; charset=utf-8" }),
);
