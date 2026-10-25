import { createComponent } from "solid-js";
import { render } from "solid-js/web";
import { expect, test } from "vite-plus/test";
import "../app.css";
import HomePage from "./index";

test("トップの note は見出し・リストを描画し、長い本文だけ Read more を出す", async () => {
  const root = document.createElement("div");
  document.body.appendChild(root);
  const dispose = render(
    () =>
      createComponent(HomePage, {
        items: [
          {
            kind: "note",
            path: "/notes/short",
            date: "2026-09-02",
            preview: { html: "<p><strong>短い本文</strong></p>", images: [] },
          },
          {
            kind: "note",
            path: "/notes/long",
            date: "2026-09-01",
            preview: {
              html: `<h2>見出し</h2><ul><li>箇条書き</li></ul><ol><li>番号付き</li></ol>${"<p>長い本文</p>".repeat(10)}`,
              images: [],
            },
          },
        ],
      }),
    root,
  );

  try {
    const articles = root.querySelectorAll("article");
    expect(articles[0].querySelector("strong")?.textContent).toBe("短い本文");
    expect(articles[1].querySelector("h2")?.textContent).toBe("見出し");
    // リストの記号はデザインどおり "—"、番号付きは番号を同じ位置に出す
    const unordered = articles[1].querySelector("ul > li")!;
    const ordered = articles[1].querySelector("ol > li")!;
    expect(getComputedStyle(unordered, "::before").content).toBe('"—"');
    expect(getComputedStyle(ordered, "::before").content).toBe('counter(list-item) "."');
    await expect.poll(() => articles[1].textContent).toContain("Read more");
    expect(articles[0].textContent).not.toContain("Read more");
    const body = articles[1].querySelector<HTMLElement>(".void-md")!;
    expect(getComputedStyle(body).webkitLineClamp).toBe("4");
    expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
  } finally {
    dispose();
    root.remove();
  }
});
