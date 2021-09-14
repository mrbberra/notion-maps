import { PropertyType as _PropertyType } from '../models/property-type';
const PropertyType = { ..._PropertyType };

class PagePropertyBase {
  public name;
  public type;
  public rawJsonValue?;
  public simplifiedValue;
  public getFormattedValue(options = {}):object {
    return {
      type: this.type
    };
  };
}

class RichTextProperty extends PagePropertyBase {
  public type = PropertyType.RichText;
  constructor(name: string, simplifiedValue: string, rawJsonValue?: object) {
    super();
    this.name = name;
    this.simplifiedValue = simplifiedValue;
    this.rawJsonValue = rawJsonValue;
  };

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

class TitleProperty extends PagePropertyBase {
  public type = PropertyType.Title;
  constructor(name: string, simplifiedValue: string, rawJsonValue?: object) {
    super();
    this.name = name;
    this.simplifiedValue = simplifiedValue;
    this.rawJsonValue = rawJsonValue;
  }

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
  PagePropertyBase,
  RichTextProperty,
  TitleProperty
}
