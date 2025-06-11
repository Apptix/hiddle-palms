const truthyValues = [ "true", "yes", "on", "enable", "enabled", "active", "available" ];
const falseyValues = [ "false", "no", "off", "disable", "disabled", "inactive", "unavailable" ];

type TTruthyValue = typeof truthyValues[number] | string;
type TFalseyValue = typeof falseyValues[number] | string;
/**
 * Function to validate if given string forms one of app accepted true values
 * @param value - string to test for
 * @returns {boolean} - returns true if value is one of truthy values
 * @example <caption>Example usage of isTruthyValue</caption>
 * isTruthyValue("true") // returns true
 * isTruthyValue("yes") // returns true
 * isTruthyValue("on") // returns true
 * isTruthyValue("enable") // returns true
 */
export function isTruthyValue( value?: TTruthyValue ): boolean {
  if ( !value ) {
    return false;
  }
  return truthyValues?.includes( `${ typeof value === "boolean" ? value : value?.toLowerCase()}` );
}

/**
 * Function to validate if given string forms one of app accepted false values
 * @param value - string to test for
 * @returns {boolean} - returns true if value is one of falsey values
 * @example <caption>Example usage of isFalsyValue</caption>
 * isFalsyValue("false") // returns true
 * isFalsyValue("no") // returns true
 * isFalsyValue("off") // returns true
 */
export function isFalsyValue( value?: TFalseyValue ): boolean {
  if ( !value ) {
    return true;
  }
  return falseyValues.includes( `${value?.toLowerCase()}` );
}

export function hyphenatedToCamelCase( str: string ): string {
  return str?.replace( /-([a-z])/g, function ( g ) {
    return g[1].toUpperCase();
  });
}

export function normalizeString( str: string ): string {
  // replace all non-word characters with a space and capitalize the first letter of each word
  return str?.replace( /[^a-zA-Z0-9]/g, " " )?.replace( /\b\w/g, ( c ) => c.toUpperCase());
}

/**
 * Method that capitalizes the first character of given string
 * @param {string} str - source string
 * @returns {string} - captalized string
 * @example <caption>Example usage of capitalize</caption>
 * capitalize('hello world') // returns 'Hello world'
 */
export function capitalize( str: string ): string {
  return `${str?.charAt( 0 )?.toUpperCase()}${str?.slice( 1 )}`;
}

/**
 * Method that capitalizes all characters of the given string
 * @param {string} str - source string
 * @returns {string} - capitalized string
 * @example <caption>Example usage of capitalizeAll</caption>
 * capitalizeAll('hello world') // returns 'HELLO WORLD'
 */
export function capitalizeAll( str: string ): string {
  return str?.toUpperCase() || "";
}

/**
 * Function to validate if given string is a valid URL
 * @param str - string to test for
 * @returns {boolean} - returns true if value is a valid URL
 */
export const regexIsLink = ( str: string ): boolean => {
  const regex = /^(https?|ftp?|http):\/\/[^\s/$.?#].[^\s]*$/i;
  return regex.test( str );
};

/**
 * Function to generate a random unique string
 * @returns {string} - returns a random unique string
 * @example <caption>Example usage of randomUniqueString</caption>
 * randomUniqueString() // returns "abc123"
 */
export const randomUniqueString = (): string => {
  return Math.random().toString( 36 ).substring( 2 );
};

export const maskEmailOrUsername = ( input: string ): string => {
  if ( !input ) {
    return ""; // Return an empty string for invalid input
  }

  if ( /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( input )) {
    // If it's an email, mask it
    const [ localPart, domain ] = input.split( "@" );
    const maskedLocal = localPart.slice( 0, 2 ) + "*".repeat( Math.max( 0, localPart.length - 2 ));
    const maskedDomain =
      domain.charAt( 0 ) + "*".repeat( Math.max( 0, domain.length - 4 )) + domain.slice( -4 );
    return `${maskedLocal}@${maskedDomain}`;
  } else {
    // If it's a username, mask it
    const maskedLength = Math.max( 0, input.length - 4 );
    return input.slice( 0, 2 ) + "*".repeat( maskedLength ) + input.slice( -2 );
  }
};

/**
 * Function to convert a Pascal case string to a space-separated string with capitalized words
 * @param str - The input Pascal case string to be converted
 * @returns {string} - The space-separated string with capitalized words
 */
export const pascalToSpaceSeparated = ( str: string ): string => {
  return str
    .replace( /([A-Z])/g, " $1" )
    .trim()
    .split( " " )
    .map( word => word.charAt( 0 ).toUpperCase() + word.slice( 1 ))
    .join( " " );
};

/**
 * Function to convert a Pascal case string to snake case
 * @param str - The input Pascal case string to be converted
 * @returns {string} - The snake case string
 * @example <caption>Example usage of pascalToSnakeCase</caption>
 * pascalToSnakeCase("inputFileValidation") // returns "input_file_validation"
 * pascalToSnakeCase("UserProfile") // returns "user_profile"
 */
export const pascalToSnakeCase = ( str: string ): string => {
  return str
    .replace( /([A-Z])/g, "_$1" )
    .toLowerCase()
    .replace( /^_/, "" );
};

/**
 * Helper function for camelCasing translation strings
 * @param str - string to be camelCased
 * @returns {string} - camelCased string
*/
export function camelCase ( str:string ): string {
  return str.replace( /(?:^\w|[A-Z]|\b\w|\s+)/g, ( match:string, index:number ) => {
    if ( Number( match ) === 0 ) {
      return "";
    }
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

/**
 * method to compare two strings with regex case sensitivity
 * @param {string} str1 string to compare with, can be a regex string also
 * @param {string} str2 string to compare
 * @param {boolean} caseSensitive
 * @returns {boolean}
 */
export const regexCompareStrings = ( str1: string, str2: string, caseSensitive = false ): boolean => {
  if ( !str2 ){
    return false;
  }
  const regex = new RegExp( str1, caseSensitive ? "g" : "gi" );
  return regex.test( str2 );
};

export const splitPascalCase = ( word: string ): string => word.match( /($[a-z])|[A-Z][^A-Z]+/g )?.join( " " ) ?? "";

/**
 * Function to convert file size in bytes to human readable format
 * @param size - size of the file in bytes
 * @returns {string} - human readable file size
 * @example <caption>Example usage of readableFileSize</caption>
 * readableFileSize(1024) // returns '1 kB'
 * readableFileSize(1024 * 1024 * 1024) // returns '1 GB'
 */
export function readableFileSize( size: number ): string {
  const i = size !== 0 ? Math.floor( Math.log( size ) / Math.log( 1024 )) : 0;
  return `${Number(( size / Math.pow( 1024, i )).toFixed( 2 )) } ${ [ "B", "kB", "MB", "GB", "TB" ][i]}`;
}

/**
 * Function to format the file name to a readable format.
 * @param obj - File Name in String format.
 * @returns {string} - Formatted File Name.
 * @example <caption>Example usage of formatFileName</caption>
 * formatFileName("https://example.com/file_name") // returns 'file name'
 * formatFileName("s3://bucketname/dir1/timestamp/username/file_name.pdf") // returns 'file name'
 */
export const formatFileName = ( obj: any ): string => {
  return decodeURI(( /^(.*)[/](.*?)$/.exec( obj ) || [] as any ).pop()) ||
    ( obj?.split( "/" )[3]?.split( "_" )?.slice( 3 )?.join( " " )) || obj || "";
};

/**
 * Method accepts a data object and extracts the message from it.
 * @param data object to extract the message from
 * @param {string} fallback fallback message to return if no message is found
 * @returns {string} message from data or fallback
 * @example <caption>Example usage of extractMessage</caption>
 * extractMessage({ message: "hello world" }) // returns 'hello world'
 * extractMessage({ key1: "hello world" }, "fallback message") // returns 'fallback message'
 */

/*
* Method accepts a string and splits it at every capital letter
* @param str
* @returns str with first letter capitalized of each word
* @example <caption>Example usage of unCamelize</caption>
* unCamelize('helloWorld') // returns 'Hello World'
* unCamelize('datasetDomainName') // returns 'Dataset Domain Name'
*/
export function unCamelize( str?: string ): string {
  return str?.replace( /([a-z])([A-Z])/g, "$1 $2" )?.replace( /^./, ( s ) => s.toUpperCase()) ?? "";
}

/**
 * Function to truncate string to given length and add ellipsis to end
 * @param str - string to truncate (optional)
 * @param length - length to truncate to (optional)
 * @param postfix - ending to add to truncated string (optional)
 * @returns {string} - truncated string
 * @example <caption>Example usage of truncateId</caption>
 * truncateId("1234567890") // returns '12345678...'
 * truncateId("1234567890", 5) // returns '12345...'
 * truncateId("1234567890", 5, "!!") // returns '12345!!'
 */
export function truncateId( str?: string, length = 8, postfix = "..." ): string {
  if ( !str ){
    return "-";
  }
  return str?.length > length ? `${str?.substring( 0, length )}${postfix}` : str;
}

export function formatSnakeCase( str: string ): string {
  return str
    .replace( /[_-]/g, " " ) // Replace underscores and hyphens with spaces
    .replace( /\b\w/g, ( char ) => char.toUpperCase()); // Capitalize each word
}

/**
 * Function to convert strings with spaces, special characters to an only lowercase alphanumeric string
 * @param str - string to convert
 * @returns { string } - lowercase alphanumeric string
 * @example
 * toLowercaseAlphanumericString("My-domain_display name@3") // returns mydomaindisplayname3
 */
export function toLowercaseAlphanumericString( str: string ): string {
  return str.replace( /[^a-zA-Z0-9]/g, "" ).toLocaleLowerCase();
}

/**
 * Checks if the given file name has a .pdf extension.
 *
 * @param {string} fileURL - The name of the file to check.
 * @returns {boolean} - Returns `true` if the file has a .pdf extension, otherwise `false`.
 *
 * @example
 * isPDFFile("document.pdf"); // true
 * isPDFFile("image.png"); // false
 * isPDFFile("file.PDF"); // true
 * isPDFFile("report.docx"); // false
 */
export function isPDFFile( fileURL: string ) {
  if ( typeof fileURL !== "string" ) {
    return false;
  }

  // Extract file extension
  const fileExtension = fileURL?.split( "?" )?.[0].slice( fileURL.lastIndexOf( "." )).toLowerCase();

  // Check if the extension is .pdf
  return fileExtension === ".pdf";
}