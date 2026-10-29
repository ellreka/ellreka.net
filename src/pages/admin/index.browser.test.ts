import { createComponent } from "solid-js";
import { render } from "solid-js/web";
import { expect, test } from "vite-plus/test";
import AdminPage from "./index";

test("管理一覧から新規作成・編集へ移動でき、本文の抜粋と日時を表示する", () => {
  const root = document.createElement("div");
  document.body.appendChild(root);
  const dispose = render(
    () =>
      createComponent(AdminPage, {
        notes: [
          {
            id: "2026-09-02-note",
            date: "2026-09-02 23:18",
            description: "最新の本文の抜粋",
            draft: false,
          },
        ],
      }),
    root,
  );
  try {
    expect(root.querySelector('a[href="/admin/notes/new"]')?.textContent).toBe("new note");
    expect(root.querySelector('a[href="/admin/notes/2026-09-02-note"]')?.textContent).toBe("edit");
    expect(root.querySelector("time")?.textContent).toBe("2026-09-02 23:18");
    expect(root.textContent).toContain("最新の本文の抜粋");
    expect(root.textContent).toContain("admin / notes (1)");
  } finally {
    dispose();
    root.remove();
  }
});

test("note がなくても新規作成のリンクを表示する", () => {
  const root = document.createElement("div");
  document.body.appendChild(root);
  const dispose = render(() => createComponent(AdminPage, { notes: [] }), root);
  try {
    expect(root.textContent).toContain("note はまだありません");
    expect(root.querySelector('a[href="/admin/notes/new"]')).not.toBeNull();
  } finally {
    dispose();
    root.remove();
  }
});
