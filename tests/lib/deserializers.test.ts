import { deserializeDatabase, deserializePage, deserializePageProperty } from '../../lib/deserializers';
import { NotionDatabase } from '../../models/notion-database';
import { NotionPage } from '../../models/notion-page';
import { RichTextProperty, TitleProperty } from '../../models/page-property';
import { PropertyType as _PropertyType } from '../../models/property-type';
const PropertyType = { ..._PropertyType };

// copied these from the notion docs https://developers.notion.com/reference/page#property-value-object
const serializedRichText = {
  "type": "rich_text",
  "rich_text": [
    {
      "type": "text",
      "text": {
        "content": "Some more text with "
      }
    },
    {
      "type": "text",
      "text": {
        "content": "some"
      },
      "annotations": {
        "italic": true
      }
    },
    {
      "type": "text",
      "text": {
        "content": " "
      }
    },
    {
      "type": "text",
      "text": {
        "content": "fun"
      },
      "annotations": {
        "bold": true
      }
    },
    {
      "type": "text",
      "text": {
        "content": " "
      }
    },
    {
      "type": "text",
      "text": {
        "content": "formatting"
      },
      "annotations": {
        "color": "pink"
      }
    }
  ]
}
const serializedTitle = {
  "type": "title",
  "title": [
    {
      "type": "text",
      "text": {
        "content": "The title"
      }
    }
  ]
}

const serializedTitleWithoutTypeKey = {
  "title": [
    {
      "type": "text",
      "text": {
        "content": "The title"
      }
    }
  ]
}

describe('deserializePageProperty', () => {
  describe('when given a rich text property that is serialized', () => {
    test('returns a RichTextProperty', () => {
      expect(deserializePageProperty("Details", serializedRichText)).toBeInstanceOf(RichTextProperty);
    });

    test('assigns the property name', () => {
      expect(deserializePageProperty("Details", serializedRichText).name).toEqual("Details");
    });

    test('assigns the rawJsonValue', () => {
      expect(deserializePageProperty("Details", serializedRichText).rawJsonValue).toEqual(serializedRichText["rich_text"]);
    });

    test('assigns the simplifiedValue', () => {
      expect(deserializePageProperty("Details", serializedRichText).simplifiedValue).toEqual('Some more text with some fun formatting');
    });
  });

  describe('when given a title property that is serialized', () => {
    test('returns a TitleProperty', () => {
      expect(deserializePageProperty("Name", serializedTitle)).toBeInstanceOf(TitleProperty);
    });

    test('infers property type when not explicit', () => {
      expect(deserializePageProperty("Name", serializedTitleWithoutTypeKey)).toBeInstanceOf(TitleProperty);
    });

    test('assigns the property name', () => {
      expect(deserializePageProperty("Name", serializedTitle).name).toEqual("Name");
    });

    test('assigns the rawJsonValue', () => {
      expect(deserializePageProperty("Name", serializedTitle).rawJsonValue).toEqual(serializedTitle["title"]);
    });

    test('assigns the simplifiedValue', () => {
      expect(deserializePageProperty("Name", serializedTitle).simplifiedValue).toEqual('The title');
    });
  });
});

const createdDatabaseJson = {
  "object": "database",
  "id": "dddddddd-dddd-dddd-dddd-dddddddddddd",
  "created_time": "2020-03-17T19:10:04.968Z",
  "last_edited_time": "2020-03-17T21:49:37.913Z",
  "parent": {
    "type": "page_id",
    "page_id": "48f8fee9-cd79-4180-bc2f-ec0398253067"
  },
  "title": [
    {
      "type": "text",
      "text": {
        "content": "Packing List",
        "link": null
      },
      "annotations": {
        "bold": false,
        "italic": false,
        "strikethrough": false,
        "underline": false,
        "code": false,
        "color": "default"
      },
      "plain_text": "Packing List",
      "href": null
    }
  ],
  "properties": {
    "Name": {
      "id": "title",
      "type": "title",
      "title": {}
    },
    "Description": {
      "id": "J@cS",
      "type": "rich_text",
      "rich_text": {}
    },
  }
}

describe('deserializeDatabase', () => {
  test('creates a new NotionDatabase object from the returned JSON', () => {
    const notionDatabase = deserializeDatabase(createdDatabaseJson);
    expect(notionDatabase).toBeInstanceOf(NotionDatabase)
  });

  test('populates the id correctly', () => {
    const notionDatabase = deserializeDatabase(createdDatabaseJson);
    expect(notionDatabase.id).toEqual("dddddddd-dddd-dddd-dddd-dddddddddddd");
  });

  test('populates the title correctly', () => {
    const notionPage = deserializeDatabase(createdDatabaseJson);
    expect(notionPage.title).toEqual("Packing List");
  });
});

const createdPageJson = {
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
    "Description": {
      "id": "aaaa",
      "type": "rich_text",
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "Blah",
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
            "content": "Titulo",
            "link": null
          },
        }
      ]
    }
  }
}

describe('deserializePage', () => {
  test('creates a new NotionPage object from the returned JSON', () => {
    const notionPage = deserializePage(createdPageJson);
    expect(notionPage).toBeInstanceOf(NotionPage)
  });

  test('populates the id and parent database id correctly', () => {
    const notionPage = deserializePage(createdPageJson);
    expect(notionPage.id).toEqual("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
    expect(notionPage.parentDatabaseId).toEqual("pppppppp-pppp-pppp-pppp-pppppppppppp");
  });

  test('populates the title correctly', () => {
    const notionPage = deserializePage(createdPageJson);
    expect(notionPage.title).toEqual("Titulo");
  });

  test('populates the properties with deserialized PageProperties', () => {
    const notionPage = deserializePage(createdPageJson);
    expect(notionPage.pageProperties).toHaveLength(2);
    expect(notionPage.pageProperties.map(p => p.type))
      .toEqual(expect.arrayContaining([PropertyType.Title, PropertyType.RichText]));
    expect(notionPage.pageProperties.map(p => p.simplifiedValue))
      .toEqual(expect.arrayContaining(["Titulo", "Blah"]));
  });
});
