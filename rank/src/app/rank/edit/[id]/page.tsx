"use client";

import React from "react";
import RankEdit from "../../../../pages/rank/rankEdit";

export default function RankEditPage({ params }: { params: { id: string } }) {
  return <RankEdit id={params.id} />;
}
