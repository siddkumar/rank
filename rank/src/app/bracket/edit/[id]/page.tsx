"use client";

import React, { use } from "react";
import BracketEdit from "./BracketEdit";

export default function BracketEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <BracketEdit id={id} />;
}
