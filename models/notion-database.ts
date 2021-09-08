import { NotionPage } from "./notion-page";

export class NotionDatabase {
  constructor(
    public id: string,
    public title: string
  ) { }

  public async getPages():Promise<NotionPage[]> {
    return await null; // TODO
  };
}
