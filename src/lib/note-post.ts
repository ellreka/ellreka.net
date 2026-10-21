// 投稿画面から notes を作るときの id・frontmatter・画像キーの決め方

export const ASSETS_ORIGIN = "https://assets.ellreka.net";
export const NOTES_DIR = "src/content/notes";
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

// ファイル名ではなく Content-Type から拡張子を決める
export const IMAGE_EXTENSIONS: Readonly<Record<string, string>> = {
  "image/avif": "avif",
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// 本文中で、まだアップロードしていない画像を指す仮の参照(`![](upload:1)`)
export const UPLOAD_PLACEHOLDER = /\(upload:(\d+)\)/g;

const JST = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

export type NoteStamp = {
  // ファイル名(= URL)にする id。秒まで含めて同じ分の投稿でも重ならないようにする
  id: string;
  // frontmatter の date。既存の notes と同じ `YYYY-MM-DD HH:MM`
  date: string;
  year: string;
};

export function noteStamp(now: Date): NoteStamp {
  const part = Object.fromEntries(JST.formatToParts(now).map(({ type, value }) => [type, value]));
  const day = `${part.year}-${part.month}-${part.day}`;
  return {
    id: `${day}-${part.hour}${part.minute}${part.second}`,
    date: `${day} ${part.hour}:${part.minute}`,
    year: part.year,
  };
}

export function buildNoteMarkdown(input: { date: string; entry?: string; body: string }): string {
  const frontmatter = [`date: ${input.date}`, ...(input.entry ? [`entry: ${input.entry}`] : [])];
  return `---\n${frontmatter.join("\n")}\n---\n\n${input.body.trim()}\n`;
}

// 中身のハッシュを名前にするので、同じ画像は 1 つにまとまり、キャッシュも変更なしで扱える
export async function imageKey(
  bytes: ArrayBuffer,
  contentType: string,
  year: string,
): Promise<string> {
  const extension = IMAGE_EXTENSIONS[contentType];
  if (!extension) throw new Error(`unsupported image type: ${contentType}`);
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  const hash = Array.from(digest.slice(0, 6), (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
  return `notes/${year}/${hash}.${extension}`;
}

export function placeholderIds(body: string): string[] {
  return [...new Set(Array.from(body.matchAll(UPLOAD_PLACEHOLDER), (match) => match[1]))];
}

export function replacePlaceholders(body: string, urls: ReadonlyMap<string, string>): string {
  return body.replace(UPLOAD_PLACEHOLDER, (placeholder, id: string) => {
    const url = urls.get(id);
    return url ? `(${url})` : placeholder;
  });
}

// GitHub の Contents API は本文を base64 で受け取る
export function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
