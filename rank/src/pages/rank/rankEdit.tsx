import React, { useEffect, useState } from "react";
import { RankViews } from "./rank";
import "../../styles/rank.css";
import { useSearchParams } from "react-router-dom";
import RankableItem from "../../models/RankableItem";
import {
  GetRankById,
  PostNewRank,
  UpdateRank,
} from "../../services/ranksService";
import ListRanker from "../../components/ranker/listRanker";
import RankTitle from "../../components/ranker/rankTitle";
import { useAuth } from "../../components/auth/authProvider";
import { useDB } from "../../services/dbProvider";

function RankEdit() {
  const [view, setView] = useState(RankViews.LOADING);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [ranking, setRanking] = useState<RankableItem[]>([]);
  const [rankName, setRankName] = useState("");
  const [templateId, setTemplateId] = useState("");
  const auth = useAuth();
  const db = useDB().db;

  useEffect(() => {
    setView(RankViews.LOADING);
    GetRankById(db!, id ?? "").then(({ bloblist, templateId, rankName }) => {
      setRanking(bloblist);
      setRankName(rankName);
      setTemplateId(templateId);
      setView(RankViews.RANKING);
    });
  }, [db, id]);

  function loadingView() {
    return (
      <div className="rank-page-layout">
        <div className="main-title">Loading ...</div>
      </div>
    );
  }

  function save(rankableList: string[]) {
    setRanking(
      rankableList.map<RankableItem>((item, index) => {
        return { name: item, rank: index + 1 };
      })
    );

    if (auth.id) {
      if (id) {
        UpdateRank(db!, id, rankableList, templateId, auth.id ?? "", rankName);
      } else {
        console.log("error, ranking DNE, save as first");
      }
    } else {
      console.log("error, not signed in"); // TODO surface
    }
  }

  function saveAs(rankableList: string[]) {
    setRanking(
      rankableList.map<RankableItem>((item, index) => {
        return { name: item, rank: index + 1 };
      })
    );
    if (auth.id) {
      PostNewRank(db!, rankableList, templateId, auth.id ?? "", rankName).then(
        (response) => console.log("saved")
      );
    } else {
      console.log("error, not signed in"); // TODO surface
    }
  }

  function onRankNameChange(s: string) {
    setRankName(s);
  }

  function rankingView() {
    return (
      <div className="rank-page-layout">
        <div className="rank-title">
          <RankTitle defaultTitle={rankName} onChange={onRankNameChange} />
          <div>
            <a href={"/rank?templateId=" + templateId}>
              Template
              <i className="icon-override fa-regular fa-share-from-square"></i>
            </a>
          </div>
        </div>
        <ListRanker
          rankableList={ranking}
          templateId={templateId ?? "og-template"}
          onSave={save}
          onSaveAs={saveAs}
        />
      </div>
    );
  }

  function savingView() {}

  return (
    <>
      {view === RankViews.LOADING && loadingView()}
      {view === RankViews.RANKING && rankingView()}
      {view === RankViews.SAVING && savingView()}
    </>
  );
}

export default RankEdit;
