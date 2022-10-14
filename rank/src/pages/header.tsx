import React, { useEffect } from "react";
import logo from "../resources/logo.png";

export interface HeaderProps {}

function Header(props: HeaderProps) {
  return (
    <div className="app-header">
      <div className="header-left">
        <img src={logo} alt="logo" className="header-logo" />
        <p className="header-title">rank anything</p>
      </div>
      <div className="header-right">
        <a href="/">home</a>
        <a href="/create">create</a>
        <a href="/demo">demo</a>
        <a href="/templates">templates</a>
        <a href="/mystuff">ranks</a>
      </div>
    </div>
  );
}

export default Header;
