import React, { useEffect, useState } from "react";
import { RankViews } from "./rank";
import "../../styles/rank.css";
import RankableItem from "../../models/RankableItem";
import { GetRankById, PostNewRank, UpdateRank } from "../../lib/ranksService";
import ListRanker from "../../components/ranker/listRanker";
import RankTitle from "../../components/ranker/rankTitle";
import { useAuth } from "../../components/auth/authProvider";
import { useDB } from "../../services/dbProvider";
import { Icon } from "../../components/common/Icon";

interface RankEditProps {
  id: string;
}

function RankEdit({ id }: RankEditProps) {
  const [view, setView] = useState(RankViews.LOADING);
  const [ranking, setRanking] = useState<RankableItem[]>([]);
  const [rankName, setRankName] = useState("");
  const [templateId, setTemplateId] = useState("");
  const auth = useAuth();
  const db = useDB().db;

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

  function save(rankableList: RankableItem[]) {
    if (auth.id) {
      if (id) {
        UpdateRank(
          db!,
          id,
          rankableList.map((item) => item.name),
          rankableList.map((item) => (item.imageUrl ? item.imageUrl : "")),
          templateId,
          auth.id ?? "",
          rankName
        );
      } else {
        console.log("error, ranking DNE, save as first");
      }
    } else {
      console.log("error, not signed in"); // TODO surface
    }
  }

  function saveAs(rankableList: RankableItem[]) {
    if (auth.id) {
      PostNewRank(
        db!,
        rankableList.map((item) => item.name),
        rankableList.map((item) => (item.imageUrl ? item.imageUrl : "")),
        templateId,
        auth.id ?? "",
        rankName
      ).then((response) => console.log("saved"));
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
            <a href={"/template/" + templateId}>
              Template
              <Icon className="icon-override fa-regular fa-share-from-square" />
            </a>
          </div>
        </div>
        <ListRanker
          rankableList={ranking}
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
