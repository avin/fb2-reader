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
    if (!data) {
      throw new Error('book not exists');
    }
    return data.content;
  }

  async writeBookMeta(id: string, data: Record<string, unknown>) {
    return this.dbClient.write('bookMetas', { ...data, id });
  }

  async readBookMeta(id: string) {
    const data = await this.dbClient.read('bookMetas', id);
    if (!data) {
      throw new Error('book not exists');
    }
    return data;
  }

  async getAllBookMetas() {
    return this.dbClient.readAll('bookMetas');
  }

  async getAllBookProgresses() {
    return this.dbClient.readAll('bookProgresses');
  }

  async writeBookProgress(id: string, data: Record<string, unknown>) {
    return this.dbClient.write('bookProgresses', { ...data, id });
  }

  async readBookProgress(id: string) {
    const data = await this.dbClient.read<{ elementId: string; progress: number }>(
      'bookProgresses',
      id,
    );
    if (!data) {
      throw new Error('book not exists');
    }
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
