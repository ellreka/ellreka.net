import { Link } from "@void/solid";
import { For } from "solid-js";
import type { JSX } from "solid-js";

const NAV_ITEMS = ["notes", "entries", "about"] as const;
type Section = (typeof NAV_ITEMS)[number];

type SiteFrameProps = {
  // デザインでは note 詳細だけ本文幅が 880px(他は 720px)
  wide?: boolean;
  current?: Section;
  children: JSX.Element;
};

// prerender 時は useRouter() の path が常に "/" になるため、幅と現在位置はページから props で渡す
export function SiteFrame(props: SiteFrameProps) {
  const container = () =>
    props.wide ? "mx-auto w-full max-w-[912px] px-4" : "mx-auto w-full max-w-[752px] px-4";

  return (
    <div class="flex min-h-dvh flex-col">
      <header class="sticky top-0 z-10 border-b border-border/50 bg-bg/85 backdrop-blur-md">
        <div class={`${container()} flex items-center justify-between pt-3 pb-[11px]`}>
          <div class="flex items-center gap-5">
            <Link href="/" class="flex items-center gap-2.5 text-text hover:no-underline">
              <img src="/icon.png" alt="" width="28" height="28" class="size-7 rounded-md" />
              <span class="font-mono text-sm leading-[18px] font-semibold text-text">ellreka</span>
            </Link>
            <div class="h-3.5 w-px bg-border" />
            <nav class="flex items-center gap-5">
              <For each={NAV_ITEMS}>
                {(item) => (
                  <Link
                    href={`/${item}`}
                    aria-current={props.current === item ? "page" : undefined}
                    class={
                      props.current === item
                        ? "font-mono text-[13px] leading-[17px] text-text"
                        : "font-mono text-[13px] leading-[17px] text-text-2"
                    }
                  >
                    {item}
                  </Link>
                )}
              </For>
            </nav>
          </div>
          <a href="/rss.xml" aria-label="RSS" class="text-text-3">
            <svg
              viewBox="0 0 24 24"
              class="size-[15px] fill-none stroke-current"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M4 11a9 9 0 0 1 9 9" />
              <path d="M4 4a16 16 0 0 1 16 16" />
              <circle cx="5" cy="19" r="1" />
            </svg>
          </a>
        </div>
      </header>
      <main class={`${container()} flex-1`}>{props.children}</main>
      <footer class="border-t border-border">
        <div
          class={`${container()} flex items-center justify-between pt-[27px] pb-7 font-mono text-xs text-text-3`}
        >
          <p>© {new Date().getFullYear()} ellreka</p>
          <p>
            <a href="https://github.com/ellreka" class="text-text-3">
              GitHub
            </a>
            {" · "}
            <a href="https://x.com/ellreka" class="text-text-3">
              X
            </a>
            {" · "}
            <a href="/rss.xml" class="text-text-3">
              RSS
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
