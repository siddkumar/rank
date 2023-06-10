import RankableItem from "../models/RankableItem";

import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
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
      return {
        name: item,
        rank: i,
        imageUrl: rankDoc.images?.at(i) ? rankDoc.images.at(i) : null,
      };
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
  images: string[],
  templateId: string,
  userId: string,
  rankName: string
) {
  console.log("requesting");
  await setDoc(doc(db, "ranks", rankId), {
    name: rankName,
    rankedBy: userId,
    templateId: templateId,
    ranking: ranking,
    images: images,
  });
}

export async function PostNewRank(
  db: Firestore,
  ranking: string[],
  images: string[],
  templateId: string,
  userId: string,
  rankName: string
): Promise<string> {
  console.log("requesting");
  var res = await addDoc(collection(db, "ranks"), {
    name: rankName,
    rankedBy: userId,
    templateId: templateId,
    ranking: ranking,
    images: images,
  });
  return res.id;
}

export async function DeleteRank(db: Firestore, id: string) {
  console.log("requesting");
  await deleteDoc(doc(db, "ranks", id));
}
