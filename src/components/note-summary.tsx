import { Link } from "@void/solid";
import { createSignal, onCleanup, onMount, Show } from "solid-js";
import type { NotePreview } from "../lib/note-preview";
import { ImageCarousel } from "./image-carousel";

type NoteSummaryProps = {
  path: string;
  preview: NotePreview;
};

// 一覧向けの note の本文。4 行で省略して Read more を出し、画像は末尾のカルーセルにまとめる。
// トップ・/notes と note 詳細の前後の note で使う
export function NoteSummary(props: NoteSummaryProps) {
  let text!: HTMLDivElement;
  const [truncated, setTruncated] = createSignal(false);
  const update = () => setTruncated(text.scrollHeight > text.clientHeight);

  onMount(() => {
    const observer = new ResizeObserver(update);
    observer.observe(text);
    update();
    void document.fonts.ready.then(update);
    onCleanup(() => observer.disconnect());
  });

  return (
    <>
      <div
        ref={(element) => (text = element)}
        class="void-md line-clamp-4 font-sans text-base leading-relaxed wrap-anywhere empty:hidden [--md-code-padding-x:--spacing(4)] [--md-code-padding-y:--spacing(3)] [--md-gap:--spacing(2.5)]"
        innerHTML={props.preview.html}
      />
      <Show when={truncated()}>
        <Link href={props.path} class="self-start font-mono text-xs text-text-2">
          Read more
        </Link>
      </Show>
      <Show when={props.preview.images.length > 0}>
        <ImageCarousel label="note の画像" images={props.preview.images} />
      </Show>
    </>
  );
}
