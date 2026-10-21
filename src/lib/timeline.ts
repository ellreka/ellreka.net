import type { VoidMdPage } from "@void/md/pages";
import { parseEntryFrontmatter } from "./frontmatter";

export type TimelineNote = {
  kind: "note";
  path: string;
  date: string;
  entry?: string;
};

export type TimelineEntry = {
  kind: "entry";
  path: string;
  date: string;
  title: string;
  description?: string;
  tags: string[];
};

export type TimelineItem = TimelineNote | TimelineEntry;

export function buildTimeline(
  pages: ReadonlyArray<VoidMdPage>,
  notes: ReadonlyArray<TimelineNote>,
): TimelineItem[] {
  const entries = pages
    .filter((page) => page.path.startsWith("/entries/"))
    .map((page): TimelineEntry => ({
      kind: "entry",
      path: page.path,
      ...parseEntryFrontmatter(page.frontmatter),
    }));
  return [...notes, ...entries].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

// YYYY-MM-DD 以降(時刻)を落として表示用にする
export function formatDate(date: string): string {
  return date.slice(0, 10);
}

// frontmatter に時刻(HH:MM)が書かれていればそれを返す
export function formatTime(date: string): string | undefined {
  return /^\d{4}-\d{2}-\d{2}[ T](\d{2}:\d{2})/.exec(date)?.[1];
}
