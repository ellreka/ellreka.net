import { Link } from "@void/solid";
import { For, Match, Show, Switch } from "solid-js";
import type { PreviewTimeline } from "../lib/timeline-preview";
import { formatDate, TIMELINE_FILTERS } from "../lib/timeline";
import type { TimelineFilter } from "../lib/timeline";
import { ImageCarousel } from "./image-carousel";
import { NoteSummary } from "./note-summary";
import { SiteFrame } from "./site-frame";

type TimelinePageProps = PreviewTimeline & { filter: TimelineFilter };
type PreviewNote = Extract<PreviewTimeline["items"][number], { kind: "note" }>;
type PreviewEntry = Extract<PreviewTimeline["items"][number], { kind: "entry" }>;

const FILTER_PATHS: Record<TimelineFilter, string> = {
  all: "/",
  notes: "/notes",
  entries: "/entries",
};

// トップ(all)・/notes・/entries で共通のタイムライン。絞り込みはページごとに分け、切り替えはリンクにする
// (static 出力なので、クエリで絞ると書き出した HTML と表示がずれるため)
export function TimelinePage(props: TimelinePageProps) {
  return (
    <SiteFrame current={props.filter === "all" ? undefined : props.filter}>
      <section class="flex flex-col pt-12 pb-24">
        <div class="flex items-center justify-between border-b border-border pb-4">
          {/* SP では消す */}
          <p class="hidden font-mono text-sm text-text-3 sm:block">
            {props.counts.notes} notes · {props.counts.entries} entries
          </p>
          <nav aria-label="表示の切り替え" class="flex gap-3">
            <For each={TIMELINE_FILTERS}>
              {(value) => (
                <Link
                  href={FILTER_PATHS[value]}
                  aria-current={props.filter === value ? "page" : undefined}
                  class={`py-1 font-mono text-xs whitespace-pre hover:no-underline ${props.filter === value ? "text-text" : "text-text-3 hover:text-text-2"}`}
                >
                  <span aria-hidden="true">{props.filter === value ? "* " : "  "}</span>
                  {value}
                </Link>
              )}
            </For>
          </nav>
        </div>
        <div class="flex flex-col pt-3">
          <For each={props.items}>
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
        </div>
      </section>
    </SiteFrame>
  );
}

function NoteRow(props: { note: PreviewNote; latest: boolean }) {
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
        <Show when={props.note.draft}>
          <span class="self-start font-mono text-xs text-orange-400">draft</span>
        </Show>
        <NoteSummary path={props.note.path} preview={props.note.preview} />
      </div>
    </article>
  );
}

function EntryRow(props: { entry: PreviewEntry }) {
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
        <Show when={props.entry.images.length > 0}>
          <ImageCarousel label="entry の画像" images={props.entry.images} />
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
