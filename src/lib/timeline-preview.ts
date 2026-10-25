import { entryPath, visibleEntries } from "./entries";
import { notePreview } from "./note-preview";
import { notePath, visibleNotes } from "./notes";
import { buildTimeline } from "./timeline";
import type { TimelineFilter, TimelineNote } from "./timeline";

// サーバー専用。公開対象からトップ・/notes・/entries のタイムラインを組み立てる。
// 一覧用の本文と画像はここで取り出し、Markdown コンポーネントはブラウザに送らない。
const previews = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>("../content/notes/*.md", {
      query: "?raw",
      import: "default",
      eager: true,
    }),
  ).map(([file, source]) => [
    notePath(file.replace(/^.*\//, "").replace(/\.md$/, "")),
    notePreview(source),
  ]),
);

// entry は一覧に画像だけを出す
const entryImages = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>("../content/entries/*.md", {
      query: "?raw",
      import: "default",
      eager: true,
    }),
  ).map(([file, source]) => [
    entryPath(file.replace(/^.*\//, "").replace(/\.md$/, "")),
    notePreview(source).images,
  ]),
);

// note 詳細の前後の note など、1 件分の一覧向けの表示
export function previewNote(note: TimelineNote) {
  return { ...note, preview: previews[note.path] };
}

// filter に合う項目と、絞り込みに関係なく全体の件数を返す
export function previewTimeline(filter: TimelineFilter) {
  const items = buildTimeline(visibleEntries, visibleNotes)
    .filter(
      (item) =>
        filter === "all" ||
        (filter === "notes" && item.kind === "note") ||
        (filter === "entries" && item.kind === "entry"),
    )
    .map((item) =>
      item.kind === "note" ? previewNote(item) : { ...item, images: entryImages[item.path] ?? [] },
    );
  return { items, counts: { notes: visibleNotes.length, entries: visibleEntries.length } };
}

export type PreviewTimeline = ReturnType<typeof previewTimeline>;
