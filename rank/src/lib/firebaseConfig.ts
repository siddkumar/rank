// lib/firebaseConfig.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC__API_KEY,
  authDomain: process.env.NEXT_PUBLIC__AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC__PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC__STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC__MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC__APP_ID,
};

// Only initialize Firebase on the client side
let app: FirebaseApp | undefined;
let db: Firestore | undefined;

if (typeof window !== "undefined") {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
}

export { db };
