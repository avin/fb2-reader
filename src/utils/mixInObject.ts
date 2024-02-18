import { createDefu } from 'defu';

const ext = createDefu((obj, key, value) => {
  if (Array.isArray(obj[key])) {
    obj[key] = value;
    return true;
  }
});

/**
 * Глубокое подмешивание данных одного объекта в другой. (перезапись массивов)
 * @param newObjectOptions
 * @param originalObject
 */
export function deepMixInObject<T>(newObjectOptions: object, originalObject: object): T {
  return ext(newObjectOptions, originalObject) as T;
}
