import { createSignal, For, onCleanup, onMount, Show } from "solid-js";
import type { JSX } from "solid-js";
import type { PreviewImage } from "../lib/note-preview";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";
import { NoteContent } from "./note-content";

type ImageCarouselProps = {
  label: string;
  images: PreviewImage[];
};

// トップの一覧で notes・entries の画像を横に並べる。拡大表示は NoteContent の dialog を使う
export function ImageCarousel(props: ImageCarouselProps) {
  let carousel!: HTMLDivElement;
  const [canPrevious, setCanPrevious] = createSignal(false);
  const [canNext, setCanNext] = createSignal(false);

  const update = () => {
    setCanPrevious(carousel.scrollLeft > 0);
    setCanNext(Math.ceil(carousel.scrollLeft + carousel.clientWidth) < carousel.scrollWidth);
  };
  // 1 枚ずつ送る。画像の幅と間隔は CSS で決まるので先頭 2 枚の位置から求める
  const scrollImages = (direction: number) => {
    const [first, second] = carousel.children;
    if (!(first instanceof HTMLElement)) return;
    const step =
      second instanceof HTMLElement ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
    carousel.scrollBy({ left: direction * step });
  };

  onMount(() => {
    const observer = new ResizeObserver(update);
    observer.observe(carousel);
    update();
    onCleanup(() => observer.disconnect());
  });

  return (
    <NoteContent class="min-w-0 pt-1.5">
      <div class="relative">
        <div
          ref={(element) => (carousel = element)}
          role="region"
          aria-label={props.label}
          aria-roledescription="カルーセル"
          tabIndex={0}
          onScroll={update}
          onKeyDown={(event) => {
            if (
              event.target !== event.currentTarget ||
              event.altKey ||
              event.ctrlKey ||
              event.metaKey ||
              event.shiftKey
            )
              return;
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              scrollImages(event.key === "ArrowLeft" ? -1 : 1);
            }
          }}
          class="flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] motion-reduce:scroll-auto [&>a]:block [&>a]:h-50 [&>a]:w-75 [&>a]:shrink-0 [&>a]:snap-start [&>a]:rounded-xl [&>a>img]:h-full [&>a>img]:rounded-xl [&>a>img]:object-cover"
        >
          <For each={props.images}>
            {(image) => (
              <a
                href={image.href ?? image.src}
                data-note-image={image.href ? undefined : ""}
                aria-haspopup={image.href ? undefined : "dialog"}
                aria-label={
                  image.href ? image.alt || "画像を開く" : `${image.alt || "画像"}を拡大表示`
                }
              >
                <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
              </a>
            )}
          </For>
        </div>
        {/* 端まで送ったら、その向きのボタンは隠す */}
        <Show when={canPrevious()}>
          <CarouselButton label="前の画像" class="left-3" onClick={() => scrollImages(-1)}>
            <ChevronLeftIcon class="size-4.5" />
          </CarouselButton>
        </Show>
        <Show when={canNext()}>
          <CarouselButton label="次の画像" class="right-3" onClick={() => scrollImages(1)}>
            <ChevronRightIcon class="size-4.5" />
          </CarouselButton>
        </Show>
      </div>
    </NoteContent>
  );
}

// 画像の上に重ねる送りボタン
function CarouselButton(props: {
  label: string;
  class: string;
  onClick: () => void;
  children: JSX.Element;
}) {
  return (
    <button
      type="button"
      aria-label={props.label}
      onClick={() => props.onClick()}
      class={`absolute top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-surface/75 text-white backdrop-blur-xs ${props.class}`}
    >
      {props.children}
    </button>
  );
}
