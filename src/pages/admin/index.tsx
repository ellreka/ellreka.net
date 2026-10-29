import { Link } from "@void/solid";
import { For, Show } from "solid-js";
import { SiteFrame } from "../../components/site-frame";
import { formatDate, formatTime } from "../../lib/timeline";
import type { Props } from "./index.server";

export default function AdminPage(props: Props) {
  return (
    <SiteFrame current="notes">
      <section class="flex flex-col gap-6 pt-12 pb-24">
        <div class="flex items-center justify-between border-b border-border pb-4">
          <h1 class="font-mono text-sm text-text">admin / notes ({props.notes.length})</h1>
          <Link
            href="/admin/notes/new"
            class="rounded bg-text px-3 py-1.5 font-mono text-xs font-semibold text-bg hover:no-underline"
          >
            new note
          </Link>
        </div>
        <Show
          when={props.notes.length > 0}
          fallback={<p class="text-sm text-text-2">note はまだありません。</p>}
        >
          <ul class="divide-y divide-border">
            <For each={props.notes}>
              {(note) => (
                <li class="flex items-start gap-4 py-5 first:pt-0">
                  <div class="flex min-w-0 flex-1 flex-col gap-2">
                    <div class="flex items-center gap-2.5 font-mono text-xs">
                      <time datetime={note.date} class="text-text-2">
                        {formatDate(note.date)} {formatTime(note.date)}
                      </time>
                      <Show when={note.draft}>
                        <span class="text-orange-400">draft</span>
                      </Show>
                    </div>
                    <p class="font-sans text-sm leading-relaxed wrap-anywhere text-text">
                      {note.description || "（本文の抜粋なし）"}
                    </p>
                    <p class="font-mono text-xs wrap-anywhere text-text-3">{note.id}</p>
                  </div>
                  <Link
                    href={`/admin/notes/${note.id}`}
                    aria-label={`${note.id} を編集`}
                    class="shrink-0 rounded border border-border px-3 py-1.5 font-mono text-xs text-text-2 hover:no-underline"
                  >
                    edit
                  </Link>
                </li>
              )}
            </For>
          </ul>
        </Show>
      </section>
    </SiteFrame>
  );
}
