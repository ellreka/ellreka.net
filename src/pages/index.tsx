import pages from "@void/md/pages";
import { Link } from "@void/solid";
import { For } from "solid-js";

const articles = pages.filter((page) => page.path.startsWith("/articles/"));

export default function HomePage() {
  return (
    <main>
      <ul>
        <For each={articles}>
          {(article) => (
            <li>
              <Link href={article.path}>{article.title}</Link>
            </li>
          )}
        </For>
      </ul>
    </main>
  );
}
