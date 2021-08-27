// see https://developers.notion.com/reference/page#all-property-values
export enum PropertyType {
  richText = "rich_text",
  number = "number",
  select = "select",
  multiSelect = "multi_select",
  date = "date",
  formula = "formula",
  relation = "relation",
  rollup = "rollup",
  title = "title",
  people = "people",
  files = "files",
  checkbox = "checkbox",
  url = "url",
  email = "email",
  phoneNumber = "phone_number",
  createdTime = "created_time",
  createdBy = "created_by",
  lastEditedTime = "last_edited_time",
  lastEditedBy = "last_edited_by"
}

export interface PageProperty {
  name: string,
  type: PropertyType,
  value: any,
  getFormattedValue(): object
}

export class RichTextProperty implements PageProperty {
  type: PropertyType.richText;
  constructor(public name: string, public value: string) { }

  public getFormattedValue():object {
    return {
      text: [
        {
          text: {
            content: this.value,
          },
        },
      ],
    };
  };
}

export class TitleProperty implements PageProperty {
  type: PropertyType.title;
  constructor(public name: string, public value: string) { }

  public getFormattedValue():object {
    return {
      title: [
        {
          text: {
            content: this.value,
          },
        },
      ],
    };
  };
}
