import type { JSX } from "solid-js";
import { useEntryFrontmatter } from "../../lib/frontmatter";

export default function EntryLayout(props: { children: JSX.Element }) {
  const fm = useEntryFrontmatter();
  return (
    <article class="void-md">
      <h1>{fm.title}</h1>
      {props.children}
    </article>
  );
}
