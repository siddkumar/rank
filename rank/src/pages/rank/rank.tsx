import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BlobManager from "../../components/blobs/blobManager";
import RankableItem from "../../models/RankableItem";
import { GetTemplateById } from "../../services/templatesService";
import "../../styles/rank.css";

export enum RankViews {
  LOADING = "loading",
  RANKING = "ranking",
  SAVING = "saving",
}

function Rank() {
  const [view, setView] = useState(RankViews.LOADING);
  const [blobs, setBlobs] = useState<RankableItem[]>([]);
  const [templateName, setTemplateName] = useState("");
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("templateId");

  useEffect(() => {
    setView(RankViews.LOADING);
    GetTemplateById(templateId ?? "").then(({ templateName, bloblist }) => {
      setBlobs(bloblist);
      setTemplateName(templateName);
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
