import { Client } from '@notionhq/client';
import { PropertyType as _PropertyType } from '../../models/property-type';
const PropertyType = { ..._PropertyType };
import { TitleProperty, RichTextProperty } from "../../models/page-property";
import { NotionPage } from '../../models/notion-page'
import { createPage } from "../../lib/notion";

const mockCreatedPage = {
  "object": "page",
  "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "created_time": "2020-03-17T19:10:04.968Z",
  "last_edited_time": "2020-03-17T21:49:37.913Z",
  "parent": {
    "type": "database_id",
    "database_id": "pppppppp-pppp-pppp-pppp-pppppppppppp"
  },
  "archived": false,
  "url": "https://www.notion.so/Tuscan-Kale-251d2b5f268c4de2afe9c71ff92ca95c",
  "properties": {
    "Street Number": {
      "id": "aaaa",
      "type": "rich_text",
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "123",
            "link": null
          },
        }
      ]
    },
    "Street Name": {
      "id": "aaaa",
      "type": "rich_text",
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "Sesame St",
            "link": null
          },
        }
      ]
    },
    "Name": {
      "id": "title",
      "type": "title",
      "title": [
        {
          "type": "text",
          "text": {
            "content": "Home",
            "link": null
          },
        }
      ]
    }
  }
}
const mockPageCreate = jest.fn().mockResolvedValue(mockCreatedPage);

jest.mock("@notionhq/client", () => {
  return {
    Client: jest.fn().mockImplementation(() => {
      return {
        // TODO: This is not the most *correct* way, but it works. Probably worth revisiting.
        pages: { create:  (...args: Parameters<typeof mockPageCreate>) => mockPageCreate(...args) },
      }
    })
  }
})
const mockedClient = Client as unknown as jest.Mock<Client>;
let sharedVars = new Object();

describe('createPage', () => {
  beforeEach(() => {
    mockedClient.mockClear();
    mockPageCreate.mockClear();
    const addressProps = [
      new TitleProperty("Name", "Home"),
      new RichTextProperty("Street Number", "123"),
      new RichTextProperty("Street Name", "Sesame St")
    ];
    sharedVars['notionPage'] = new NotionPage({ parentDatabaseId: "pppppppp-pppp-pppp-pppp-pppppppppppp", pageProperties: addressProps });
  });

  describe('calls the notion client', () => {
    test('with the parent database ID', async () => {
      await createPage(sharedVars['notionPage']);
      expect(mockPageCreate).toHaveBeenCalledTimes(1);
      expect(mockPageCreate).toHaveBeenCalledWith(
        expect.objectContaining({ "parent": {"database_id": "pppppppp-pppp-pppp-pppp-pppppppppppp" } })
      );
    });

    test('with the formatted properties', async () => {
      await createPage(sharedVars['notionPage']);
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

    test('creates a new NotionPage object from the returned JSON', async () => {
      const returnedNotionPage = await createPage(sharedVars['notionPage']);
      expect(returnedNotionPage.id).toEqual("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
      expect(returnedNotionPage.parentDatabaseId).toEqual("pppppppp-pppp-pppp-pppp-pppppppppppp");
      expect(returnedNotionPage.title).toEqual("Home");
      expect(returnedNotionPage.pageProperties).toHaveLength(3);
      expect(returnedNotionPage.pageProperties.map(p => p.type))
        .toEqual(expect.arrayContaining([PropertyType.Title, PropertyType.RichText, PropertyType.RichText]));
      expect(returnedNotionPage.pageProperties.map(p => p.simplifiedValue))
        .toEqual(expect.arrayContaining(["Home", "123", "Sesame St"]));
    })

    test('and throws if it receives an error', async () => {
      expect.assertions(1);
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockPageCreate.mockRejectedValueOnce(new Error("error"));
      await expect(createPage(sharedVars['notionPage'])).rejects.toThrow();
    });
  });
});
