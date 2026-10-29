// Worker の開発環境は workerd 内なので、ホストへの保存だけ Vite の Node プロセスで行う。
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { HTTPException } from "hono/http-exception";
import type { Plugin } from "vite";
import {
  listLocalNotes,
  readLocalNote,
  saveLocalImage,
  saveLocalNote,
} from "../src/lib/note-local";
import { MAX_IMAGE_BYTES } from "../src/lib/note-post";

export function localNotes(): Plugin {
  // HMR で Worker と Vite の再起動タイミングがずれても、同じ開発用トークンを使う。
  const tokenPath = resolve(process.cwd(), ".void/local-notes-token");
  mkdirSync(resolve(process.cwd(), ".void"), { recursive: true });
  if (!existsSync(tokenPath)) writeFileSync(tokenPath, randomUUID(), { flag: "wx", mode: 0o600 });
  const token = readFileSync(tokenPath, "utf8");
  return {
    name: "local-notes",
    apply: "serve",
    config(config) {
      return {
        environments: {
          void_worker: {
            define: {
              __LOCAL_NOTES_TOKEN__: JSON.stringify(token),
              __LOCAL_NOTES_URL__: JSON.stringify(
                `http://localhost:${config.server?.port ?? 4444}/__local/notes`,
              ),
            },
          },
        },
      };
    },
    configureServer(server) {
      server.middlewares.use("/__local/notes", async (request, response) => {
        response.setHeader("content-type", "application/json");
        response.setHeader("cache-control", "no-store");
        // ブラウザや別サイトから直接ファイル操作を呼べないよう、Worker にだけ渡したトークンを要求する。
        if (request.method !== "POST" || request.headers["x-local-notes-token"] !== token) {
          response.statusCode = 403;
          response.end(JSON.stringify({ error: "forbidden" }));
          return;
        }
        try {
          const chunks: Buffer[] = [];
          let size = 0;
          for await (const chunk of request) {
            size += chunk.length;
            if (size > MAX_IMAGE_BYTES * 1.4)
              throw new HTTPException(413, { message: "大きすぎるリクエストです" });
            chunks.push(chunk);
          }
          const input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
          let result: unknown;
          if (input.action === "list") {
            result = listLocalNotes();
          } else if (input.action === "read" && typeof input.id === "string") {
            result = readLocalNote(input.id);
          } else if (
            input.action === "save" &&
            typeof input.id === "string" &&
            typeof input.content === "string" &&
            (input.version === undefined || typeof input.version === "string")
          ) {
            saveLocalNote(input.id, input.content, input.version);
            result = {};
          } else if (
            input.action === "image" &&
            typeof input.key === "string" &&
            typeof input.data === "string"
          ) {
            const bytes = Buffer.from(input.data, "base64");
            if (bytes.length > MAX_IMAGE_BYTES)
              throw new HTTPException(413, { message: "画像が大きすぎます" });
            result = { url: saveLocalImage(input.key, bytes) };
          } else {
            throw new HTTPException(400, { message: "不正なリクエストです" });
          }
          response.end(JSON.stringify(result));
        } catch (error) {
          response.statusCode = error instanceof HTTPException ? error.status : 500;
          response.end(
            JSON.stringify({
              error: error instanceof Error ? error.message : "保存に失敗しました",
            }),
          );
        }
      });
    },
  };
}
