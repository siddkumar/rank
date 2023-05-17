import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useState } from "react";
import logo from "../resources/logo.png";

export interface HeaderProps {}

function Header(props: HeaderProps) {
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);

  onAuthStateChanged(auth, (user) => {
    setUser(user);
  });

  return (
    <div className="app-header">
      <div className="header-container">
        <div className="header-left">
          <a href="/">
            <img src={logo} alt="logo" className="header-logo" />
          </a>
          <a href="/">
            <h1 className="header-title">rank anything</h1>
          </a>
          <nav className="header-right">
            <a href="/">create</a>
            {user ? (
              <a href="/mystuff">saved</a>
            ) : (
              <a href="/signIn">Sign In</a>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Header;
