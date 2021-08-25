import { NotionPage } from "./notion-page.interface";

export interface NotionDatabase {
  id: string;
  title: string;
  getPages(): Promise<NotionPage[]>
}
