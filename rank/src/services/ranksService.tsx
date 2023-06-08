import RankableItem from "../models/RankableItem";

import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

export async function GetRankById(db: Firestore, id: string) {
  console.log("requesting");
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
  db: Firestore,
  rankId: string,
  ranking: string[],
  templateId: string,
  userId: string,
  rankName: string
) {
  await setDoc(doc(db, "ranks", rankId), {
    name: rankName,
    rankedBy: userId,
    templateId: templateId,
    ranking: ranking,
  });
}

export async function PostNewRank(
  db: Firestore,
  ranking: string[],
  templateId: string,
  userId: string,
  rankName: string
): Promise<string> {
  var res = await addDoc(collection(db, "ranks"), {
    name: rankName,
    rankedBy: userId,
    templateId: templateId,
    ranking: ranking,
  });
  return res.id;
}
