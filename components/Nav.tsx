import Link from "next/link";
import { NextPage } from "next";

const Nav: NextPage = () => (
  <nav>
    <ul className="flex text-lg">
      <li>
        <Link href="/">
          <a>Home</a>
        </Link>
      </li>
      <li>
        <Link href="/about">
          <a>About</a>
        </Link>
      </li>
      <li>
        <Link href="/blog">
          <a>Blog</a>
        </Link>
      </li>
    </ul>
    <style jsx>
      {`
        li + li {
          margin-left: 15px;
        }
      `}
    </style>
  </nav>
);

export default Nav;
