import { useFrontmatter } from "@void/md";

// @void/md の useFrontmatter() は Record<string, unknown> を返すだけなので、ここで検証して型を付ける
export type ArticleFrontmatter = {
  title: string;
};

export function parseArticleFrontmatter(frontmatter: Record<string, unknown>): ArticleFrontmatter {
  const { title } = frontmatter;
  if (typeof title !== "string") {
    throw new Error(`frontmatter.title must be a string: ${JSON.stringify(frontmatter)}`);
  }
  return { title };
}

export function useArticleFrontmatter(): ArticleFrontmatter {
  return parseArticleFrontmatter(useFrontmatter());
}
