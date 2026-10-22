import { defineHandler } from "void";
import { env } from "void/env";
import { isAccessAuthorized } from "../../../lib/access";
import { commitNewFile } from "../../../lib/github";
import {
  ASSETS_ORIGIN,
  buildNoteMarkdown,
  IMAGE_EXTENSIONS,
  imageKey,
  MAX_IMAGE_BYTES,
  NOTES_DIR,
  noteStamp,
  placeholderIds,
  replacePlaceholders,
} from "../../../lib/note-post";
import { findEntry } from "../../../lib/entries";

const MAX_BODY_LENGTH = 20_000;

// 投稿画面から notes を 1 件作る。
// multipart で本文(body)・関連 entry(entry)・画像(upload:<n>)を受け取り、
// 画像を R2 に置いてから Markdown を GitHub に commit する
export const POST = defineHandler(async (c) => {
  const authorized = await isAccessAuthorized(c.req.raw, {
    teamDomain: env.ACCESS_TEAM_DOMAIN,
    audience: env.ACCESS_AUD,
  });
  if (!authorized) return c.json({ error: "forbidden" }, 403);

  // 別サイトのフォームから送られないよう、同じオリジンからの送信だけ受け付ける
  if (c.req.header("origin") !== new URL(c.req.url).origin) {
    return c.json({ error: "invalid origin" }, 403);
  }

  const form = await c.req.formData();
  const body = form.get("body");
  if (typeof body !== "string" || body.trim() === "") {
    return c.json({ error: "本文が空です" }, 400);
  }
  if (body.length > MAX_BODY_LENGTH) {
    return c.json({ error: `本文は ${MAX_BODY_LENGTH} 文字までです` }, 400);
  }
  const entry = form.get("entry");
  if (entry !== null && (typeof entry !== "string" || (entry !== "" && !findEntry(entry)))) {
    return c.json({ error: "関連 entry が見つかりません" }, 400);
  }

  if (!env.GITHUB_TOKEN) return c.json({ error: "GITHUB_TOKEN が設定されていません" }, 503);
  // ローカルで試すときに本番のブランチへ commit しないようにする
  if (import.meta.env.DEV && env.GITHUB_BRANCH === "main") {
    return c.json(
      { error: "dev では .env の GITHUB_BRANCH に検証用ブランチを指定してください" },
      400,
    );
  }

  const stamp = noteStamp(new Date());
  const urls = new Map<string, string>();
  for (const id of placeholderIds(body)) {
    const file = form.get(`upload:${id}`);
    if (!(file instanceof File)) return c.json({ error: `画像 upload:${id} がありません` }, 400);
    if (!IMAGE_EXTENSIONS[file.type]) {
      return c.json({ error: `${file.name} は対応していない形式です` }, 400);
    }
    if (file.size > MAX_IMAGE_BYTES) return c.json({ error: `${file.name} が大きすぎます` }, 400);

    const bytes = await file.arrayBuffer();
    const key = await imageKey(bytes, file.type, stamp.year);
    await c.env.MEDIA.put(key, bytes, {
      httpMetadata: { contentType: file.type, cacheControl: "public, max-age=31536000, immutable" },
    });
    urls.set(id, `${ASSETS_ORIGIN}/${key}`);
  }

  const result = await commitNewFile({
    token: env.GITHUB_TOKEN,
    branch: env.GITHUB_BRANCH,
    path: `${NOTES_DIR}/${stamp.id}.md`,
    content: buildNoteMarkdown({
      date: stamp.date,
      entry: entry || undefined,
      body: replacePlaceholders(body, urls),
    }),
    message: `note: ${stamp.id}`,
  });
  if (!result.ok) {
    return c.json({ error: `GitHub への commit に失敗しました: ${result.message}` }, 502);
  }
  return { id: stamp.id, path: `/notes/${stamp.id}`, commitUrl: result.commitUrl };
});
