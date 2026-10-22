import type { Component } from "solid-js";
import { parseNoteFrontmatter } from "./frontmatter";
import type { TimelineNote } from "./timeline";

type NoteModule = {
  default: Component;
  frontmatter: Record<string, unknown>;
};

// notes は src/content/notes/*.md に置き、/notes/:id は動的ルートで描画する。
// (Markdown ルーティングだと prerender 時に現在の note を特定できないため)
const modules = Object.entries(
  import.meta.glob<NoteModule>("../content/notes/*.md", { eager: true }),
).map(([file, mod]) => ({ id: file.replace(/^.*\//, "").replace(/\.md$/, ""), mod }));

export function notePath(id: string): string {
  return `/notes/${id}`;
}

export const noteBodies: Readonly<Record<string, Component>> = Object.fromEntries(
  modules.map(({ id, mod }) => [notePath(id), mod.default]),
);

// 新しい順
export const notes: ReadonlyArray<TimelineNote> = modules
  .map(({ id, mod }): TimelineNote => ({
    kind: "note",
    path: notePath(id),
    ...parseNoteFrontmatter(mod.frontmatter),
  }))
  .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

export const noteIds: ReadonlyArray<string> = modules.map(({ id }) => id);
