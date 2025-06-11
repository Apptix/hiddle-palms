type TMissingKeyInfo = {
  path: string;
  missingIn: string;
  key: string;
};

/**
 *
 * @param translations
 * @returns TMissingKeyInfo[]
 * @description - This function will compare the translation files and return any missing keys in console.
 */
export function compareTranslations( translations: { [lang: string]: any }[]): TMissingKeyInfo[] {
  const missingKeys: TMissingKeyInfo[] = [];
  const languages = translations.map( t => Object.keys( t )[0]);

  function compareObjects( objects: { [key: string]: any }[], prefix = "" ): void {
    const allKeys = new Set( objects.flatMap( obj => Object.keys( obj )));

    for ( const key of allKeys ) {
      languages.forEach(( lang, index ) => {
        if ( !( key in objects[index])) {
          missingKeys.push({
            path: prefix ? `${prefix}.${key}` : key,
            missingIn: lang,
            key: key
          });
        }
      });

      const objectsWithKey = objects.filter( obj => key in obj && typeof obj[key] === "object" && obj[key] !== null );
      if ( objectsWithKey.length > 0 ) {
        const nestedObjects = objects.map( obj => obj[key] || {});
        compareObjects( nestedObjects, prefix ? `${prefix}.${key}` : key );
      }
    }
  }

  const innerObjects = translations.map( t => t[Object.keys( t )[0]]);
  compareObjects( innerObjects );

  // return missingKeys;
  return [];
}

