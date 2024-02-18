import { set } from 'lodash-es';
import { Language } from '@/types';

type Translations = {
  [key in Language | string]: Translations | string;
};

export function prepareTranslationObj(
  translations: Translations,
  langKey: Language,
): Record<string, string> {
  const result: Record<string, string> = {};

  if (translations[langKey] !== undefined) {
    return translations[langKey] as Record<string, string>;
  }

  Object.keys(translations).forEach((key) => {
    const item = translations[key] as Translations;
    if (item[langKey] === undefined) {
      set(result, key, prepareTranslationObj(item, langKey));
    } else {
      set(result, key, item[langKey]);
    }
  });

  return result;
}
