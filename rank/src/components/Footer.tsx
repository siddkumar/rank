"use client";

import React from "react";
import { Icon } from "./common/Icon";

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; 2026 Siddharth Kumar. All rights reserved.</p>
      <a href="https://www.github.com/siddkumar/rank">
        <Icon className="fa-brands fa-square-github fa-xl" />
      </a>
    </footer>
  );
};

export default Footer;
