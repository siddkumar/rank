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
import { db } from "./firebaseConfig";

export async function GetBracketById(id: string) {
  console.log("requesting bracket");
  const docRef = doc(db!, "brackets", id);
  const docSnap = await getDoc(docRef);
  var bloblist: RankableItem[] = [];
  var templateId = "";
  var bracketName = "";

  if (docSnap.exists()) {
    var bracketDoc = docSnap.data();
    bloblist = (bracketDoc.ranking as string[]).map<RankableItem>((item, i) => {
      return {
        name: item,
        rank: i,
        imageUrl: bracketDoc.images?.at(i) ? bracketDoc.images.at(i) : null,
      };
    });
    templateId = bracketDoc.templateId as string;
    bracketName = bracketDoc.name as string;
  } else {
    console.log("bracket not found");
  }
  return { bloblist, templateId, bracketName };
}

export async function UpdateBracket(
  db: Firestore,
  bracketId: string,
  ranking: string[],
  images: string[],
  templateId: string,
  userId: string,
  bracketName: string
) {
  console.log("updating bracket");
  await setDoc(doc(db, "brackets", bracketId), {
    name: bracketName,
    rankedBy: userId,
    templateId: templateId,
    ranking: ranking,
    images: images,
  });
}

export async function PostNewBracket(
  db: Firestore,
  ranking: string[],
  images: string[],
  templateId: string,
  userId: string,
  bracketName: string
): Promise<string> {
  console.log("creating new bracket");
  var res = await addDoc(collection(db, "brackets"), {
    name: bracketName,
    rankedBy: userId,
    templateId: templateId,
    ranking: ranking,
    images: images,
  });
  return res.id;
}

export async function DeleteBracket(db: Firestore, id: string) {
  console.log("deleting bracket");
  await deleteDoc(doc(db, "brackets", id));
}
