import { Link } from "@void/solid";
import MarkdownExit from "markdown-exit";
import { createMemo, createSignal, For, onCleanup, Show } from "solid-js";
import { NoteContent } from "./note-content";
import { SiteFrame } from "./site-frame";
import {
  IMAGE_EXTENSIONS,
  isImageType,
  placeholderIds,
  UPLOAD_PLACEHOLDER,
} from "../lib/note-post";

type NoteEditorProps = {
  entries: ReadonlyArray<{ id: string; title: string }>;
  note?: { id: string; body: string; entry?: string; version: string; draft?: boolean };
};

// プレビュー専用。生の HTML は描画しない
const markdown = new MarkdownExit({ html: false, linkify: true });

type Upload = {
  id: string;
  file: File;
  previewUrl: string;
};

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "done"; path: string; commitUrl?: string }
  | { kind: "error"; message: string };

export function NoteEditor(props: NoteEditorProps) {
  const [body, setBody] = createSignal(props.note?.body ?? "");
  const [entry, setEntry] = createSignal(props.note?.entry ?? "");
  const [draft, setDraft] = createSignal(props.note?.draft ?? false);
  const [uploads, setUploads] = createSignal<Upload[]>([]);
  const [status, setStatus] = createSignal<Status>({ kind: "idle" });
  let textarea: HTMLTextAreaElement | undefined;
  let nextUploadId = 1;
  const done = () => {
    const current = status();
    return current.kind === "done" ? current : undefined;
  };
  const failed = () => {
    const current = status();
    return current.kind === "error" ? current : undefined;
  };
  // 送信中と保存後は入力を止める
  const locked = () => status().kind === "sending" || status().kind === "done";
  // SSR では textarea の value が出力されないので、初期値は子要素としても渡す
  const initialBody = body();

  onCleanup(() => {
    for (const upload of uploads()) URL.revokeObjectURL(upload.previewUrl);
  });

  const insertAtCursor = (text: string) => {
    const start = textarea?.selectionStart ?? body().length;
    const end = textarea?.selectionEnd ?? start;
    setBody((current) => current.slice(0, start) + text + current.slice(end));
    const cursor = start + text.length;
    queueMicrotask(() => textarea?.setSelectionRange(cursor, cursor));
  };

  // 画像は投稿時にまとめて送る。それまでは仮の参照 `upload:<n>` とブラウザ内の URL でプレビューする
  const addImages = (files: Iterable<File>) => {
    const images = [...files].filter((file) => isImageType(file.type));
    if (images.length === 0) return false;
    const added = images.map((file) => ({
      id: String(nextUploadId++),
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setUploads((current) => [...current, ...added]);
    insertAtCursor(added.map((upload) => `![](upload:${upload.id})\n`).join(""));
    return true;
  };

  const preview = createMemo(() => {
    const urls = new Map(uploads().map((upload) => [upload.id, upload.previewUrl]));
    return markdown.render(
      body().replace(UPLOAD_PLACEHOLDER, (placeholder, id: string) =>
        urls.has(id) ? `(${urls.get(id)})` : placeholder,
      ),
    );
  });

  const submit = async () => {
    if (body().trim() === "" || locked()) return;
    setStatus({ kind: "sending" });
    const form = new FormData();
    form.set("body", body());
    form.set("entry", entry());
    form.set("draft", String(draft()));
    if (props.note) {
      form.set("id", props.note.id);
      form.set("version", props.note.version);
    }
    const used = new Set(placeholderIds(body()));
    for (const upload of uploads()) {
      if (used.has(upload.id)) form.set(`upload:${upload.id}`, upload.file);
    }
    try {
      const response = await fetch("/admin/api/notes", {
        method: props.note ? "PUT" : "POST",
        body: form,
      });
      const result = (await response.json()) as
        | { path: string; commitUrl?: string }
        | { error: string };
      if ("error" in result) {
        setStatus({ kind: "error", message: result.error });
        return;
      }
      if (!response.ok) throw new Error("保存に失敗しました");
      setStatus({ kind: "done", path: result.path, commitUrl: result.commitUrl });
    } catch (error: unknown) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "送信に失敗しました",
      });
    }
  };

  return (
    <SiteFrame current="notes">
      <div class="flex flex-col gap-6 pt-12 pb-18">
        <div class="flex items-center justify-between border-b border-border pb-4 font-mono text-sm">
          <Link href="/admin" class="text-text-2">
            All notes
          </Link>
          <span class="text-text-3">{props.note ? "edit note" : "new note"}</span>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          <textarea
            ref={(element) => (textarea = element)}
            value={body()}
            onInput={(event) => setBody(event.currentTarget.value)}
            onPaste={(event) => {
              if (addImages(event.clipboardData?.files ?? [])) event.preventDefault();
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              if (addImages(event.dataTransfer?.files ?? [])) event.preventDefault();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) void submit();
            }}
            aria-label="本文"
            disabled={locked()}
            placeholder="いま考えていること。画像は貼り付けかドロップで追加"
            class="min-h-80 w-full resize-y rounded-md border border-border bg-surface p-4 font-sans text-base leading-relaxed text-text outline-none placeholder:text-text-3 focus:border-line"
          >
            {initialBody}
          </textarea>
          {/* 自分の入力だけを描画するプレビュー(markdown-exit で生の HTML は無効にしている) */}
          <NoteContent class="void-md min-h-80 min-w-0 rounded-md border border-border p-4 font-sans text-base leading-relaxed">
            <div innerHTML={preview()} />
          </NoteContent>
        </div>

        <div class="flex flex-wrap items-center gap-4 font-mono text-xs text-text-2">
          <label class="flex cursor-pointer items-center gap-2 rounded border border-border px-3 py-1.5">
            画像を追加
            <input
              type="file"
              accept={Object.keys(IMAGE_EXTENSIONS).join(",")}
              multiple
              disabled={locked()}
              class="hidden"
              onChange={(event) => {
                addImages(event.currentTarget.files ?? []);
                event.currentTarget.value = "";
              }}
            />
          </label>
          <label class="flex items-center gap-2">
            related entry
            <select
              value={entry()}
              disabled={locked()}
              onChange={(event) => setEntry(event.currentTarget.value)}
              class="max-w-80 rounded border border-border bg-surface px-2 py-1.5 text-text"
            >
              <option value="">なし</option>
              <For each={props.entries}>
                {(option) => <option value={option.id}>{option.title}</option>}
              </For>
            </select>
          </label>
          <label class="flex items-center gap-2">
            <input
              type="checkbox"
              checked={draft()}
              onChange={(event) => setDraft(event.currentTarget.checked)}
              disabled={locked()}
              class="size-4 accent-accent"
            />
            下書き（本番では非公開）
          </label>
          <button
            type="button"
            disabled={body().trim() === "" || locked()}
            onClick={() => void submit()}
            class="ml-auto rounded bg-text px-4 py-1.5 font-semibold text-bg disabled:opacity-40"
          >
            {status().kind === "sending"
              ? "保存中…"
              : draft()
                ? "下書きを保存 (⌘ + Enter)"
                : props.note
                  ? "更新する (⌘ + Enter)"
                  : "投稿する (⌘ + Enter)"}
          </button>
        </div>

        <Show when={done()}>
          {(result) => (
            <p class="font-mono text-xs text-text-2">
              <Show when={result().commitUrl} fallback={<>ローカルに保存しました。 </>}>
                {(url) => (
                  <>
                    commit しました(<a href={url()}>commit</a>)。デプロイ後に反映されます。{" "}
                  </>
                )}
              </Show>
              <Show when={!draft() || import.meta.env.DEV}>
                <a href={result().path}>note を開く</a>
                {" · "}
              </Show>
              <a href={`/admin${result().path}`}>編集する</a>
              {" · "}
              <a href="/admin">一覧に戻る</a>
            </p>
          )}
        </Show>
        <Show when={failed()}>
          {(result) => <p class="font-mono text-xs text-orange-400">{result().message}</p>}
        </Show>

        <Show when={uploads().length > 0}>
          <p class="font-mono text-xs text-text-3">
            {import.meta.env.DEV
              ? "画像は保存時にローカルへ保存されます"
              : "画像は保存時に R2 へアップロードされます"}
            ({uploads().length} 件)
          </p>
        </Show>
      </div>
    </SiteFrame>
  );
}
