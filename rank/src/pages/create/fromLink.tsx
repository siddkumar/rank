import React, { useState } from "react";
import { TemplateEditor } from "../../components/templateEditor";
import "../../styles/create.css";

export enum FromLinkViews {
  ENTER = "enter",
}

export function CreateFromLink() {
  const [view, setView] = useState(FromLinkViews.ENTER);
  const [wikiLink, setWikiLink] = useState("");

  const onChangeWikiLink = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setWikiLink(event.target.value);
  };

  function enterLinkView() {
    return (
      <>
        <div className="main-title">Enter a link from Wikipedia</div>
        <label className="main-subtitle">paste URL here:&nbsp;</label>
        <input type="text" value={wikiLink} onChange={onChangeWikiLink} />
        <button className="button-styles">find tables</button>
      </>
    );
  }

  return (
    <div className="rank-page-layout">
      {view === FromLinkViews.ENTER && enterLinkView()}
    </div>
  );
}
