import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parse } from "yaml";
import { expect, test, vi } from "vite-plus/test";
import { listLocalNotes, readLocalNote, saveLocalImage, saveLocalNote } from "./note-local";
import { listNotes, parseNoteSource, readNote, saveNote, updateNoteMarkdown } from "./note-store";
import { callLocalNotes } from "./note-dev";

vi.mock("void/env", () => ({ env: {} }));
vi.mock("./note-dev", () => ({ callLocalNotes: vi.fn() }));

test("ローカルで新規作成・編集でき、重複や古い版での保存は元の本文を上書きしない", () => {
  const root = mkdtempSync(join(tmpdir(), "note-local-"));
  const cwd = vi.spyOn(process, "cwd").mockReturnValue(root);
  const id = "2026-10-21-184012";
  try {
    expect(listLocalNotes()).toEqual([]);
    saveLocalNote(id, "最初の本文");
    const first = readLocalNote(id);
    expect(first.source).toBe("最初の本文");
    expect(() => saveLocalNote(id, "重複")).toThrow(/同じ id/);
    saveLocalNote(id, "更新した本文", first.version);
    expect(() => saveLocalNote(id, "古い編集", first.version)).toThrow(/変更されています/);
    expect(readLocalNote(id).source).toBe("更新した本文");
    expect(listLocalNotes()).toEqual([{ id, source: "更新した本文" }]);
    expect(() => readLocalNote("2026-10-21-missing")).toThrow(/見つかりません/);
    const key = "notes/2026/012345abcdef.png";
    expect(saveLocalImage(key, new Uint8Array([1, 2, 3]))).toBe(`/note-assets/${key}`);
    expect(readFileSync(join(root, "public/note-assets", key))).toEqual(Buffer.from([1, 2, 3]));
    expect(() => saveLocalImage("../outside.png", new Uint8Array())).toThrow(/不正な画像/);
  } finally {
    cwd.mockRestore();
    rmSync(root, { recursive: true, force: true });
  }
});

test("編集は本文と関連 entry だけを変え、日時や他の frontmatter を保つ", () => {
  const source = "---\ndate: 2026-09-02 23:18\nentry: previous\ncustom: keep\n---\n\n元の本文\n";
  expect(parseNoteSource(source)).toEqual({ body: "元の本文", entry: "previous", draft: false });
  const updated = updateNoteMarkdown(source, {
    body: "新しい本文\n\n![](/existing.png)",
    entry: "next",
  });
  const metadata = (source: string) => parse(source.split("---")[1]);
  expect(metadata(updated)).toEqual({ date: "2026-09-02 23:18", entry: "next", custom: "keep" });
  expect(parseNoteSource(updated).body).toBe("新しい本文\n\n![](/existing.png)");
  expect(metadata(updateNoteMarkdown(updated, { body: "本文" }))).not.toHaveProperty("entry");
  const dateOnly = "---\ndate: 2026-09-02\n---\n\n本文\n";
  expect(metadata(updateNoteMarkdown(dateOnly, { body: "更新" })).date).toBe("2026-09-02");
});

test("管理一覧は保存先の最新の本文から抜粋を作り、日時の新しい順に返す", async () => {
  vi.mocked(callLocalNotes).mockResolvedValueOnce([
    { id: "2026-09-02-older", source: "---\ndate: 2026-09-02 09:00\n---\n\n**前の投稿**\n" },
    { id: "2026-09-02-newer", source: "---\ndate: 2026-09-02 23:18\n---\n\n編集した最新の本文\n" },
  ]);
  expect(await listNotes()).toEqual([
    {
      id: "2026-09-02-newer",
      date: "2026-09-02 23:18",
      description: "編集した最新の本文",
      draft: false,
    },
    { id: "2026-09-02-older", date: "2026-09-02 09:00", description: "前の投稿", draft: false },
  ]);
  expect(callLocalNotes).toHaveBeenCalledWith({ action: "list" });
  vi.mocked(callLocalNotes).mockResolvedValueOnce([]);
  expect(await listNotes()).toEqual([]);
});

test("読み込み・保存の両方で notes の外を指す id を拒否する", async () => {
  for (const id of ["../../env", "2026-01-01-../secret", "2026-01-01-a/b", ""]) {
    await expect(readNote(id)).rejects.toMatchObject({ status: 400 });
    await expect(saveNote(id, "本文")).rejects.toMatchObject({ status: 400 });
  }
});
