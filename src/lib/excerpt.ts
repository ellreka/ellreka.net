// description が無い記事のために、本文の先頭から説明文を作る。
// 見出し・コード・画像・HTML・単独の URL は説明に向かないので除き、Markdown の記号を外した地の文を使う
export const EXCERPT_LENGTH = 120;

export function excerpt(markdown: string, length = EXCERPT_LENGTH): string {
  const body = markdown.replace(/^---\n[\s\S]*?\n---\n/, "");
  const lines: string[] = [];
  let inFence = false;
  for (const raw of body.split("\n")) {
    const line = raw.trim();
    if (line.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence || line === "" || /^#{1,6}\s/.test(line) || /^<.*>$/.test(line)) continue;
    if (line.startsWith("|") || /^[-*_]{3,}$/.test(line)) continue;
    lines.push(line);
  }

  const text = lines
    .join(" ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/(\*\*|__|\*|_|~~)(.+?)\1/g, "$2")
    .replace(/(^|\s)(?:[-*+]|\d+\.|>)\s+/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

  const chars = Array.from(text);
  return chars.length > length ? `${chars.slice(0, length).join("").trimEnd()}…` : text;
}
