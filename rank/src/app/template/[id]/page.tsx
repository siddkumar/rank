"use client";

import { useEffect, useState } from "react";
import RankView from "../../../components/rank/RankView";
import { GetTemplateById } from "../../../lib/templatesService";
import RankableItem from "../../../models/RankableItem";

const Template = ({ params }: { params: Promise<{ id: string }> }) => {
  const [id, setId] = useState<string>("");
  const [rankableList, setRankableList] = useState<RankableItem[]>([]);
  const [templateName, setTemplateName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ id }) => {
      setId(id);
      GetTemplateById(id ?? "").then((x) => {
        setRankableList(x.rankableList);
        setTemplateName(x.templateName);
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

  return <RankView ranking={rankableList} rankName={templateName} templateId={id}></RankView>;
};

export default Template;
