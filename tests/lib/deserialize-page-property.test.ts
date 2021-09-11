import { deserializePageProperty } from '../../lib/deserialize-page-property';
import { RichTextProperty, TitleProperty } from '../../models/page-property';

// copied these from the notion docs https://developers.notion.com/reference/page#property-value-object
const serializedRichText = {
  "Details": {
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
}
const serializedTitle = {
  "Name": {
    "title": [
      {
        "type": "text",
        "text": {
          "content": "The title"
        }
      }
    ]
  }
}

describe('deserializePageProperty', () => {
  describe('when given a rich text property that is serialized', () => {
    test('returns a RichTextProperty', () => {
      expect(deserializePageProperty(serializedRichText)).toBeInstanceOf(RichTextProperty);
    });

    test('assigns the property name', () => {
      expect(deserializePageProperty(serializedRichText).name).toEqual("Details");
    });

    test('assigns the rawJsonValue', () => {
      expect(deserializePageProperty(serializedRichText).rawJsonValue).toEqual(serializedRichText["Details"]["rich_text"]);
    });

    test('assigns the simplifiedValue', () => {
      expect(deserializePageProperty(serializedRichText).simplifiedValue).toEqual('Some more text with some fun formatting');
    });
  });
});


describe('deserializePageProperty', () => {
  describe('when given a title property that is serialized', () => {
    test('returns a TitleProperty', () => {
      expect(deserializePageProperty(serializedTitle)).toBeInstanceOf(TitleProperty);
    });

    test('assigns the property name', () => {
      expect(deserializePageProperty(serializedTitle).name).toEqual("Name");
    });

    test('assigns the rawJsonValue', () => {
      expect(deserializePageProperty(serializedTitle).rawJsonValue).toEqual(serializedTitle["Name"]["title"]);
    });

    test('assigns the simplifiedValue', () => {
      expect(deserializePageProperty(serializedTitle).simplifiedValue).toEqual('The title');
    });
  });
});
