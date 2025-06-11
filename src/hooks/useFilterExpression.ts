import { IOption } from "@/types/index";

/**
 * Constructs a filter expression string by combining search value and filter criteria
 *
 * @returns {string} A comma-separated string of filter expressions in the format "key:value"
 *
 * @example
 * // With search value "test" and filters {type: {label: "csv", value: "csv"}}
 * // Returns "DatasetName:*test*,type:csv"
 *
 * @description
 * The function combines two types of filters:
 * 1. Search value filter: Adds a resourceNameIdentifier filter with wildcards if searchValue exists
 * 2. Filter object filters: Processes both single value and array filters from the filters object
 *
 * @remarks
 * - Array filters are processed individually and joined with commas
 * - Single value filters are added as key:value pairs
 * - Special characters in search values are currently handled through URL encoding
 * - TODO: Needs proper escaping for regex characters
 */
export const useFilterExpression = (
  /**
   * The identifier used for the resource name in the filter expression
   */
  resourceNameIdentifier: string,
  /**
   * The search value to be used in the filter expression
   */
  searchValue?: string | null,
  /**
   * Object containing filter criteria where each filter can be either
   * a single option or an array of options
   */
  filters?: {
    [key: string]: IOption | IOption[];
  }
): string => {
  const filterExpression: string[] = [];
  if ( searchValue ) {
    // TODO: Needs escaping for regex characters,
    // currently API call is made with URL encoding, which is converting special characters to %20
    filterExpression.push( `${resourceNameIdentifier}:*${searchValue}*` );
  }
  if ( filters && Object.keys( filters ).length > 0 ) {
    Object.keys( filters )?.map(( fkey: string ) => {
      if ( Array.isArray( filters?.[fkey])){
        filters[fkey]?.forEach(( option: IOption ) => {
          filterExpression.push( `${fkey}:${option.value}` );
        });
      } else {
        filterExpression.push( `${fkey}:${( filters[fkey]).value}` );
      }
    });
  }
  return filterExpression.join( "," );
};
