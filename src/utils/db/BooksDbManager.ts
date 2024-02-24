import { BookMeta, BookProgress } from '@/types';
import { IndexedDBClient } from '@/utils/db/IndexedDBClient.ts';

export class BooksDbManager {
  private constructor(private dbClient: IndexedDBClient) {}

  static async open() {
    const dbClient = await IndexedDBClient.open('fb2Reader', 3, [
      { name: 'bookStrings', options: { keyPath: 'id' } },
      { name: 'bookMetas', options: { keyPath: 'id' } },
      { name: 'bookProgresses', options: { keyPath: 'id' } },
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

  async writeBookMeta(id: string, data: BookMeta) {
    return this.dbClient.write('bookMetas', { ...data, id });
  }

  async readBookMeta(id: string) {
    const data = await this.dbClient.read<BookMeta>('bookMetas', id);
    return data;
  }

  async getAllBookMetas() {
    return this.dbClient.readAll<BookMeta>('bookMetas');
  }

  async getAllBookProgresses() {
    return this.dbClient.readAll<BookProgress>('bookProgresses');
  }

  async writeBookProgress(id: string, data: MakeOptional<BookProgress, 'id'>) {
    return this.dbClient.write('bookProgresses', { ...data, id });
  }

  async readBookProgress(id: string) {
    const data = await this.dbClient.read<BookProgress>('bookProgresses', id);
    return data;
  }

  async removeBook(id: string) {
    await Promise.all([
      this.dbClient.delete('bookProgresses', id),
      this.dbClient.delete('bookMetas', id),
      this.dbClient.delete('bookStrings', id),
    ]);
  }
}
