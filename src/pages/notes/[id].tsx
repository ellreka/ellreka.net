import { Link } from "@void/solid";
import { createMemo, createSignal, lazy, Show, Suspense } from "solid-js";
import type { Component } from "solid-js";
import { Dynamic } from "solid-js/web";
import { NoteContent } from "../../components/note-content";
import { NoteSummary } from "../../components/note-summary";
import { SiteFrame } from "../../components/site-frame";
import { Dashes } from "../../components/timeline";
import { formatDate, formatTime } from "../../lib/timeline";
import type { TimelineEntry } from "../../lib/timeline";
import type { Props } from "./[id].server";

const COPIED_RESET_MS = 2000;
const COPY_LABELS = { idle: "copy link", copied: "copied", failed: "copy failed" } as const;

// entry と同じく、表示する note の本文だけを読み込む。
const bodies = import.meta.glob<{ default: Component }>("../../content/notes/*.md");

export default function NotePage(props: Props) {
  const Body = createMemo(() => {
    const load = bodies[`../../content/notes/${props.id}.md`];
    return load ? lazy(load) : () => null;
  });

  return (
    <SiteFrame current="notes">
      <div class="flex flex-col pt-12 pb-18">
        <div class="flex border-b border-border pb-4">
          <Link href="/notes" class="font-mono text-sm text-text-2">
            All notes
          </Link>
        </div>
        <div class="flex flex-col pt-3">
          <Show when={props.newer}>
            {(neighbor) => (
              <>
                <Dashes fade="in" />
                <NeighborRow note={neighbor()} />
              </>
            )}
          </Show>
          <article class="flex gap-4">
            <div class="flex w-5 shrink-0 flex-col items-center">
              <div class="h-4.5 w-0.5 bg-line" />
              <div class="size-3 rounded-full border-2 border-text bg-text" />
              <div class="w-0.5 flex-1 bg-line" />
            </div>
            <div class="flex min-w-0 flex-1 flex-col gap-6 pt-4 pb-14">
              <p class="flex gap-2.5 font-mono text-sm">
                <time class="text-text-2" datetime={props.note.date}>
                  {formatDate(props.note.date)}
                </time>
                <Show when={formatTime(props.note.date)}>
                  {(time) => <span class="text-text-3">{time()}</span>}
                </Show>
                <Show when={props.note.draft}>
                  <span class="text-orange-400">draft（本番では公開されません）</span>
                </Show>
              </p>
              {/* 本文のスタイルは app.css の .void-md で共通化し、ここでは文字サイズと行間だけ決める */}
              <NoteContent class="void-md font-sans text-lg leading-loose [--md-code-padding-x:--spacing(4.5)] [--md-code-padding-y:--spacing(3.5)]">
                <Suspense>
                  <Dynamic component={Body()} />
                </Suspense>
              </NoteContent>
              <Actions />
              <Show when={props.related}>{(related) => <RelatedEntry entry={related()} />}</Show>
            </div>
          </article>
          <Show when={props.older}>
            {(neighbor) => (
              <>
                <NeighborRow note={neighbor()} />
                <Dashes fade="out" />
              </>
            )}
          </Show>
        </div>
      </div>
    </SiteFrame>
  );
}

// 前後の note。トップと同じく本文を省略して画像はカルーセルにまとめ、薄く表示する。日付から遷移できる
function NeighborRow(props: { note: NonNullable<Props["newer"]> }) {
  return (
    <article class="flex gap-4">
      <div class="flex w-10 shrink-0">
        <div class="flex w-5 flex-col items-center">
          <div class="h-4.75 w-0.5 bg-line" />
          <div class="size-2.5 rounded-full border-2 border-text-3 bg-bg opacity-40" />
          <div class="w-0.5 flex-1 bg-line" />
        </div>
      </div>
      <div class="flex min-w-0 flex-1 flex-col gap-2.5 pt-4 pb-8 opacity-40">
        <Link href={props.note.path} class="font-mono text-xs text-text-3">
          <time datetime={props.note.date}>{formatDate(props.note.date)}</time>
        </Link>
        <NoteSummary path={props.note.path} preview={props.note.preview} />
      </div>
    </article>
  );
}

function Actions() {
  const [copyState, setCopyState] = createSignal<"idle" | "copied" | "failed">("idle");

  // クリップボードの書き込みは権限が無いと拒否されるので、結果をラベルで返す
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    setTimeout(() => setCopyState("idle"), COPIED_RESET_MS);
  };

  // Web Share API が無い環境では X の投稿画面を開く
  const share = async () => {
    if (!navigator.share) {
      const url = `https://x.com/intent/post?url=${encodeURIComponent(location.href)}`;
      window.open(url, "_blank", "noopener");
      return;
    }
    try {
      await navigator.share({ url: location.href });
    } catch (error: unknown) {
      if (!(error instanceof DOMException && error.name === "AbortError")) throw error;
    }
  };

  return (
    <div class="flex items-center gap-5 font-mono text-xs text-text-2">
      <button type="button" class="flex items-center gap-2" onClick={copyLink}>
        <svg viewBox="0 0 24 24" class="size-3.5 fill-none stroke-current" {...ICON_STROKE}>
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        {COPY_LABELS[copyState()]}
      </button>
      <button type="button" class="flex items-center gap-2" onClick={share}>
        <svg viewBox="0 0 24 24" class="size-3.5 fill-none stroke-current" {...ICON_STROKE}>
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" x2="12" y1="2" y2="15" />
        </svg>
        share
      </button>
    </div>
  );
}

// lucide アイコンと同じ線の描き方
const ICON_STROKE = {
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true",
} as const;

function RelatedEntry(props: { entry: TimelineEntry }) {
  return (
    <section class="flex flex-col gap-3 border-t border-border pt-6">
      <h2 class="font-mono text-xs font-normal text-text-3">related entry</h2>
      <Link
        href={props.entry.path}
        class="flex flex-col gap-1.5 border-l-2 border-line py-1 pl-4 text-text hover:no-underline"
      >
        <span class="flex items-center gap-2.5 font-mono text-xs">
          <span class="size-2 rounded-full bg-text" />
          <span class="font-semibold text-text">entry</span>
          <time class="text-text-2" datetime={props.entry.date}>
            {formatDate(props.entry.date)}
          </time>
        </span>
        <span class="font-sans text-base leading-normal font-semibold text-text">
          {props.entry.title}
        </span>
      </Link>
    </section>
  );
}
