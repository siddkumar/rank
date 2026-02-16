import RankView from "../../../components/rank/RankView";
import { GetTemplateById } from "../../../lib/templatesService";

const Template = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const x = await GetTemplateById(id ?? "");

  if (!x) {
    // Handle not found, optionally return a 404 page
    return <div>List not found</div>;
  }

  return <RankView ranking={x.rankableList} rankName={x.templateName} templateId={id}></RankView>;
};

export default Template;
