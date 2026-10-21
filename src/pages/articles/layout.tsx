import { useFrontmatter } from "@void/md";
import type { JSX } from "solid-js";

export default function ArticleLayout(props: { children: JSX.Element }) {
  const fm = useFrontmatter();
  return (
    <article class="void-md">
      <h1>{fm.title as string}</h1>
      {props.children}
    </article>
  );
}
