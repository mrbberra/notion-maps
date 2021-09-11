import { PropertyType, PageProperty } from "./page-property";

interface NotionPageParams {
  id?: string;
  parentDatabaseId: string;
  properties: PageProperty[];
}

export class NotionPage {
  id?: string;
  parentDatabaseId: string;
  properties: PageProperty[];
  title: string;

  constructor({id, parentDatabaseId, properties}: NotionPageParams) {
    this.id = id;
    this.parentDatabaseId = parentDatabaseId;
    this.properties = properties;
    if (this.onlyHasOneTitleProperty()) throw "NotionPage can only have one title property.";
    this.title = this.titleFromProperties();
  }

  public getFormattedProperties():{} {
    return this.properties.reduce((formatted, currProperty) => {
      formatted[currProperty.name] = currProperty.getFormattedValue()
      return formatted;
    }, {});
  }

  private onlyHasOneTitleProperty():boolean {
    const titleProperties = this.properties.filter(p => p.type = PropertyType.title);
    return titleProperties.length <= 1;
  }

  private titleFromProperties():string {
    const titleProperty = this.properties.find(p => p.type = PropertyType.title);
    if (!! titleProperty) return titleProperty.simplifiedValue;
  }
}
