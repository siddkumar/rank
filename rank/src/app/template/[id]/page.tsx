import RankView from "../../../pages/rank/rank";
import { GetTemplateById } from "../../../lib/templatesService";

const Template = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const x = await GetTemplateById(id ?? "");

  if (!x) {
    // Handle not found, optionally return a 404 page
    return <div>List not found</div>;
  }

  return <RankView ranking={x.rankableList} rankName={x.templateName}></RankView>;
};

export default Template;
