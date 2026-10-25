import { afterEach, expect, test, vi } from "vite-plus/test";
import { commitFile, listGithubFiles, readGithubFile } from "./github";
import { toBase64 } from "./note-post";

afterEach(() => vi.unstubAllGlobals());

test("指定ブランチから UTF-8 の本文と編集用 SHA を読み、同じ SHA で更新する", async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValueOnce(
      Response.json({ content: `${toBase64("日本語の本文")}\n`, sha: "original-sha" }),
    )
    .mockResolvedValueOnce(Response.json({ commit: { html_url: "https://github.com/commit" } }));
  vi.stubGlobal("fetch", fetcher);
  const input = { token: "test-token", branch: "draft/notes", path: "src/content/notes/test.md" };
  expect(await readGithubFile(input)).toEqual({
    ok: true,
    source: "日本語の本文",
    version: "original-sha",
  });
  expect(fetcher.mock.calls[0][0]).toContain("?ref=draft%2Fnotes");
  expect(
    await commitFile({ ...input, content: "更新", message: "edit", sha: "original-sha" }),
  ).toEqual({
    ok: true,
    commitUrl: "https://github.com/commit",
  });
  expect(JSON.parse(fetcher.mock.calls[1][1].body)).toMatchObject({
    branch: "draft/notes",
    sha: "original-sha",
    content: toBase64("更新"),
  });
});

test("指定ブランチの Markdown ファイルだけを一覧にする", async () => {
  const fetcher = vi.fn().mockResolvedValue(
    Response.json([
      { name: "2026-09-02-first.md", type: "file" },
      { name: "2026-09-03-new.md", type: "file" },
      { name: "images", type: "dir" },
      { name: "memo.txt", type: "file" },
    ]),
  );
  vi.stubGlobal("fetch", fetcher);
  expect(
    await listGithubFiles({ token: "test", branch: "draft/notes", path: "src/content/notes" }),
  ).toEqual({
    ok: true,
    files: ["2026-09-02-first.md", "2026-09-03-new.md"],
  });
  expect(fetcher.mock.calls[0][0]).toContain("/contents/src/content/notes?ref=draft%2Fnotes");
});

test("新規作成は SHA を付けず、GitHub の競合は失敗として返す", async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValue(Response.json({ message: "conflict" }, { status: 409 }));
  vi.stubGlobal("fetch", fetcher);
  expect(
    await commitFile({
      token: "test",
      branch: "main",
      path: "note.md",
      content: "本文",
      message: "create",
    }),
  ).toEqual({ ok: false, status: 409, message: "conflict" });
  expect(JSON.parse(fetcher.mock.calls[0][1].body)).not.toHaveProperty("sha");
});
