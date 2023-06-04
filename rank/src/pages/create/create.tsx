import React, { useState } from "react";
import "../../styles/create.css";
import "../../styles/home.css";
import CreateFromExisting from "./fromExisting";
import { useNavigate } from "react-router-dom";
import CreateFromScratch from "./fromScratch";

export enum HomeViews {
  HOME = "home",
  SCRATCH = "scratch",
}

function Create() {
  const [wikiLink, setWikiLink] = useState("");
  const navigate = useNavigate();
  const [view, setView] = useState(HomeViews.HOME);
  const [scratchName, setScratchName] = useState("");
  const [textArea, setTextArea] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate("/create/fromLink?link=" + wikiLink);
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
            onClick={(_e) => setView(HomeViews.SCRATCH)}
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
          <div className="home-title">Welcome!👋</div>
          <div className="main-subtitle">
            Here, you can rank, well, anything.{" "}
          </div>
          <div className="main-subtitle">
            To start, you'll need a template..
          </div>
          <CreateFromExisting />
        </div>
        <div className="choices-container card container">
          <div className="home-title">
            Build your Own Template
            <i className="no-pointer fa-solid fa-file-circle-plus"></i>
          </div>
          {fromScratchForm()}
          <div className="main-subtitle">
            <i className="no-pointer no-left fa-brands fa-wikipedia-w"></i>{" "}
            Import List from Wikipedia
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={wikiLink}
              placeholder="Paste url of wikipedia page that contains a table"
              onChange={(e) => setWikiLink(e.target.value)}
            />
            <button className="button-styles">Submit</button>
          </form>
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
