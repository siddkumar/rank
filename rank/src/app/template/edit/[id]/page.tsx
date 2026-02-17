"use client";

import { useEffect, useState } from "react";
import { TemplateEditor } from "../../../../components/templates/templateEditor";
import { GetTemplateById, UpdateTemplate } from "../../../../lib/templatesService";
import { useRouter } from "next/navigation";
import { useDB } from "../../../../services/dbProvider";
import "../../../../styles/create.css";

enum TemplateEditViews {
  LOADING = "loading",
  EDIT = "edit",
  SAVING = "saving",
  ERROR = "error",
}

interface TemplateEditClientProps {
  id: string;
}

function TemplateEditClient({ id }: TemplateEditClientProps) {
  const [view, setView] = useState(TemplateEditViews.LOADING);
  const [templateName, setTemplateName] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const router = useRouter();
  const db = useDB().db;

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const template = await GetTemplateById(id);
        if (template && template.templateName) {
          setTemplateName(template.templateName);
          setItems(template.rankableList.map((item) => item.name));
          setImages(template.rankableList.map((item) => item.imageUrl ?? ""));
          setView(TemplateEditViews.EDIT);
        } else {
          setView(TemplateEditViews.ERROR);
        }
      } catch (error) {
        console.error("Error loading template:", error);
        setView(TemplateEditViews.ERROR);
      }
    };

    loadTemplate();
  }, [id]);

  const updateTemplate = async (
    updatedName: string,
    updatedItems: string[],
    updatedImages?: string[]
  ) => {
    if (!db) {
      console.error("Database not available");
      return;
    }

    setView(TemplateEditViews.SAVING);

    try {
      await UpdateTemplate(
        db,
        id,
        updatedName,
        updatedItems,
        updatedImages
      );
      router.push("/template/" + id);
    } catch (error) {
      console.error("Error updating template:", error);
      setView(TemplateEditViews.ERROR);
    }
  };

  function loadingView() {
    return (
      <div className="create-page-layout">
        <div className="main-title">Loading...</div>
      </div>
    );
  }

  function editView() {
    return (
      <div className="create-page-layout">
        <div className="main-title">Edit Template</div>
        <br />
        <div className="card container">
          <TemplateEditor
            initialName={templateName}
            initialItems={items}
            onSubmit={updateTemplate}
            initialHelperLinks={images.length > 0 ? images : undefined}
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

  function errorView() {
    return (
      <div className="create-page-layout">
        <div className="main-title">Error: Template not found</div>
        <button onClick={() => router.push("/")} className="button-styles">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <>
      {view === TemplateEditViews.LOADING && loadingView()}
      {view === TemplateEditViews.EDIT && editView()}
      {view === TemplateEditViews.SAVING && savingView()}
      {view === TemplateEditViews.ERROR && errorView()}
    </>
  );
}

export default async function TemplateEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TemplateEditClient id={id} />;
}
