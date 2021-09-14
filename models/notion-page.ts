import { PropertyType as _PropertyType } from '../models/property-type';
const PropertyType = { ..._PropertyType };
import { PagePropertyBase } from './page-property';

interface NotionPageParams {
  id?: string;
  parentDatabaseId: string;
  pageProperties: PagePropertyBase[];
}

export class NotionPage {
  public id?: string;
  public parentDatabaseId: string;
  public pageProperties: PagePropertyBase[];
  public title: string;

  constructor({id, parentDatabaseId, pageProperties}: NotionPageParams) {
    this.id = id;
    this.parentDatabaseId = parentDatabaseId;
    if (! this.onlyHasOneTitleProperty(pageProperties)) throw "NotionPage can only have one title property.";
    this.pageProperties = pageProperties;
    this.title = this.titleFromProperties(pageProperties);
  }

  public getFormattedProperties():{} {
    return this.pageProperties.reduce((formatted, currProperty) => {
      formatted[currProperty.name] = currProperty.getFormattedValue()
      return formatted;
    }, {});
  }

  private onlyHasOneTitleProperty(pageProperties: PagePropertyBase[]):boolean {
    const titleProperties = pageProperties.filter(p => p.type === PropertyType.Title);
    return titleProperties.length <= 1;
  }

  private titleFromProperties(pageProperties: PagePropertyBase[]):string {
    const titleProperty = pageProperties.find(p => p.type === PropertyType.Title);
    if (!! titleProperty) return titleProperty.simplifiedValue;
  }
}
