"use client";

import React, { useState } from "react";
import BracketManager from "../../../components/brackets/bracketManager";
import RankableItem from "../../../models/RankableItem";
import "../../../styles/rank.css";
import RankTitle from "../../../components/ranker/rankTitle";
import { PostNewBracket } from "../../../lib/bracketsService";
import { useAuth } from "../../../components/auth/authProvider";
import { useDB } from "../../../services/dbProvider";
import { useRouter } from "next/navigation";

export interface BracketViewProps {
  bracketItems: RankableItem[];
  bracketName: string;
  templateId?: string;
}

function BracketView(props: BracketViewProps) {
  const [bracketName, setBracketName] = useState(props.bracketName);
  const auth = useAuth();
  const db = useDB().db;
  const router = useRouter();

  async function save(bracketItems: RankableItem[]) {
    if (!auth.id) {
      alert("Please sign in to save your bracket");
      return;
    }

    if (!db) {
      alert("Database not available");
      return;
    }

    try {
      const bracketId = await PostNewBracket(
        db,
        bracketItems.map((item) => item.name),
        bracketItems.map((item) => item.imageUrl ?? ""),
        props.templateId ?? "",
        auth.id,
        bracketName
      );
      alert("Bracket saved successfully!");
      router.push("/bracket/edit/" + bracketId);
    } catch (error) {
      console.error("Error saving bracket:", error);
      alert("Failed to save bracket. Please try again.");
    }
  }

  return (
    <div className="rank-page-layout">
      <div className="rank-title">
        <RankTitle defaultTitle={bracketName} onChange={(s) => setBracketName(s)} />
      </div>
      <BracketManager bracketItems={props.bracketItems} onSave={save} />
    </div>
  );
}

export default BracketView;
