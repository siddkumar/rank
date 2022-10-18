import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BlobManager from "../../components/blobs/blobManager";
import RankableItem from "../../models/RankableItem";
import "../../styles/rank.css";

export enum RankViews {
  LOADING = "loading",
  RANKING = "ranking",
  SAVING = "saving",
}

interface GetTemplateResponse {
  success: boolean;
  createdBy: string;
  items: string[];
  name: string;
  origin: string;
  sourceUrl: string;
}

function Rank() {
  const [view, setView] = useState(RankViews.LOADING);
  const [blobs, setBlobs] = useState<RankableItem[]>([]);
  const [templateName, setTemplateName] = useState("");
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("templateId");

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    fetch("https://rank-backend.vercel.app/templates?id=" + templateId, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        var templateResponse = data as GetTemplateResponse;
        var bloblist: RankableItem[] = [];
        templateResponse.items.map((item, i) => {
          bloblist.push({
            name: item,
            rank: i,
          } as RankableItem);
        });
        setBlobs(bloblist);
        setTemplateName(templateResponse.name);
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
        <div className="main-title">{templateName}</div>
        <BlobManager blobs={blobs} templateId={templateId ?? "og-template"} />
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

export default Rank;
