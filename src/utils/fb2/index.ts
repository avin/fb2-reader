export class FB2 {
  private constructor() {}

  static init() {
    return new FB2();
  }

  async loadExample(){
    const response = await fetch('./examples/book.fb2');
    if (!response.ok) {
      throw new Error('Failed to load the book');
    }
    return await response.text();
  }
}
