import { TitleProperty, RichTextProperty } from "../../interfaces/page-property";
import { AddressPage } from "../../models/address-page";

test('AddressPage formats properties correctly', () => {
  const addressProps = [
    new TitleProperty("Name", "Home"),
    new RichTextProperty("Street Number", "123"),
    new RichTextProperty("Street Name", "Sesame St")
  ];
  const addressPage = new AddressPage({ parentDatabaseId: "ppp", properties: addressProps });
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
  expect(addressPage.getFormattedProperties()).toStrictEqual(expected);
});
