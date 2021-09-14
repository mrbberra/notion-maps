import { Client } from '@notionhq/client';
import { PropertyType as _PropertyType } from '../../models/property-type';
const PropertyType = { ..._PropertyType };
import { TitleProperty, RichTextProperty } from "../../models/page-property";
import { NotionPage } from '../../models/notion-page'
import { createPage, getDatabase, searchDatabases } from "../../lib/notion";

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
const mockRetrievedDatabaseOne = {
  "id": "dddddddd-dddd-dddd-dddd-111111111111",
  "title": [
    {
      "type": "text",
      "text": {
        "content": "Grocery List",
        "link": null
      },
      "plain_text": "Grocery List",
      "href": null
    }
  ],
  "properties": {}
}
const mockRetrievedDatabaseTwo = {
  "id": "dddddddd-dddd-dddd-dddd-222222222222",
  "title": [
    {
      "type": "text",
      "text": {
        "content": "Packing List",
        "link": null
      },
    }
  ],
  "properties": {}
}
const mockSearchedDatabases = [
  Object.assign({ "object": "database" }, mockRetrievedDatabaseOne),
  Object.assign({ "object": "database" }, mockRetrievedDatabaseTwo)
]
const mockPageCreate = jest.fn().mockResolvedValue(mockCreatedPage);
const mockDatabaseRetrieve = jest.fn().mockResolvedValue(mockRetrievedDatabaseOne)
const mockSearch = jest.fn().mockResolvedValue({ "results": mockSearchedDatabases });
jest.mock("@notionhq/client", () => {
  return {
    Client: jest.fn().mockImplementation(() => {
      return {
        // TODO: This is not the most *correct* way, but it works. Probably worth revisiting.
        pages: { create:  (...args: Parameters<typeof mockPageCreate>) => mockPageCreate(...args) },
        databases: { retrieve:  (...args: Parameters<typeof mockDatabaseRetrieve>) => mockDatabaseRetrieve(...args) },
        search: (...args: Parameters<typeof mockSearch>) => mockSearch(...args)
      }
    })
  }
})
const mockedClient = Client as unknown as jest.Mock<Client>;
let sharedVars = new Object();

describe('searchDatabases', () => {
  beforeEach(() => {
    mockedClient.mockClear();
    mockSearch.mockClear();
  });

  describe('calls the notion client', () => {
    test('with the provided search term', async () => {
      await searchDatabases("something");
      expect(mockSearch).toHaveBeenCalledTimes(1);
      expect(mockSearch).toHaveBeenCalledWith({
        query: "something",
        sort: {
          direction: 'ascending',
          timestamp: 'last_edited_time',
        }
      });
    });

    test('creates new NotionDatabase objects from the returned JSON', async () => {
      const returnedNotionDbs = await searchDatabases('list');
      expect(returnedNotionDbs.map(db => db.id)).toHaveLength(2);
      expect(returnedNotionDbs.map(db => db.id)).toEqual(expect.arrayContaining([
        "dddddddd-dddd-dddd-dddd-111111111111",
        "dddddddd-dddd-dddd-dddd-222222222222"
      ]));
    });

    test('and throws if it receives an error', async () => {
      expect.assertions(1);
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockSearch.mockRejectedValueOnce(new Error("error"));
      await expect(searchDatabases('something')).rejects.toThrow();
    });
  });
});

describe('getDatabase', () => {
  beforeEach(() => {
    mockedClient.mockClear();
    mockDatabaseRetrieve.mockClear();
  });

  describe('calls the notion client', () => {
    test('with the provided database ID', async () => {
      await getDatabase("dddddddd-dddd-dddd-dddd-111111111111");
      expect(mockDatabaseRetrieve).toHaveBeenCalledTimes(1);
      expect(mockDatabaseRetrieve).toHaveBeenCalledWith({ database_id: "dddddddd-dddd-dddd-dddd-111111111111" });
    });

    test('creates a new NotionDatabase object from the returned JSON', async () => {
      const returnedNotionDb = await getDatabase("dddddddd-dddd-dddd-dddd-111111111111");
      expect(returnedNotionDb.id).toEqual("dddddddd-dddd-dddd-dddd-111111111111");
      expect(returnedNotionDb.title).toEqual("Grocery List");
    });

    test('and throws if it receives an error', async () => {
      expect.assertions(1);
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockSearch.mockRejectedValueOnce(new Error("error"));
      await expect(searchDatabases('something')).rejects.toThrow();
    });
  });
});

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
    });

    test('and throws if it receives an error', async () => {
      expect.assertions(1);
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockPageCreate.mockRejectedValueOnce(new Error("error"));
      await expect(createPage(sharedVars['notionPage'])).rejects.toThrow();
    });
  });
});
