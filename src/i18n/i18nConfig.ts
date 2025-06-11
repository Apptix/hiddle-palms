// Libraries
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Methods / Hooks / Styles / Constants
import formatter from "./formatterConfig";
import { translationResources } from "./translationResources";

/**
 * @description - This function will load the static translation files from a server,
 * the data received from server will always supersede the local static files.
 */
const getStaticFiles = async (): Promise<Record<string, any>> => {
  // const response = await fetch(`http://localhost:4000/lng/staticData`);
  // const data = response.json();
  return {};
};

/**
 * @description This function will initialize the i18n instance.
 * If you add a new language translation file, make sure to update the i18next module (i18n/types/i18next.d.ts) to get vscode intelliSense.
 */
const i18nInit = async () => {
  await i18n
    .use( LanguageDetector )
    .use( initReactI18next )
    .init({
      resources: {
        en: {
          translation: translationResources.en.translation,
          static: translationResources.en.static
        }
      },
      fallbackLng: "en",
      ns: ["translation"],
      defaultNS: "translation",
      detection: {
        order: [ "navigator", "htmlTag", "localStorage", "querystring", "cookie", "path", "subdomain" ],
        caches: ["cookie"],
        lookupQuerystring: "lng",
        lookupFromPathIndex: 0,
        lookupFromSubdomainIndex: 0,
        lookupCookie: "i18next",
        lookupLocalStorage: "i18nextLng"
      },
      debug: false,
      interpolation: {
        escapeValue: false,
        format: function( value, format ) {
          if ( format === "uppercase" ) {
            return value.toUpperCase();
          }
          if ( format === "lowercase" ) {
            return value.toLowerCase();
          }
          if ( format === "capitalize" ) {
            return value.charAt( 0 ).toUpperCase() + value.slice( 1 );
          }
          return value;
        }
      }
    });

  const staticData = await getStaticFiles();
  Object.keys( staticData ).forEach( lng => {
    if ( Object.keys( staticData[lng])?.length ) {
      i18n.addResourceBundle( lng, "static", staticData[lng], true, true );
    }
  });

  // Add the formatters to the instance
  Object.keys( formatter ).forEach(( key ) => {
    i18n.services.formatter?.add( key, formatter[key]);
  });

  // Un-comment the following code block once we start supporting more than one language

  /**
   * @description This block of code will compare the translation files and log any missing keys in the console.
   */
  // const lngs: string[] = Object.keys( translationResources );
  // const translations: { [key: string]: any }[] = lngs
  //   .map( lng => ({ [lng]: translationResources[lng as keyof typeof translationResources].translation || {} }));

  // const missingKeys = compareTranslations( translations );
  // missingKeys.forEach(({ path, missingIn, key }) => {
  //   console.error( `Key '${key}' is missing in '${missingIn}' translation file. path '${missingIn}.${path}'.`, { path, missingIn, key });
  // });

};

void i18nInit();

export default i18n;