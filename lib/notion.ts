import { Client } from '@notionhq/client';
import { NotionPage } from '../models/notion-page';
import { NotionDatabase } from '../models/notion-database';
import { deserializeDatabase, deserializePage } from './deserializers';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function searchDatabases(query: string):Promise<NotionDatabase[]> {
  try {
    const response =  await notion.search({
      query,
      sort: {
        direction: 'ascending',
        timestamp: 'last_edited_time',
      },
    });
    const serializedDatabases = response.results.filter(result => result["object"] === "database");
    return serializedDatabases.map(db => deserializeDatabase(db));
  } catch (error) {
    console.error(`Error calling Notion API to search for: "${query}"`, error);
    throw(error);
  }
};

export async function getDatabase(databaseId: string):Promise<NotionDatabase> {
  try {
    const response = await notion.databases.retrieve({ database_id: databaseId });
    return deserializeDatabase(response);
  } catch (error) {
    console.error(`Error calling Notion API to get database "${databaseId}"`, error);
    throw(error);
  }
};

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
