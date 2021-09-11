import {
  PropertyType,
  PageProperty,
  RichTextProperty,
  TitleProperty
} from "../models/page-property";

function richTextSimplifier(richText:object[]) {
  return richText
    .filter(txtObj => txtObj["type"] === "text")
    .map(txtObj => txtObj["text"]["content"])
    .join('');
}

function richTextDeserializer(propertyName:string, rawPropertyValue:object[]):RichTextProperty {
  const simplifiedValue = richTextSimplifier(rawPropertyValue);
  return new RichTextProperty(propertyName, simplifiedValue, rawPropertyValue);
}

function titleDeserializer(propertyName:string, rawPropertyValue:object[]):TitleProperty {
  const simplifiedValue = richTextSimplifier(rawPropertyValue);
  return new TitleProperty(propertyName, simplifiedValue, rawPropertyValue);
}

export function deserializePageProperty(jsonReceived:object):PageProperty|null {
  const propertyName = Object.keys(jsonReceived)[0];
  const propertyType = Object.keys(jsonReceived[propertyName])[0];
  const rawPropertyValue = jsonReceived[propertyName][propertyType];
  switch(propertyType) {
    case PropertyType.richText:
      return richTextDeserializer(propertyName, rawPropertyValue);
    case PropertyType.title:
      return titleDeserializer(propertyName, rawPropertyValue);
    default:
      return null; // only supporting title and rich text for now, potential TODO
  }
}
