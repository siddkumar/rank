import React, { useEffect, useState } from "react";
import { RankViews } from "./rank";
import "../../styles/rank.css";
import { useSearchParams } from "react-router-dom";
import BlobManager from "../../components/blobs/blobManager";
import RankableItem from "../../models/RankableItem";

interface GetRankResponse {
  ranking: string[];
  name: string;
  templateId: string;
}

function RankEdit() {
  const [view, setView] = useState(RankViews.LOADING);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [ranking, setRanking] = useState<RankableItem[]>([]);
  const [rankName, setRankName] = useState("");
  const [templateId, setTemplateId] = useState("");

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    fetch("https://rank-backend.vercel.app/ranks?id=" + id, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        var rankResponse = data as GetRankResponse;
        var bloblist: RankableItem[] = [];
        rankResponse.ranking.map((item, i) => {
          bloblist.push({
            name: item,
            rank: i,
          } as RankableItem);
        });
        setRanking(bloblist);
        setRankName(rankResponse.name);
        setTemplateId(rankResponse.templateId);
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
