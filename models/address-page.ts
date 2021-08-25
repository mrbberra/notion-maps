import { INotionPage } from "../interfaces/i-notion-page";

export class AddressPage implements INotionPage {
  constructor(public id: string, public title: string) { }
}
