import { defineHandler } from "void";
import { env } from "void/env";
import { HTTPException } from "hono/http-exception";
import { isAccessAuthorized } from "../../../lib/access";
import { findEntry } from "../../../lib/entries";
import { readNote, saveImage, saveNote, updateNoteMarkdown } from "../../../lib/note-store";
import {
  buildNoteMarkdown,
  imageKey,
  isImageType,
  MAX_IMAGE_BYTES,
  noteStamp,
  placeholderIds,
  replacePlaceholders,
} from "../../../lib/note-post";

const MAX_BODY_LENGTH = 20_000;

// POST は新規作成、PUT は既存 note の更新。dev はファイル、本番は R2 + GitHub に保存する。
// multipart で本文(body)・関連 entry(entry)・画像(upload:<n>)、更新時は id・version も受け取る
export const POST = defineHandler(async (c) => {
  const authorized = await isAccessAuthorized(c.req.raw);
  if (!authorized) return c.json({ error: "forbidden" }, 403);
  try {
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
    const draftValue = form.get("draft");
    if (draftValue !== null && draftValue !== "true" && draftValue !== "false") {
      return c.json({ error: "draft は true または false で指定してください" }, 400);
    }
    // 古いクライアントなどで指定がない場合、編集では元の公開状態を保つ。
    const draft = draftValue === null ? undefined : draftValue === "true";
    // 画像を置いてから commit できないと分かることがないよう、先に確かめる
    if (!import.meta.env.DEV && !env.GITHUB_TOKEN) {
      return c.json({ error: "GITHUB_TOKEN が設定されていません" }, 503);
    }

    const stamp = noteStamp(new Date());
    let id = stamp.id;
    let existing: { source: string; version: string } | undefined;
    if (c.req.method === "PUT") {
      const editId = form.get("id");
      const version = form.get("version");
      if (typeof editId !== "string" || typeof version !== "string" || version === "") {
        return c.json({ error: "note id と version が必要です" }, 400);
      }
      existing = await readNote(editId);
      if (existing.version !== version) {
        return c.json({ error: "note が変更されています。編集画面を開き直してください" }, 409);
      }
      id = editId;
    }

    const urls = new Map<string, string>();
    for (const uploadId of placeholderIds(body)) {
      const file = form.get(`upload:${uploadId}`);
      if (!(file instanceof File)) {
        return c.json({ error: `画像 upload:${uploadId} がありません` }, 400);
      }
      if (!isImageType(file.type)) {
        return c.json({ error: `${file.name} は対応していない形式です` }, 400);
      }
      if (file.size > MAX_IMAGE_BYTES) return c.json({ error: `${file.name} が大きすぎます` }, 400);

      const bytes = await file.arrayBuffer();
      const key = await imageKey(bytes, file.type, stamp.year);
      urls.set(uploadId, await saveImage(c.env.MEDIA, key, bytes, file.type));
    }

    const input = { entry: entry || undefined, body: replacePlaceholders(body, urls), draft };
    const content = existing
      ? updateNoteMarkdown(existing.source, input)
      : buildNoteMarkdown({ ...input, date: stamp.date });
    const result = await saveNote(id, content, existing?.version);
    return { id, path: `/notes/${id}`, ...result };
  } catch (error) {
    if (error instanceof HTTPException) return c.json({ error: error.message }, error.status);
    console.error("note の保存に失敗しました", error);
    return c.json({ error: "note の保存に失敗しました" }, 500);
  }
});

export const PUT = POST;
