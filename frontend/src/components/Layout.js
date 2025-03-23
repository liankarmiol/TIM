import React from "react";
import MainNav from "./MainNav";

const Layout = ({ children }) => {
  return (
    <div>
      <MainNav />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
