import "../app.css";
import type { JSX } from "solid-js";

// ヘッダー・フッターは各ページが SiteFrame で描画する(幅や現在位置をページごとに渡すため)
export default function Layout(props: { children: JSX.Element }) {
  return <>{props.children}</>;
}
