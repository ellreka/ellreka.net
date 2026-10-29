import { Hono } from "hono";
import { describe, expect, test, vi } from "vite-plus/test";
import type { CloudEnv } from "void";
import { GET } from "../routes/rss.xml";
import { buildRss, parseJstDate } from "./rss";

vi.mock("void", () => import("void/handler"));
vi.mock("./entries", () => ({
  publishedEntries: Array.from({ length: 51 }, (_, index) => ({
    title: `entry ${index}`,
    path: `/entries/${index}`,
    date: "2026-09-03",
  })),
}));
vi.mock("./notes", () => {
  throw new Error("RSS では notes を読み込まない");
});

test("/rss.xml は notes を読み込まず、公開 entries を最大 50 件出す", async () => {
  const app = new Hono<CloudEnv>().get("/rss.xml", (c) => GET(c) as Response);
  const response = await app.request("/rss.xml");
  const xml = await response.text();
  expect(response.status).toBe(200);
  expect(response.headers.get("content-type")).toBe("application/rss+xml; charset=utf-8");
  expect(xml.match(/<item>/g)).toHaveLength(50);
  expect(xml).toContain("<link>https://ellreka.net/entries/0</link>");
  expect(xml).toContain("<link>https://ellreka.net/entries/49</link>");
  expect(xml).not.toContain("/entries/50");
  expect(xml).not.toContain("/notes/");
});

describe("parseJstDate", () => {
  test("日付だけなら日本時間の 0 時にする", () => {
    expect(parseJstDate("2026-09-03").toISOString()).toBe("2026-09-02T15:00:00.000Z");
  });

  test("時刻があれば日本時間として扱う", () => {
    expect(parseJstDate("2026-09-02 23:18").toISOString()).toBe("2026-09-02T14:18:00.000Z");
  });
});

describe("buildRss", () => {
  const xml = buildRss({
    title: "ellreka.net",
    origin: "https://ellreka.net",
    description: "説明",
    items: [
      { title: "A & B <C>", path: "/entries/a", date: "2026-09-03", description: "本文" },
      { title: "entry", path: "/entries/b", date: "2026-09-02 23:18" },
    ],
  });

  test("項目ごとに絶対 URL のリンクと日時を出す", () => {
    expect(xml).toContain("<link>https://ellreka.net/entries/a</link>");
    expect(xml).toContain("https://ellreka.net/entries/b</guid>");
    expect(xml).toContain("<pubDate>Wed, 02 Sep 2026 14:18:00 GMT</pubDate>");
  });

  test("更新日時は生成した時刻ではなく最新の項目の日時にする", () => {
    expect(xml).toContain("<lastBuildDate>Wed, 02 Sep 2026 15:00:00 GMT</lastBuildDate>");
  });

  test("自身の URL と言語を出す", () => {
    expect(xml).toContain('href="https://ellreka.net/rss.xml"');
    expect(xml).toContain("<language>ja</language>");
  });

  test("タイトルの記号を XML として壊さない", () => {
    expect(xml).not.toContain("<title>A & B <C></title>");
    expect(xml).toMatch(/A &amp; B &lt;C&gt;|<!\[CDATA\[A & B <C>\]\]>/);
  });
});
