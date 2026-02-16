"use client";

import { useEffect, useState } from "react";
import BracketManager from "../../../components/brackets/bracketManager";
import BracketView from "./BracketView";
import { GetBracketById } from "../../../lib/bracketsService";
import { GetTemplateById } from "../../../lib/templatesService";
import RankableItem from "../../../models/RankableItem";

const Bracket = ({ params }: { params: Promise<{ id: string }> }) => {
  const [id, setId] = useState<string>("");
  const [content, setContent] = useState<React.ReactNode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(async ({ id }) => {
      setId(id);

      // Try to fetch as an existing bracket first
      const bracket = await GetBracketById(id ?? "");

      if (bracket && bracket.bloblist.length > 1) {
        // Display existing bracket (read-only view)
        setContent(
          <div className="rank-page-layout">
            <BracketManager bracketItems={[...bracket.bloblist]}></BracketManager>
          </div>
        );
        setLoading(false);
        return;
      }

      // If not found as a bracket, try as a template (for creating new bracket)
      const template = await GetTemplateById(id ?? "");
      if (template && template.rankableList && template.rankableList.length > 1) {
        // Display template in bracket view with save functionality
        setContent(
          <BracketView
            bracketItems={[...template.rankableList]}
            bracketName={template.templateName}
            templateId={id}
          />
        );
        setLoading(false);
        return;
      }

      setContent(<div>List not found</div>);
      setLoading(false);
    });
  }, [params]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{content}</>;
};

export default Bracket;
