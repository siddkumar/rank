import React from "react";
import "../../styles/create.css";

function Create() {
  return (
    <div className="create-page-layout">
      <div className="main-title">Let's start ranking!</div>
      <div className="main-subtitle">
        To start, you'll need a template to rank from
      </div>
      <div className="choices-container">
        <ul>
          <div>
            <li> I want to create a new template! </li>
            <a href="/create/fromScratch">
              <button className="button-styles">create from scratch</button>
            </a>
            <a href="/create/fromLink">
              <button className="button-styles">
                create from a wikipedia article
              </button>
            </a>
          </div>
          <div>
            <li>I want to use an existing template!</li>
            <a href="/create/fromExisting">
              <button className="button-styles">
                browse featured templates
              </button>
            </a>
            <a href="/mystuff">
              <button className="button-styles">see saved templates</button>
            </a>
          </div>
        </ul>
      </div>
    </div>
  );
}

export default Create;
