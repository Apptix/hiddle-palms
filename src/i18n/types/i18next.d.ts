import enNS from "../locales/en/index";
import staticData_en from "../locales/en/static.json";

declare module "i18next" {
  // This is the standard i18next type definition required for the i18next instance to work properly, we cannot start the interface name with I.

  interface ICustomTypeOptions {
    defaultNS: "translation";
    resources: {
      en: {
        translation: typeof enNS;
        static: typeof staticData_en;
      };
    };
  }
}
