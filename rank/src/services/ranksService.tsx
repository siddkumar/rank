import RankableItem from "../models/RankableItem";
import { getPrefix } from "./servicesConfig";

const prefix = getPrefix();

interface GetRankResponse {
  ranking: string[];
  name: string;
  templateId: string;
}

export async function GetRankById(id: string) {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  var bloblist: RankableItem[] = [];
  var templateId = "";
  var rankName = "";

  await fetch(prefix + "/ranks?id=" + id, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      var rankResponse = data as GetRankResponse;
      rankResponse.ranking.map((item, i) => {
        bloblist.push({
          name: item,
          rank: i,
        } as RankableItem);
      });
      rankName = rankResponse.name;
      templateId = rankResponse.templateId;
    });

  return { bloblist, templateId, rankName };
}

export async function PostNewRank(
  ranking: string[],
  templateId: string,
  userEmail: string
) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      emailAddress: userEmail,
      ranking: ranking,
      templateId: templateId,
    }),
  };
  await fetch(prefix + "/ranks/create", requestOptions);

  return;
}
