import BracketManager from "../../../components/brackets/bracketManager";
import BracketView from "./BracketView";
import { GetBracketById } from "../../../lib/bracketsService";
import { GetTemplateById } from "../../../lib/templatesService";

const Bracket = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  // Try to fetch as an existing bracket first
  const bracket = await GetBracketById(id ?? "");

  if (bracket && bracket.bloblist.length > 1) {
    // Display existing bracket (read-only view)
    return (
      <div className="rank-page-layout">
        <BracketManager bracketItems={[...bracket.bloblist]}></BracketManager>
      </div>
    );
  }

  // If not found as a bracket, try as a template (for creating new bracket)
  const template = await GetTemplateById(id ?? "");
  if (template && template.rankableList && template.rankableList.length > 1) {
    // Display template in bracket view with save functionality
    return (
      <BracketView
        bracketItems={[...template.rankableList]}
        bracketName={template.templateName}
        templateId={id}
      />
    );
  }

  return <div>List not found</div>;
};

export default Bracket;
