import React, { useState } from "react";
import { TemplateEditor } from "../../components/templateEditor";
import "../../styles/create.css";

export enum FromLinkViews {
  ENTER = "enter",
  WAITING = "waiting",
  PICKTABLE = "pickTable",
  PICKLIST = "pickList",
  EDITOR = "templateEditor",
  READY = "ready",
}

interface ParseLinkTemplate {
  templateItems: string[];
  templateName: string;
}

interface ParseLinkTables {
  potentialTemplates: ParseLinkTemplate[];
  tableName: string;
}

interface ParseLinkResponse {
  tables: ParseLinkTables[];
}

interface CreateFromScratchPostResponse {
  success: boolean;
  templateId: string;
}

export function CreateFromLink() {
  const [view, setView] = useState(FromLinkViews.ENTER);
  const [wikiLink, setWikiLink] = useState("");
  const [tables, setTables] = useState<ParseLinkTables[]>([]);
  const [templates, setTemplates] = useState<ParseLinkTemplate[]>([]);
  const [chosenTemplate, setChosenTemplate] = useState<ParseLinkTemplate>({
    templateItems: [],
    templateName: "",
  });
  const [templateId, setTemplateId] = useState("");

  const onChangeWikiLink = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setWikiLink(event.target.value);
  };

  const submitLink = () => {
    setView(FromLinkViews.WAITING);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        link: wikiLink,
      }),
    };
    fetch("http://127.0.0.1:8080/parser/parseLink", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setTables((data as ParseLinkResponse).tables);
      });
    setView(FromLinkViews.PICKTABLE);
  };

  const submitTemplate = (templateName: string, items: string[]) => {
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
    setView(FromLinkViews.READY);
  };

  function enterLinkView() {
    return (
      <>
        <div className="main-title">Enter a link from Wikipedia</div>
        <label className="main-subtitle">paste URL here:&nbsp;</label>
        <input type="text" value={wikiLink} onChange={onChangeWikiLink} />
        <button className="button-styles" onClick={() => submitLink()}>
          find tables
        </button>
      </>
    );
  }

  function pickTableView() {
    return (
      <>
        <div className="main-title">We found these tables...</div>
        <div className="main-subtitle">please select one to continue</div>
        {tables.map((table, _t) => {
          return (
            <button
              onClick={() => {
                setTemplates(table.potentialTemplates);
                setView(FromLinkViews.PICKLIST);
              }}
              className="button-styles"
              key={table.tableName}
            >
              {table.tableName}
            </button>
          );
        })}
      </>
    );
  }

  function pickTemplateView() {
    return (
      <>
        <div className="main-title">We found these potential templates ...</div>
        <div className="main-subtitle">please select one to continue</div>
        {templates.map((template, _t) => {
          return (
            <button
              onClick={() => {
                setChosenTemplate(template);
                setView(FromLinkViews.EDITOR);
              }}
              className="button-styles"
              key={template.templateName}
            >
              {template.templateName}
            </button>
          );
        })}
      </>
    );
  }

  function templateEditorView() {
    return (
      <>
        <div className="main-title">Edit this template</div>
        <div className="main-subtitle">
          scroll down and click "i'm done" to continue
        </div>
        <TemplateEditor
          initialName={chosenTemplate.templateName}
          initialItems={chosenTemplate.templateItems}
          onSubmit={submitTemplate}
        />
      </>
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
    <div className="rank-page-layout">
      {view === FromLinkViews.ENTER && enterLinkView()}
      {view === FromLinkViews.PICKTABLE && pickTableView()}
      {view === FromLinkViews.PICKLIST && pickTemplateView()}
      {view === FromLinkViews.EDITOR && templateEditorView()}
      {view === FromLinkViews.READY && readyView()}
    </div>
  );
}
