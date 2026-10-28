import { describe, expect, test } from "vite-plus/test";
import { fitTextClass } from "./og-fit";

const box = { width: 1000, height: 380 };

describe("fitTextClass", () => {
  test("短い文章は最大の文字サイズにする", () => {
    expect(fitTextClass("2020 年の振り返り", box)).toBe("text-6xl");
  });

  test("長くなるほど文字サイズを下げる", () => {
    expect(fitTextClass("あ".repeat(60), box)).toBe("text-5xl");
    expect(fitTextClass("あ".repeat(120), box)).toBe("text-4xl");
  });

  test("半角は全角より狭く見積もる", () => {
    expect(fitTextClass("a".repeat(60), box)).toBe("text-6xl");
  });

  test("収まらなくても最小の文字サイズを返す", () => {
    expect(fitTextClass("あ".repeat(1000), box)).toBe("text-2xl");
  });
});
