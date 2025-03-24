import React from "react";
import "../styles/AppStyles.css";

const Footer = () => {
  return (
    <footer>
      <p>
        © {new Date().getFullYear()} The Inner Maze. All rights not really
        reserved — but you know the drill.
      </p>
    </footer>
  );
};

export default Footer;
