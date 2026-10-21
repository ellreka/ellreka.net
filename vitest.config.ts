import { defineConfig } from "vite-plus";

// テストは純粋な関数だけを対象にするので、Void のプラグインを含む vite.config.ts は読み込まない
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
  },
});
