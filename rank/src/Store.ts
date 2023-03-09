import { configure } from "mobx";
import { ExistingTemplateStub } from "./components/templates/templates";
import { ExistingRankStub } from "./pages/rank/ranks";
import { GetRanksForUser, GetTemplatesForUser } from "./services/userService";
import { makeAutoObservable } from "mobx";

configure({ enforceActions: "always" });

export interface UserStore {
  isLoggedIn: boolean;
  userEmail: string;
  name: string;
  templates: ExistingTemplateStub[];
  ranks: ExistingRankStub[];
}

export default class Store {
  store: UserStore = {
    isLoggedIn: false,
    userEmail: "",
    name:"",
    templates: [],
    ranks: [],
  };

  constructor() {
    makeAutoObservable(this);
  }

  async init() {
    this.store = { isLoggedIn: false, userEmail: "", name:"", templates: [], ranks: [] };
  }

  getIsLoggedIn() {
    return this.store.isLoggedIn;
  }

  getDisplayName() {
    return this.store.name;
  }

  getUserEmail() {
    return this.store.userEmail;
  }

  getTemplates() {
    return this.store.templates;
  }

  getRanks() {
    return this.store.ranks;
  }

  setLogInInfo(isLoggedIn: boolean, userEmail: string, name: string) {
    this.store.isLoggedIn = isLoggedIn;
    this.store.userEmail = userEmail;
    this.store.name = name;
  }

  setTemplates(templates: ExistingTemplateStub[]) {
    this.store.templates = templates;
  }

  setRanks(ranks: ExistingRankStub[]) {
    this.store.ranks = ranks;
  }

  async loadTemplates() {
    if (this.store.userEmail) {
      this.store.templates = await GetTemplatesForUser(this.store.userEmail);
    }
  }

  async loadRanks() {
    if (this.store.userEmail) {
      this.store.ranks = await GetRanksForUser(this.store.userEmail);
    }
  }
}
