import { defineConfig } from "vite";
import { voidPlugin } from "void";
import { voidSolid } from "@void/solid/plugin";
import { voidMarkdown } from "@void/md/plugin";
import tailwindcss from "@tailwindcss/vite";
import { localNotes } from "./scripts/local-notes";

export default defineConfig({
  plugins: [
    localNotes(),
    voidPlugin(),
    voidSolid(),
    voidMarkdown({
      shiki: {
        themes: { light: "github-light", dark: "github-dark" },
      },
    }),
    tailwindcss(),
  ],
  server: {
    port: 4444,
    strictPort: true,
  },
});
