import "../app.css";
import { Link } from "@void/solid";
import type { JSX } from "solid-js";

export default function Layout(props: { children: JSX.Element }) {
  return (
    <div class="mx-auto max-w-3xl px-4 py-10">
      <header class="mb-12">
        <Link href="/" class="font-bold text-ellreka">
          ellreka.net
        </Link>
      </header>
      {props.children}
    </div>
  );
}
