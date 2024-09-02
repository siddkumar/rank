import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ListRanker from "../../components/ranker/listRanker";
import BracketManager from "../../components/brackets/bracketManager";
import RankableItem from "../../models/RankableItem";
import { GetTemplateById } from "../../services/templatesService";
import "../../styles/rank.css";
import { PostNewRank } from "../../services/ranksService";
import RankTitle from "../../components/ranker/rankTitle";
import { useAuth } from "../../components/auth/authProvider";
import { useDB } from "../../services/dbProvider";

export enum RankViews {
  LOADING = "loading",
  RANKING = "ranking",
  SAVING = "saving",
  BRACKET = "bracket",
  READY = "ready",
}

function Rank() {
  const [view, setView] = useState(RankViews.LOADING);
  const [ranking, setRanking] = useState<RankableItem[]>([]);
  const [templateName, setTemplateName] = useState("");
  const [rankName, setRankName] = useState("");
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("templateId");
  const [rankId, setRankId] = useState("");
  const auth = useAuth();
  const db = useDB().db;

  useEffect(() => {
    setView(RankViews.LOADING);
    GetTemplateById(db!, templateId ?? "").then(
      ({ templateName, rankableList }) => {
        setRanking(rankableList);
        setTemplateName(templateName);
        setRankName(templateName);
        setView(RankViews.RANKING);
      }
    );
  }, [db, templateId]);

  function save(rankableList: RankableItem[]) {
    setView(RankViews.SAVING);
    setRanking(rankableList);
    if (templateId) {
      PostNewRank(
        db!,
        rankableList.map((item) => item.name),
        rankableList.map((item) => (item.imageUrl ? item.imageUrl : "")),
        templateId,
        auth.id ?? "",
        rankName
      ).then((response) => {
        setRankId(response);
        setView(RankViews.READY);
      });
    }
  }

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
        <div className="rank-title">
          <RankTitle defaultTitle={rankName} onChange={(s) => setRankName(s)} />
          <div>
            <div>Template: {templateName}</div>
            <div className="bracket-button">
              <div>Switch to Bracket: </div>
              <div
                onClick={() => {
                  setView(RankViews.BRACKET);
                }}
              >
                <i className="fa-solid fa-network-wired tooltip">
                  <div className="tooltiptext">bracketify</div>
                </i>
              </div>
            </div>
          </div>
        </div>
        <ListRanker
          rankableList={ranking}
          templateId={templateId ?? "og-template"}
          onSave={save}
        />
      </div>
    );
  }

  function savingView() {
    <div className="rank-page-layout">
      <div className="main-title"> Saving...</div>
    </div>;
  }

  function readyView() {
    return (
      <div className="create-page-layout">
        <div className="main-title">Your Ranking is Saved!</div>
        <br></br>
        <div className="button-styles w-100">Share</div>
        <a href={"/rank/edit?id=" + rankId}>
          <button className="button-styles w-100">Edit</button>
        </a>
      </div>
    );
  }

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
                <div className="tooltiptext">rank</div>
              </i>
            </div>
          </div>
        </div>
        <BracketManager bracketItems={[...ranking]} />
      </div>
    );
  }

  return (
    <>
      {view === RankViews.LOADING && loadingView()}
      {view === RankViews.RANKING && rankingView()}
      {view === RankViews.SAVING && savingView()}
      {view === RankViews.BRACKET && bracketView()}
      {view === RankViews.READY && readyView()}
    </>
  );
}

export default Rank;
