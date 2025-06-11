interface IFormatterConfig {
  [key: string]: ( value: number, lng: string | undefined, options: any ) => string;
}
/**
 * @description Formatter object that will be used to format the values in the translation files.
 */
const formatter: IFormatterConfig = {
  // An example of a formatter
  // convertToML: ( value: number, lng: string | undefined, options: any ) => {
  //   return `${value * 150} ml`;
  // }
};

export default formatter;