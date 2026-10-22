import { createMemo, lazy, Show, Suspense } from "solid-js";
import type { Component } from "solid-js";
import { Dynamic } from "solid-js/web";
import { SiteFrame } from "../../components/site-frame";
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
      <article class="void-md pt-12 pb-24 [&_video]:w-full [&_video]:rounded-md">
        <Show when={props.entry.draft}>
          <p class="font-mono text-xs text-orange-400">draft(本番では公開されません)</p>
        </Show>
        <h1>{props.entry.title}</h1>
        <Suspense>
          <Dynamic component={Body()} />
        </Suspense>
      </article>
    </SiteFrame>
  );
}
