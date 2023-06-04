import {
  collection,
  getFirestore,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "@firebase/firestore";
import { ExistingTemplateStub } from "../components/templates/templates";
import RankableItem from "../models/RankableItem";
import { addDoc } from "firebase/firestore";

export async function GetTemplateById(templateId: string) {
  console.log("requesting");
  const db = getFirestore();
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
  console.log("requesting");
  const db = getFirestore();
  const q = query(collection(db, "templates"), where("featured", "==", true));
  const qs = await getDocs(q);
  var stubList: ExistingTemplateStub[] = [];

  qs.forEach((doc) => {
    stubList.push({ id: doc.id, name: doc.data().name });
  });

  return stubList;
}

export async function PostNewTemplate(
  templateName: string,
  items: string[],
  userEmail: string
) {
  console.log("requesting");
  const db = getFirestore();
  const uniqueArray = Array.from(new Set(items));

  var response = await addDoc(collection(db, "templates"), {
    createdBy: userEmail,
    items: uniqueArray,
    name: templateName,
  });

  return response.id;
}
