"use client";

import React, { useState } from "react";

export interface RankTitleProps {
  defaultTitle: string;
  onChange: (s: string) => void;
}

export default function RankTitle(props: RankTitleProps) {
  const [editView, setEditView] = useState<boolean>(false);

  function editorView() {
    return (
      <div className="row">
        Ranking Name:
        <input
          type="text"
          value={props.defaultTitle}
          onChange={(e) => props.onChange(e.target.value)}
        ></input>
        <i
          onClick={(e) => setEditView(false)}
          aria-hidden
          className="icon-override fa-regular fa-floppy-disk"
        ></i>
      </div>
    );
  }

  function displayView() {
    return (
      <h2 className="row">
        {props.defaultTitle}
        <i
          onClick={(e) => setEditView(true)}
          aria-hidden
          className="icon-override fa-regular fa-pen-to-square"
        ></i>
      </h2>
    );
  }

  return <div>{editView ? editorView() : displayView()}</div>;
}
