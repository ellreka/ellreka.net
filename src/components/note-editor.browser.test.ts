import { createComponent } from "solid-js";
import { render } from "solid-js/web";
import { expect, test, vi } from "vite-plus/test";
import { NoteEditor } from "./note-editor";

test("編集は元の本文・関連 entry を読み、競合時も入力を失わず PUT で保存する", async () => {
  const root = document.createElement("div");
  document.body.appendChild(root);
  const fetcher = vi
    .fn()
    .mockResolvedValueOnce(Response.json({ error: "note が変更されています" }, { status: 409 }))
    .mockResolvedValueOnce(Response.json({ path: "/notes/2026-09-02-note" }));
  vi.stubGlobal("fetch", fetcher);
  const dispose = render(
    () =>
      createComponent(NoteEditor, {
        entries: [{ id: "related", title: "関連記事" }],
        note: {
          id: "2026-09-02-note",
          body: "元の本文\n\n![](/existing.png)",
          entry: "related",
          version: "original-version",
        },
      }),
    root,
  );

  try {
    const textarea = root.querySelector("textarea")!;
    expect(textarea.value).toContain("元の本文");
    expect(textarea.defaultValue).toBe("元の本文\n\n![](/existing.png)");
    expect(root.querySelector("select")!.value).toBe("related");
    textarea.value = "更新した本文\n\n![](/existing.png)";
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    const submit = [...root.querySelectorAll("button")].find((button) =>
      button.textContent?.includes("更新する"),
    )!;
    submit.click();
    await expect.poll(() => root.textContent).toContain("note が変更されています");
    expect(textarea.value).toContain("更新した本文");
    expect(submit.disabled).toBe(false);
    expect(fetcher.mock.calls[0][0]).toBe("/admin/api/notes");
    const request = fetcher.mock.calls[0][1];
    expect(request.method).toBe("PUT");
    expect(Object.fromEntries(request.body)).toEqual({
      body: textarea.value,
      entry: "related",
      id: "2026-09-02-note",
      version: "original-version",
      draft: "false",
    });
    submit.click();
    await expect.poll(() => root.textContent).toContain("ローカルに保存しました");
    expect(root.querySelector('a[href="/notes/2026-09-02-note"]')).not.toBeNull();
    expect(submit.disabled).toBe(true);
  } finally {
    dispose();
    root.remove();
    vi.unstubAllGlobals();
  }
});
