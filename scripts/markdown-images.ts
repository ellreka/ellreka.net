// @void/md には Markdown の変換に処理を足す口が無いため、出力した Solid のモジュールの HTML を書き換える。
// vite-plugin-solid が JSX を変換する前に動かすので、vite.config.ts では Solid のプラグインより前に置く
import type { Plugin } from "vite";
import { optimizeMarkdownModule } from "../src/lib/markdown-images";

export function markdownImages(): Plugin {
  return {
    name: "markdown-images",
    enforce: "pre",
    transform: {
      filter: { id: /^\/@void-md-solid\// },
      handler(code) {
        const result = optimizeMarkdownModule(code);
        return result === code ? null : { code: result, map: null };
      },
    },
  };
}
