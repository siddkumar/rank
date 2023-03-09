import React, { useContext } from "react";
import "firebaseui/dist/firebaseui.css";
import "../../styles/home.css";
import { AuthWidget2 } from "../../components/auth/authWidget2";
import { StoreContext } from "../../App";

function SignIn() {
  
  
  const authInfo = useContext(StoreContext);


  return (
    <>
      <div className="home-page-layout">
        <div className="main-title">Welcome!</div>
        <div className="main-subtitle">
          Sign In to access more features, like saving!
        </div>
      </div>
      {authInfo.getIsLoggedIn() ? <></> : <AuthWidget2></AuthWidget2>}
    </>
  );
}

export default SignIn;
