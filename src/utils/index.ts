// Methods / Hooks / Constants / Styles
import type { TDirtyFields } from "@/types/index";

export * from "./authUtils";
export * from "./browserUtils";
export * from "./dateUtils";
export * from "./formValidationUtils";
export * from "./renderUtils/index";
export * from "./routeUtils";
export * from "./stringUtils";

// Map RHF's dirtyFields over the `data` received by `handleSubmit` and return the changed subset of that data.
export const getDirtyValues = ( dirtyFields: TDirtyFields, allValues: Record<string, any> ): Record<string, any> => {
  // If *any* item in an array was modified, the entire array must be submitted, because there's no way to indicate
  // "placeholders" for unchanged elements. `dirtyFields` is `true` for leaves.
  if ( dirtyFields === true || Array.isArray( allValues )) {
    return allValues;
  }

  // Here, we have an object
  return Object.fromEntries(
    Object.keys( dirtyFields as object ).map( key => [
      key,
      getDirtyValues(( dirtyFields as Record<string, TDirtyFields> )[key], allValues[key])
    ])
  );
};

export const uniqueValue = ( array: any[], key: string ): boolean => {
  const seen = new Set();
  for ( const item of array ) {
    const value = item[key];
    if ( seen.has( value )) {
      return false;
    }
    if ( value ) {
      seen.add( value );
    }
  }
  return true;
};

export function debounce<Params extends any[]>(
  func: ( ...args: Params ) => any,
  timeout: number
): ( ...args: Params ) => void {
  let timer: NodeJS.Timeout;
  return ( ...args: Params ) => {
    if ( timer ) {
      clearTimeout( timer );
    }
    timer = setTimeout(() => {
      func( ...args );
    }, timeout );
  };
}

export const convertObjectToCustomFormat = ( obj ) =>
  Object.entries( obj )
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([ _, value ]) => value !== "all" )
    .map(([ key, value ]) => `${key}:${value}` )
    .join( ", " );