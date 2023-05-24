import RankableItem from "../models/RankableItem";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
} from "firebase/firestore";
import { GetUserIdForEmail } from "./userService";

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

export async function UpdateRank(
  rankId: string,
  ranking: string[],
  templateId: string,
  userEmail: string,
  rankName: string
) {}

export async function PostNewRank(
  ranking: string[],
  templateId: string,
  userEmail: string,
  rankName: string
): Promise<string> {
  const db = getFirestore();
  var userId = await GetUserIdForEmail(userEmail);
  var res = await addDoc(collection(db, "ranks"), {
    name: rankName,
    rankedBy: userId,
    templateId: templateId,
    ranking: ranking,
  });
  return res.id;
}
