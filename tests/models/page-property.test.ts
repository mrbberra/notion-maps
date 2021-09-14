import { TitleProperty, RichTextProperty } from "../../models/page-property";

test('RichTextProperty formats simple text correctly', () => {
  const richTextProp = new RichTextProperty("Street Name", "Sesame St");
  const expected = {
    "type": "rich_text",
    "rich_text": [
      {
        "text": {
          "content": "Sesame St",
        },
      },
    ],
  };
  expect(richTextProp.getFormattedValue()).toStrictEqual(expected);
});

test('TitleProperty formats simple text correctly', () => {
  const richTextProp = new TitleProperty("Name", "Home");
  const expected = {
    "type": "title",
    "title": [
      {
        "text": {
          "content": "Home",
        },
      },
    ],
  };
  expect(richTextProp.getFormattedValue()).toStrictEqual(expected);
});
