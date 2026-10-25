import { defineHandler } from "void";
import type { InferProps } from "void";
import { entryPath, visibleEntries } from "../lib/entries";
import { notePreview } from "../lib/note-preview";
import { notePath, notes } from "../lib/notes";
import { buildTimeline } from "../lib/timeline";

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

export type Props = InferProps<typeof loader>;

// 一覧用の本文と画像はサーバー側で組み立て、Markdown コンポーネントはブラウザに送らない。
export const loader = defineHandler(() => {
  return {
    items: buildTimeline(visibleEntries, notes).map((item) =>
      item.kind === "note"
        ? { ...item, preview: previews[item.path] }
        : { ...item, images: entryImages[item.path] ?? [] },
    ),
  };
});
