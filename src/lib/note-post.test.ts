import { describe, expect, test } from "vite-plus/test";
import { formatTime } from "./timeline";
import {
  buildNoteMarkdown,
  imageKey,
  noteStamp,
  placeholderIds,
  replacePlaceholders,
  toBase64,
} from "./note-post";

describe("noteStamp", () => {
  test("日本時間で id と date を作る", () => {
    const stamp = noteStamp(new Date("2026-10-21T09:40:12Z"));
    expect(stamp).toEqual({ id: "2026-10-21-184012", date: "2026-10-21 18:40", year: "2026" });
    expect(formatTime(stamp.date)).toBe("18:40");
  });

  test("UTC では前日でも日本時間の日付になる", () => {
    expect(noteStamp(new Date("2026-12-31T15:00:00Z")).id).toBe("2027-01-01-000000");
  });
});

describe("buildNoteMarkdown", () => {
  test("関連 entry が無ければ date だけの frontmatter にする", () => {
    expect(buildNoteMarkdown({ date: "2026-10-21 18:40", body: "  本文\n" })).toBe(
      "---\ndate: 2026-10-21 18:40\n---\n\n本文\n",
    );
  });

  test("関連 entry を frontmatter に入れる", () => {
    expect(buildNoteMarkdown({ date: "2026-10-21 18:40", entry: "kanadaku", body: "本文" })).toBe(
      "---\ndate: 2026-10-21 18:40\nentry: kanadaku\n---\n\n本文\n",
    );
  });
});

describe("imageKey", () => {
  const bytes = new TextEncoder().encode("image").buffer;

  test("中身のハッシュと Content-Type から決まる", async () => {
    const key = await imageKey(bytes, "image/png", "2026");
    expect(key).toMatch(/^notes\/2026\/[0-9a-f]{12}\.png$/);
    expect(await imageKey(bytes, "image/png", "2026")).toBe(key);
    expect(await imageKey(bytes, "image/jpeg", "2026")).toBe(key.replace(/\.png$/, ".jpg"));
  });

  test("画像以外は受け付けない", async () => {
    await expect(imageKey(bytes, "text/html", "2026")).rejects.toThrow("unsupported image type");
  });
});

describe("placeholders", () => {
  const body = "![](upload:1)\n文\n![](upload:2)\n![](upload:1)";

  test("本文中の仮の参照を重複なしで取り出す", () => {
    expect(placeholderIds(body)).toEqual(["1", "2"]);
  });

  test("アップロードした URL に置き換え、分からないものは残す", () => {
    expect(replacePlaceholders(body, new Map([["1", "https://assets.ellreka.net/a.png"]]))).toBe(
      "![](https://assets.ellreka.net/a.png)\n文\n![](upload:2)\n![](https://assets.ellreka.net/a.png)",
    );
  });
});

test("toBase64 は UTF-8 で符号化する", () => {
  const encoded = toBase64("日本語 note");
  const decoded = new TextDecoder().decode(Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0)));
  expect(decoded).toBe("日本語 note");
});
