import type { HeadDescriptor } from "void";
import { ASSETS_ORIGIN } from "./note-post";

// 公開ページの head に出す OGP。og:url などは絶対 URL が必要なので、本番のオリジンを持つ
export const SITE_ORIGIN = "https://ellreka.net";
export const SITE_NAME = "ellreka.net";
export const SITE_DESCRIPTION = "ellreka の個人ブログです。技術のことや日々のメモを書いています。";

// OGP 画像は `pnpm og:generate` が /og 配下のページを撮影して R2 に置く。
// ファイル名に内容のハッシュを入れ、文章が変わったものだけ撮り直す。
// カードのデザイン(OgCard・/og のページ)を変えたら、この版を上げて全部撮り直す
const OG_IMAGE_VERSION = 1;
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

// 同期で求められる短いハッシュ(FNV-1a 32bit)。ファイル名の更新検知にだけ使う
function hash(text: string): string {
  let value = 0x811c9dc5;
  for (const byte of new TextEncoder().encode(text)) {
    value = Math.imul(value ^ byte, 0x01000193) >>> 0;
  }
  return value.toString(16).padStart(8, "0");
}

// card は撮影するページの /og 以下のパス(`entries/<id>`・`notes/<id>`。サイト共通は空文字)、
// text はカードに出す文章
export function ogImageUrl(card: string, text: string): string {
  const name = card === "" ? "default" : card;
  return `${ASSETS_ORIGIN}/og/${name}-${hash(`${OG_IMAGE_VERSION}\n${text}`)}.png`;
}

// トップ・一覧・about で共通に使うカードの文章
export const DEFAULT_OG_CARD = {
  title: "ellreka.net",
  lead: "",
};
export const DEFAULT_OG_IMAGE = ogImageUrl("", `${DEFAULT_OG_CARD.title}\n${DEFAULT_OG_CARD.lead}`);

type OgMetaInput = {
  // titleTemplate を通らないので、サイト名を付けない完成形を渡す
  title: string;
  description?: string;
  path: string;
  type: "website" | "article";
  image: string;
};

export function ogMeta(input: OgMetaInput): NonNullable<HeadDescriptor["meta"]> {
  const description = input.description
    ? [
        { name: "description", content: input.description },
        { property: "og:description", content: input.description },
      ]
    : [];
  return [
    ...description,
    { property: "og:title", content: input.title },
    { property: "og:type", content: input.type },
    { property: "og:url", content: new URL(input.path, SITE_ORIGIN).href },
    { property: "og:image", content: input.image },
    { property: "og:image:width", content: String(OG_IMAGE_WIDTH) },
    { property: "og:image:height", content: String(OG_IMAGE_HEIGHT) },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: "ja_JP" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}
