import React, { useEffect, useState } from "react";
import { TemplateEditor } from "../../components/templates/templateEditor";
import {
  ParseLinkTables,
  ParseLinkTemplate,
  PostParseLink,
} from "../../services/parserService";
import { PostNewTemplate } from "../../services/templatesService";
import "../../styles/create.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../components/auth/authProvider";
import { useDB } from "../../services/dbProvider";

export enum FromLinkViews {
  ENTER = "enter",
  WAITING = "waiting",
  PICKTABLE = "pickTable",
  PICKLIST = "pickList",
  EDITOR = "templateEditor",
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const db = useDB().db;

  useEffect(() => {
    const link = searchParams.get("link");
    if (link) {
      setView(FromLinkViews.WAITING);
      PostParseLink(link).then((tables) => {
        setTables(tables);
        setView(FromLinkViews.PICKTABLE);
        setWikiLink(link);
      });
    }
  }, [searchParams]);

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

  const submitTemplate = async (
    templateName: string,
    items: string[],
    images?: string[]
  ) => {
    setView(FromLinkViews.WAITING);
    var email = auth.email ?? undefined;
    var id = await PostNewTemplate(
      db!,
      templateName,
      items,
      email ?? "undefined",
      images
    );
    navigate("/rank?templateId=" + id);
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
        <div className="main-title">please select one to continue</div>
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
        <div className="main-title card container">
          please select one to continue
        </div>
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
            initialHelperLinks={chosenTemplate.templateItemLinks}
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

  return (
    <div className="rank-page-layout">
      {view === FromLinkViews.ENTER && enterLinkView()}
      {view === FromLinkViews.PICKTABLE && pickTableView()}
      {view === FromLinkViews.PICKLIST && pickTemplateView()}
      {view === FromLinkViews.EDITOR && templateEditorView()}
      {view === FromLinkViews.WAITING && waitingView()}
    </div>
  );
}
