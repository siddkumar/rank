"use client";

import React, { use } from "react";
import RankEdit from "./RankEdit";

export default function RankEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <RankEdit id={id} />;
}
