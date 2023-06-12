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
  const stubList: { id: string; name: string; images: string[] }[] = [
    {
      id: "pesDeP9wt6ARYCtlz7u8",
      name: "Movie Musicals",
      images: [
        "http://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Singin%27_in_the_Rain_%281952_poster%29.jpg/220px-Singin%27_in_the_Rain_%281952_poster%29.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/West_Side_Story_1961_film_poster.jpg/220px-West_Side_Story_1961_film_poster.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Wizard_of_oz_movie_poster.jpg/220px-Wizard_of_oz_movie_poster.jpg",
      ],
    },
    {
      id: "Qtxrj5ioTxLjv32uBN5o",
      name: "Taylor Swift Albums",
      images: [
        "http://upload.wikimedia.org/wikipedia/en/thumb/1/1f/Taylor_Swift_-_Taylor_Swift.png/220px-Taylor_Swift_-_Taylor_Swift.png",
        "http://upload.wikimedia.org/wikipedia/en/thumb/8/86/Taylor_Swift_-_Fearless.png/220px-Taylor_Swift_-_Fearless.png",
        "http://upload.wikimedia.org/wikipedia/en/thumb/8/8f/Taylor_Swift_-_Speak_Now_cover.png/220px-Taylor_Swift_-_Speak_Now_cover.png",
      ],
    },
    {
      id: "euqt0Z2MFaXX4yC526aT",
      name: "Harry Potter Books",
      images: [
        "http://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Harry_Potter_and_the_Philosopher%27s_Stone_Book_Cover.jpg/220px-Harry_Potter_and_the_Philosopher%27s_Stone_Book_Cover.jpg",
        "http://upload.wikimedia.org/wikipedia/en/thumb/5/5c/Harry_Potter_and_the_Chamber_of_Secrets.jpg/220px-Harry_Potter_and_the_Chamber_of_Secrets.jpg",
        "http://upload.wikimedia.org/wikipedia/en/thumb/a/a0/Harry_Potter_and_the_Prisoner_of_Azkaban.jpg/220px-Harry_Potter_and_the_Prisoner_of_Azkaban.jpg",
      ],
    },
    {
      id: "qxq1XeQGPvW73vqrQ5Jd",
      name: "2010 Films (Oscar nominees)",
      images: [
        "http://upload.wikimedia.org/wikipedia/en/thumb/4/4a/The_King%27s_Speech_poster.jpg/220px-The_King%27s_Speech_poster.jpg",
        "http://upload.wikimedia.org/wikipedia/en/6/68/Black_Swan_poster.jpg",
        "http://upload.wikimedia.org/wikipedia/en/thumb/9/93/The_Fighter_Poster.jpg/220px-The_Fighter_Poster.jpg",
      ],
    },
  ];

  return stubList;
}

export async function PostNewTemplate(
  db: Firestore,
  templateName: string,
  items: string[],
  userId: string,
  images?: string[]
) {
  console.log("requesting");
  const uniqueArray = Array.from(new Set(items));

  var response = await addDoc(collection(db, "templates"), {
    createdBy: userId,
    items: uniqueArray,
    name: templateName,
    images: images ?? [],
  });

  return response.id;
}
