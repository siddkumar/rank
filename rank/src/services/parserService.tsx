import { getPrefix } from "./servicesConfig";

export interface ParseLinkTemplate {
  templateItems: string[];
  templateName: string;
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
