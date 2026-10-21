import { defineConfig } from "vite";
import { voidPlugin } from "void";
import { voidSolid } from "@void/solid/plugin";
import { voidMarkdown } from "@void/md/plugin";

export default defineConfig({
  plugins: [voidPlugin(), voidSolid(), voidMarkdown()],
  server: {
    port: 4444,
    strictPort: true,
  },
});
