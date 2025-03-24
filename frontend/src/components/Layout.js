import React from "react";
import MainNavigation from "./MainNavigation";
import Footer from "./Footer";
import "../styles/AppStyles.css";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <MainNavigation />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
