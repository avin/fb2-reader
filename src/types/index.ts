export type Language = 'ru' | 'en';

export type Translations =
  | {
      [k: string]: Translations;
    }
  | Record<Language, string>;
