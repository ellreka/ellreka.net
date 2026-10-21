import "@void/md/theme.css";
import { Link } from "@void/solid";
import type { JSX } from "solid-js";

export default function Layout(props: { children: JSX.Element }) {
  return (
    <>
      <header>
        <Link href="/">ellreka.net</Link>
      </header>
      {props.children}
    </>
  );
}
