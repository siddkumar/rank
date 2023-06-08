import React, { createContext, useContext } from "react";
import { Firestore, getFirestore } from "@firebase/firestore";

// Define the shape of the AuthContext value
interface DbContextValue {
  db: Firestore | null;
}

// Create the AuthContext
const DbContext = createContext<DbContextValue>({
  db: null,
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
  const database = getFirestore();
  const value: DbContextValue = { db: database };
  return <DbContext.Provider value={value}>{children}</DbContext.Provider>;
}
