import { voidSolid } from "@void/solid/plugin";
import { createServer } from "vite";
import { expect, test } from "vite-plus/test";

test("編集時の Markdown を SSR の textarea 内に出力し、初期値を空にしない", async () => {
  const server = await createServer({
    configFile: false,
    plugins: [voidSolid()],
    server: { middlewareMode: true, watch: null, hmr: false },
    logLevel: "error",
  });
  try {
    const { NoteEditor } = await server.ssrLoadModule("/src/components/note-editor.tsx");
    const { renderToString } = await server.ssrLoadModule("solid-js/web");
    const { createComponent } = await server.ssrLoadModule("solid-js");
    const body = "## 元の Markdown\n\n**本文**\n\n![](https://example.com/image.png)";
    const html = renderToString(() =>
      createComponent(NoteEditor, {
        entries: [],
        note: { id: "2026-09-02-note", body, version: "original-version" },
      }),
    );
    expect(html.match(/<textarea\b[^>]*>([\s\S]*?)<\/textarea>/)?.[1]).toBe(body);
  } finally {
    await server.close();
  }
});
