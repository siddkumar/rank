"use client"

import React, { useState, useEffect } from "react";
import "../../styles/create.css";
import "../../styles/home.css";
import CreateFromExisting from "./fromExisting";
import CreateFromScratch from "./fromScratch";
import { ExistingTemplateStub } from "../templates/templates";
import { TemplatesList, RanksList } from "../templates/templatesList";
import { GetTemplatesForUserId, GetRanksForUserId } from "../../services/userService";
import { ExistingRankStub } from "../../models/ExistingRankStub";
import { useAuth } from "../auth/authProvider";
import { useDB } from "../../services/dbProvider";
import { Icon } from "../common/Icon";

export enum HomeViews {
  HOME = "home",
  SCRATCH = "scratch",
}

function Create() {
  const [wikiLink, setWikiLink] = useState("");
  // const navigate = useNavigate();

  const [view, setView] = useState(HomeViews.HOME);
  const [scratchName, setScratchName] = useState("");
  const [textArea, setTextArea] = useState("");

  // User templates and ranks state
  const auth = useAuth();
  const db = useDB().db;
  const [userTemplates, setUserTemplates] = useState<ExistingTemplateStub[]>([]);
  const [userRanks, setUserRanks] = useState<ExistingRankStub[]>([]);

  // Collapse state for each card
  const [collapsedCards, setCollapsedCards] = useState<{[key: string]: boolean}>({
    welcome: false,
    savedTemplates: false,
    savedRanks: false,
    featuredTemplates: false,
    buildOwn: false,
    wikipedia: false,
  });

  const toggleCard = (cardKey: string) => {
    setCollapsedCards(prev => ({
      ...prev,
      [cardKey]: !prev[cardKey]
    }));
  };

  const expandCard = (cardKey: string) => {
    setCollapsedCards(prev => ({
      ...prev,
      [cardKey]: false
    }));
  };

  useEffect(() => {
    // Fetch user's templates and ranks if logged in
    if (db && auth.id) {
      GetTemplatesForUserId(db, auth.id).then((res) =>
        setUserTemplates(res.sort((a, b) => a.name.localeCompare(b.name)))
      );
      GetRanksForUserId(db, auth.id).then((res) =>
        setUserRanks(res.sort((a, b) => a.name.localeCompare(b.name)))
      );
    } else {
      setUserTemplates([]);
      setUserRanks([]);
    }
  }, [db, auth.id]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    params.set("link", wikiLink);
    // navigate("/create/fromLink?" + params.toString());
  };

  function fromScratchForm() {
    return (
      <>
        <div>
          <input
            type="text"
            value={scratchName}
            placeholder="Template Name"
            onChange={(e) => setScratchName(e.target.value)}
          />
          <textarea
            value={textArea}
            placeholder="Paste list of items, separated by line"
            onChange={(e) => setTextArea(e.target.value)}
          ></textarea>
          <button
            onClick={() => setView(HomeViews.SCRATCH)}
            className="button-styles"
          >
            Parse
          </button>
        </div>
      </>
    );
  }

  function EditorView() {
    return (
      <>
        <CreateFromScratch
          initialName={scratchName}
          initialItems={textArea.split("\n")}
        />
        <div className="backButton">
          <button
            onClick={(_e) => setView(HomeViews.HOME)}
            className="button-styles"
          >
            Back
          </button>
        </div>
      </>
    );
  }

  function HomeView() {
    return (
      <div className="home-page-layout">
        <div className="card container main-container">
          <div className="card-header">
            <div className="home-title" onClick={() => expandCard('welcome')}>Welcome!👋</div>
            <Icon
              className={`fa-solid ${collapsedCards.welcome ? 'fa-chevron-down' : 'fa-chevron-up'}`}
              onClick={() => toggleCard('welcome')}
            />
          </div>
          {!collapsedCards.welcome && (
            <div className="main-subtitle">
              Here, you can rank, well, anything.{" "}
            </div>
          )}
        </div>

        {/* Show saved templates for logged-in users */}
        {auth.id && userTemplates.length > 0 && (
          <div className="card container main-container">
            <div className="card-header">
              <div className="home-title" onClick={() => expandCard('savedTemplates')}>Use a Saved Template</div>
              <Icon
                className={`fa-solid ${collapsedCards.savedTemplates ? 'fa-chevron-down' : 'fa-chevron-up'}`}
                onClick={() => toggleCard('savedTemplates')}
              />
            </div>
            {!collapsedCards.savedTemplates && <TemplatesList stubs={userTemplates} />}
          </div>
        )}

        {/* Show saved ranks for logged-in users */}
        {auth.id && userRanks.length > 0 && (
          <div className="card container main-container">
            <div className="card-header">
              <div className="home-title" onClick={() => expandCard('savedRanks')}>Edit a Saved Ranking</div>
              <Icon
                className={`fa-solid ${collapsedCards.savedRanks ? 'fa-chevron-down' : 'fa-chevron-up'}`}
                onClick={() => toggleCard('savedRanks')}
              />
            </div>
            {!collapsedCards.savedRanks && <RanksList stubs={userRanks} />}
          </div>
        )}

        <div className="card container main-container">
          <div className="card-header">
            <div className="home-title" onClick={() => expandCard('featuredTemplates')}>Use a Featured Template</div>
            <Icon
              className={`fa-solid ${collapsedCards.featuredTemplates ? 'fa-chevron-down' : 'fa-chevron-up'}`}
              onClick={() => toggleCard('featuredTemplates')}
            />
          </div>
          {!collapsedCards.featuredTemplates && <CreateFromExisting />}
        </div>

        <div className="choices-container card container">
          <div className="card-header">
            <div className="home-title" onClick={() => expandCard('buildOwn')}>Build Your Own Template</div>
            <Icon
              className={`fa-solid ${collapsedCards.buildOwn ? 'fa-chevron-down' : 'fa-chevron-up'}`}
              onClick={() => toggleCard('buildOwn')}
            />
          </div>
          {!collapsedCards.buildOwn && fromScratchForm()}
        </div>

        <div className="choices-container card container">
          <div className="card-header">
            <div className="home-title" onClick={() => expandCard('wikipedia')}>Import a Template from Wikipedia</div>
            <Icon
              className={`fa-solid ${collapsedCards.wikipedia ? 'fa-chevron-down' : 'fa-chevron-up'}`}
              onClick={() => toggleCard('wikipedia')}
            />
          </div>
          {!collapsedCards.wikipedia && (
            <form onSubmit={handleSubmit}>
              <div className="wiki-input-container">
                <Icon className="fa-brands fa-wikipedia-w" />
                <input
                  type="text"
                  value={wikiLink}
                  placeholder="Paste the url of wikipedia page that contains a table"
                  onChange={(e) => setWikiLink(e.target.value)}
                />
              </div>
              <button className="button-styles">Submit</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {view === HomeViews.HOME && HomeView()}
      {view === HomeViews.SCRATCH && EditorView()}
    </>
  );
}

export default Create;
