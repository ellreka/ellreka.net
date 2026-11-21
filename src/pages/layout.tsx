import "../app.css";
import type { JSX } from "solid-js";
import { preserveScrollOnHmr } from "../lib/hmr-scroll";

// dev で Markdown を編集したときにスクロール位置を保つ(本番のビルドでは import.meta.hot が無く消える)
if (import.meta.hot && typeof window !== "undefined") preserveScrollOnHmr(import.meta.hot);

// ヘッダー・フッターは各ページが SiteFrame で描画する(現在位置をページごとに渡すため)
export default function Layout(props: { children: JSX.Element }) {
  return <>{props.children}</>;
}
