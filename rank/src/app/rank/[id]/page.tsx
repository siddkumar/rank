import { GetRankById } from "../../../lib/ranksService";
import RankView from "../../../components/rank/RankView";

const Rank = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const x = await GetRankById(id ?? "");

  if (!x) {
    // Handle not found, optionally return a 404 page
    return <div>List not found</div>;
  }

  return <RankView ranking={x.bloblist} rankName={x.rankName}></RankView>;
};

export default Rank;
