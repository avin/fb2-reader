export type Language = 'ru' | 'en';

export type Translations =
  | {
      [k: string]: Translations;
    }
  | Record<Language, string>;

export type BookMeta = {
  genres: string[];
  authors: { firstName?: string; lastName?: string }[];
  bookTitle: string;
  // coverPage: [{ image: []; ':@': { '@_xlink:href': '#_0.jpg' } }];
  id: string;
};

export type BookProgress = {
  elementId: string;
  progress: number;
  id: string;
  lastReadTime: null | number
};
