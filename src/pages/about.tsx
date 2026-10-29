import { SiteFrame } from "../components/site-frame";

export default function AboutPage() {
  return (
    <SiteFrame current="about">
      <section class="flex flex-col gap-6 pt-12 pb-24">
        <h1 class="border-b border-border pb-4 font-mono text-sm text-text">about</h1>
        <p class="font-sans text-base leading-relaxed text-text-2">
          ellreka の個人ブログです。技術のことや日々のメモを書いています。
        </p>
        <ul class="flex gap-4 font-mono text-sm">
          <li>
            <a href="https://github.com/ellreka">GitHub</a>
          </li>
          <li>
            <a href="https://x.com/ellreka">X</a>
          </li>
        </ul>
      </section>
    </SiteFrame>
  );
}
