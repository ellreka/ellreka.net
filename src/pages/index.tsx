import { Link } from "@void/solid";
import { createMemo, createSignal, For, Match, Show, Switch } from "solid-js";
import { SiteFrame } from "../components/site-frame";
import { Dashes } from "../components/timeline";
import { noteBodies } from "../lib/notes";
import { formatDate } from "../lib/timeline";
import type { TimelineEntry, TimelineNote } from "../lib/timeline";
import type { Props } from "./index.server";

const PAGE_SIZE = 10;
const FILTERS = ["all", "notes", "entries"] as const;
type Filter = (typeof FILTERS)[number];

export default function HomePage(props: Props) {
  const [filter, setFilter] = createSignal<Filter>("all");
  const [limit, setLimit] = createSignal(PAGE_SIZE);
  const filtered = createMemo(() =>
    props.items.filter(
      (item) =>
        filter() === "all" ||
        (filter() === "notes" && item.kind === "note") ||
        (filter() === "entries" && item.kind === "entry"),
    ),
  );
  const noteCount = () => props.items.filter((item) => item.kind === "note").length;
  const entryCount = () => props.items.filter((item) => item.kind === "entry").length;

  return (
    <SiteFrame>
      <section class="flex flex-col pt-12 pb-24">
        <div class="flex items-center justify-between border-b border-border pb-4">
          <p class="font-mono text-sm text-text-3">
            {noteCount()} notes · {entryCount()} entries
          </p>
          <div class="flex gap-1">
            <For each={FILTERS}>
              {(value) => (
                <button
                  type="button"
                  aria-pressed={filter() === value}
                  class={
                    filter() === value
                      ? "rounded border border-border bg-surface px-2.5 py-1 font-mono text-xs text-text"
                      : "rounded border border-transparent px-2.5 py-1 font-mono text-xs text-text-3"
                  }
                  onClick={() => {
                    setFilter(value);
                    setLimit(PAGE_SIZE);
                  }}
                >
                  {value}
                </button>
              )}
            </For>
          </div>
        </div>
        <div class="flex flex-col pt-3">
          <For each={filtered().slice(0, limit())}>
            {(item, index) => (
              <Switch>
                <Match when={item.kind === "note" && item}>
                  {(note) => <NoteRow note={note()} latest={index() === 0} />}
                </Match>
                <Match when={item.kind === "entry" && item}>
                  {(entry) => (
                    <>
                      <EntryRow entry={entry()} />
                      <Fork />
                    </>
                  )}
                </Match>
              </Switch>
            )}
          </For>
          <Show when={filtered().length > limit()}>
            <LoadMore onClick={() => setLimit((current) => current + PAGE_SIZE)} />
          </Show>
        </div>
      </section>
    </SiteFrame>
  );
}

function NoteRow(props: { note: TimelineNote; latest: boolean }) {
  const Body = noteBodies[props.note.path] ?? (() => null);
  return (
    <article class="flex gap-4">
      {/* note は幹のレーンだけを使い、本文を entry と揃えず幹に寄せる */}
      <div class="flex w-5 shrink-0 flex-col items-center">
        <div class="h-4.75 w-0.5 bg-line" />
        <div
          class={
            props.latest
              ? "size-2.5 rounded-full border-2 border-text bg-text"
              : "size-2.5 rounded-full border-2 border-text-3 bg-bg"
          }
        />
        <div class="w-0.5 flex-1 bg-line" />
      </div>
      <div class="flex min-w-0 flex-1 flex-col gap-2.5 pt-4 pb-4">
        <Link href={props.note.path} class="font-mono text-xs text-text-3">
          <time datetime={props.note.date}>{formatDate(props.note.date)}</time>
        </Link>
        {/* @void/md の本文テーマ(.void-md)を使いつつ、一覧用に文字サイズと余白を詰める */}
        <div class="void-md font-sans text-base leading-relaxed [&>div>*]:my-0 [&>div]:flex [&>div]:flex-col [&>div]:gap-2.5 [&_.lang]:hidden">
          <Body />
        </div>
      </div>
    </article>
  );
}

function EntryRow(props: { entry: TimelineEntry }) {
  return (
    <article class="flex gap-4">
      <div class="flex w-10 shrink-0">
        <div class="flex w-5 flex-col items-center">
          <div class="w-0.5 flex-1 bg-line" />
        </div>
        <div class="flex w-5 flex-col items-center">
          <div class="h-4.5" />
          <div class="size-3 rounded-full border-2 border-text bg-text" />
          <div class="w-0.5 flex-1 bg-line" />
        </div>
      </div>
      <div class="flex min-w-0 flex-1 flex-col gap-2.5 pt-4">
        <div class="flex items-center gap-2.5 font-mono text-xs">
          <span class="font-semibold text-text">entry</span>
          <time class="text-text-3" datetime={props.entry.date}>
            {formatDate(props.entry.date)}
          </time>
          {/* draft は dev でだけ一覧に出る */}
          <Show when={props.entry.draft}>
            <span class="text-orange-400">draft</span>
          </Show>
        </div>
        <h2 class="font-sans text-xl leading-normal font-semibold">
          <Link href={props.entry.path} class="text-text">
            {props.entry.title}
          </Link>
        </h2>
        <Show when={props.entry.description}>
          <p class="font-sans text-sm leading-relaxed text-text-2">{props.entry.description}</p>
        </Show>
        <Show when={props.entry.tags.length > 0}>
          <div class="flex items-center gap-3 pt-0.5 font-mono text-xs text-text-3">
            <For each={props.entry.tags}>{(tag) => <span>#{tag}</span>}</For>
          </div>
        </Show>
      </div>
    </article>
  );
}

// entry のレーンを幹に合流させる曲線
function Fork() {
  return (
    <svg class="h-6 w-10 shrink-0" viewBox="0 0 40 24" aria-hidden="true">
      <rect x="9" width="2" height="24" class="fill-line" />
      <path d="M30 0c0 12-20 12-20 24" class="fill-none stroke-line" stroke-width="2" />
    </svg>
  );
}

function LoadMore(props: { onClick: () => void }) {
  return (
    <div class="flex gap-4">
      <Dashes fade="out" />
      <button
        type="button"
        class="py-0.5 font-mono text-sm text-text-2"
        onClick={() => props.onClick()}
      >
        Load more
      </button>
    </div>
  );
}
