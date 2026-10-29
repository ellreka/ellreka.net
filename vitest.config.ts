import { defineConfig } from "vite-plus";

// アプリの vite.config.ts は読まない。SSR の回帰テストだけ Solid の変換を個別に使う
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    exclude: ["src/**/*.browser.test.ts"],
  },
});
