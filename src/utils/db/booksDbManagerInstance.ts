import { BooksDbManager } from '@/utils/db/BooksDbManager.ts';

export let booksDbManagerInstance: BooksDbManager;

export async function initBooksDbManagerInstance() {
  booksDbManagerInstance = await BooksDbManager.open();
}
