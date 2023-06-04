import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!hasRequestedTemplates && stubs.length === 0 && existingUser) {
      // get templates
      setHasRequestedTemplates(true);
      GetTemplatesForUser(existingUser.email!).then((res) =>
        setStubs(res.sort((a, b) => a.name.localeCompare(b.name)))
      );

      // get ranks
      GetRanksForUser(existingUser.email!).then((res) =>
        setRanks(res.sort((a, b) => a.name.localeCompare(b.name)))
      );
      setView(MyStuffViews.Loaded);
    }
  }, [existingUser, hasRequestedTemplates, stubs.length]);

  onAuthStateChanged(auth, (user) => {
    if (user && !existingUser) {
      setView(MyStuffViews.Loaded);
      setUser(user);
    }
  });

  function renderMyStuff() {
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
      </>
    );
  }

  function renderPleaseSignIn() {
    return (
      <>
        <div className="myStuffContainer">
          <div className="container card">
            <div className="main-subtitle">
              This page is where you can see your saved rankings and templates,
              but you must sign in to do so.
            </div>
          </div>
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
