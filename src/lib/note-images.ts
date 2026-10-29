// @void/md の静的 HTML を拡張する。画像リンクは元の遷移先を優先する。
// gallery が false なら画像だけの段落をまとめず、拡大表示用のリンクだけを付ける(entry は本文の並びを変えない)。
// ponytail: グリッド化は hydration 後。初期表示の並びも揃える必要が出たらビルド時の Markdown 変換に移す。
export function enhanceNoteImages(content: HTMLElement, options: { gallery: boolean }): void {
  if (options.gallery) groupImageParagraphs(content);

  for (const image of content.querySelectorAll("img")) {
    if (image.closest("a, button")) continue;
    const link = document.createElement("a");
    link.href = image.currentSrc || image.src;
    link.dataset.noteImage = "";
    link.setAttribute("aria-haspopup", "dialog");
    link.setAttribute("aria-label", image.alt ? `${image.alt}を拡大表示` : "画像を拡大表示");
    image.parentNode?.insertBefore(link, image);
    link.appendChild(image);
  }
}

// 連続した画像だけの段落を 1 つの [data-note-gallery] にまとめる
function groupImageParagraphs(content: HTMLElement): void {
  for (const paragraph of content.querySelectorAll("p")) {
    const images = paragraph.querySelectorAll(":scope > img");
    const imageOnly = [...paragraph.childNodes].every((node) =>
      node.nodeType === Node.TEXT_NODE
        ? node.textContent?.trim() === ""
        : node instanceof HTMLImageElement || node instanceof HTMLBRElement,
    );
    if (!imageOnly || images.length === 0) continue;

    const previous = paragraph.previousElementSibling;
    const gallery = previous?.hasAttribute("data-note-gallery")
      ? previous
      : document.createElement("div");
    gallery.setAttribute("data-note-gallery", "");
    if (gallery !== previous) paragraph.parentNode?.insertBefore(gallery, paragraph);
    for (const image of images) gallery.appendChild(image);
    paragraph.remove();
  }
}
