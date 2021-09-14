import { Client } from '@notionhq/client';
import { NotionPage } from '../models/notion-page';
import { deserializePageProperty } from '../lib/deserialize-page-property';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function createPage(pageToCreate: NotionPage):Promise<NotionPage> {
  try {
    const response = await notion.pages.create({
      parent: { database_id: pageToCreate.parentDatabaseId },
      properties: pageToCreate.getFormattedProperties(),
    });
    const id = response["id"];
    const parentDatabaseId = response["parent"]["database_id"];
    const serializedProperties = Object.entries(response["properties"]) as [string, object][];
    const pageProperties = serializedProperties.map(([k, v]) => deserializePageProperty(k, v));
    return new NotionPage({ id, parentDatabaseId, pageProperties });
  } catch (error) {
    console.error(`Error calling Notion API to create page "${pageToCreate.title}"`, error);
    throw(error);
  }
};
