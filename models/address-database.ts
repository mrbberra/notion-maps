import { NotionDatabase } from "./notion-database.interface";
import { AddressPage } from "./address-page";

export class AddressDatabase implements NotionDatabase {
  constructor(public id: string, public title: string) { }

  public async getPages():Promise<AddressPage[]> {
    return await null;
  };
}
