import React, { useEffect, useState } from "react";
import AuthWidget from "../../components/authWidget";
import 'firebaseui/dist/firebaseui.css'
import '../../styles/home.css'
import {getAuth, onAuthStateChanged} from "firebase/auth";

function Home() {

  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);
  const [forceHide, setForceHide] = useState(false);

  useEffect(() => 
    { 
      if(!user) {
        AuthWidget({}) 
      }
    }, [user, forceHide])

  onAuthStateChanged(auth, (user) => { 
    setUser(user);
    setForceHide(user != null);
  });

  return (
    <>
      <div className="home-page-layout">
        <div className="main-title">Welcome!</div>
        <div className="main-subtitle">Sign In to access more features, like saving!</div>
      </div>
      <div id="firebaseui-auth-container"></div>
    </>
  )
}

export default Home;