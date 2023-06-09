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
        return { name: item, rank: i };
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
    { id: "JfqDJOqlOHGl50Cpx7bs", name: "NBA Teams" },
    { id: "Pr0cSbzqpNa7IQAOv3Rs", name: "Harry Potter Books" },
    { id: "WaLG70rtXb9HjxunAI4f", name: "States in US" },
    { id: "i3Haj4404KFsRhqIKwx6", name: "Taylor Swift Studio Albums" },
    {
      id: "qPQo68TrymdhKZMHwEs0",
      name: "Academy Award Nominees of the 2010's",
    },
    { id: "vhvJrQSalht2NWTIefng", name: "NFL Teams" },
  ];

  return stubList;
}

export async function PostNewTemplate(
  db: Firestore,
  templateName: string,
  items: string[],
  userEmail: string
) {
  console.log("requesting");
  const uniqueArray = Array.from(new Set(items));

  var response = await addDoc(collection(db, "templates"), {
    createdBy: userEmail,
    items: uniqueArray,
    name: templateName,
  });

  return response.id;
}
