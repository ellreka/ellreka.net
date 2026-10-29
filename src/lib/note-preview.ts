import MarkdownExit from "markdown-exit";

// サーバー専用。root には全文の Markdown コンポーネントではなく、本文と画像だけを渡す。
const markdown = new MarkdownExit({ html: true, linkify: true });

export type PreviewImage = { src: string; alt: string; href?: string };

export type NotePreview = { html: string; images: PreviewImage[] };

export function notePreview(source: string): NotePreview {
  const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, "");
  const tokens = markdown.parse(body, {});
  const images: PreviewImage[] = [];

  for (const [index, block] of tokens.entries()) {
    if (!block.children) continue;
    let href: string | undefined;
    block.children = block.children.filter((token) => {
      if (token.type === "link_open") href = token.attrGet("href") ?? undefined;
      else if (token.type === "link_close") href = undefined;
      else if (token.type === "image") {
        images.push({
          src: token.attrGet("src") ?? "",
          alt: markdown.renderer.renderInlineAsText(token.children ?? [], markdown.options),
          href,
        });
        return false;
      }
      return true;
    });
    // カルーセルへ移した画像だけの段落は、空のリンクや余白も残さない。
    if (
      block.children.every((token) =>
        ["link_open", "link_close", "softbreak", "hardbreak"].includes(token.type),
      ) &&
      tokens[index - 1]?.type === "paragraph_open"
    ) {
      block.children = [];
      tokens[index - 1].hidden = true;
      tokens[index + 1].hidden = true;
    }
  }

  return { html: markdown.renderer.render(tokens, markdown.options, {}).trim(), images };
}
