import { getAuth } from "firebase/auth";
import React, { useState } from "react";
import { TemplateEditor } from "../../components/templateEditor";
import {
  ParseLinkTables,
  ParseLinkTemplate,
  PostParseLink,
} from "../../services/parserService";
import { PostNewTemplate } from "../../services/templatesService";
import "../../styles/create.css";

export enum FromLinkViews {
  ENTER = "enter",
  WAITING = "waiting",
  PICKTABLE = "pickTable",
  PICKLIST = "pickList",
  EDITOR = "templateEditor",
  READY = "ready",
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
  const [chosenTableName, setChosenTableName] = useState("");
  const [templateId, setTemplateId] = useState("");

  const onChangeWikiLink = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setWikiLink(event.target.value);
  };

  const submitLink = () => {
    setView(FromLinkViews.WAITING);
    PostParseLink(wikiLink).then((tables) => {
      setTables(tables);
      setView(FromLinkViews.PICKTABLE);
    });
  };

  const submitTemplate = (templateName: string, items: string[]) => {
    setView(FromLinkViews.WAITING);
    var email = getAuth().currentUser?.email ?? undefined;
    PostNewTemplate(templateName, items, email).then((newId) => {
      console.log(newId);
      setTemplateId(newId);
      setView(FromLinkViews.READY);
    });
  };

  function enterLinkView() {
    return (
      <>
        <div className="main-title">Enter a link from Wikipedia</div>
        <div className="card container">
          <label className="main-subtitle">Paste URL here:&nbsp;</label>
          <input type="text" value={wikiLink} onChange={onChangeWikiLink} />
          <div>
            <button className="button-styles" onClick={() => submitLink()}>
              find tables
            </button>
          </div>
        </div>
      </>
    );
  }

  function pickTableView() {
    return (
      <>
        <div className="main-title">We found these tables...</div>
        <div className="main-subtitle">please select one to continue</div>
        <div className="potential-template-wrapper card container">
          {tables.map((table, t) => {
            return (
              <button
                onClick={() => {
                  setChosenTableName(table.tableName);
                  setTemplates(table.potentialTemplates);
                  setView(FromLinkViews.PICKLIST);
                }}
                className="button-styles"
                key={table.tableName + t}
              >
                {table.tableName}
              </button>
            );
          })}
          <button
            className="add-remove-button"
            onClick={() => {
              setTemplates([]);
              setView(FromLinkViews.ENTER);
            }}
          >
            Go back
          </button>
        </div>
      </>
    );
  }

  function pickTemplateView() {
    return (
      <>
        <div className="main-title">We found these potential templates ...</div>
        <div className="main-subtitle">please select one to continue</div>
        <div className="potential-template-wrapper card container">
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
        </div>
        <button
          className="add-remove-button"
          onClick={() => {
            setChosenTableName("");
            setView(FromLinkViews.PICKTABLE);
          }}
        >
          Go back
        </button>
      </>
    );
  }

  function templateEditorView() {
    return (
      <>
        <div className="main-title">Edit this template</div>
        <div className="card container">
          <TemplateEditor
            initialName={chosenTableName + " - " + chosenTemplate.templateName}
            initialItems={chosenTemplate.templateItems}
            onSubmit={submitTemplate}
          />
        </div>
        <button
          className="add-remove-button"
          onClick={() => {
            setChosenTemplate({
              templateItems: [],
              templateName: "",
            });
            setView(FromLinkViews.PICKLIST);
          }}
        >
          Go back
        </button>
      </>
    );
  }

  function waitingView() {
    return (
      <div className="create-page-layout">
        <div className="main-title">one sec...</div>
        <div className="spinner">
          <div></div>
        </div>
      </div>
    );
  }

  function readyView() {
    return (
      <div className="create-page-layout">
        <div className="main-title">Your Template is Ready!</div>
        <br></br>
        <a href={"/rank?templateId=" + templateId}>
          <button className="button-styles done-button">let's rank!</button>
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
      {view === FromLinkViews.WAITING && waitingView()}
    </div>
  );
}
