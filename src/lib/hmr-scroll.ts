import type { ViteHotContext } from "vite/types/hot.js";

// dev 専用。Markdown を編集すると、それを lazy import しているページ(entry・note の詳細)が
// HMR で再描画され、本文の読み込み中は Suspense が空になってページの高さが縮み、スクロールが先頭に戻る。
// 更新前の位置を覚えておき、本文が戻ってその位置までスクロールできるようになったら戻す
const RESTORE_TIMEOUT_MS = 3000;

export function preserveScrollOnHmr(hot: ViteHotContext): void {
  let target: number | undefined;
  let frame = 0;

  const stop = () => {
    target = undefined;
    cancelAnimationFrame(frame);
    for (const type of USER_SCROLL_EVENTS) removeEventListener(type, stop);
  };

  hot.on("vite:beforeUpdate", () => {
    // 戻している途中に次の更新が来たら、最初に覚えた位置を使う
    target ??= scrollY;
  });

  hot.on("vite:afterUpdate", () => {
    if (target === undefined) return;
    cancelAnimationFrame(frame);
    // 待っている間に自分でスクロールしたら戻さない
    for (const type of USER_SCROLL_EVENTS) addEventListener(type, stop, { passive: true });
    const deadline = performance.now() + RESTORE_TIMEOUT_MS;
    // 本文が空になってページが縮むのは afterUpdate より後のこともあるので、一度戻せても期限までは見張り、
    // 位置がずれたら戻す。期限が来たら、文章を削って前の位置まで届かない場合も届く範囲で一番近い位置にする
    const restore = () => {
      if (target === undefined) return;
      const max = document.documentElement.scrollHeight - innerHeight;
      if (performance.now() > deadline) {
        scrollTo(0, Math.min(target, max));
        stop();
        return;
      }
      if (max >= target && Math.abs(scrollY - target) >= 1) scrollTo(0, target);
      frame = requestAnimationFrame(restore);
    };
    restore();
  });
}

// pointerdown はスクロールバーのドラッグ用
const USER_SCROLL_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
