// 記事の画像・動画を R2 の公開バケットにアップロードする。
// 元ファイルは git 管理外の assets/ に置き、記事からは ASSETS_ORIGIN 配下の URL で参照する。
//
//   pnpm assets:upload                    assets/ 以下をすべてアップロード
//   pnpm assets:upload foo.png bar/baz.jpg   指定したファイルだけアップロード(assets/ からの相対パス)
import { readdirSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import { putObject } from "./r2.ts";

const ASSETS_DIR = resolve(import.meta.dirname, "../assets");
const CACHE_CONTROL = "public, max-age=2592000";

const CONTENT_TYPES: Readonly<Record<string, string>> = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".mov": "video/quicktime",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webm": "video/webm",
  ".webp": "image/webp",
};

function listFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    if (name.startsWith(".")) return [];
    const path = join(dir, name);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}

function upload(path: string): void {
  const key = relative(ASSETS_DIR, path).split("\\").join("/");
  const contentType = CONTENT_TYPES[extname(path).toLowerCase()];
  if (!contentType) throw new Error(`unsupported file type: ${key}`);
  putObject(key, path, contentType, CACHE_CONTROL);
}

const targets = process.argv.slice(2);
const files =
  targets.length > 0 ? targets.map((target) => join(ASSETS_DIR, target)) : listFiles(ASSETS_DIR);
for (const file of files) upload(file);
