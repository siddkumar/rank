import { getAuth } from "firebase/auth";
import React, { useState } from "react";
import { TemplateEditor } from "../../components/templates/templateEditor";
import { PostNewTemplate } from "../../services/templatesService";
import "../../styles/create.css";

export enum CreateFromScratchViews {
  CREATE = "create",
  SAVING = "saving",
  READY = "ready",
}

function CreateFromScratch() {
  const [view, setView] = useState(CreateFromScratchViews.CREATE);
  const [templateId, setTemplateId] = useState("");

  const submitTemplate = (templateName: string, items: string[]) => {
    setView(CreateFromScratchViews.SAVING);

    var email = getAuth().currentUser?.email;

    PostNewTemplate(templateName, items, email ?? undefined).then((newId) =>
      setTemplateId(newId)
    );

    setView(CreateFromScratchViews.READY);
  };

  function createView() {
    return (
      <div className="create-page-layout">
        <div className="main-title">Let's create a template</div>
        <br></br>
        <div className="card container">
          <TemplateEditor
            initialName={""}
            initialItems={[""]}
            onSubmit={submitTemplate}
          />
        </div>
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
        <div>
          <div className="main-title">Your Template is Ready!</div>
        </div>
        <div>
          <a href={"/rank?templateId=" + templateId}>
            <button className="button-styles">let's rank</button>
          </a>
        </div>
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
