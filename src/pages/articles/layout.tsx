import type { JSX } from "solid-js";
import { useArticleFrontmatter } from "../../lib/frontmatter";

export default function ArticleLayout(props: { children: JSX.Element }) {
  const fm = useArticleFrontmatter();
  return (
    <article class="void-md">
      <h1>{fm.title}</h1>
      {props.children}
    </article>
  );
}
