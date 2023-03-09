import { ExistingTemplateStub } from "../components/templates/templates";
import { ExistingRankStub } from "../pages/rank/ranks";
import { getPrefix } from "./servicesConfig";

const prefix = getPrefix();

export async function GetTemplatesForUser(
  email: string
): Promise<ExistingTemplateStub[]> {
  let retVal: ExistingTemplateStub[] | PromiseLike<ExistingTemplateStub[]> = [];
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  await fetch(prefix + "/templates?email=" + email, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      var response = data as ExistingTemplateStub[];
      var stublist = response.map<ExistingTemplateStub>((template, _t) => {
        return { id: template.id, name: template.name };
      });
      retVal = stublist;
    });
  return retVal;
}

export async function GetRanksForUser(
  email: string
): Promise<ExistingRankStub[]> {
  let retVal: ExistingRankStub[] | PromiseLike<ExistingRankStub[]> = [];
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  await fetch(prefix + "/ranks?email=" + email, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      var response = data as ExistingRankStub[];
      var stublist = response.map<ExistingRankStub>((template, _t) => {
        return { id: template.id, name: template.name };
      });
      retVal = stublist;
    });
  return retVal;
}

export async function CreateUser(
    email: string) {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                emailAddress: email,
            }),
            };

        fetch( prefix + "/users/create", requestOptions)
            .then((response) => response.json())
            .then((_data) => window.location.assign("/mystuff"));
        return false;
    }
