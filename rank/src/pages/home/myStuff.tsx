import React, { useState } from "react";
import "firebaseui/dist/firebaseui.css";
import "../../styles/myStuff.css";
import { Auth, getAuth, onAuthStateChanged, User } from "firebase/auth";
import { ExistingTemplateStub } from "../../components/templates/templates";
import {
  RanksList,
  TemplatesList,
} from "../../components/templates/templatesList";
import { ExistingRankStub } from "../rank/ranks";
import {
  GetRanksForUser,
  GetTemplatesForUser,
} from "../../services/userService";

enum MyStuffViews {
  SignIn = "SignIn",
  Waiting = "Waiting",
  Loaded = "Loaded",
}

function MyStuff() {
  const auth = getAuth();
  const [existingUser, setUser] = useState<User | null>(null);
  const [stubs, setStubs] = useState<ExistingTemplateStub[]>([]);
  const [hasRequestedTemplates, setHasRequestedTemplates] = useState(false);
  const [ranks, setRanks] = useState<ExistingRankStub[]>([]);
  const [view, setView] = useState<MyStuffViews>(MyStuffViews.SignIn);

  onAuthStateChanged(auth, (user) => {
    if (user && !existingUser) {
      setView(MyStuffViews.Loaded);
      setUser(user);
    }
  });

  function signMeOut(auth: Auth) {
    setView(MyStuffViews.SignIn);
    setStubs([]);
    setRanks([]);
    auth.signOut();
  }

  function renderMyStuff() {
    if (!hasRequestedTemplates && stubs.length === 0 && existingUser) {
      // get templates
      setHasRequestedTemplates(true);
      GetTemplatesForUser(existingUser.email!).then((res) => setStubs(res));

      // get ranks
      GetRanksForUser(existingUser.email!).then((res) => setRanks(res));
      setView(MyStuffViews.Loaded);
    }

    return (
      <>
        <div className="myStuffContainer">
          <div className="container">
            <div className="stuff-subtitle">Your Templates</div>
            <TemplatesList stubs={stubs} />
          </div>
          <div className="container">
            <div className="stuff-subtitle">Your Ranks</div>
            <RanksList stubs={ranks} />
          </div>
        </div>
        <button className="button-styles" onClick={(e) => signMeOut(auth)}>
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
      </>
    );
  }

  return (
    <>
      <div className="myStuff-page-layout">
        {view === MyStuffViews.SignIn && renderPleaseSignIn()}
        {view === MyStuffViews.Loaded && renderMyStuff()}
      </div>
    </>
  );
}

export default MyStuff;
