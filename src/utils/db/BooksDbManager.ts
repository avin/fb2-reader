import { RootState } from '@/store/reducers';
import { IndexedDBClient } from '@/utils/db/IndexedDBClient.ts';

export class BooksDbManager {
  private constructor(private dbClient: IndexedDBClient) {}

  static async open() {
    const dbClient = await IndexedDBClient.open('fb2Reader', 3, [
      { name: 'bookStrings', options: { keyPath: 'id' } },
      { name: 'state', options: { keyPath: 'id' } },
    ]);
    return new BooksDbManager(dbClient);
  }

  async writeBookString(id: string, content: string) {
    return this.dbClient.write('bookStrings', { content, id });
  }

  async readBookString(id: string) {
    const data = await this.dbClient.read<{ content: string }>('bookStrings', id);
    return data?.content;
  }

  async writeState(data: RootState) {
    return this.dbClient.write('state', { id: 'root', data });
  }

  async readState() {
    const data = await this.dbClient.read<{ id: 'root'; data: RootState }>('state', 'root');
    return data?.data;
  }

  async removeBook(id: string) {
    await Promise.all([
      this.dbClient.delete('bookProgresses', id),
      this.dbClient.delete('bookMetas', id),
      this.dbClient.delete('bookStrings', id),
    ]);
  }
}
