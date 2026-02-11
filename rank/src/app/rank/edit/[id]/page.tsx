"use client";

import React from "react";
import RankEdit from "./RankEdit";

export default function RankEditPage({ params }: { params: { id: string } }) {
  return <RankEdit id={params.id} />;
}
