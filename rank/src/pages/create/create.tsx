import React, { useState } from "react";
import "../../styles/create.css";
import CreateFromExisting from "./fromExisting";
import { useNavigate } from "react-router-dom";

function Create() {
  const [wikiLink, setWikiLink] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate("/create/fromLink?link=" + wikiLink);
  };

  return (
    <div className="home-page-layout">
      <div className="card container main-container">
        <div className="home-title">Welcome to "rank anything"!👋</div>
        <div className="main-subtitle">
          Here, you can rank, well, anything.{" "}
        </div>
        <div className="main-subtitle">To start, you'll need a template..</div>
        <CreateFromExisting />
      </div>
      <div className="choices-container card container">
        <div className="home-title">
          Build your Own Template
          <i className="no-pointer fa-solid fa-file-circle-plus"></i>
        </div>
        <a href="/create/fromScratch">
          <button className="button-styles">Create From Scratch</button>
        </a>
        <div className="main-subtitle">
          <i className="no-pointer no-left fa-brands fa-wikipedia-w"></i> Create
          from a wikipedia article
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={wikiLink}
            placeholder="Paste link here"
            onChange={(e) => setWikiLink(e.target.value)}
          />
          <button className="button-styles">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Create;
