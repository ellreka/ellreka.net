import pages from "@void/md/pages";
import { Link } from "@void/solid";
import { For } from "solid-js";

const entries = pages.filter((page) => page.path.startsWith("/entries/"));

export default function HomePage() {
  return (
    <main>
      <ul>
        <For each={entries}>
          {(entry) => (
            <li>
              <Link href={entry.path}>{entry.title}</Link>
            </li>
          )}
        </For>
      </ul>
    </main>
  );
}
