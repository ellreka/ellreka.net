import Header from "./Header";
import Nav from "./Nav";
import { NextPage } from "next";

const Layout: NextPage = ({ children }) => (
  <div className="bg-brown-100 text-brown-200 font-mono">
    <Header />
    <div className="w-11/12 max-w-2xl mx-auto">{children}</div>
  </div>
);

export default Layout;
