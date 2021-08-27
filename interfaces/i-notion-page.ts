import { PageProperty } from "./page-property";

export interface INotionPage {
  id?: string;
  parentDatabaseId: string;
  title: string;
  properties: PageProperty[];
  getFormattedProperties(): object;
}
