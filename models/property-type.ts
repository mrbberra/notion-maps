/*
list taken from https://developers.notion.com/reference/page#all-property-values
WHEN IMPORTING: (https://github.com/kulshekhar/ts-jest/issues/1357#issuecomment-773931343)
import { PropertyType as _PropertyType } from './property-type';
const PropertyType = { ..._PropertyType };
*/
export enum PropertyType {
  RichText = "rich_text",
  Number = "number",
  Select = "select",
  MultiSelect = "multi_select",
  Date = "date",
  Formula = "formula",
  Relation = "relation",
  Rollup = "rollup",
  Title = "title",
  People = "people",
  Files = "files",
  Checkbox = "checkbox",
  Url = "url",
  Email = "email",
  PhoneNumber = "phone_number",
  CreatedTime = "created_time",
  CreatedBy = "created_by",
  LastEditedTime = "last_edited_time",
  LastEditedBy = "last_edited_by"
}
