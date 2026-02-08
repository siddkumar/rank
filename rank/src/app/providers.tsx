"use client";

import React from "react";
import { AuthProvider } from "../components/auth/authProvider";
import { DbProvider } from "../services/dbProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DbProvider>{children}</DbProvider>
    </AuthProvider>
  );
}
