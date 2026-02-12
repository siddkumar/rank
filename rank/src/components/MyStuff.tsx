import React, { useEffect, useState } from "react";
import "firebaseui/dist/firebaseui.css";
import "../styles/myStuff.css";
import { ExistingTemplateStub } from "./templates/templates";
import {
  RanksList,
  TemplatesList,
} from "./templates/templatesList";
import { ExistingRankStub } from "../models/ExistingRankStub";
import {
  GetRanksForUserId,
  GetTemplatesForUserId,
} from "../services/userService";
import { useAuth } from "./auth/authProvider";
import { useDB } from "../services/dbProvider";

enum MyStuffViews {
  SignIn = "SignIn",
  Waiting = "Waiting",
  Loaded = "Loaded",
}

function MyStuff() {
  const auth = useAuth();
  const [stubs, setStubs] = useState<ExistingTemplateStub[]>([]);
  const [ranks, setRanks] = useState<ExistingRankStub[]>([]);
  const [view, setView] = useState<MyStuffViews>(MyStuffViews.Waiting);
  const db = useDB().db;

  const refreshTemplates = () => {
    if (db && auth.id) {
      GetTemplatesForUserId(db, auth.id).then((res) =>
        setStubs(res.sort((a, b) => a.name.localeCompare(b.name)))
      );
    }
  };

  const refreshRanks = () => {
    if (db && auth.id) {
      GetRanksForUserId(db, auth.id).then((res) =>
        setRanks(res.sort((a, b) => a.name.localeCompare(b.name)))
      );
    }
  };

  useEffect(() => {
    // Don't update view while auth is still loading from localStorage
    if (auth.isLoading) {
      setView(MyStuffViews.Waiting);
      return;
    }

    if (auth.id && db) {
      setView(MyStuffViews.Loaded);
      // Automatically load templates and ranks when user is authenticated
      refreshTemplates();
      refreshRanks();
    } else {
      setView(MyStuffViews.SignIn);
    }
  }, [auth.id, auth.isLoading, db]);

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
            <div className="stuff-subtitle">
              Your Ranks
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
        {view === MyStuffViews.Waiting && (
          <div className="myStuffContainer">
            <div className="main-subtitle">Loading...</div>
          </div>
        )}
        {view === MyStuffViews.SignIn && renderPleaseSignIn()}
        {view === MyStuffViews.Loaded && renderMyStuff()}
      </div>
    </>
  );
}

export default MyStuff;
