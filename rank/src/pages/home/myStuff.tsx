import React, { useContext, useState } from "react";
import "firebaseui/dist/firebaseui.css";
import "../../styles/myStuff.css";
import { getAuth } from "firebase/auth";
import {
  RanksList,
  TemplatesList,
} from "../../components/templates/templatesList";
import { observer } from "mobx-react";
import { StoreContext } from "../../App";

enum MyStuffViews {
  SignIn = "SignIn",
  Waiting = "Waiting",
  Loaded = "Loaded"
}

function MyStuff() {
  const auth = getAuth();
  const store = useContext(StoreContext);
  const [view, setView] = useState<MyStuffViews>(MyStuffViews.SignIn);

  function signOut() {
    setView(MyStuffViews.SignIn)
    store.setLogInInfo(false, "", "");
    auth.signOut();
  }

  function renderMyStuff() {
    return (
      <>
        <div className="myStuffContainer">
          <div className="container">
            <div className="stuff-subtitle">Your Templates</div>
            <TemplatesList stubs={store.getTemplates()} />
          </div>
          <div className="container">
            <div className="stuff-subtitle">Your Ranks</div>
            <RanksList stubs={store.getRanks()} />
          </div>
        </div>
        <button className="button-styles" onClick={() => signOut()}>
          Sign Out
        </button>
      </>
    );
  }

  function renderPleaseSignIn() {
    return (
      <>
        <div className="main-subtitle">
          This page is where you can see your saved rankings and templates, but
          you must sign in to do so.
        </div>
        <a className="button-styles" href={"/signIn"}>
          Sign In
        </a>
      </>
    );
  }

  return (
    <>
      <div className="home-page-layout">
        <div className="main-title">
          Hello {store.getDisplayName() ?? store.getUserEmail()} !
        </div>
        {view === MyStuffViews.SignIn && renderPleaseSignIn()}
        {view === MyStuffViews.Loaded && renderMyStuff()}
      </div>
    </>
  );
}

export default observer(MyStuff);
