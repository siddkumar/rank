import React, { useState } from "react";
import { TemplateEditor } from "../../components/templates/templateEditor";
import { PostNewTemplate } from "../../services/templatesService";
import "../../styles/create.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/auth/authProvider";
import { useDB } from "../../services/dbProvider";

export enum CreateFromScratchViews {
  CREATE = "create",
  SAVING = "saving",
  READY = "ready",
}

export interface CreateFromScratchProps {
  initialName: string;
  initialItems: string[];
}

function CreateFromScratch(props: CreateFromScratchProps) {
  const [view, setView] = useState(CreateFromScratchViews.CREATE);
  const navigate = useNavigate();
  const auth = useAuth();
  const db = useDB().db;

  const submitTemplate = async (templateName: string, items: string[]) => {
    setView(CreateFromScratchViews.SAVING);

    var email = auth.email;
    var id = await PostNewTemplate(
      db!,
      templateName,
      items,
      email ?? "undefined"
    );
    navigate("/rank?templateId=" + id);
  };

  function createView() {
    return (
      <div className="create-page-layout">
        <div className="main-title">Let's create a template</div>
        <br></br>
        <div className="card container">
          <TemplateEditor
            initialName={props.initialName}
            initialItems={props.initialItems}
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
