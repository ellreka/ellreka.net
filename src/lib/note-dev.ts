// Vite ホストのファイル操作を、開発用 Worker から呼び出すための橋渡し。
// 定数は Vite プラグインが void_worker 環境にだけ注入し、本番にはこの呼び出しを含めない。
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";

declare const __LOCAL_NOTES_URL__: string;
declare const __LOCAL_NOTES_TOKEN__: string;

type LocalNoteRequest =
  | { action: "list" }
  | { action: "read"; id: string }
  | { action: "save"; id: string; content: string; version?: string }
  | { action: "image"; key: string; data: string };

export async function callLocalNotes<T>(input: LocalNoteRequest): Promise<T> {
  const response = await fetch(__LOCAL_NOTES_URL__, {
    method: "POST",
    headers: { "content-type": "application/json", "x-local-notes-token": __LOCAL_NOTES_TOKEN__ },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const result = (await response.json()) as { error: string };
    throw new HTTPException(response.status as ContentfulStatusCode, { message: result.error });
  }
  return response.json() as Promise<T>;
}
