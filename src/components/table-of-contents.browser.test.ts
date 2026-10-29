import { createComponent } from "solid-js";
import { render } from "solid-js/web";
import { expect, test } from "vite-plus/test";
import "../app.css";
import { TableOfContents } from "./table-of-contents";

test("目次はスクロールに合わせて読んでいる見出しを強調する", async () => {
  const article = document.createElement("div");
  article.innerHTML = ["first", "second", "third"]
    .map((slug) => `<h2 id="${slug}">${slug}</h2><div style="height: 1500px"></div>`)
    .join("");
  document.body.appendChild(article);
  const root = document.createElement("div");
  document.body.appendChild(root);
  const dispose = render(
    () =>
      createComponent(TableOfContents, {
        class: "flex",
        headings: [
          { depth: 2, slug: "first", text: "最初" },
          { depth: 3, slug: "second", text: "次" },
          { depth: 2, slug: "third", text: "最後" },
        ],
      }),
    root,
  );
  const current = () => root.querySelector('a[aria-current="location"]')?.textContent;

  try {
    expect(current()).toBe("最初");
    expect(root.querySelector('a[href="#second"]')?.className).toContain("pl-6");
    document.getElementById("third")!.scrollIntoView();
    await expect.poll(current).toBe("最後");
    document.getElementById("second")!.scrollIntoView();
    await expect.poll(current).toBe("次");
  } finally {
    dispose();
    root.remove();
    article.remove();
  }
});

test("ページの終わりまでスクロールしたら、上まで来ない最後の見出しを強調する", async () => {
  const article = document.createElement("div");
  article.innerHTML = `<h2 id="top">top</h2><div style="height: 3000px"></div><h2 id="end">end</h2><div style="height: 100px"></div>`;
  document.body.appendChild(article);
  const root = document.createElement("div");
  document.body.appendChild(root);
  const dispose = render(
    () =>
      createComponent(TableOfContents, {
        class: "flex",
        headings: [
          { depth: 2, slug: "top", text: "最初" },
          { depth: 2, slug: "end", text: "最後" },
        ],
      }),
    root,
  );
  const current = () => root.querySelector('a[aria-current="location"]')?.textContent;

  try {
    window.scrollTo(0, 0);
    await expect.poll(current).toBe("最初");
    window.scrollTo(0, document.documentElement.scrollHeight);
    expect(document.getElementById("end")!.getBoundingClientRect().top).toBeGreaterThan(96);
    await expect.poll(current).toBe("最後");
  } finally {
    dispose();
    root.remove();
    article.remove();
  }
});
