import { Firestore, collection, doc, getDoc } from "@firebase/firestore";
import RankableItem from "../models/RankableItem";
import { addDoc } from "firebase/firestore";

export async function GetTemplateById(db: Firestore, templateId: string) {
  console.log("requesting");
  const docRef = doc(db, "templates", templateId);
  var rankableList: RankableItem[] = [];
  var templateName: string = "";

  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    var templateDoc = docSnap.data();
    rankableList = (templateDoc.items as string[]).map<RankableItem>(
      (item, i) => {
        return {
          name: item,
          rank: i,
          imageUrl: templateDoc?.images ? templateDoc.images[i] : null,
        };
      }
    );
    templateName = templateDoc.name;
  } else {
    console.log("uh oh");
  }
  return { templateName, rankableList };
}

export async function GetTemplatesList() {
  const stubList: { id: string; name: string }[] = [
    { id: "pesDeP9wt6ARYCtlz7u8", name: "Movie Musicals" },
    { id: "euqt0Z2MFaXX4yC526aT", name: "Harry Potter Books" },
    { id: "WaLG70rtXb9HjxunAI4f", name: "States in US" },
    { id: "Qtxrj5ioTxLjv32uBN5o", name: "Taylor Swift Albums" },
    {
      id: "qPQo68TrymdhKZMHwEs0",
      name: "Academy Award Nominees of the 2010's",
    },
    { id: "PAV866AtMDBYOtmktbpp", name: "Men's Tenins Players (All Time)" },
  ];

  return stubList;
}

export async function PostNewTemplate(
  db: Firestore,
  templateName: string,
  items: string[],
  userEmail: string,
  images?: string[]
) {
  console.log("requesting");
  const uniqueArray = Array.from(new Set(items));

  var response = await addDoc(collection(db, "templates"), {
    createdBy: userEmail,
    items: uniqueArray,
    name: templateName,
    images: images ?? [],
  });

  return response.id;
}
