import React, { useEffect, useState } from "react";
import { ExistingTemplateStub } from "../../components/templates/templates";
import { TemplatesList } from "../../components/templates/templatesList";
import "../../styles/create.css";

interface GetTemplateResponse {
  success: boolean;
  createdBy: string;
  items: string[];
  name: string;
  origin: string;
  sourceUrl: string;
  id: string;
}

function CreateFromExisting() {
  const [stubs, setStubs] = useState<ExistingTemplateStub[]>([]);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    fetch("http://127.0.0.1:8080/templates", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        var templateResponse = data as GetTemplateResponse[];
        var stubList: ExistingTemplateStub[] = [];
        templateResponse.map((template, t) => {
          stubList.push({ id: template.id, name: template.name });
        });
        setStubs(stubList);
      });
  }, []);

  return (
    <div className="create-page-layout">
      <div className="main-title">Let's pick a template</div>
      <TemplatesList stubs={stubs} />
    </div>
  );
}

export default CreateFromExisting;
