"use client";

import { useEffect, useState } from "react";
import { GetRankById } from "../../../lib/ranksService";
import RankView from "../../../components/rank/RankView";
import RankableItem from "../../../models/RankableItem";

const Rank = ({ params }: { params: Promise<{ id: string }> }) => {
  const [id, setId] = useState<string>("");
  const [rankableList, setRankableList] = useState<RankableItem[]>([]);
  const [rankName, setRankName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ id }) => {
      setId(id);
      GetRankById(id ?? "").then((x) => {
        setRankableList(x.bloblist);
        setRankName(x.rankName);
        setLoading(false);
      });
    });
  }, [params]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!rankableList.length) {
    return <div>List not found</div>;
  }

  return <RankView ranking={rankableList} rankName={rankName}></RankView>;
};

export default Rank;
