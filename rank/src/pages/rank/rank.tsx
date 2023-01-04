import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ListRanker from "../../components/ranker/listRanker";
import BracketManager from "../../components/brackets/bracketManager";
import RankableItem from "../../models/RankableItem";
import { GetTemplateById } from "../../services/templatesService";
import "../../styles/rank.css";

export enum RankViews {
  LOADING = "loading",
  RANKING = "ranking",
  SAVING = "saving",
  BRACKET = "bracket",
}

function Rank() {
  const [view, setView] = useState(RankViews.LOADING);
  const [blobs, setBlobs] = useState<RankableItem[]>([]);
  const [templateName, setTemplateName] = useState("");
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("templateId");

  useEffect(() => {
    setView(RankViews.LOADING);
    GetTemplateById(templateId ?? "").then(({ templateName, rankableList }) => {
      setBlobs(rankableList);
      setTemplateName(templateName);
      setView(RankViews.RANKING);
    });
  }, [templateId]);

  function loadingView() {
    return (
      <div className="rank-page-layout">
        <div className="main-title">Loading ...</div>
      </div>
    );
  }

  function rankingView() {
    return (
      <div className="rank-page-layout">
        <div className="main-title row">
          {templateName}
          <div className="bracket-button">
            <div
              onClick={() => {
                setView(RankViews.BRACKET);
              }}
            >
              <i className="fa-solid fa-network-wired tooltip">
                <span className="tooltiptext">bracketify</span>
              </i>
            </div>
          </div>
        </div>
        <ListRanker
          rankableList={blobs}
          templateId={templateId ?? "og-template"}
        />
      </div>
    );
  }

  function savingView() {}

  function bracketView() {
    return (
      <div className="rank-page-layout">
        <div className="main-title row">
          {templateName}
          <div className="bracket-button">
            <div
              onClick={() => {
                setView(RankViews.RANKING);
              }}
            >
              <i className="fa-solid fa-list tooltip">
                <span className="tooltiptext">rank</span>
              </i>
            </div>
          </div>
        </div>
        <BracketManager blobs={[...blobs]} />
      </div>
    );
  }

  return (
    <>
      {view === RankViews.LOADING && loadingView()}
      {view === RankViews.RANKING && rankingView()}
      {view === RankViews.SAVING && savingView()}
      {view === RankViews.BRACKET && bracketView()}
    </>
  );
}

export default Rank;
