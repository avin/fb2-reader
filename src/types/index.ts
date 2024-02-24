export type Language = 'ru' | 'en';

export type Translations =
  | {
      [k: string]: Translations;
    }
  | Record<Language, string>;

export type BookMeta = {
  genres: string[];
  authors: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    nickname?: string;
    homePage?: string;
    email?: string;
  }[];
  bookTitle: string;
  coverPageImgPreview?: string;
  coverPage: [{ image: []; ':@': { '@_xlink:href': '#_0.jpg' } }];
  id: string;
  annotation: any;
  date: string;
};

export type BookProgress = {
  elementId?: string;
  progress: number;
  id: string;
  lastReadTime: number;
};
