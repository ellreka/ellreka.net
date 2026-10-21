import type { JSX } from "solid-js";
import { SiteFrame } from "../../components/site-frame";
import { useEntryFrontmatter } from "../../lib/frontmatter";

export default function EntryLayout(props: { children: JSX.Element }) {
  const fm = useEntryFrontmatter();
  return (
    <SiteFrame current="entries">
      <article class="void-md pt-12 pb-24 [&_video]:w-full [&_video]:rounded-md">
        <h1>{fm.title}</h1>
        {props.children}
      </article>
    </SiteFrame>
  );
}
