"use client";

import React, { useState } from "react";
import ListRanker from "../../components/ranker/listRanker";
import RankableItem from "../../models/RankableItem";
import "../../styles/rank.css";
import RankTitle from "../../components/ranker/rankTitle";
import { PostNewRank } from "../../lib/ranksService";
import { useAuth } from "../../components/auth/authProvider";
import { useDB } from "../../services/dbProvider";
import { useRouter } from "next/navigation";

export enum RankViews {
  LOADING = "loading",
  RANKING = "ranking",
  SAVING = "saving",
}

export interface RankViewProps {
  ranking: RankableItem[];
  rankName: string;
  templateId?: string;
}

function RankView(props: RankViewProps) {
  const [ranking, setRanking] = useState<RankableItem[]>(props.ranking);
  const [rankName, setRankName] = useState(props.rankName);
  const auth = useAuth();
  const db = useDB().db;
  const router = useRouter();

  async function save(rankableList: RankableItem[]) {
    if (!auth.id) {
      alert("Please sign in to save your ranking");
      return;
    }

    if (!db) {
      alert("Database not available");
      return;
    }

    try {
      const rankId = await PostNewRank(
        db,
        rankableList.map((item) => item.name),
        rankableList.map((item) => item.imageUrl ?? ""),
        props.templateId ?? "",
        auth.id,
        rankName
      );
      alert("Ranking saved successfully!");
      router.push("/rank/edit?id=" + rankId);
    } catch (error) {
      console.error("Error saving ranking:", error);
      alert("Failed to save ranking. Please try again.");
    }
  }

  return (
    <div className="rank-page-layout">
      <div className="rank-title">
        <RankTitle defaultTitle={rankName} onChange={(s) => setRankName(s)} />
      </div>
      <ListRanker rankableList={ranking} onSave={save} />
    </div>
  );
}

export default RankView;
