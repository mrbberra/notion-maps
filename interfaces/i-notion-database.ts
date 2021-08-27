import { INotionPage } from "./i-notion-page";

export interface INotionDatabase {
  id: string;
  title: string;
  getPages(): Promise<INotionPage[]>;
}
