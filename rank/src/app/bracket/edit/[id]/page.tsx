"use client";

import React from "react";
import BracketEdit from "./BracketEdit";

export default function BracketEditPage({ params }: { params: { id: string } }) {
  return <BracketEdit id={params.id} />;
}
