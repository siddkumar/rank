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
    if (auth.id) {
      setView(MyStuffViews.Loaded);
    }
  }, [auth.email, auth.id, db]);

  function refreshTemplates() {
    GetTemplatesForUserId(db!, auth.id!).then((res) =>
      setStubs(res.sort((a, b) => a.name.localeCompare(b.name)))
    );
  }

  function refreshRanks() {
    GetRanksForUserId(db!, auth.id!).then((res) =>
      setRanks(res.sort((a, b) => a.name.localeCompare(b.name)))
    );
  }

  function renderMyStuff() {
    return (
      <>
        <div className="myStuffContainer">
          <div className="stuff-container">
            <div className="stuff-subtitle">
              Your Templates{}
              <i
                onClick={(e) => refreshTemplates()}
                className="icon-override fa-solid fa-rotate-right"
              ></i>
            </div>
            <TemplatesList stubs={stubs} />
          </div>
          <div className="stuff-container">
            <div className="stuff-subtitle">Your Ranks
            <i
                onClick={(e) => refreshRanks()}
                className="icon-override fa-solid fa-rotate-right"
              ></i>
            </div>
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
