import { Link } from "@void/solid";
import MarkdownExit from "markdown-exit";
import { createMemo, createSignal, For, onCleanup, Show } from "solid-js";
import { SiteFrame } from "../../../components/site-frame";
import { IMAGE_EXTENSIONS, placeholderIds, UPLOAD_PLACEHOLDER } from "../../../lib/note-post";
import type { Props } from "./new.server";

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
  | { kind: "done"; path: string; commitUrl: string }
  | { kind: "error"; message: string };

export default function NewNotePage(props: Props) {
  const [body, setBody] = createSignal("");
  const [entry, setEntry] = createSignal("");
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
    const images = [...files].filter((file) => IMAGE_EXTENSIONS[file.type]);
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
    if (body().trim() === "" || status().kind === "sending") return;
    setStatus({ kind: "sending" });
    const form = new FormData();
    form.set("body", body());
    form.set("entry", entry());
    const used = new Set(placeholderIds(body()));
    for (const upload of uploads()) {
      if (used.has(upload.id)) form.set(`upload:${upload.id}`, upload.file);
    }
    try {
      const response = await fetch("/admin/api/notes", { method: "POST", body: form });
      const result = (await response.json()) as
        | { path: string; commitUrl: string }
        | { error: string };
      if ("error" in result) {
        setStatus({ kind: "error", message: result.error });
        return;
      }
      setStatus({ kind: "done", path: result.path, commitUrl: result.commitUrl });
    } catch (error: unknown) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "送信に失敗しました",
      });
    }
  };

  return (
    <SiteFrame wide current="notes">
      <div class="flex flex-col gap-6 pt-12 pb-18">
        <div class="flex items-center justify-between border-b border-border pb-4 font-mono text-sm">
          <Link href="/" class="text-text-2">
            All notes
          </Link>
          <span class="text-text-3">new note</span>
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
            placeholder="いま考えていること。画像は貼り付けかドロップで追加"
            class="min-h-80 w-full resize-y rounded-md border border-border bg-surface p-4 font-sans text-base leading-relaxed text-text outline-none placeholder:text-text-3 focus:border-line"
          />
          {/* 自分の入力だけを描画するプレビュー(markdown-exit で生の HTML は無効にしている) */}
          <div
            class="void-md min-h-80 rounded-md border border-border p-4 font-sans text-base leading-relaxed [&_img]:max-w-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
            innerHTML={preview()}
          />
        </div>

        <div class="flex flex-wrap items-center gap-4 font-mono text-xs text-text-2">
          <label class="flex cursor-pointer items-center gap-2 rounded border border-border px-3 py-1.5">
            画像を追加
            <input
              type="file"
              accept={Object.keys(IMAGE_EXTENSIONS).join(",")}
              multiple
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
              onChange={(event) => setEntry(event.currentTarget.value)}
              class="max-w-80 rounded border border-border bg-surface px-2 py-1.5 text-text"
            >
              <option value="">なし</option>
              <For each={props.entries}>
                {(option) => <option value={option.id}>{option.title}</option>}
              </For>
            </select>
          </label>
          <button
            type="button"
            disabled={body().trim() === "" || status().kind === "sending"}
            onClick={() => void submit()}
            class="ml-auto rounded bg-text px-4 py-1.5 font-semibold text-bg disabled:opacity-40"
          >
            {status().kind === "sending" ? "投稿中…" : "投稿する (⌘ + Enter)"}
          </button>
        </div>

        <Show when={done()}>
          {(result) => (
            <p class="font-mono text-xs text-text-2">
              commit しました。デプロイ後に <a href={result().path}>{result().path}</a>{" "}
              で公開されます(<a href={result().commitUrl}>commit</a>)
            </p>
          )}
        </Show>
        <Show when={failed()}>
          {(result) => <p class="font-mono text-xs text-orange-400">{result().message}</p>}
        </Show>

        <Show when={uploads().length > 0}>
          <p class="font-mono text-xs text-text-3">
            画像は投稿時に R2 へアップロードされます({uploads().length} 件)
          </p>
        </Show>
      </div>
    </SiteFrame>
  );
}
