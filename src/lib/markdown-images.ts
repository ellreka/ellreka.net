import { imageUrl } from "./image-url";

type ImageTagOptions = {
  // false なら最初の <img> は遅延読み込みにしない(ファーストビューにあると LCP が遅れるため)
  lazyFirst?: boolean;
};

// Markdown から作った HTML の <img> を本文用の大きさの URL にし、遅延読み込みにする。
// コードブロック中の <img> はエスケープ済み(&lt;img)なので対象にならない。
// 生の HTML で書いたクォート無しの src(<img src=a.png>)は対象外
export function optimizeImageTags(html: string, options: ImageTagOptions = {}): string {
  let index = 0;
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    let result = tag.replace(
      /(\ssrc=)(["'])(.*?)\2/i,
      (_, before: string, quote: string, src: string) =>
        `${before}${quote}${imageUrl(src, "content")}${quote}`,
    );
    const lazy = options.lazyFirst !== false || index > 0;
    index += 1;
    // @void/md は Markdown の画像すべてに loading="lazy" を付けるので、最初の画像からは外す
    if (!lazy) result = result.replace(/\sloading=(["'])lazy\1/i, "");
    else if (!/\sloading=/i.test(result))
      result = result.replace(/^<img\b/i, '<img loading="lazy"');
    if (!/\sdecoding=/i.test(result)) result = result.replace(/^<img\b/i, '<img decoding="async"');
    return result;
  });
}

// @void/md が出力する Solid のモジュールでは、本文の HTML は `const __html_chunk_N = "...";` の文字列になる。
// 本文の最初の画像だけは遅延読み込みにしない
export function optimizeMarkdownModule(code: string): string {
  let seenImage = false;
  return code.replace(
    /(const __html_chunk_\d+ = )("(?:[^"\\]|\\.)*")(;)/g,
    (_, before: string, literal: string, after: string) => {
      const html = JSON.parse(literal) as string;
      const optimized = optimizeImageTags(html, { lazyFirst: seenImage });
      seenImage ||= /<img\b/i.test(html);
      return `${before}${JSON.stringify(optimized)}${after}`;
    },
  );
}
