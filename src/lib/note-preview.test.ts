import { expect, test } from "vite-plus/test";
import { notePreview } from "./note-preview";

test("見出し・リスト・装飾は HTML に残し、画像だけを順序どおり分離する", () => {
  const preview = notePreview(`---
date: 2026-09-02
---

## 見出し

**太字**と[リンク](https://example.com/)

- 箇条書き
- 二つ目

1. 番号付き
`);
  expect(preview.html).toContain("<h2>見出し</h2>");
  expect(preview.html).toContain("<strong>太字</strong>");
  expect(preview.html).toContain('<a href="https://example.com/">リンク</a>');
  expect(preview.html).toContain("<ul>");
  expect(preview.html).toContain("<ol>");
  expect(preview.html).toContain("<li>箇条書き</li>");
  expect(preview.html).not.toContain("date:");

  const images = notePreview(`![最初](https://example.com/1.png)

[![次](https://example.com/2.png)](https://example.com/linked)
![最後](https://example.com/3.png)`);
  expect(images.html).toBe("");
  expect(images.images).toEqual([
    { src: "https://example.com/1.png", alt: "最初", href: undefined },
    { src: "https://example.com/2.png", alt: "次", href: "https://example.com/linked" },
    { src: "https://example.com/3.png", alt: "最後", href: undefined },
  ]);
  expect(notePreview("`![コード](https://example.com/code.png)`").images).toEqual([]);
});
