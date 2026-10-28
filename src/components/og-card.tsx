import type { JSX } from "solid-js";
import { fitTextClass } from "../lib/og-fit";

type OgCardProps = {
  children: JSX.Element;
};

// 文章を置ける範囲(枠の内側から余白を除いた大きさに少し余裕を持たせたもの)。文字サイズの見積もりに使う
const TEXT_BOX = { width: 960, height: 400 };

export function OgBrand() {
  return (
    <div class="flex items-center gap-4">
      <img src="/icon.png" alt="" width="56" height="56" class="size-14 rounded-xl" />
      <span class="font-mono text-3xl font-semibold text-text">ellreka.net</span>
    </div>
  );
}

// OGP 画像として撮影するカード(1200×630)。文章を枠線で囲んで中央に置き、
// サイト名は枠線の下辺に重ねる(サイト名の背景で枠線を切る)。撮影時は viewport を同じ大きさにする
export function OgCard(props: OgCardProps) {
  return (
    <div class="flex h-157.5 w-300 overflow-hidden bg-bg p-10 pb-16">
      <div class="relative flex flex-1 items-center justify-center rounded-3xl border-2 border-line px-14 py-12">
        {props.children}
        <div class="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-bg px-6">
          <OgBrand />
        </div>
      </div>
    </div>
  );
}

// 省略せずに全文を出す。長さに応じて文字サイズを下げる
export function OgText(props: { text: string; bold?: boolean }) {
  return (
    <p
      class={`${fitTextClass(props.text, TEXT_BOX)} text-center font-sans leading-normal text-text ${props.bold ? "font-semibold" : ""}`}
    >
      {props.text}
    </p>
  );
}
