import { ExistingTemplateStub } from "../components/templates/templates";
import { ExistingRankStub } from "../pages/rank/ranks";
import {
  Firestore,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export async function GetTemplatesForUserId(db: Firestore, userId: string) {
  console.log("requesting");
  const q = query(
    collection(db, "templates"),
    where("createdBy", "==", userId)
  );
  const qs = await getDocs(q);

  var stubList = [] as ExistingTemplateStub[];
  qs.forEach((doc) => {
    var template = doc.data();
    stubList.push({
      id: doc.id,
      name: template.name,
      images: template?.images ?? [],
    });
  });
  return stubList;
}

export async function GetRanksForUserId(db: Firestore, userId: string) {
  console.log("requesting");
  const q = query(collection(db, "ranks"), where("rankedBy", "==", userId));
  const qs = await getDocs(q);

  var stubList = [] as ExistingRankStub[];
  qs.forEach((doc) => {
    var rank = doc.data();
    stubList.push({ id: doc.id, name: rank.name, images: rank?.images ?? [] });
  });
  return stubList;
}

export async function GetUserIdForEmail(db: Firestore, email: string) {
  console.log("requesting");
  const q = query(collection(db, "users"), where("emailAddress", "==", email));
  const qs = await getDocs(q);
  if (qs.size > 0) {
    return qs.docs.at(0)!.id;
  } else {
    return "DNE";
  }
}

export async function CreateUser(
  db: Firestore,
  email: string
): Promise<string> {
  console.log("requesting");
  const q = query(collection(db, "users"), where("emailAddress", "==", email));
  const qs = await getDocs(q);

  if (qs.size > 0) {
    console.log("User already exists");
    return "User already exists";
  }

  var res = await addDoc(collection(db, "users"), {
    emailAddress: email,
  });

  return res.id;
}
