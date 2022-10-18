import React, { useState } from "react";
import { TemplateEditor } from "../../components/templateEditor";
import "../../styles/create.css";

export enum CreateFromScratchViews {
  CREATE = "create",
  SAVING = "saving",
  READY = "ready",
}

interface CreateFromScratchPostResponse {
  success: boolean;
  templateId: string;
}

function CreateFromScratch() {
  const [view, setView] = useState(CreateFromScratchViews.CREATE);
  const [templateId, setTemplateId] = useState("");

  const submitTemplate = (templateName: string, items: string[]) => {
    setView(CreateFromScratchViews.SAVING);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: templateName,
        items: items,
        userId: "og-user",
      }),
    };
    fetch(
      "https://rank-backend.vercel.app/templates/createFromScratch",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        setTemplateId((data[0] as CreateFromScratchPostResponse).templateId);
      });
    setView(CreateFromScratchViews.READY);
  };

  function createView() {
    return (
      <div className="create-page-layout">
        <div className="main-title">Let's create a template</div>
        <TemplateEditor
          initialName={""}
          initialItems={[""]}
          onSubmit={submitTemplate}
        />
      </div>
    );
  }

  function savingView() {
    return (
      <div className="create-page-layout">
        <div className="main-title">Saving...</div>
      </div>
    );
  }

  function readyView() {
    return (
      <div className="create-page-layout">
        <div className="main-title">Your Template is Ready!</div>
        <a href={"/rank?templateId=" + templateId}>
          <button className="button-styles">let's rank</button>
        </a>
      </div>
    );
  }

  return (
    <>
      {view === CreateFromScratchViews.CREATE && createView()}
      {view === CreateFromScratchViews.SAVING && savingView()}
      {view === CreateFromScratchViews.READY && readyView()}
    </>
  );
}

export default CreateFromScratch;
