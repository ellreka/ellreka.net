import { expect, test } from "vite-plus/test";
import { imageUrl, originalImageUrl } from "./image-url";

const ORIGINAL = "https://assets.ellreka.net/notes/2026/abc.jpg";

test("R2 の画像は表示先ごとの大きさに変換する URL にする", () => {
  expect(imageUrl(ORIGINAL, "content")).toBe(
    "https://assets.ellreka.net/cdn-cgi/image/width=1536,fit=scale-down,format=auto,onerror=redirect/notes/2026/abc.jpg",
  );
  expect(imageUrl(ORIGINAL, "thumbnail")).toBe(
    "https://assets.ellreka.net/cdn-cgi/image/width=600,height=400,fit=cover,format=auto,onerror=redirect/notes/2026/abc.jpg",
  );
});

test("変換済みの URL から別の大きさを作り直せる", () => {
  const content = imageUrl(ORIGINAL, "content");
  expect(originalImageUrl(content)).toBe(ORIGINAL);
  expect(imageUrl(content, "zoom")).toBe(imageUrl(ORIGINAL, "zoom"));
});

test("R2 以外・縮小できない形式は元の URL のまま", () => {
  for (const src of [
    "https://example.com/a.jpg",
    "/note-assets/notes/2026/abc.png",
    "blob:http://localhost:4444/1234",
    "https://assets.ellreka.net/diagram.svg",
    "https://assets.ellreka.net/movie.mp4",
  ]) {
    expect(imageUrl(src, "content")).toBe(src);
  }
});
