import { describe, expect, test } from "vite-plus/test";
import { excerpt } from "./excerpt";
import { parseEntryFrontmatter } from "./frontmatter";

describe("excerpt", () => {
  test("見出し・コード・画像・HTML・単独 URL を除いた地の文を使う", () => {
    const markdown = [
      "---",
      "title: t",
      "---",
      "",
      "## はじめに",
      "",
      "最近組んだ **PC** の[備忘録](https://example.com)。`code` も書く。",
      "",
      "```ts",
      "const a = 1;",
      "```",
      "",
      "![](https://assets.ellreka.net/a.png)",
      '<video src="a.mp4" controls></video>',
      "<https://github.com/ellreka>",
      "",
      "- 一つ目",
      "- 二つ目",
    ].join("\n");
    expect(excerpt(markdown)).toBe("最近組んだ PC の備忘録。code も書く。 一つ目 二つ目");
  });

  test("長い本文は文字数で切って … を付ける", () => {
    expect(excerpt("あ".repeat(130), 120)).toBe(`${"あ".repeat(120)}…`);
    expect(excerpt("短い本文")).toBe("短い本文");
  });
});

describe("parseEntryFrontmatter", () => {
  const base = { title: "t", date: "2026-10-21" };

  test("draft は省略すると false", () => {
    expect(parseEntryFrontmatter(base).draft).toBe(false);
    expect(parseEntryFrontmatter({ ...base, draft: true }).draft).toBe(true);
  });

  test("draft が真偽値でなければエラー", () => {
    expect(() => parseEntryFrontmatter({ ...base, draft: "yes" })).toThrow("frontmatter.draft");
  });
});
