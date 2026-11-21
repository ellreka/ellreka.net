// R2 の公開バケット。投稿画像・OGP 画像・記事の画像はすべてこの下に置く
export const ASSETS_ORIGIN = "https://assets.ellreka.net";

// R2 の画像は Cloudflare Image Transformations で縮小・変換して配信する。
// 元ファイルの大きさを気にせず置けるよう、表示に使う URL はここで組み立てる。
// ゾーン(ellreka.net)で Transformations を有効にしていないと /cdn-cgi/image/ は 404 になる
const TRANSFORM_PREFIX = `${ASSETS_ORIGIN}/cdn-cgi/image/`;

// 縮小できる形式だけを変換する(SVG・動画などは元の URL のまま)
const RESIZABLE = /\.(?:jpe?g|png|webp|gif|avif)(?:[?#]|$)/i;

// 表示先ごとの大きさ。srcset は元画像の大きさが分からないと小さい画像の表示幅が変わるため使わず、
// 高解像度の画面に合わせた 1 つにする
const VARIANTS = {
  // 本文。列(max-w-3xl = 768px)の 2 倍。scale-down なので小さい画像は拡大せず、表示の大きさも変わらない
  content: "width=1536,fit=scale-down",
  // 一覧のカルーセル。枠(300×200 の object-cover)の 2 倍を埋めるように中央で切り抜く。
  // 高さだけの指定だと縦長の画像は幅が足りず、枠に合わせて引き伸ばされる
  thumbnail: "width=600,height=400,fit=cover",
  // 拡大表示
  zoom: "width=2048,height=2048,fit=scale-down",
} as const;

export type ImageVariant = keyof typeof VARIANTS;

export function imageUrl(src: string, variant: ImageVariant): string {
  const original = originalImageUrl(src);
  if (!original.startsWith(`${ASSETS_ORIGIN}/`) || !RESIZABLE.test(original)) return src;
  const path = original.slice(ASSETS_ORIGIN.length + 1);
  // 上限(画像 100MP・アニメーション GIF の合計 50MP など)を超えて変換できないときは元の画像へリダイレクトさせる
  return `${TRANSFORM_PREFIX}${VARIANTS[variant]},format=auto,onerror=redirect/${path}`;
}

// 変換済みの URL から元の URL に戻す(別の大きさの URL を作り直すため)
export function originalImageUrl(src: string): string {
  if (!src.startsWith(TRANSFORM_PREFIX)) return src;
  const rest = src.slice(TRANSFORM_PREFIX.length);
  return `${ASSETS_ORIGIN}/${rest.slice(rest.indexOf("/") + 1)}`;
}
