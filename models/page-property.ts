// see https://developers.notion.com/reference/page#all-property-values
 enum PropertyType {
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

interface PageProperty {
  name: string,
  type: PropertyType,
  rawJsonValue?: object,
  simplifiedValue: any,
  getFormattedValue(options?:object): object
}

 class RichTextProperty implements PageProperty {
  type: PropertyType.richText;
  constructor(public name: string, public simplifiedValue: string, public rawJsonValue?: object) { }

  public getFormattedValue({ allowRaw = true }: { allowRaw?: boolean } = {}):object {
    if (allowRaw && this.rawJsonValue) return this.rawJsonValue;
    return {
      text: [
        {
          text: {
            content: this.simplifiedValue,
          },
        },
      ],
    };
  };
}

 class TitleProperty implements PageProperty {
  type: PropertyType.title;
  constructor(public name: string, public simplifiedValue: string, public rawJsonValue?: object) { }

  public getFormattedValue():object {
    return {
      title: [
        {
          text: {
            content: this.simplifiedValue,
          },
        },
      ],
    };
  };
}

export {
  PropertyType,
  PageProperty,
  RichTextProperty,
  TitleProperty
}
