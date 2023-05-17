import { ExistingTemplateStub } from "../components/templates/templates";
import { ExistingRankStub } from "../pages/rank/ranks";

import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

export async function GetTemplatesForUser(
  email: string
): Promise<ExistingTemplateStub[]> {
  var userId = await GetUserIdForEmail(email);
  return await GetTemplatesForUserId(userId);
}

export async function GetTemplatesForUserId(userId: string) {
  console.log("requesting");
  const db = getFirestore();
  const q = query(
    collection(db, "templates"),
    where("createdBy", "==", userId)
  );
  const qs = await getDocs(q);

  var stubList = [] as ExistingTemplateStub[];
  qs.forEach((doc) => {
    var template = doc.data();
    stubList.push({ id: doc.id, name: template.name });
  });
  return stubList;
}

export async function GetRanksForUserId(userId: string) {
  console.log("requesting");
  const db = getFirestore();
  const q = query(collection(db, "ranks"), where("rankedBy", "==", userId));
  const qs = await getDocs(q);

  var stubList = [] as ExistingRankStub[];
  qs.forEach((doc) => {
    var rank = doc.data();
    stubList.push({ id: doc.id, name: rank.name });
  });
  return stubList;
}

export async function GetRanksForUser(
  email: string
): Promise<ExistingRankStub[]> {
  var userId = await GetUserIdForEmail(email);
  return await GetRanksForUserId(userId);
}

export async function GetUserIdForEmail(email: string) {
  const db = getFirestore();
  const q = query(collection(db, "users"), where("emailAddress", "==", email));
  const qs = await getDocs(q);
  if (qs.size > 0) {
    return qs.docs.at(0)!.id;
  } else {
    return "DNE";
  }
}

export async function CreateUser(email: string): Promise<void> {
  const db = getFirestore();

  const q = query(collection(db, "users"), where("emailAddress", "==", email));
  const qs = await getDocs(q);

  if (qs.size > 0) {
    console.log("User already exists");
    return;
  }

  await addDoc(collection(db, "users"), {
    emailAddress: email,
  });
}
