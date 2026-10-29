import { defineHandler, defineHead } from "void";
import type { InferProps } from "void";
import { DEFAULT_OG_CARD } from "../../lib/og";

// トップ・一覧・about で共通に使う OGP 画像のカード。
// 文章は画像のファイル名のハッシュと揃えるため og.ts から渡す
export type Props = InferProps<typeof loader>;

export const loader = defineHandler(() => DEFAULT_OG_CARD);

export const head = defineHead(() => ({
  title: "og",
  meta: [{ name: "robots", content: "noindex" }],
}));
