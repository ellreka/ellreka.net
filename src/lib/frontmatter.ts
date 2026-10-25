// @void/md の frontmatter は Record<string, unknown> なので、ここで検証して型を付ける
export type EntryFrontmatter = {
  title: string;
  date: string;
  description?: string;
  tags: string[];
  // true の記事は本番では書き出さず、一覧にも出さない(dev では確認できる)
  draft: boolean;
};

export type NoteFrontmatter = {
  date: string;
  // 関連する entry の id(`src/pages/entries/<id>.md`)
  entry?: string;
  draft: boolean;
};

function fail(key: string, expected: string, frontmatter: Record<string, unknown>): never {
  throw new Error(`frontmatter.${key} must be ${expected}: ${JSON.stringify(frontmatter)}`);
}

// YAML の日付は gray-matter で Date になり、Markdown モジュールの frontmatter では JSON 化された ISO 文字列になる。
// 時刻を書いたもの(`2026-10-21 12:00` のように秒が無いと文字列のまま)以外は YYYY-MM-DD に揃える
function parseDate(frontmatter: Record<string, unknown>): string {
  const { date } = frontmatter;
  if (date instanceof Date) return date.toISOString().slice(0, 10);
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/.test(date)) {
    return date.slice(0, 10);
  }
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}/.test(date)) return date;
  return fail("date", "a date (YYYY-MM-DD)", frontmatter);
}

export function parseEntryFrontmatter(frontmatter: Record<string, unknown>): EntryFrontmatter {
  const { title, description, tags = [], draft = false } = frontmatter;
  if (typeof title !== "string") fail("title", "a string", frontmatter);
  if (description !== undefined && typeof description !== "string") {
    fail("description", "a string", frontmatter);
  }
  if (!Array.isArray(tags) || !tags.every((tag) => typeof tag === "string")) {
    fail("tags", "a string array", frontmatter);
  }
  if (typeof draft !== "boolean") fail("draft", "a boolean", frontmatter);
  return { title, date: parseDate(frontmatter), description, tags, draft };
}

export function parseNoteFrontmatter(frontmatter: Record<string, unknown>): NoteFrontmatter {
  const { entry, draft = false } = frontmatter;
  if (entry !== undefined && typeof entry !== "string") fail("entry", "a string", frontmatter);
  if (typeof draft !== "boolean") fail("draft", "a boolean", frontmatter);
  return { date: parseDate(frontmatter), entry, draft };
}
