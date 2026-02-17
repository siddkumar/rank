import React, { createContext, useContext } from "react";
import { Firestore } from "@firebase/firestore";
import { db } from "../lib/firebaseConfig";

// Define the shape of the AuthContext value
interface DbContextValue {
  db: Firestore | undefined;
}

// Create the AuthContext
const DbContext = createContext<DbContextValue>({
  db: undefined,
});

// Create a custom hook to access the AuthContext
export function useDB(): DbContextValue {
  return useContext(DbContext);
}

// Create an AuthProvider component to wrap your app with
interface DbProviderProps {
  children: React.ReactNode;
}

export function DbProvider({ children }: DbProviderProps) {
  const value: DbContextValue = { db: db };
  return <DbContext.Provider value={value}>{children}</DbContext.Provider>;
}
