import { Language } from '@/types';
import { deepMixInObject } from '@/utils/mixInObject.ts';

export class Config {
  defaultLanguage: Language = 'en';
  availableLanguages: Language[] = ['ru', 'en'];

  extendConfig(newConfigParams: Partial<Config>): void {
    Object.assign(this, deepMixInObject<Config>(newConfigParams, this));
  }
}

const config = new Config();

export default config;
