import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ListRanker from "../../components/ranker/listRanker";
import BracketManager from "../../components/brackets/bracketManager";
import RankableItem from "../../models/RankableItem";
import { GetTemplateById } from "../../services/templatesService";
import "../../styles/rank.css";
import { getAuth } from "firebase/auth";
import { PostNewRank } from "../../services/ranksService";
import RankTitle from "../../components/ranker/rankTitle";

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

  useEffect(() => {
    setView(RankViews.LOADING);
    GetTemplateById(templateId ?? "").then(({ templateName, rankableList }) => {
      setRanking(rankableList);
      setTemplateName(templateName);
      setRankName(templateName);
      setView(RankViews.RANKING);
    });
  }, [templateId]);

  function save(rankableList: string[]) {
    setView(RankViews.SAVING);
    setRanking(
      rankableList.map<RankableItem>((item, index) => {
        return { name: item, rank: index };
      })
    );
    const auth = getAuth();
    const user = auth.currentUser;
    if (user && templateId) {
      PostNewRank(rankableList, templateId, user.email ?? "", rankName).then(
        (response) => {
          setRankId(response);
          setView(RankViews.READY);
        }
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
