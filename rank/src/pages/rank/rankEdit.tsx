import React, { useEffect, useState } from "react";
import { RankViews } from "./rank";
import "../../styles/rank.css";
import { useSearchParams } from "react-router-dom";
import RankableItem from "../../models/RankableItem";
import { GetRankById, PostNewRank } from "../../services/ranksService";
import ListRanker from "../../components/ranker/listRanker";
import { getAuth } from "firebase/auth";

function RankEdit() {
  const [view, setView] = useState(RankViews.LOADING);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [ranking, setRanking] = useState<RankableItem[]>([]);
  const [rankName, setRankName] = useState("");
  const [templateId, setTemplateId] = useState("");

  useEffect(() => {
    setView(RankViews.LOADING);
    GetRankById(id ?? "").then(({ bloblist, templateId, rankName }) => {
      setRanking(bloblist);
      setRankName(rankName);
      setTemplateId(templateId);
      setView(RankViews.RANKING);
    });
  }, [id]);

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
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      PostNewRank(rankableList, templateId, user.email ?? "").then((response) =>
        console.log("saved")
      );
    } else {
      console.log("error, not signed in"); // TODO surface
    }
  }

  function rankingView() {
    return (
      <div className="rank-page-layout">
        <div className="main-title">{rankName}</div>
        <ListRanker
          rankableList={ranking}
          templateId={templateId ?? "og-template"}
          onSave={save}
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
