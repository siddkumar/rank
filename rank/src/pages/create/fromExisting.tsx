import React, { useEffect, useState } from "react";
import { ExistingTemplateStub } from "../../components/templates/templates";
import { TemplatesList } from "../../components/templates/templatesList";
import { GetTemplatesList } from "../../lib/templatesService";
import { Icon } from "../../components/common/Icon";
import "../../styles/create.css";

function CreateFromExisting() {
  const [stubs, setStubs] = useState<ExistingTemplateStub[]>([]);

  useEffect(() => {
    GetTemplatesList().then((stubList) => setStubs(stubList));
  }, []);

  return (
    <div>
      <div className="main-subtitle">
        <Icon className="fa-solid fa-medal no-left no-pointer" /> Featured
        Templates
      </div>
      <TemplatesList stubs={stubs} />
    </div>
  );
}

export default CreateFromExisting;
