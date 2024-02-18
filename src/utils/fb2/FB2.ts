import FB2Parser from './FB2Parser.ts';

export class FB2 {
  private constructor() {}

  static init() {
    return new FB2();
  }

  parse(content: string) {
    const parser = new FB2Parser();

    const obj = parser.parse(content);

    // console.log(JSON.stringify(obj));

    return obj[1].FictionBook;
  }

  getTag(item){
    return
  }

  async loadExample() {
    const response = await fetch('./examples/book1.fb2');
    if (!response.ok) {
      throw new Error('Failed to load the book');
    }
    return await response.text();
  }
}
