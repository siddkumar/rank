import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import logo from "../resources/logo.png";

export interface HeaderProps {}

function Header(props: HeaderProps) {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  function renderAuthSection() {
    if (isAuthenticated) {
      return (
        <>
          <div>Hi {user?.given_name}! </div>
          <button
            className="login-button-styles"
            onClick={() => logout({ returnTo: window.location.origin })}
          >
            Log Out
          </button>
        </>
      );
    }
    return (
      <button
        onClick={() => {
          console.log(window.location.origin);
          loginWithRedirect();
        }}
        className="login-button-styles"
      >
        Log In
      </button>
    );
  }

  return (
    <div className="app-header">
      <div className="header-left">
        <img src={logo} alt="logo" className="header-logo" />
        <p className="header-title">rank anything</p>
      </div>
      <div className="header-right">
        <a href="/home">home</a>
        <a href="/create">create</a>
        <a href="/demo">demo</a>
        <a href="/templates">templates</a>
        <a href="/mystuff">ranks</a>
        <>{renderAuthSection()}</>
      </div>
    </div>
  );
}

export default Header;
