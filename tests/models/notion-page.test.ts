import { TitleProperty, RichTextProperty } from "../../models/page-property";
import { NotionPage } from "../../models/notion-page";

test('NotionPage formats properties correctly', () => {
  const addressProps = [
    new TitleProperty("Name", "Home"),
    new RichTextProperty("Street Number", "123"),
    new RichTextProperty("Street Name", "Sesame St")
  ];
  const notionPage = new NotionPage({ parentDatabaseId: "ppp", properties: addressProps });
  const expected = {
    "Name": {
      title: [
        {
          text: {
            content: "Home",
          },
        },
      ]
    },
    "Street Number": {
      text: [
        {
          text: {
            content: "123",
          },
        },
      ]
    },
    "Street Name": {
      text: [
        {
          text: {
            content: "Sesame St",
          },
        },
      ]
    },
  };
  expect(notionPage.getFormattedProperties()).toStrictEqual(expected);
});
