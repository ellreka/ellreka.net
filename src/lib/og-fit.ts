// OGP カードの文章を省略せずに収める文字サイズを選ぶ。
// prerender の時点で決めるためブラウザで測らず、文字幅を全角 1・半角 0.6(em)として行数を見積もる。
// クラス名は Tailwind が拾えるよう、文字列のまま書く
const SIZES = [
  { px: 60, className: "text-6xl" },
  { px: 48, className: "text-5xl" },
  { px: 36, className: "text-4xl" },
  { px: 30, className: "text-3xl" },
  { px: 24, className: "text-2xl" },
] as const;

// leading-normal
const LINE_HEIGHT = 1.5;
// 英単語の途中では折り返さないぶん、行末に余りが出る
const WRAP_SLACK = 1.15;

export type OgTextBox = { width: number; height: number };

function textWidthEm(text: string): number {
  return Array.from(text).reduce(
    (sum, char) => sum + ((char.codePointAt(0) ?? 0) < 0x2000 ? 0.6 : 1),
    0,
  );
}

export function fitTextClass(text: string, box: OgTextBox): string {
  const em = textWidthEm(text);
  const fit = SIZES.find(({ px }) => {
    const lines = Math.max(1, Math.ceil((em * px * WRAP_SLACK) / box.width));
    return lines * px * LINE_HEIGHT <= box.height;
  });
  return (fit ?? SIZES[SIZES.length - 1]).className;
}
