import React from "react";
import { ExistingTemplateStub } from "./templates";
import "../../styles/create.css";

export interface TemplatesListProps {
  stubs: ExistingTemplateStub[];
}

export function TemplatesList(props: TemplatesListProps) {
  return (
    <>
      {props.stubs.map((stub, _s) => {
        return (
          <a key={stub.id} href={"/rank?templateId=" + stub.id}>
            {stub.name}
          </a>
        );
      })}
    </>
  );
}
