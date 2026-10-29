import { createSignal, For, onCleanup, onMount } from "solid-js";
import type { EntryHeading } from "../lib/entries";

// 見出しがこの位置(ヘッダーの下)より上に来たら、その見出しを読んでいる箇所とみなす
const ACTIVE_OFFSET_PX = 96;

// entry 詳細の本文の横に置く目次。読んでいる見出しを強調する。
// 配置と高さの上限(超えた分は目次の中でスクロールする)は使う側が class で決める
export function TableOfContents(props: { headings: EntryHeading[]; class: string }) {
  let nav!: HTMLElement;
  const [active, setActive] = createSignal(props.headings[0]?.slug);

  onMount(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = props.headings[0]?.slug;
      for (const heading of props.headings) {
        const element = document.getElementById(heading.slug);
        if (element && element.getBoundingClientRect().top <= ACTIVE_OFFSET_PX) {
          current = heading.slug;
        }
      }
      // 末尾の見出しはページの終わりに近いと上まで来ないので、最後までスクロールしたら最後の見出しにする
      const bottom = document.documentElement.scrollHeight - 2;
      if (window.scrollY > 0 && window.innerHeight + window.scrollY >= bottom) {
        current = props.headings.at(-1)?.slug ?? current;
      }
      if (current === active()) return;
      setActive(current);
      // 目次の中がスクロールしているときも、強調した項目が見えるようにする。
      // scrollIntoView はページ全体もスクロールしてしまうので、目次の scrollTop だけを動かす
      const link = nav.querySelector('[aria-current="location"]');
      if (!link) return;
      const box = nav.getBoundingClientRect();
      const item = link.getBoundingClientRect();
      if (item.top < box.top) nav.scrollTop -= box.top - item.top;
      else if (item.bottom > box.bottom) nav.scrollTop += item.bottom - box.bottom;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    onCleanup(() => {
      window.removeEventListener("scroll", schedule);
      cancelAnimationFrame(frame);
    });
  });

  return (
    <nav
      ref={(element) => (nav = element)}
      aria-label="目次"
      class={`flex-col gap-3.5 pt-1 ${props.class}`}
    >
      <p class="font-mono text-xs text-text-3">contents</p>
      <ol class="flex flex-col gap-3">
        <For each={props.headings}>
          {(heading) => (
            <li>
              <a
                href={`#${heading.slug}`}
                aria-current={active() === heading.slug ? "location" : undefined}
                class={`block border-l-2 font-sans text-sm leading-relaxed hover:no-underline ${heading.depth === 3 ? "pl-6" : "pl-3"} ${
                  active() === heading.slug
                    ? "border-text text-text"
                    : "border-border text-text-3 hover:text-text-2"
                }`}
              >
                {heading.text}
              </a>
            </li>
          )}
        </For>
      </ol>
    </nav>
  );
}
