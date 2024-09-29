"use client";

import React, { useState } from "react";
import ListRanker from "../../components/ranker/listRanker";
import RankableItem from "../../models/RankableItem";
import "../../styles/rank.css";
import RankTitle from "../../components/ranker/rankTitle";

export interface RankViewProps {
  ranking: RankableItem[];
  rankName: string;
}

function RankView(props: RankViewProps) {
  const [ranking, setRanking] = useState<RankableItem[]>(props.ranking);
  const [rankName, setRankName] = useState(props.rankName);

  return (
    <div className="rank-page-layout">
      <div className="rank-title">
        <RankTitle defaultTitle={rankName} onChange={(s) => setRankName(s)} />
      </div>
      <ListRanker rankableList={ranking} onSave={() => setRanking(ranking)} />
    </div>
  );
}

export default RankView;
