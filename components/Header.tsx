import { NextPage } from "next";
import Link from "next/link";
import Nav from "./Nav";

const Header: NextPage = () => (
  <header className="h-10">
    <div className="fixed flex justify-between items-center shadow-md w-full px-12 py-1 bg-header">
      <Link href="/" as="/">
        <a className="flex">
          <img
            src="/icon.png"
            width="20"
            height="20"
            className="w-6 h-6"
            alt=""
          />
          <h1 className="ml-2 font-bold">ellreka.net</h1>
        </a>
      </Link>
      <Nav></Nav>
    </div>
  </header>
);

export default Header;
