import React, { useEffect, useState } from "react";
import { ExistingTemplateStub } from "./templates";
import "../../styles/create.css";
import { ExistingRankStub } from "../../pages/rank/ranks";
import { useDB } from "../../services/dbProvider";
import { Firestore } from "@firebase/firestore";
import { DeleteRank } from "../../services/ranksService";

export interface TemplatesListProps {
  stubs: ExistingTemplateStub[];
}

export interface RanksListProps {
  stubs: ExistingRankStub[];
}

export function TemplatesList(props: TemplatesListProps) {
  return (
    <div className="list-container">
      {props.stubs.map((stub, _s) => {
        return (
          <a
            className="template-link item-container card row"
            key={stub.id}
            href={"/rank?templateId=" + stub.id}
          >
            {stub.name}
            {stub.images.length > 2 ? (
              <div key={stub.id} className="controls">
                <img src={stub.images[0]} alt={"i"} className="glyph-stub" />
                <img src={stub.images[1]} alt={"i"} className="glyph-stub" />
                <img src={stub.images[2]} alt={"i"} className="glyph-stub" />
              </div>
            ) : (
              <></>
            )}
          </a>
        );
      })}
    </div>
  );
}

export function RanksList(props: RanksListProps) {
  const db = useDB().db;
  const [rankList, setRankList] = useState(props.stubs);

  useEffect(() => {
    setRankList(props.stubs);
  }, [props.stubs]);

  function deleteRank(s: ExistingRankStub, i: number, db: Firestore) {
    const updatedList = rankList.slice(0, i).concat(rankList.slice(i + 1));
    DeleteRank(db, s.id);
    setRankList(updatedList);
  }

  return (
    <>
      {rankList.map((stub, i) => {
        return (
          <div className="item-container card row" key={stub.id}>
            <a
              className="template-link row"
              key={stub.id}
              href={"/rank/edit?id=" + stub.id}
            >
              {stub.name}{" "}
              {stub.images.length > 2 ? (
                <div key={stub.id} className="controls-rank">
                  <img src={stub.images[0]} alt={"i"} className="glyph-stub" />
                  <img src={stub.images[1]} alt={"i"} className="glyph-stub" />
                  <img src={stub.images[2]} alt={"i"} className="glyph-stub" />
                </div>
              ) : (
                <></>
              )}
            </a>
            <i
              onClick={(e) => deleteRank(stub, i, db!)}
              className="fa-regular fa-trash-can"
            ></i>
          </div>
        );
      })}
    </>
  );
}
