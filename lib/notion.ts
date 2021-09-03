import { Client } from '@notionhq/client';
import { INotionPage } from "../interfaces/i-notion-page";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function createPage(pageToCreate: INotionPage) {
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
