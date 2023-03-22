import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ListRanker from "../../components/ranker/listRanker";
import BracketManager from "../../components/brackets/bracketManager";
import RankableItem from "../../models/RankableItem";
import { GetTemplateById } from "../../services/templatesService";
import "../../styles/rank.css";
import { getAuth } from "firebase/auth";
import { PostNewRank } from "../../services/ranksService";

export enum RankViews {
  LOADING = "loading",
  RANKING = "ranking",
  SAVING = "saving",
  BRACKET = "bracket",
}

function Rank() {
  const [view, setView] = useState(RankViews.LOADING);
  const [ranking, setRanking] = useState<RankableItem[]>([]);
  const [templateName, setTemplateName] = useState("");
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("templateId");

  useEffect(() => {
    setView(RankViews.LOADING);
    GetTemplateById(templateId ?? "").then(({ templateName, rankableList }) => {
      setRanking(rankableList);
      setTemplateName(templateName);
      setView(RankViews.RANKING);
    });
  }, [templateId]);

  function save(rankableList: string[]) {
    setRanking(
      rankableList.map<RankableItem>((item, index) => {
        return { name: item, rank: index };
      })
    );
    const auth = getAuth();
    const user = auth.currentUser;
    if (user && templateId) {
      PostNewRank(rankableList, templateId, user.email ?? "").then((response) =>
        console.log("saved")
      );
    } else {
      console.log("error, not signed in"); // TODO surface
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
        <div className="main-title row">
          {templateName}
          <div className="bracket-button">
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
        <ListRanker
          rankableList={ranking}
          templateId={templateId ?? "og-template"}
          onSave={save}
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
    </>
  );
}

export default Rank;
