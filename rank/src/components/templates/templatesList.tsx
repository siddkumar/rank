import React from "react";
import { ExistingTemplateStub } from "./templates";
import "../../styles/create.css";
import { ExistingRankStub } from "../../pages/rank/ranks";

export interface TemplatesListProps {
  stubs: ExistingTemplateStub[];
}

export interface RanksListProps {
  stubs: ExistingRankStub[];
}

export function TemplatesList(props: TemplatesListProps) {
  return (
    <>
      {props.stubs.map((stub, _s) => {
        return (
          <a
            className="template-link"
            key={stub.id}
            href={"/rank?templateId=" + stub.id}
          >
            <button className="button-styles">{stub.name}</button>
          </a>
        );
      })}
    </>
  );
}

export function RanksList(props: RanksListProps) {
  return (
    <>
      {props.stubs.map((stub, _s) => {
        return (
          <a
            className="template-link"
            key={stub.id}
            href={"/rank/edit?id=" + stub.id}
          >
            <button className="button-styles">{stub.name}</button>
          </a>
        );
      })}
    </>
  );
}
