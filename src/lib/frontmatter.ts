import { useFrontmatter } from "@void/md";

// @void/md の useFrontmatter() は Record<string, unknown> を返すだけなので、ここで検証して型を付ける
export type EntryFrontmatter = {
  title: string;
};

export function parseEntryFrontmatter(frontmatter: Record<string, unknown>): EntryFrontmatter {
  const { title } = frontmatter;
  if (typeof title !== "string") {
    throw new Error(`frontmatter.title must be a string: ${JSON.stringify(frontmatter)}`);
  }
  return { title };
}

export function useEntryFrontmatter(): EntryFrontmatter {
  return parseEntryFrontmatter(useFrontmatter());
}
