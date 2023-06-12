import { getPrefix } from "./servicesConfig";

export interface ParseLinkTemplate {
  templateItems: string[];
  templateName: string;
  templateItemLinks?: string[];
}

export interface ParseLinkTables {
  potentialTemplates: ParseLinkTemplate[];
  tableName: string;
}

interface ParseLinkResponse {
  tables: ParseLinkTables[];
}

const prefix = getPrefix();

export async function PostParseLink(wikiLink: string) {
  console.log("requesting backend");
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      link: wikiLink,
    }),
  };

  var tables: ParseLinkTables[] = [];

  await fetch(prefix + "/parser/parseLink", requestOptions)
    .then((response) => response.json())
    .then((data) => {
      tables = (data as ParseLinkResponse).tables;
    });

  return tables;
}

export async function GetImgSrc(wikiLink: string) {
  console.log("requesting backend");
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  var res = "";

  await fetch(prefix + "/parser/getImgUrl?url=" + wikiLink, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      res = data[0];
    });

  return res;
}
