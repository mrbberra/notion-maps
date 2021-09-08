import { Client } from '@notionhq/client';
import { TitleProperty, RichTextProperty } from "../../models/page-property";
import { NotionPage } from '../../models/notion-page'
import { createPage } from "../../lib/notion";

const mockPageCreate = jest.fn(() => {
  console.log("called")
});
jest.mock("@notionhq/client", () => {
  return {
    Client: jest.fn().mockImplementation(() => {
      return {
        // TODO: This is not the most *correct* way, but it works. Probably worth revisiting.
        pages: { create:  (...args: Parameters<typeof mockPageCreate>) => mockPageCreate(...args) }
      }
    })
  }
})
const mockedClient = Client as unknown as jest.Mock<Client>;

beforeEach(() => {
  mockedClient.mockClear();
  mockPageCreate.mockClear();
  const addressProps = [
    new TitleProperty("Name", "Home"),
    new RichTextProperty("Street Number", "123"),
    new RichTextProperty("Street Name", "Sesame St")
  ];
  const addressPage = new NotionPage({ parentDatabaseId: "ppp", properties: addressProps });
  return createPage(addressPage);
});

test('createPage calls the notion client with the parent database ID', () => {
  expect(mockPageCreate).toHaveBeenCalledTimes(1);
  expect(mockPageCreate).toHaveBeenCalledWith(
    expect.objectContaining({ "parent": {"database_id": "ppp" } })
  );
});

test('createPage calls the notion client with the formatted properties', () => {
  expect(mockPageCreate).toHaveBeenCalledTimes(1);
  expect(mockPageCreate).toHaveBeenCalledWith(
    expect.objectContaining({
      "properties": expect.objectContaining({
        "Name": expect.any(Object),
        "Street Number": expect.any(Object),
        "Street Name": expect.any(Object)
      })
    })
  );
});
