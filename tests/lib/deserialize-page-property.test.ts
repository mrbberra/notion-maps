import { deserializePageProperty } from '../../lib/deserialize-page-property';
import { RichTextProperty, TitleProperty } from '../../models/page-property';

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
});


describe('deserializePageProperty', () => {
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
