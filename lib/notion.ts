import { Client } from '@notionhq/client';
import { NotionPage } from '../models/notion-page';
import { deserializePage } from './deserializers';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function createPage(pageToCreate: NotionPage):Promise<NotionPage> {
  try {
    const response = await notion.pages.create({
      parent: { database_id: pageToCreate.parentDatabaseId },
      properties: pageToCreate.getFormattedProperties(),
    });
    return deserializePage(response);
  } catch (error) {
    console.error(`Error calling Notion API to create page "${pageToCreate.title}"`, error);
    throw(error);
  }
};
