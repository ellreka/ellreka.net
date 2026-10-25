import { createSignal, onCleanup, onMount, Show } from "solid-js";
import type { JSX } from "solid-js";
import { enhanceNoteImages } from "../lib/note-images";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "./icons";

type NoteContentProps = {
  class: string;
  compact?: boolean;
  children: JSX.Element;
};

type ModalImage = { src: string; alt: string };

const OVERLAY_BUTTON =
  "absolute grid size-9 place-items-center rounded-full bg-surface/75 text-white backdrop-blur-xs disabled:cursor-default disabled:opacity-30";

export function NoteContent(props: NoteContentProps) {
  let content!: HTMLDivElement;
  let dialog!: HTMLDialogElement;
  const [images, setImages] = createSignal<ModalImage[]>([]);
  const [index, setIndex] = createSignal(0);
  const selected = () => images()[index()];
  const move = (direction: number) =>
    setIndex((current) => Math.min(Math.max(current + direction, 0), images().length - 1));

  onMount(() => {
    let opener: HTMLAnchorElement | undefined;
    const enhance = () => {
      if (dialog.open && opener && !content.contains(opener)) dialog.close();
      enhanceNoteImages(content);
    };
    enhance();
    // Markdown の差し替え(ページ遷移・投稿プレビュー)にも対応する。
    const observer = new MutationObserver(enhance);
    observer.observe(content, { childList: true, subtree: true });

    const openImage = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      const link = (event.target as Element).closest<HTMLAnchorElement>("a[data-note-image]");
      if (!link?.querySelector("img") || typeof dialog.showModal !== "function") return;
      event.preventDefault();
      opener = link;
      // 拡大表示では同じ note の画像を前後に送れるようにする
      const links = [...content.querySelectorAll<HTMLAnchorElement>("a[data-note-image]")];
      const list = links.flatMap((item) => {
        const image = item.querySelector("img");
        return image ? [{ link: item, src: image.currentSrc || image.src, alt: image.alt }] : [];
      });
      setImages(list.map((item) => ({ src: item.src, alt: item.alt })));
      setIndex(
        Math.max(
          list.findIndex((item) => item.link === link),
          0,
        ),
      );
      dialog.showModal();
    };
    content.addEventListener("click", openImage);
    onCleanup(() => {
      observer.disconnect();
      content.removeEventListener("click", openImage);
      dialog.close();
    });
  });

  return (
    <>
      <div
        ref={(element) => (content = element)}
        class={`${props.class} [&_img]:w-full [&_img]:rounded-md [&_img]:border [&_img]:border-border [&_img]:object-contain [&_[data-note-gallery]]:grid [&_[data-note-gallery]]:grid-cols-2 [&_[data-note-gallery]]:items-start [&_[data-note-gallery]]:gap-2 [&_[data-note-gallery]>:only-child]:col-span-2 [&_[data-note-image]]:cursor-zoom-in [&_[data-note-gallery]>a]:block [&_[data-note-gallery]>a]:min-w-0`}
        classList={{ "[&_img]:max-h-80": props.compact }}
      >
        {props.children}
      </div>
      <dialog
        ref={(element) => (dialog = element)}
        aria-label="画像の拡大表示"
        class="m-auto h-dvh max-h-none w-dvw max-w-none border-0 bg-black/90 p-0 text-text backdrop:bg-transparent"
        onClick={(event) => {
          // 画像とボタン以外(余白)のクリックで閉じる
          if (!(event.target as Element).closest("img, button")) dialog.close();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
      >
        <Show when={selected()}>
          {(image) => (
            <div class="absolute inset-x-4 inset-y-16 sm:inset-16">
              <img src={image().src} alt={image().alt} class="size-full object-contain" />
            </div>
          )}
        </Show>
        <button
          type="button"
          autofocus
          aria-label="閉じる"
          onClick={() => dialog.close()}
          class={`${OVERLAY_BUTTON} top-4 left-4`}
        >
          <CloseIcon class="size-5" />
        </button>
        <Show when={images().length > 1}>
          <button
            type="button"
            aria-label="前の画像"
            disabled={index() === 0}
            onClick={() => move(-1)}
            class={`${OVERLAY_BUTTON} top-1/2 left-4 -translate-y-1/2`}
          >
            <ChevronLeftIcon class="size-5" />
          </button>
          <button
            type="button"
            aria-label="次の画像"
            disabled={index() === images().length - 1}
            onClick={() => move(1)}
            class={`${OVERLAY_BUTTON} top-1/2 right-4 -translate-y-1/2`}
          >
            <ChevronRightIcon class="size-5" />
          </button>
        </Show>
      </dialog>
    </>
  );
}
