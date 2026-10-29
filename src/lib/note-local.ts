// Vite の開発専用ミドルウェアから使う。Worker 内の node:fs ではホストのファイルは触れない。
import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { HTTPException } from "hono/http-exception";
import { NOTES_DIR, notePath } from "./note-post";

function noteFile(id: string): string {
  return resolve(process.cwd(), notePath(id));
}

export function readLocalNote(id: string) {
  const path = noteFile(id);
  let source: string;
  try {
    source = readFileSync(path, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new HTTPException(404, { message: "note が見つかりません" });
    }
    throw error;
  }
  return { source, version: createHash("sha256").update(source).digest("hex") };
}

export function listLocalNotes(): { id: string; source: string }[] {
  let files;
  try {
    files = readdirSync(resolve(process.cwd(), NOTES_DIR), { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  return files
    .filter((file) => file.isFile() && file.name.endsWith(".md"))
    .map((file) => ({
      id: file.name.slice(0, -3),
      source: readFileSync(resolve(file.parentPath, file.name), "utf8"),
    }));
}

export function saveLocalNote(id: string, content: string, version?: string): void {
  const path = noteFile(id);
  mkdirSync(dirname(path), { recursive: true });
  if (version === undefined) {
    try {
      writeFileSync(path, content, { flag: "wx" });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "EEXIST") {
        throw new HTTPException(409, {
          message: "同じ id の note が既にあります。再度投稿してください",
        });
      }
      throw error;
    }
    return;
  }
  // 比較から書き込みまでは同期処理にし、同じ dev サーバー内の保存が割り込まないようにする。
  if (readLocalNote(id).version !== version) {
    throw new HTTPException(409, {
      message: "note が変更されています。編集画面を開き直してください",
    });
  }
  writeFileSync(path, content);
}

export function saveLocalImage(key: string, bytes: Uint8Array): string {
  if (!/^notes\/\d{4}\/[0-9a-f]{12}\.(avif|gif|jpg|png|webp)$/.test(key)) {
    throw new HTTPException(400, { message: "不正な画像キーです" });
  }
  const path = resolve(process.cwd(), "public/note-assets", key);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, bytes);
  return `/note-assets/${key}`;
}
