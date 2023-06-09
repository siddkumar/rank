import React, { useState } from "react";
import logo from "../resources/logo.png";
import { CreateUser, GetUserIdForEmail } from "../services/userService";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { AuthResult } from "../components/auth/authWidget";
import "../styles/auth.css";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/authProvider";
import { useDB } from "../services/dbProvider";

export interface HeaderProps {}

function Header(props: HeaderProps) {
  const auth = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();
  const db = useDB().db;

  async function signInWithCredential(authResult: AuthResult) {
    var id = "";
    if (authResult.additionalUserInfo.isNewUser) {
      const email = authResult.additionalUserInfo.profile.email;
      id = await CreateUser(db!, email);
    } else {
      id = await GetUserIdForEmail(
        db!,
        authResult.additionalUserInfo.profile.email
      );
    }
    console.log("signing in");
    auth.saveUserId(id);
    auth.saveEmail(authResult.additionalUserInfo.profile.email);
    auth.saveName(authResult.additionalUserInfo.profile.name);
    setShowAuth(false);
    return true;
  }

  const SignInSuccessWithAuthResult = (
    authResult: AuthResult,
    redirectUrl?: string | undefined
  ) => {
    signInWithCredential(authResult).then();
    return true;
  };

  const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: (
        authResult: AuthResult,
        redirectUrl?: string
      ) => SignInSuccessWithAuthResult(authResult, redirectUrl),
    },
    
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: "popup",
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      // firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
  };

  const handleSignInClick = () => {
    setShowAuth(true);
  };

  function userView() {
    return (
      <>
        <a href="/myStuff">
          <button className=" caveat-large button-styles">My Stuff</button>
        </a>
        <button
          className="button-styles caveat-large"
          onClick={() => {
            auth.signOut();
            navigate("/");
          }}
        >
          {" "}
          Sign Out{" "}
        </button>
      </>
    );
  }

  function authComponent() {
    return (
      <div className="auth-overlay">
        <div className="auth-container">
          <div className="auth-title">Sign in or Sign Up</div>
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          ></StyledFirebaseAuth>
          <button
            className="close-auth button-styles caveat-large"
            onClick={() => setShowAuth(false)}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

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
            {auth.id && auth.id.length > 0 ? (
              userView()
            ) : (
              <button
                className="button-styles caveat-large"
                onClick={handleSignInClick}
              >
                Sign In
              </button>
            )}
            {showAuth && authComponent()}
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Header;
