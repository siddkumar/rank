import React, { useEffect, useState } from "react";
import "firebaseui/dist/firebaseui.css";
import "../../styles/myStuff.css";
import { ExistingTemplateStub } from "../../components/templates/templates";
import {
  RanksList,
  TemplatesList,
} from "../../components/templates/templatesList";
import { ExistingRankStub } from "../rank/ranks";
import {
  GetRanksForUserId,
  GetTemplatesForUserId,
} from "../../services/userService";
import { useAuth } from "../../components/auth/authProvider";
import { useDB } from "../../services/dbProvider";

enum MyStuffViews {
  SignIn = "SignIn",
  Waiting = "Waiting",
  Loaded = "Loaded",
}

function MyStuff() {
  const auth = useAuth();
  const [stubs, setStubs] = useState<ExistingTemplateStub[]>([]);
  const [hasRequestedTemplates, setHasRequestedTemplates] = useState(false);
  const [ranks, setRanks] = useState<ExistingRankStub[]>([]);
  const [view, setView] = useState<MyStuffViews>(MyStuffViews.SignIn);
  const db = useDB().db;

  useEffect(() => {
    if (!hasRequestedTemplates && stubs.length === 0 && auth.id) {
      // get templates
      setHasRequestedTemplates(true);
      GetTemplatesForUserId(db!, auth.id!).then((res) =>
        setStubs(res.sort((a, b) => a.name.localeCompare(b.name)))
      );

      // get ranks
      GetRanksForUserId(db!, auth.id!).then((res) =>
        setRanks(res.sort((a, b) => a.name.localeCompare(b.name)))
      );

      setView(MyStuffViews.Loaded);
    }
  }, [auth.email, auth.id, db, hasRequestedTemplates, stubs.length]);

  function renderMyStuff() {
    return (
      <>
        <div className="myStuffContainer">
          <div className="stuff-container">
            <div className="stuff-subtitle">Your Templates</div>
            <TemplatesList stubs={stubs} />
          </div>
          <div className="stuff-container">
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
