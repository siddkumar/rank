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
    <div>
      <div className="main-subtitle">
        <i className="fa-solid fa-medal no-left no-pointer"></i> Featured
        Templates
      </div>
      <TemplatesList stubs={stubs} />
    </div>
  );
}

export default CreateFromExisting;
