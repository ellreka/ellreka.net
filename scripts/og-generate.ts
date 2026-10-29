// OGP 画像を作って R2 の公開バケットに置く。
// `pnpm build` の出力から公開ページの og:image を集め、R2 にまだ無いものだけ /og 配下のページを撮影してアップロードする。
// ファイル名に文章のハッシュが入っている(src/lib/og.ts の ogImageUrl)ので、新しい・変わったカードだけが撮り直しになる。
//
//   pnpm build && pnpm og:generate   無い画像だけ撮影してアップロード
//   pnpm og:generate --force         すべて撮り直してアップロード
//   pnpm og:generate --dry-run       撮影して dist/og-images/ に書き出すだけ(アップロードしない)
//
// 撮影にはインストール済みの Google Chrome を使う(playwright-core。ブラウザはダウンロードしない)
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { chromium } from "playwright-core";
import type { Browser, BrowserContext } from "playwright-core";
import { ASSETS_ORIGIN, putObject } from "./r2.ts";

const CLIENT_DIR = resolve(import.meta.dirname, "../dist/client");
const OUT_DIR = resolve(import.meta.dirname, "../dist/og-images");
// 撮影のときだけ使うオリジン。リクエストは dist/client のファイルで返す(Google Fonts は通常どおり取得する)
const LOCAL_ORIGIN = "http://og.localhost";
const OG_PREFIX = `${ASSETS_ORIGIN}/og/`;
// 内容が変わるとファイル名も変わるので、長くキャッシュしてよい
const CACHE_CONTROL = "public, max-age=31536000, immutable";

function log(message: string): void {
  process.stdout.write(`${message}\n`);
}

function listHtml(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return listHtml(path);
    return path.endsWith(".html") ? [path] : [];
  });
}

// 公開ページの head に出ている og:image(R2 に置く OGP 画像)の URL
function collectImageUrls(): string[] {
  const urls = new Set<string>();
  for (const file of listHtml(CLIENT_DIR)) {
    for (const match of readFileSync(file, "utf8").matchAll(
      /<meta property="og:image" content="([^"]+)"/g,
    )) {
      if (match[1].startsWith(OG_PREFIX)) urls.add(match[1]);
    }
  }
  return [...urls].sort();
}

// og/entries/<id>-<hash>.png → /og/entries/<id>、og/default-<hash>.png → /og
function cardPath(key: string): string {
  const name = key.replace(/-[0-9a-f]{8}\.png$/, "");
  return name === "og/default" ? "/og" : `/${name}`;
}

async function exists(url: string): Promise<boolean> {
  const response = await fetch(url, { method: "HEAD" });
  if (response.ok) return true;
  if (response.status === 404) return false;
  throw new Error(`${url} を確認できませんでした: ${response.status}`);
}

// prerender 済みの HTML と、そこから読む CSS・画像などを dist/client から返す
function resolveFile(pathname: string): string | undefined {
  const path = join(CLIENT_DIR, decodeURIComponent(pathname));
  if (path !== CLIENT_DIR && !path.startsWith(`${CLIENT_DIR}${sep}`)) return undefined;
  return [path, `${path}.html`, join(path, "index.html")].find(
    (file) => existsSync(file) && statSync(file).isFile(),
  );
}

async function launch(): Promise<Browser> {
  try {
    return await chromium.launch({ channel: "chrome" });
  } catch (error) {
    throw new Error("Google Chrome を起動できませんでした。OGP 画像の撮影には Chrome が必要です", {
      cause: error,
    });
  }
}

async function capture(context: BrowserContext, path: string): Promise<Buffer> {
  const page = await context.newPage();
  try {
    const response = await page.goto(`${LOCAL_ORIGIN}${path}`, { waitUntil: "networkidle" });
    if (response?.status() !== 200) {
      throw new Error(`${path} のカードがありません(${response?.status()})`);
    }
    await page.evaluate(() => document.fonts.ready);
    return await page.screenshot({ type: "png" });
  } finally {
    await page.close();
  }
}

async function main(): Promise<void> {
  const args = new Set(process.argv.slice(2));
  const force = args.has("--force");
  const dryRun = args.has("--dry-run");
  if (!existsSync(CLIENT_DIR)) {
    throw new Error("dist/client がありません。先に pnpm build を実行してください");
  }

  const urls = collectImageUrls();
  if (urls.length === 0) throw new Error("og:image を出しているページがありません");
  const targets: string[] = [];
  for (const url of urls) {
    if (force || !(await exists(url))) targets.push(url);
  }
  log(`OGP 画像 ${urls.length} 枚のうち ${targets.length} 枚を作成します`);
  if (targets.length === 0) return;

  const browser = await launch();
  try {
    const context = await browser.newContext({
      viewport: { width: 1200, height: 630 },
      deviceScaleFactor: 1,
    });
    await context.route(`${LOCAL_ORIGIN}/**`, (route) => {
      const file = resolveFile(new URL(route.request().url()).pathname);
      return file ? route.fulfill({ path: file }) : route.fulfill({ status: 404 });
    });
    for (const url of targets) {
      const key = url.slice(ASSETS_ORIGIN.length + 1);
      const file = join(OUT_DIR, key);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, await capture(context, cardPath(key)));
      if (dryRun) log(`${file} に書き出しました`);
      else putObject(key, file, "image/png", CACHE_CONTROL);
    }
  } finally {
    await browser.close();
  }
}

await main();
