import { excerpt } from "./excerpt";
import { parseEntryFrontmatter } from "./frontmatter";
import type { TimelineEntry } from "./timeline";

// サーバー側(*.server.ts と routes)専用。全記事の本文を読むので、ページのコンポーネントからは import しない。
// 記事は src/content/entries/*.md に置き、/entries/:id は動的ルートで描画する
// (Markdown ルーティングだと draft を書き出しから外せないため)
const frontmatters = import.meta.glob<Record<string, unknown>>("../content/entries/*.md", {
  import: "frontmatter",
  eager: true,
});
const sources = import.meta.glob<string>("../content/entries/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

export function entryPath(id: string): string {
  return `/entries/${id}`;
}

// 新しい順。description が無ければ本文から作る
const allEntries: ReadonlyArray<TimelineEntry> = Object.entries(frontmatters)
  .map(([file, frontmatter]): TimelineEntry => {
    const parsed = parseEntryFrontmatter(frontmatter);
    return {
      kind: "entry",
      path: entryPath(file.replace(/^.*\//, "").replace(/\.md$/, "")),
      ...parsed,
      description: parsed.description ?? excerpt(sources[file] ?? ""),
    };
  })
  .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

// 本番では draft を除く。dev では draft も一覧と詳細で確認できる
export const visibleEntries: ReadonlyArray<TimelineEntry> = import.meta.env.DEV
  ? allEntries
  : allEntries.filter((entry) => !entry.draft);

// 公開している(draft でない)記事
export const publishedEntries: ReadonlyArray<TimelineEntry> = allEntries.filter(
  (entry) => !entry.draft,
);

// frontmatter に書かれた description。本文から作ったものは本文の冒頭と重なるので、詳細のリードには使わない
export function entryLead(id: string): string | undefined {
  const frontmatter = frontmatters[`../content/entries/${id}.md`];
  return frontmatter ? parseEntryFrontmatter(frontmatter).description : undefined;
}

export function findEntry(id: string): TimelineEntry | undefined {
  return visibleEntries.find((entry) => entry.path === entryPath(id));
}
