import React, { useEffect, useState } from "react";
import { ExistingTemplateStub } from "../../components/templates/templates";
import { TemplatesList } from "../../components/templates/templatesList";
import { GetTemplatesList } from "../../services/templatesService";
import "../../styles/create.css";

function CreateFromExisting() {
  const [stubs, setStubs] = useState<ExistingTemplateStub[]>([]);

  useEffect(() => {
    GetTemplatesList().then((stubList) => setStubs(stubList));
  }, []);

  return (
    <div className="create-page-layout">
      <div className="main-title">
        {" "}
        <i className="fa-solid fa-medal"></i> Featured Templates
        <i className="fa-solid fa-medal"></i>{" "}
      </div>
      <TemplatesList stubs={stubs} />
    </div>
  );
}

export default CreateFromExisting;
