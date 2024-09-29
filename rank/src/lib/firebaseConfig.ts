// lib/firebaseConfig.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC__API_KEY,
  authDomain: process.env.NEXT_PUBLIC__AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC__PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC__STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC__MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC__APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
