import React, { useEffect, useState } from "react";
import { RankViews } from "./rank";
import "../../styles/rank.css";
import { useSearchParams } from "react-router-dom";
import BlobManager from "../../components/blobs/blobManager";
import RankableItem from "../../models/RankableItem";
import { GetRankById } from "../../services/ranksService";

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
  }, []);

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
        <div className="main-title">{rankName}</div>
        <BlobManager blobs={ranking} templateId={templateId ?? "og-template"} />
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
