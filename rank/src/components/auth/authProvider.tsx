import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};
firebase.initializeApp(firebaseConfig);
const auth = getAuth();

// Define the shape of the AuthContext value
interface AuthContextValue {
  name: string | null;
  email: string | null;
  id: string | null;
  signOut: () => void;
  saveUserId: (id: string) => void;
  saveEmail: (email: string) => void;
  saveName: (name: string) => void;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextValue>({
  name: null,
  email: null,
  id: null,
  signOut: () => {},
  saveUserId: (id: string) => {},
  saveEmail: (email: string) => {},
  saveName: (name: string) => {},
});

// Create a custom hook to access the AuthContext
export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

// Create an AuthProvider component to wrap your app with
interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setUserId] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const id = localStorage.getItem("id");

    if (name) {
      setName(JSON.parse(name));
    }
    if (email) {
      setEmail(JSON.parse(email));
    }
    if (id) {
      setUserId(JSON.parse(id));
    }
  }, []);

  const signOut = () => {
    setName("");
    setEmail("");
    setUserId("");
    auth.signOut();
    localStorage.setItem("name", "");
    localStorage.setItem("email", "");
    localStorage.setItem("id", "");
  };

  const saveUserId = (id: string) => {
    setUserId(id);
    localStorage.setItem("id", JSON.stringify(id));
  };
  const saveName = (name: string) => {
    setName(name);
    localStorage.setItem("name", JSON.stringify(name));
  };
  const saveEmail = (email: string) => {
    setEmail(email);
    localStorage.setItem("email", JSON.stringify(email));
  };

  const value: AuthContextValue = {
    name,
    email,
    id,
    signOut,
    saveUserId,
    saveEmail,
    saveName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
