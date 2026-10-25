export type TimelineNote = {
  kind: "note";
  path: string;
  date: string;
  entry?: string;
  draft: boolean;
};

export type TimelineEntry = {
  kind: "entry";
  path: string;
  date: string;
  title: string;
  description?: string;
  tags: string[];
  draft: boolean;
};

export type TimelineItem = TimelineNote | TimelineEntry;

// トップ(all)・/notes・/entries のどれを表示するか
export const TIMELINE_FILTERS = ["all", "notes", "entries"] as const;
export type TimelineFilter = (typeof TIMELINE_FILTERS)[number];

export function buildTimeline(
  entries: ReadonlyArray<TimelineEntry>,
  notes: ReadonlyArray<TimelineNote>,
): TimelineItem[] {
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
