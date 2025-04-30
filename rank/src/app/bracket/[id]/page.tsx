import BracketManager from "../../../components/brackets/bracketManager";
import { GetRankById } from "../../../lib/ranksService";

const Bracket = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const x = await GetRankById(id ?? "");

  if (!x) {
    // Handle not found, optionally return a 404 page
    return <div>List not found</div>;
  }

  if (x.bloblist.length <= 1 )
  {
    return <div>List not found</div>;
  }

  return (
    <div className="rank-page-layout">
      <BracketManager bracketItems={[...x.bloblist]}></BracketManager>
    </div>
  );
};

export default Bracket;
