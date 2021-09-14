import { PropertyType as _PropertyType } from '../models/property-type';
const PropertyType = { ..._PropertyType };
import {
  PagePropertyBase,
  RichTextProperty,
  TitleProperty
} from '../models/page-property';

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

// Notion API is still in beta and the docs are unclear on whether the "type": "some_type" key will be included
function getPropertyType(jsonReceived:object):string {
  const typeFromTypeKeyValue = jsonReceived["type"];
  const proprtyTypeStrings = Object.values(PropertyType) as string[];
  const typeFromDataKey = Object.keys(jsonReceived).find((key) => proprtyTypeStrings.includes(key));
  return typeFromTypeKeyValue || typeFromDataKey;
}

export function deserializePageProperty(propertyName:string, jsonReceived:object):PagePropertyBase|null {
  const propertyType = getPropertyType(jsonReceived);
  const rawPropertyValue = jsonReceived[propertyType];
  switch(propertyType) {
    case PropertyType.RichText:
      return richTextDeserializer(propertyName, rawPropertyValue);
    case PropertyType.Title:
      return titleDeserializer(propertyName, rawPropertyValue);
    default:
      return null; // only supporting title and rich text for now, potential TODO
  }
}
