import { TitleProperty, RichTextProperty } from "../../models/page-property";
import { NotionPage } from "../../models/notion-page";

test('NotionPage formats properties correctly', () => {
  const addressProps = [
    new TitleProperty("Name", "Home"),
    new RichTextProperty("Street Number", "123"),
    new RichTextProperty("Street Name", "Sesame St")
  ];
  const notionPage = new NotionPage({ parentDatabaseId: "pppppppp-pppp-pppp-pppp-pppppppppppp", pageProperties: addressProps });
  const expected = {
    "Name": {
      "type": "title",
      "title": [
        {
          "text": {
            "content": "Home",
          },
        },
      ]
    },
    "Street Number": {
      "type": "rich_text",
      "rich_text": [
        {
          "text": {
            "content": "123",
          },
        },
      ]
    },
    "Street Name": {
      "type": "rich_text",
      "rich_text": [
        {
          "text": {
            "content": "Sesame St",
          },
        },
      ]
    },
  };
  expect(notionPage.getFormattedProperties()).toStrictEqual(expected);
});
