import { describe, expect, test } from "vite-plus/test";
import { DEFAULT_OG_IMAGE, ogImageUrl, ogMeta } from "./og";

const image = "https://assets.ellreka.net/og/entries/foo-00000000.png";

function content(meta: ReturnType<typeof ogMeta>, key: string): string | undefined {
  return meta.find((item) => item.property === key || item.name === key)?.content;
}

describe("ogImageUrl", () => {
  test("撮影するページのパスと文章のハッシュからファイル名を決める", () => {
    expect(ogImageUrl("entries/foo", "記事")).toMatch(
      /^https:\/\/assets\.ellreka\.net\/og\/entries\/foo-[0-9a-f]{8}\.png$/,
    );
    expect(DEFAULT_OG_IMAGE).toMatch(/\/og\/default-[0-9a-f]{8}\.png$/);
  });

  test("文章が同じなら同じ URL、変われば別の URL にする", () => {
    expect(ogImageUrl("notes/a", "本文")).toBe(ogImageUrl("notes/a", "本文"));
    expect(ogImageUrl("notes/a", "本文")).not.toBe(ogImageUrl("notes/a", "本文を直した"));
  });
});

describe("ogMeta", () => {
  test("og:url を本番のオリジンの絶対 URL にする", () => {
    const meta = ogMeta({ title: "記事", path: "/entries/foo", type: "article", image });
    expect(content(meta, "og:url")).toBe("https://ellreka.net/entries/foo");
    expect(content(meta, "og:type")).toBe("article");
    expect(content(meta, "og:title")).toBe("記事");
  });

  test("画像を大きなカードで出す", () => {
    const meta = ogMeta({ title: "記事", path: "/entries/foo", type: "article", image });
    expect(content(meta, "og:image")).toBe(image);
    expect(content(meta, "og:image:width")).toBe("1200");
    expect(content(meta, "twitter:card")).toBe("summary_large_image");
  });

  test("description は meta と og:description の両方に出す", () => {
    const meta = ogMeta({
      title: "notes",
      description: "説明",
      path: "/notes",
      type: "website",
      image,
    });
    expect(content(meta, "description")).toBe("説明");
    expect(content(meta, "og:description")).toBe("説明");
  });

  test("description が無ければどちらも出さない", () => {
    const meta = ogMeta({ title: "ellreka.net", path: "/", type: "website", image });
    expect(content(meta, "description")).toBeUndefined();
    expect(content(meta, "og:description")).toBeUndefined();
  });
});
