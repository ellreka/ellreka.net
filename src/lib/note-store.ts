// サーバー専用。dev は手元のファイル、本番は GitHub の指定ブランチと R2 を読み書きする。
import { parse, stringify } from "yaml";
import { HTTPException } from "hono/http-exception";
import { env } from "void/env";
import { commitFile, listGithubFiles, readGithubFile } from "./github";
import { excerpt } from "./excerpt";
import { parseNoteFrontmatter } from "./frontmatter";
import { ASSETS_ORIGIN, NOTES_DIR, notePath, toBase64 } from "./note-post";
import { callLocalNotes } from "./note-dev";

function splitNote(source: string): { data: Record<string, unknown>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source);
  if (!match) throw new Error("note の frontmatter がありません");
  return { data: parse(match[1]), body: source.slice(match[0].length).trim() };
}

export function parseNoteSource(source: string): { body: string; entry?: string; draft: boolean } {
  const { data, body } = splitNote(source);
  const { entry, draft } = parseNoteFrontmatter(data);
  return { body, entry, draft };
}

// 日付やそれ以外の frontmatter は元の値を保ち、本文・関連 entry・公開状態を更新する。
export function updateNoteMarkdown(
  source: string,
  input: { body: string; entry?: string; draft?: boolean },
): string {
  const { data } = splitNote(source);
  if (input.entry) data.entry = input.entry;
  else delete data.entry;
  if (input.draft === true) data.draft = true;
  else if (input.draft === false) delete data.draft;
  return `---\n${stringify(data)}---\n\n${input.body.trim()}\n`;
}

function githubConfig() {
  if (!env.GITHUB_TOKEN) {
    throw new HTTPException(503, { message: "GITHUB_TOKEN が設定されていません" });
  }
  return { token: env.GITHUB_TOKEN, branch: env.GITHUB_BRANCH };
}

export async function readNote(id: string): Promise<{ source: string; version: string }> {
  const path = notePath(id);
  if (import.meta.env.DEV) return callLocalNotes({ action: "read", id });
  const result = await readGithubFile({ ...githubConfig(), path });
  if (!result.ok) {
    throw result.status === 404
      ? new HTTPException(404, { message: "note が見つかりません" })
      : new HTTPException(502, { message: "GitHub からの読み込みに失敗しました" });
  }
  return result;
}

// 管理画面はビルド時の一覧ではなく、保存先の最新の本文から抜粋を作る。
export async function listNotes() {
  let sources: { id: string; source: string }[];
  if (import.meta.env.DEV) {
    sources = await callLocalNotes({ action: "list" });
  } else {
    const directory = await listGithubFiles({ ...githubConfig(), path: NOTES_DIR });
    if (!directory.ok) {
      if (directory.status === 404) return [];
      throw new HTTPException(502, { message: "GitHub からの一覧取得に失敗しました" });
    }
    // ponytail: 各 note の Contents API で本文を読む。Worker の subrequest 上限に近づく件数になったら GraphQL で一括取得する。
    sources = await Promise.all(
      directory.files.map(async (file) => {
        const id = file.slice(0, -3);
        return { id, source: (await readNote(id)).source };
      }),
    );
  }
  return sources
    .map(({ id, source }) => {
      const { data, body } = splitNote(source);
      const { date, draft } = parseNoteFrontmatter(data);
      return { id, date, draft, description: excerpt(body) };
    })
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date) || b.id.localeCompare(a.id));
}

// version なしは新規作成、ありはその版のときだけ更新する。
export async function saveNote(
  id: string,
  content: string,
  version?: string,
): Promise<{ commitUrl?: string }> {
  const path = notePath(id);
  if (import.meta.env.DEV) {
    await callLocalNotes({ action: "save", id, content, version });
    return {};
  }
  const result = await commitFile({
    ...githubConfig(),
    path,
    content,
    sha: version,
    message: `note${version ? " edit" : ""}: ${id}`,
  });
  if (!result.ok) {
    throw result.status === 409 || result.status === 422
      ? new HTTPException(409, {
          message: "note が変更されているか、同じ id が既にあります。編集画面を開き直してください",
        })
      : new HTTPException(502, { message: `GitHub への commit に失敗しました: ${result.message}` });
  }
  return { commitUrl: result.commitUrl };
}

// 保存した画像の URL を返す。dev は public/ に置き、本番は R2 に置く。
export async function saveImage(
  bucket: R2Bucket,
  key: string,
  bytes: ArrayBuffer,
  contentType: string,
): Promise<string> {
  if (import.meta.env.DEV) {
    const result = await callLocalNotes<{ url: string }>({
      action: "image",
      key,
      data: toBase64(bytes),
    });
    return result.url;
  }
  await bucket.put(key, bytes, {
    httpMetadata: { contentType, cacheControl: "public, max-age=31536000, immutable" },
  });
  return `${ASSETS_ORIGIN}/${key}`;
}
