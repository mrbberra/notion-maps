import { NotionPage } from "./notion-page.interface";

export class AddressPage implements NotionPage {
  constructor(public id: string, public title: string) { }
}
