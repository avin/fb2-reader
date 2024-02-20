import { IndexedDBClient } from '@/utils/db/IndexedDBClient.ts';

export class BooksDbManager {
  private constructor(private dbClient: IndexedDBClient) {}

  static async open() {
    const dbClient = await IndexedDBClient.open('fb2Reader', 1, [
      { name: 'bookStrings', options: { keyPath: 'id' } },
      { name: 'bookMetas', options: { keyPath: 'id' } },
    ]);
    return new BooksDbManager(dbClient);
  }

  writeBookString(id: string, content: string) {
    return this.dbClient.write('bookStrings', { content, id });
  }

  async readBookString(id: string) {
    const data = (await this.dbClient.read('bookStrings', id)) as { content: string };
    return data.content;
  }

  writeBookMeta(id: string, data: Record<string, unknown>) {
    return this.dbClient.write('bookMetas', { ...data, id });
  }

  readBookMeta(id: string) {
    return this.dbClient.read('bookMetas', id);
  }
}
