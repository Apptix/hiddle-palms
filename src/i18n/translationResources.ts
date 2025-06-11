import en from "./locales/en";

import staticData_en from "./locales/en/static.json";

type TLangTypes = {
  en: {
    translation: typeof en;
    static: typeof staticData_en;
  };
};

/**
 * @description - This is the default resources that will be used by the i18n instance.
 * Add the languages here and also make sure to add the translation files in /types/i18next.d.ts
 */
export const translationResources: TLangTypes = {
  en: {
    translation: en,
    static: staticData_en
  }
};