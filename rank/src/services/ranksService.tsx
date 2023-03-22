import { doc, getDoc, getFirestore } from "@firebase/firestore";
import RankableItem from "../models/RankableItem";
import { getPrefix } from "./servicesConfig";

const prefix = getPrefix();

export async function GetRankById(id: string) {
  console.log("requesting");
  const db = getFirestore();
  const docRef = doc(db, "ranks", id);
  const docSnap = await getDoc(docRef);
  var bloblist: RankableItem[] = [];
  var templateId = "";
  var rankName = "";

  if (docSnap.exists()) {
    var rankDoc = docSnap.data();
    bloblist = (rankDoc.ranking as string[]).map<RankableItem>((item, i) => {
      return { name: item, rank: i };
    });
    templateId = rankDoc.templateId as string;
    rankName = rankDoc.name as string;
  } else {
    console.log("uh oh");
  }
  return { bloblist, templateId, rankName };
}

export async function PostNewRankFast(
  ranking: string[],
  templateId: string,
  userEmail: string
) {
  // todo
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
