import { ExistingTemplateStub } from "../components/templates/templates";
import RankableItem from "../models/RankableItem";
import { getPrefix } from "./servicesConfig";

interface GetTemplateResponse {
  success: boolean;
  createdBy: string;
  items: string[];
  name: string;
  origin: string;
  sourceUrl: string;
  id: string;
}

const prefix = getPrefix();

export async function GetTemplateById(templateId: string) {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  var bloblist: RankableItem[] = [];
  var templateName: string = "";

  await fetch(prefix + "/templates?id=" + templateId, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      var templateResponse = data as GetTemplateResponse;
      templateResponse.items.map((item, i) => {
        bloblist.push({
          name: item,
          rank: i,
        } as RankableItem);
      });
      templateName = templateResponse.name;
    });

  return { templateName, bloblist };
}

export async function GetTemplatesList() {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  var stubList: ExistingTemplateStub[] = [];

  await fetch(prefix + "/templates", requestOptions)
    .then((response) => response.json())
    .then((data) => {
      var templateResponse = data as GetTemplateResponse[];
      templateResponse.map((template, t) => {
        stubList.push({ id: template.id, name: template.name });
      });
    });

  return stubList;
}

interface CreateFromScratchPostResponse {
  success: boolean;
  templateId: string;
}

export async function PostNewTemplate(
  templateName: string,
  items: string[],
  userEmail?: string
) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: templateName,
      items: items,
      email: userEmail,
    }),
  };

  var templateId = "";

  await fetch(prefix + "/templates/createFromScratch", requestOptions)
    .then((response) => response.json())
    .then((data) => {
      templateId = (data[0] as CreateFromScratchPostResponse).templateId;
    });

  return templateId;
}
