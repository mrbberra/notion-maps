import { INotionDatabase } from "../interfaces/i-notion-database";
import { AddressPage } from "./address-page";

export class AddressDatabase implements INotionDatabase {
  constructor(public id: string, public title: string) { }

  public async getPages():Promise<AddressPage[]> {
    return await null;
  };
}
