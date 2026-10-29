import { parseNoteFrontmatter } from "./frontmatter";
import type { TimelineNote } from "./timeline";

// entries.ts と同じくサーバー専用。ページのコンポーネントからは import しない。
// 本文は詳細ページで個別に読み込み、ここでは一覧・公開判定に必要な metadata だけを扱う。
const frontmatters = import.meta.glob<Record<string, unknown>>("../content/notes/*.md", {
  import: "frontmatter",
  eager: true,
});

export function notePath(id: string): string {
  return `/notes/${id}`;
}

const allNotes: ReadonlyArray<TimelineNote> = Object.entries(frontmatters)
  .map(([file, frontmatter]): TimelineNote => ({
    kind: "note",
    path: notePath(file.replace(/^.*\//, "").replace(/\.md$/, "")),
    ...parseNoteFrontmatter(frontmatter),
  }))
  .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

export const visibleNotes: ReadonlyArray<TimelineNote> = import.meta.env.DEV
  ? allNotes
  : allNotes.filter((note) => !note.draft);

export const publishedNotes: ReadonlyArray<TimelineNote> = allNotes.filter((note) => !note.draft);

export function findNote(id: string): TimelineNote | undefined {
  return visibleNotes.find((note) => note.path === notePath(id));
}
