import { Link } from "@void/solid";
import { createMemo, For, lazy, Show, Suspense } from "solid-js";
import type { Component } from "solid-js";
import { Dynamic } from "solid-js/web";
import { NoteContent } from "../../components/note-content";
import { SiteFrame } from "../../components/site-frame";
import { TableOfContents } from "../../components/table-of-contents";
import { formatDate } from "../../lib/timeline";
import type { Props } from "./[id].server";

// 記事本文はページごとに読み込む(全記事を 1 つの JS にまとめない)
const bodies = import.meta.glob<{ default: Component }>("../../content/entries/*.md");

export default function EntryPage(props: Props) {
  const Body = createMemo(() => {
    const load = bodies[`../../content/entries/${props.id}.md`];
    return load ? lazy(load) : () => null;
  });

  return (
    <SiteFrame current="entries">
      <div class="flex flex-col pt-12 pb-24">
        <div class="flex border-b border-border pb-4">
          <Link href="/entries" class="font-mono text-sm text-text-2">
            All entries
          </Link>
        </div>
        <article class="flex flex-col gap-10 pt-10">
          <header class="flex flex-col gap-4">
            <p class="flex items-center gap-2.5 font-mono text-xs">
              <span class="font-semibold text-text">entry</span>
              <time class="text-text-2" datetime={props.entry.date}>
                {formatDate(props.entry.date)}
              </time>
              <Show when={props.entry.draft}>
                <span class="text-orange-400">draft(本番では公開されません)</span>
              </Show>
            </p>
            <h1 class="font-sans text-4xl leading-snug font-semibold text-text">
              {props.entry.title}
            </h1>
            <Show when={props.lead}>
              <p class="font-sans text-base leading-relaxed text-text-2">{props.lead}</p>
            </Show>
            <Show when={props.entry.tags.length > 0}>
              <p class="flex items-center gap-3 pt-1 font-mono text-xs text-text-2">
                <For each={props.entry.tags}>{(tag) => <span>#{tag}</span>}</For>
              </p>
            </Show>
          </header>
          <div class="relative border-t border-border pt-9">
            {/* 本文のスタイルは app.css の .void-md で共通化し、ここでは文字サイズ・行間・色だけ決める。
                画像は本文の並びのまま、クリックで拡大表示する */}
            <NoteContent
              gallery={false}
              class="void-md font-sans text-base leading-loose text-prose"
            >
              <Suspense>
                <Dynamic component={Body()} />
              </Suspense>
            </NoteContent>
            {/* 目次はヘッダーと左端をそろえた列(max-w-3xl)の外、右の余白に置き、本文は列の全幅を使う。
                余白に収まらない xl 未満では出さない。見出しが多いと画面に収まらないので、
                固定ヘッダーと上下の余白(10rem)を除いた高さで目次の中をスクロールさせる */}
            <Show when={props.toc.length > 0}>
              <div class="absolute top-9 bottom-0 left-full ml-14 hidden w-45 xl:block">
                <TableOfContents
                  headings={props.toc}
                  class="sticky top-20 flex max-h-[calc(100dvh-10rem)] overflow-y-auto [scrollbar-color:var(--color-line)_transparent] [scrollbar-width:thin]"
                />
              </div>
            </Show>
          </div>
        </article>
      </div>
    </SiteFrame>
  );
}
