import React, { useEffect, useState } from "react";
import { ExistingTemplateStub } from "../templates/templates";
import { TemplatesList } from "../templates/templatesList";
import { GetTemplatesList } from "../../lib/templatesService";
import "../../styles/create.css";

function CreateFromExisting() {
  const [stubs, setStubs] = useState<ExistingTemplateStub[]>([]);

  useEffect(() => {
    GetTemplatesList().then((stubList) => setStubs(stubList));
  }, []);

  return (
    <div>
      <TemplatesList stubs={stubs} />
    </div>
  );
}

export default CreateFromExisting;
