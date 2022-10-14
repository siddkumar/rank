import React, { useEffect, useState } from "react";
import "firebaseui/dist/firebaseui.css";
import "../../styles/home.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function MyStuff() {
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);

  onAuthStateChanged(auth, (user) => {
    setUser(user);
  });

  return (
    <>
      <div className="home-page-layout">
        <div className="main-title">
          Welcome {user?.displayName ?? user?.email} !
        </div>
        <button className="button-styles" onClick={() => auth.signOut()}>
          Sign Out
        </button>
      </div>
    </>
  );
}

export default MyStuff;
