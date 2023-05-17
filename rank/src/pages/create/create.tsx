import React from "react";
import "../../styles/create.css";

function Create() {
  return (
    <div className="home-page-layout">
      <div className="card container main-container">
        <div className="home-title">Welcome to "rank anything"!</div>
        <div className="main-subtitle">
          Here, you can rank, well, anything.{" "}
        </div>
        <div className="main-subtitle">To start, you'll need a template..</div>
      </div>
      <div className="choices-container">
        <div className="card container">
          <div className="main-subtitle">
            New Template
            <i className="no-pointer fa-solid fa-file-circle-plus"></i>
          </div>
          <a href="/create/fromScratch">
            <button className="button-styles">create from scratch</button>
          </a>
          <a href="/create/fromLink">
            <button className="button-styles">
              create from a wikipedia article
            </button>
          </a>
        </div>
        <div className="card container">
          <div className="main-subtitle">
            Existing Templates
            <i className="no-pointer fa-solid fa-file-pen"></i>
          </div>
          <a href="/create/fromExisting">
            <button className="button-styles">browse featured templates</button>
          </a>
          <a href="/mystuff">
            <button className="button-styles">see saved templates</button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Create;
