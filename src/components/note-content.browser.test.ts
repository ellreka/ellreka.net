import { createComponent } from "solid-js";
import { render } from "solid-js/web";
import { expect, test } from "vite-plus/test";
import "../app.css";
import { NoteContent } from "./note-content";

const portrait = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="1200"><rect width="600" height="1200" fill="teal"/></svg>')}`;
const image = `<img src="${portrait}" alt="縦長の画像">`;

test("画像のグリッド・拡大・本文の差し替え", async () => {
  const root = document.createElement("div");
  root.style.width = "700px";
  root.style.maxWidth = "100%";
  document.body.appendChild(root);
  const markdown = document.createElement("div");
  markdown.innerHTML = `<p>本文</p><p>${image}\n${image}</p><p>${image}</p><p>途中の本文</p><p>${image}</p><p><a href="https://example.com/">${image}</a></p>`;
  const dispose = render(
    () => createComponent(NoteContent, { class: "void-md", children: markdown }),
    root,
  );

  try {
    await expect.poll(() => root.querySelectorAll("[data-note-gallery]").length).toBe(2);
    const galleries = root.querySelectorAll<HTMLElement>("[data-note-gallery]");
    expect(galleries[0].querySelectorAll("img").length).toBe(3);
    expect(galleries[1].querySelectorAll("img").length).toBe(1);
    expect(getComputedStyle(galleries[0]).display).toBe("grid");
    expect(getComputedStyle(galleries[0]).gridTemplateColumns.split(" ")).toHaveLength(2);
    expect(
      markdown.querySelector('a[href="https://example.com/"]')?.querySelector("img"),
    ).not.toBeNull();
    expect(markdown.querySelectorAll("a[data-note-image]").length).toBe(4);
    expect(markdown.textContent).toContain("途中の本文");

    expect(getComputedStyle(galleries[1].querySelector("img")!).objectFit).toBe("contain");

    const link = galleries[0].querySelector<HTMLAnchorElement>("a")!;
    const dialog = root.querySelector("dialog")!;
    const overflow = getComputedStyle(document.documentElement).overflow;
    link.focus();
    link.click();
    expect(dialog.open).toBe(true);
    expect(getComputedStyle(document.documentElement).overflow).toBe("hidden");
    expect(dialog.querySelector("img")?.alt).toBe("縦長の画像");
    const close = dialog.querySelector("button")!;
    expect(document.activeElement).toBe(close);

    // 同じ note の画像(リンク付きを除く 4 枚)を前後に送れる
    const previous = dialog.querySelector<HTMLButtonElement>('button[aria-label="前の画像"]')!;
    const next = dialog.querySelector<HTMLButtonElement>('button[aria-label="次の画像"]')!;
    expect(previous.disabled).toBe(true);
    for (let i = 0; i < 3; i++) next.click();
    expect(next.disabled).toBe(true);
    dialog.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    expect(next.disabled).toBe(false);
    close.click();
    expect(dialog.open).toBe(false);
    expect(getComputedStyle(document.documentElement).overflow).toBe(overflow);
    expect(document.activeElement).toBe(link);

    link.click();
    markdown.innerHTML = `<p>${image}</p><p>${image}</p>`;
    await expect.poll(() => dialog.open).toBe(false);
    await expect.poll(() => markdown.querySelectorAll("[data-note-gallery]").length).toBe(1);
    expect(markdown.querySelectorAll("a[data-note-image]").length).toBe(2);
  } finally {
    dispose();
    root.remove();
  }
});

test("gallery を切ると画像の並びを変えずに拡大表示だけを付ける", async () => {
  const root = document.createElement("div");
  document.body.appendChild(root);
  const markdown = document.createElement("div");
  markdown.innerHTML = `<p>${image}</p><p>${image}</p><p>本文 ${image}</p>`;
  const dispose = render(
    () => createComponent(NoteContent, { class: "void-md", gallery: false, children: markdown }),
    root,
  );

  try {
    await expect.poll(() => markdown.querySelectorAll("a[data-note-image]").length).toBe(3);
    expect(markdown.querySelectorAll("[data-note-gallery]").length).toBe(0);
    expect(markdown.querySelectorAll(":scope > p").length).toBe(3);
    // notes 用のグリッド表示の指定(本文幅・縦横比を保って収める)は付けない
    expect(getComputedStyle(markdown.querySelector("img")!).objectFit).toBe("fill");

    const dialog = root.querySelector("dialog")!;
    markdown.querySelectorAll<HTMLAnchorElement>("a[data-note-image]")[2].click();
    expect(dialog.open).toBe(true);
    const next = dialog.querySelector<HTMLButtonElement>('button[aria-label="次の画像"]')!;
    expect(next.disabled).toBe(true);
    dialog.querySelector<HTMLButtonElement>('button[aria-label="閉じる"]')!.click();
    expect(dialog.open).toBe(false);
  } finally {
    dispose();
    root.remove();
  }
});
