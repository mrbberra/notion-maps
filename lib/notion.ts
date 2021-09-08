import { Client } from '@notionhq/client';
import { NotionPage } from "../models/notion-page";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function createPage(pageToCreate: NotionPage) {
  try {
    await notion.pages.create({
      parent: { database_id: pageToCreate.parentDatabaseId },
      properties: pageToCreate.getFormattedProperties(),
    });
    console.log('Created new page');
  } catch (error) {
    console.error(error)
  }
}
