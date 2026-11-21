import { expect, test } from "vite-plus/test";
import { imageUrl } from "./image-url";
import { optimizeImageTags, optimizeMarkdownModule } from "./markdown-images";

const SRC = "https://assets.ellreka.net/a.png";

test("本文の R2 の画像を縮小した URL にして遅延読み込みにする", () => {
  expect(optimizeImageTags(`<p><img src="${SRC}" alt="図"></p>`)).toBe(
    `<p><img decoding="async" loading="lazy" src="${imageUrl(SRC, "content")}" alt="図"></p>`,
  );
});

test("生の HTML のシングルクォートの src も書き換える", () => {
  expect(optimizeImageTags(`<img src='${SRC}' width="400">`)).toContain(
    `src='${imageUrl(SRC, "content")}'`,
  );
});

test("指定済みの loading は残し、コードブロック中の <img> は書き換えない", () => {
  expect(optimizeImageTags('<img loading="eager" src="https://example.com/a.png">')).toBe(
    '<img decoding="async" loading="eager" src="https://example.com/a.png">',
  );
  const code = `<pre><code>&lt;img src="${SRC}"&gt;</code></pre>`;
  expect(optimizeImageTags(code)).toBe(code);
});

test("@void/md の Solid モジュールの HTML 文字列だけを書き換え、本文の最初の画像は遅延読み込みにしない", () => {
  const first = '<p>"引用"</p>';
  // @void/md の出力と同じく、Markdown の画像には loading="lazy" が付いている
  const second = `<img src="${SRC}" alt="" loading="lazy"><img src="${SRC}" alt="" loading="lazy">`;
  const code = [
    "const __headings = [];",
    `const __html_chunk_0 = ${JSON.stringify(first)};`,
    `const __html_chunk_1 = ${JSON.stringify(second)};`,
  ].join("\n");
  const result = optimizeMarkdownModule(code);
  expect(result).toContain("const __headings = [];");
  expect(result).toContain(`const __html_chunk_0 = ${JSON.stringify(first)};`);
  const html = JSON.parse(/__html_chunk_1 = (".*");/.exec(result)?.[1] ?? '""') as string;
  const [eager, lazy] = html.match(/<img\b[^>]*>/g) ?? [];
  expect(eager).not.toContain("loading=");
  expect(lazy).toContain('loading="lazy"');
});
