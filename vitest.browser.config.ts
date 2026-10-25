import { voidSolid } from "@void/solid/plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite-plus";
import { preview } from "vite-plus/test/browser-preview";

export default defineConfig({
  plugins: [voidSolid(), tailwindcss()],
  test: {
    include: ["src/**/*.browser.test.ts"],
    browser: {
      enabled: true,
      provider: preview(),
      instances: [{ browser: "chromium" }],
    },
  },
});
