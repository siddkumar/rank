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
      <div className="main-title">Let's pick a template</div>
      <div className="card container potential-template-wrapper">
        <TemplatesList stubs={stubs} />
      </div>
    </div>
  );
}

export default CreateFromExisting;
