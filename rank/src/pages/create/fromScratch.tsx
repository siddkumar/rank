import React, { useState } from "react";
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
  const [templateName, setTemplateName] = useState("");
  const [items, setItems] = useState([""]);
  const [view, setView] = useState(CreateFromScratchViews.CREATE);
  const [templateId, setTemplateId] = useState("");

  const onChangeTemplateName = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setTemplateName(event.target.value);
  };

  const handleUserInputChange = (
    event: { target: { value: string } },
    position: number
  ) => {
    setItems([
      ...items.slice(0, position),
      event.target.value,
      ...items.slice(position + 1),
    ]);
  };

  const addItem = () => {
    setItems([...items, ""]);
  };

  const removeItem = (position: number) => {
    setItems([...items.slice(0, position), ...items.slice(position + 1)]);
  };

  const submitTemplate = () => {
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
    fetch("http://127.0.0.1:8080/templates/createFromScratch", requestOptions)
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
        <label className="main-subtitle">Template Name:&nbsp;</label>
        <input
          type="text"
          value={templateName}
          onChange={onChangeTemplateName}
        />
        <div className="main-subtitle">Rankable Things:</div>
        {items.map((item, i) => (
          <div key={i + "div-key"}>
            <input
              key={i + "-key"}
              type="text"
              value={item}
              onChange={(e) => handleUserInputChange(e, i)}
            ></input>
            <button
              key={i + "-button-key"}
              className="close"
              onClick={(e) => removeItem(i)}
            >
              remove{" "}
            </button>
          </div>
        ))}
        <button onClick={addItem} className="button-styles">
          Add Item
        </button>
        <button onClick={submitTemplate} className="button-styles">
          i'm done
        </button>
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
