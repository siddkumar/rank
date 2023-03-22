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
import { getPrefix } from "./servicesConfig";

const prefix = getPrefix();

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

interface CreateFromScratchPostResponse {
  success: boolean;
  templateId: string;
}

export async function PostNewTemplate(
  templateName: string,
  items: string[],
  userEmail?: string
) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: templateName,
      items: items,
      email: userEmail,
    }),
  };

  var templateId = "";

  await fetch(prefix + "/templates/createFromScratch", requestOptions)
    .then((response) => response.json())
    .then((data) => {
      templateId = (data[0] as CreateFromScratchPostResponse).templateId;
    });

  return templateId;
}
