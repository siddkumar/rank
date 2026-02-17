"use client";

import React, { useEffect, useState } from "react";
import "../../../../styles/rank.css";
import RankableItem from "../../../../models/RankableItem";
import { GetBracketById, PostNewBracket, UpdateBracket } from "../../../../lib/bracketsService";
import BracketManager from "../../../../components/brackets/bracketManager";
import RankTitle from "../../../../components/ranker/rankTitle";
import { useAuth } from "../../../../components/auth/authProvider";
import { useDB } from "../../../../services/dbProvider";
import { Icon } from "../../../../components/common/Icon";

export enum BracketViews {
  LOADING = "loading",
  BRACKET = "bracket",
  SAVING = "saving",
}

interface BracketEditProps {
  id: string;
}

function BracketEdit({ id }: BracketEditProps) {
  const [view, setView] = useState(BracketViews.LOADING);
  const [bracketItems, setBracketItems] = useState<RankableItem[]>([]);
  const [bracketName, setBracketName] = useState("");
  const [templateId, setTemplateId] = useState("");
  const auth = useAuth();
  const db = useDB().db;

  useEffect(() => {
    setView(BracketViews.LOADING);
    GetBracketById(id ?? "").then(({ bloblist, templateId, bracketName }) => {
      setBracketItems(bloblist);
      setBracketName(bracketName);
      setTemplateId(templateId);
      setView(BracketViews.BRACKET);
    });
  }, [id]);

  function loadingView() {
    return (
      <div className="rank-page-layout">
        <div className="main-title">Loading ...</div>
      </div>
    );
  }

  function save(updatedBracketItems: RankableItem[]) {
    if (auth.id) {
      if (id) {
        UpdateBracket(
          db!,
          id,
          updatedBracketItems.map((item) => item.name),
          updatedBracketItems.map((item) => (item.imageUrl ? item.imageUrl : "")),
          templateId,
          auth.id ?? "",
          bracketName
        );
        alert("Bracket updated successfully!");
      } else {
        console.log("error, bracket DNE, save as first");
      }
    } else {
      console.log("error, not signed in");
    }
  }

  function saveAs(updatedBracketItems: RankableItem[]) {
    if (auth.id) {
      PostNewBracket(
        db!,
        updatedBracketItems.map((item) => item.name),
        updatedBracketItems.map((item) => (item.imageUrl ? item.imageUrl : "")),
        templateId,
        auth.id ?? "",
        bracketName
      ).then((response) => {
        console.log("saved as new bracket");
        alert("Bracket saved as new!");
      });
    } else {
      console.log("error, not signed in");
    }
  }

  function onBracketNameChange(s: string) {
    setBracketName(s);
  }

  function bracketView() {
    return (
      <div className="rank-page-layout">
        <div className="rank-title">
          <RankTitle defaultTitle={bracketName} onChange={onBracketNameChange} />
          <div>
            <a href={"/bracket/" + id}>
              View Bracket
            </a>
          </div>
          <div>
            <a href={"/template/" + templateId}>
              Template
              <Icon className="icon-override fa-regular fa-share-from-square" />
            </a>
          </div>
        </div>
        <BracketManager
          bracketItems={bracketItems}
          onSave={save}
        />
      </div>
    );
  }

  function savingView() {}

  return (
    <>
      {view === BracketViews.LOADING && loadingView()}
      {view === BracketViews.BRACKET && bracketView()}
      {view === BracketViews.SAVING && savingView()}
    </>
  );
}

export default BracketEdit;
